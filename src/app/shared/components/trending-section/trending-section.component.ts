import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';

// Core
import { TrendingPost } from '../../../core/models/post.model';
import { PostService } from '../../../core/services/post.service';

/**
 * Trending Section Component - Sprint 7
 * 
 * Displays trending posts from the last 24 hours.
 */
@Component({
  selector: 'app-trending-section',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    SkeletonModule,
    AvatarModule,
    TagModule
  ],
  template: `
    <section class="trending-section">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <i class="pi pi-chart-line text-xl text-accent-500"></i>
          <h2 class="text-lg font-bold text-primary-700 dark:text-primary-300 font-heading">Em Alta 🔥</h2>
        </div>
        <a 
          routerLink="/social/trending"
          class="text-sm text-primary-600 hover:underline"
        >
          Ver todos
        </a>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1, 2, 3]; track i) {
            <div class="flex items-center gap-3 p-3 bg-surface-card rounded-lg">
              <p-skeleton shape="circle" size="2.5rem" />
              <div class="flex-1">
                <p-skeleton width="60%" height="1rem" styleClass="mb-2" />
                <p-skeleton width="80%" height="0.75rem" />
              </div>
            </div>
          }
        </div>
      }

      <!-- Content -->
      @if (!loading() && posts().length > 0) {
        <div class="space-y-2">
          @for (post of posts(); track post.id; let i = $index) {
            <a 
              [routerLink]="['/social/post', post.id]"
              class="flex items-start gap-3 p-3 bg-surface-card rounded-lg border border-surface-border hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all cursor-pointer"
            >
              <!-- Rank Number -->
              <div class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                [class]="getRankClass(i)">
                {{ i + 1 }}
              </div>

              <!-- User Avatar -->
              <p-avatar 
                [image]="post.user.avatar || undefined"
                [label]="!post.user.avatar ? post.user.name.substring(0, 1) : undefined"
                shape="circle"
                size="normal"
              />

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-medium text-sm text-primary-800 dark:text-primary-200 truncate">
                    {{ post.user.name }}
                  </span>
                  @if (i < 3) {
                    <p-tag 
                      [value]="getTrendingLabel(i)" 
                      [severity]="getTrendingSeverity(i)"
                      styleClass="text-xs"
                    />
                  }
                </div>
                <p class="text-sm text-secondary line-clamp-2">
                  {{ post.content }}
                </p>
                <div class="flex items-center gap-3 mt-2 text-xs text-secondary">
                  <span class="flex items-center gap-1">
                    <i class="pi pi-heart-fill text-accent-500"></i>
                    {{ post.likeCount }}
                  </span>
                  <span class="flex items-center gap-1">
                    <i class="pi pi-comment"></i>
                    {{ post.commentCount }}
                  </span>
                  <span class="flex items-center gap-1">
                    <i class="pi pi-share-alt"></i>
                    {{ post.shareCount }}
                  </span>
                </div>
              </div>
            </a>
          }
        </div>
      }

      <!-- Empty State -->
      @if (!loading() && posts().length === 0) {
        <div class="text-center py-8 bg-surface-card rounded-lg">
          <i class="pi pi-chart-line text-4xl text-secondary-300 mb-3"></i>
          <p class="text-secondary">Nenhum post em alta no momento</p>
        </div>
      }
    </section>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .trending-section a:hover {
      transform: translateY(-1px);
    }
  `]
})
export class TrendingSectionComponent implements OnInit {
  private readonly postService = inject(PostService);

  @Input() limit: number = 5;
  @Output() postClicked = new EventEmitter<TrendingPost>();

  posts = signal<TrendingPost[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadTrending();
  }

  loadTrending(): void {
    this.loading.set(true);
    this.postService.getTrending(1, this.limit).subscribe({
      next: (response) => {
        this.posts.set(response.posts);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[TrendingSection] Error loading trending:', err);
        this.loading.set(false);
      }
    });
  }

  getRankClass(index: number): string {
    switch (index) {
      case 0:
        return 'bg-livra-500 text-white';
      case 1:
        return 'bg-secondary-400 text-white';
      case 2:
        return 'bg-livra-600 text-white';
      default:
        return 'bg-secondary-200 text-secondary-600 dark:bg-secondary-700 dark:text-secondary-300';
    }
  }

  getTrendingLabel(index: number): string {
    switch (index) {
      case 0:
        return '🥇 #1';
      case 1:
        return '🥈 #2';
      case 2:
        return '🥉 #3';
      default:
        return `#${index + 1}`;
    }
  }

  getTrendingSeverity(index: number): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (index) {
      case 0:
        return 'warn';
      case 1:
        return 'secondary';
      case 2:
        return 'info';
      default:
        return 'secondary';
    }
  }
}
