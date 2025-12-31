import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementService } from '../../../../core/services/achievement.service';
import { 
  Achievement, 
  AchievementStats, 
  AchievementCategory,
  ACHIEVEMENT_CATEGORY_LABELS,
  ACHIEVEMENT_CATEGORY_ICONS,
  isAchievementUnlocked,
  getAchievementProgress,
  formatAchievementDate
} from '../../../../core/models/achievement.model';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-achievements-page',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TabsModule,
    ProgressBarModule,
    TagModule,
    BadgeModule,
    SkeletonModule,
    TooltipModule,
    ButtonModule,
    MessageModule
  ],
  template: `
    <div class="achievements-page">
      <!-- Header with Stats -->
      <div class="achievements-header">
        <h1>🏆 Conquistas</h1>
        @if (stats()) {
          <div class="stats-overview">
            <div class="stat-card">
              <span class="stat-value">{{ stats()!.unlocked }}</span>
              <span class="stat-label">Desbloqueadas</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ stats()!.total }}</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="stat-card progress-card">
              <div class="progress-circle" [style.--progress]="stats()!.percentage">
                <span>{{ stats()!.percentage }}%</span>
              </div>
              <span class="stat-label">Progresso</span>
            </div>
          </div>
        }
      </div>

      <!-- Recent Unlocks -->
      @if (stats()?.recentUnlocks?.length) {
        <div class="recent-unlocks">
          <h3>🎉 Conquistas Recentes</h3>
          <div class="recent-list">
            @for (ua of stats()!.recentUnlocks.slice(0, 3); track ua.id) {
              <div class="recent-item">
                <span class="achievement-icon">{{ ua.achievement.icon }}</span>
                <div class="recent-info">
                  <span class="recent-name">{{ ua.achievement.name }}</span>
                  <span class="recent-date">{{ formatDate(ua.unlockedAt) }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Category Tabs -->
      <p-tabs value="all">
        <p-tablist>
          <p-tab value="all">Todas</p-tab>
          @for (category of categories; track category) {
            <p-tab [value]="category">{{ getCategoryLabel(category) }}</p-tab>
          }
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel value="all">
            @if (loading()) {
              <div class="achievements-grid">
                @for (i of [1,2,3,4,5,6]; track i) {
                  <div class="achievement-card skeleton">
                    <p-skeleton width="50px" height="50px" styleClass="achievement-icon-skeleton"/>
                    <p-skeleton width="80%" height="1.2rem"/>
                    <p-skeleton width="100%" height="0.9rem"/>
                    <p-skeleton width="100%" height="8px"/>
                  </div>
                }
              </div>
            } @else {
              <div class="achievements-grid">
                @for (achievement of achievements(); track achievement.id) {
                  <ng-container *ngTemplateOutlet="achievementCard; context: { $implicit: achievement }"/>
                }
              </div>
            }
          </p-tabpanel>

          @for (category of categories; track category) {
            <p-tabpanel [value]="category">
              <div class="achievements-grid">
                @for (achievement of getAchievementsByCategory(category); track achievement.id) {
                  <ng-container *ngTemplateOutlet="achievementCard; context: { $implicit: achievement }"/>
                } @empty {
                  <p-message severity="info" text="Nenhuma conquista nesta categoria ainda."/>
                }
              </div>
            </p-tabpanel>
          }
        </p-tabpanels>
      </p-tabs>

      <!-- Achievement Card Template -->
      <ng-template #achievementCard let-achievement>
        <div class="achievement-card" 
             [class.unlocked]="isUnlocked(achievement)"
             [class.locked]="!isUnlocked(achievement)">
          <div class="achievement-icon" [class.grayscale]="!isUnlocked(achievement)">
            {{ achievement.icon }}
          </div>
          <div class="achievement-info">
            <h4>{{ achievement.name }}</h4>
            <p>{{ achievement.description }}</p>
            @if (isUnlocked(achievement)) {
              <p-tag severity="success" value="Desbloqueada" icon="pi pi-check"/>
              <span class="unlock-date">{{ formatDate(achievement.unlockedAt) }}</span>
            } @else {
              <div class="progress-section">
                <p-progressBar 
                  [value]="getProgress(achievement)" 
                  [showValue]="false"
                  styleClass="achievement-progress"/>
                <span class="progress-text">
                  {{ achievement.progress || 0 }}/{{ achievement.progressTarget }}
                </span>
              </div>
            }
            @if (achievement.livraReward > 0) {
              <div class="reward">
                <span class="livra-icon">💎</span>
                <span>+{{ achievement.livraReward }} Livras</span>
              </div>
            }
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .achievements-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .achievements-header {
      text-align: center;
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
      }
    }

    .stats-overview {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .stat-card {
      background: var(--surface-card);
      border-radius: 12px;
      padding: 1.5rem 2rem;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);

      .stat-value {
        display: block;
        font-size: 2.5rem;
        font-weight: bold;
        color: var(--primary-color);
      }

      .stat-label {
        font-size: 0.9rem;
        color: var(--text-color-secondary);
      }
    }

    .progress-card {
      .progress-circle {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: conic-gradient(
          var(--primary-color) calc(var(--progress, 0) * 1%),
          var(--surface-border) 0
        );
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 0.5rem;

        span {
          background: var(--surface-card);
          width: 55px;
          height: 55px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: var(--primary-color);
        }
      }
    }

    .recent-unlocks {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-700));
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      color: white;

      h3 {
        margin: 0 0 1rem 0;
      }

      .recent-list {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .recent-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(255,255,255,0.15);
        padding: 0.75rem 1rem;
        border-radius: 8px;

        .achievement-icon {
          font-size: 1.5rem;
        }

        .recent-info {
          display: flex;
          flex-direction: column;

          .recent-name {
            font-weight: 600;
          }

          .recent-date {
            font-size: 0.8rem;
            opacity: 0.8;
          }
        }
      }
    }

    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      padding: 1rem 0;
    }

    .achievement-card {
      background: var(--surface-card);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 2px solid transparent;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      &.unlocked {
        border-color: var(--green-500);
        background: linear-gradient(135deg, var(--surface-card), rgba(34, 197, 94, 0.05));
      }

      &.locked {
        opacity: 0.8;
      }

      .achievement-icon {
        font-size: 2.5rem;
        flex-shrink: 0;

        &.grayscale {
          filter: grayscale(100%);
          opacity: 0.5;
        }
      }

      .achievement-info {
        flex: 1;

        h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
        }

        p {
          margin: 0 0 0.75rem 0;
          font-size: 0.9rem;
          color: var(--text-color-secondary);
        }

        .unlock-date {
          display: block;
          font-size: 0.8rem;
          color: var(--text-color-secondary);
          margin-top: 0.5rem;
        }

        .progress-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;

          ::ng-deep .achievement-progress {
            flex: 1;
            height: 8px;
          }

          .progress-text {
            font-size: 0.8rem;
            color: var(--text-color-secondary);
            white-space: nowrap;
          }
        }

        .reward {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.75rem;
          font-size: 0.9rem;
          color: var(--primary-color);
          font-weight: 500;

          .livra-icon {
            font-size: 1rem;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .achievements-page {
        padding: 1rem;
      }

      .stats-overview {
        gap: 1rem;
      }

      .stat-card {
        padding: 1rem;

        .stat-value {
          font-size: 1.8rem;
        }
      }

      .achievements-grid {
        grid-template-columns: 1fr;
      }

      .recent-list {
        flex-direction: column;
      }
    }
  `]
})
export class AchievementsPageComponent implements OnInit {
  private achievementService = inject(AchievementService);

