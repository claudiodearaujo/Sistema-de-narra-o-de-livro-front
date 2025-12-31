import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  Achievement, 
  isAchievementUnlocked, 
  getAchievementProgress, 
  formatAchievementDate 
} from '../../../../core/models/achievement.model';

import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-achievement-card',
  standalone: true,
  imports: [CommonModule, ProgressBarModule, TagModule, TooltipModule],
  template: `
    <div class="achievement-card" 
         [class.unlocked]="isUnlocked"
         [class.locked]="!isUnlocked"
         [class.compact]="compact"
         [pTooltip]="achievement.description"
         tooltipPosition="top">
      <div class="achievement-icon" [class.grayscale]="!isUnlocked">
        {{ achievement.icon }}
      </div>
      @if (!compact) {
        <div class="achievement-info">
          <h4>{{ achievement.name }}</h4>
          <p>{{ achievement.description }}</p>
          @if (isUnlocked) {
            <p-tag severity="success" value="Desbloqueada" icon="pi pi-check"/>
            <span class="unlock-date">{{ formatDate(achievement.unlockedAt) }}</span>
          } @else if (showProgress) {
            <div class="progress-section">
              <p-progressBar 
                [value]="progress" 
                [showValue]="false"
                styleClass="achievement-progress"/>
              <span class="progress-text">
                {{ achievement.progress || 0 }}/{{ achievement.progressTarget }}
              </span>
            </div>
          }
          @if (achievement.livraReward > 0 && showReward) {
            <div class="reward">
              <span class="livra-icon">💎</span>
              <span>+{{ achievement.livraReward }} Livras</span>
            </div>
          }
        </div>
      } @else {
        <span class="compact-name">{{ achievement.name }}</span>
      }
    </div>
  `,
  styles: [`
    .achievement-card {
      background: var(--surface-card);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      gap: 0.75rem;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 2px solid transparent;
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      &.unlocked {
        border-color: var(--green-500);
        background: linear-gradient(135deg, var(--surface-card), rgba(34, 197, 94, 0.05));
      }

      &.locked {
        opacity: 0.7;
      }

      &.compact {
        padding: 0.5rem 0.75rem;
        align-items: center;

        .achievement-icon {
          font-size: 1.5rem;
        }

        .compact-name {
          font-size: 0.85rem;
          font-weight: 500;
        }
      }

      .achievement-icon {
        font-size: 2rem;
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
          font-size: 1rem;
        }

        p {
          margin: 0 0 0.5rem 0;
          font-size: 0.85rem;
          color: var(--text-color-secondary);
        }

        .unlock-date {
          display: block;
          font-size: 0.75rem;
          color: var(--text-color-secondary);
          margin-top: 0.25rem;
        }

        .progress-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          ::ng-deep .achievement-progress {
            flex: 1;
            height: 6px;
          }

          .progress-text {
            font-size: 0.75rem;
            color: var(--text-color-secondary);
          }
        }

        .reward {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.5rem;
          font-size: 0.85rem;
          color: var(--primary-color);
          font-weight: 500;
        }
      }
    }
  `]
})
export class AchievementCardComponent {
  @Input({ required: true }) achievement!: Achievement;
  @Input() compact = false;
  @Input() showProgress = true;
  @Input() showReward = true;

  get isUnlocked(): boolean {
    return isAchievementUnlocked(this.achievement);
  }

  get progress(): number {
    return getAchievementProgress(this.achievement);
  }

  formatDate(date: Date | string | null | undefined): string {
    return formatAchievementDate(date);
  }
}
