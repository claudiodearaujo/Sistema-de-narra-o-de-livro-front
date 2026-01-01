import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

// Core
import { TrendingPost } from '../../../../core/models/post.model';
import { PostService } from '../../../../core/services/post.service';

// Shared Components
import { PostCardComponent } from '../../../../shared/components/post-card/post-card.component';

/**
 * Trending Page Component - Sprint 7
 * 
 * Displays all trending posts from the last 24 hours.
 */
@Component({
  selector: 'app-trending-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    SkeletonModule,
    TagModule,
    DividerModule,
    PostCardComponent
  ],
  template: `
    <div class="trending-page max-w-3xl mx-auto p-4">
      <!-- Header -->
      <header class="mb-6">
        <div class="flex items-center gap-3 mb-2">
          <i class="pi pi-chart-line text-3xl text-accent-500"></i>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Em Alta 🔥</h1>
        </div>
        <p class="text-gray-600 dark:text-gray-400">
          Posts mais populares das últimas 24 horas
        </p>
      </header>

      <!-- Stats Bar -->
      <div class="bg-gradient-to-r from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-900/40 rounded-lg p-4 mb-6 flex items-center justify-around">
        <div class="text-center">
          <div class="text-2xl font-bold text-accent-600 dark:text-accent-400">{{ totalPosts() }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Posts em alta</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-accent-700 dark:text-accent-500">{{ totalLikes() }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Curtidas totais</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ totalComments() }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Comentários</div>
        </div>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="space-y-4">
          @for (i of [1, 2, 3, 4, 5]; track i) {
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-3 mb-4">
                <p-skeleton shape="circle" size="3rem" />
                <div class="flex-1">
                  <p-skeleton width="40%" height="1rem" styleClass="mb-2" />
                  <p-skeleton width="20%" height="0.75rem" />
                </div>
              </div>
              <p-skeleton width="100%" height="4rem" />
            </div>
          }
        </div>
      }

      <!-- Posts List -->
      @if (!loading() && posts().length > 0) {
        <div class="space-y-4">
          @for (post of posts(); track post.id; let i = $index) {
            <div class="relative">
              <!-- Rank Badge -->
              <div class="absolute -left-3 -top-3 z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg"
                [class]="getRankClass(i)">
                {{ i + 1 }}
              </div>

              <!-- Post Card -->
              <app-post-card 
                [post]="post"
                (shared)="onPostShared()"
              />

              <!-- Engagement Score Badge -->
              <div class="absolute -right-2 top-4 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                ⚡ {{ post.engagementScore }}
              </div>
            </div>
          }
        </div>

        <!-- Load More -->
        @if (hasMore()) {
          <div class="text-center mt-6">
            <button 
              pButton 
              type="button"
              label="Carregar mais"
              icon="pi pi-arrow-down"
              class="p-button-outlined"
              (click)="loadMore()"
              [loading]="loadingMore()"
            ></button>
          </div>
        }
      }

      <!-- Empty State -->
      @if (!loading() && posts().length === 0) {
        <div class="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
          <i class="pi pi-chart-line text-6xl text-gray-300 mb-4"></i>
          <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nenhum post em alta
          </h2>
          <p class="text-gray-500 dark:text-gray-400">
            Os posts mais populares das últimas 24 horas aparecerão aqui
          </p>
        </div>
      }
    </div>
  `,
  styles: [`
    .trending-page {
      min-height: 100vh;
    }
  `]
})
export class TrendingPageComponent implements OnInit {
  private readonly postService = inject(PostService);

  posts = signal<TrendingPost[]>([]);
  loading = signal(true);
  loadingMore = signal(false);
  hasMore = signal(true);
  currentPage = 1;

  // Computed stats
  totalPosts = signal(0);
  totalLikes = signal(0);
  totalComments = signal(0);

  ngOnInit(): void {
    this.loadTrending();
  }

  loadTrending(): void {
    this.loading.set(true);
    this.postService.getTrending(1, 20).subscribe({
      next: (response) => {
        this.posts.set(response.posts);
        this.hasMore.set(response.pagination.hasMore);
        this.totalPosts.set(response.pagination.total);
        this.calculateStats(response.posts);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[TrendingPage] Error loading trending:', err);
        this.loading.set(false);
      }
    });
  }

  loadMore(): void {
    if (this.loadingMore() || !this.hasMore()) return;

    this.loadingMore.set(true);
    this.currentPage++;

    this.postService.getTrending(this.currentPage, 20).subscribe({
      next: (response) => {
        this.posts.update(posts => [...posts, ...response.posts]);
        this.hasMore.set(response.pagination.hasMore);
        this.calculateStats(this.posts());
        this.loadingMore.set(false);
      },
      error: (err) => {
        console.error('[TrendingPage] Error loading more:', err);
        this.currentPage--;
        this.loadingMore.set(false);
      }
    });
  }

  calculateStats(posts: TrendingPost[]): void {
    const likes = posts.reduce((sum, p) => sum + p.likeCount, 0);
    const comments = posts.reduce((sum, p) => sum + p.commentCount, 0);
    this.totalLikes.set(likes);
    this.totalComments.set(comments);
  }

  onPostShared(): void {
    // Optionally refresh stats
  }

  getRankClass(index: number): string {
    switch (index) {
      case 0:
        return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white';
      case 1:
        return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white';
      case 2:
        return 'bg-gradient-to-br from-amber-500 to-amber-700 text-white';
      default:
        return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  }
}