  achievements = signal<Achievement[]>([]);
  stats = signal<AchievementStats | null>(null);
  loading = signal(true);

  categories: AchievementCategory[] = ['SOCIAL', 'WRITING', 'READING', 'MILESTONE', 'SPECIAL'];

  ngOnInit() {
    this.loadAchievements();
  }

  loadAchievements() {
    this.loading.set(true);
    this.achievementService.getMyAchievements().subscribe({
      next: (response) => {
        // Flatten user achievements to Achievement[]
        const achievements = response.achievements.map(ua => ({
          ...ua.achievement,
          unlockedAt: ua.unlockedAt
        }));
        
        // Also get all achievements for progress
        this.achievementService.getAllAchievements().subscribe({
          next: (allResponse) => {
            this.achievements.set(allResponse.achievements);
            this.stats.set(response.stats);
            this.loading.set(false);
          },
          error: () => {
            this.achievements.set(achievements);
            this.stats.set(response.stats);
            this.loading.set(false);
          }
        });
      },
      error: () => {
        // Fallback to all achievements without auth
        this.achievementService.getAllAchievements().subscribe({
          next: (response) => {
            this.achievements.set(response.achievements);
            this.loading.set(false);
          },
          error: () => {
            this.loading.set(false);
          }
        });
      }
    });
  }

  getAchievementsByCategory(category: AchievementCategory): Achievement[] {
    return this.achievements().filter(a => a.category === category);
  }

  getCategoryLabel(category: AchievementCategory): string {
    return ACHIEVEMENT_CATEGORY_LABELS[category];
  }

  getCategoryIcon(category: AchievementCategory): string {
    return ACHIEVEMENT_CATEGORY_ICONS[category];
  }

  isUnlocked(achievement: Achievement): boolean {
    return isAchievementUnlocked(achievement);
  }

  getProgress(achievement: Achievement): number {
    return getAchievementProgress(achievement);
  }

  formatDate(date: Date | string | null | undefined): string {
    return formatAchievementDate(date);
  }
}
