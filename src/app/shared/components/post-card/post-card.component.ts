import { Component, Input, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';

// Core
import { Post } from '../../../core/models/post.model';
import { LikeService } from '../../../core/services/like.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

// Shared Components
import { ShareModalComponent } from '../share-modal/share-modal.component';
import { BookUpdateCardComponent } from '../book-update-card/book-update-card.component';
import { ChapterPreviewCardComponent } from '../chapter-preview-card/chapter-preview-card.component';
import { AudioPreviewPlayerComponent } from '../audio-preview-player/audio-preview-player.component';

/**
 * Post Card Component
 * 
 * Displays a post with user info, content, media, and interaction buttons.
 * Handles like, comment, and share actions.
 */
@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    AvatarModule,
    MenuModule,
    TooltipModule,
    TimeAgoPipe,
    ShareModalComponent,
    BookUpdateCardComponent,
    ChapterPreviewCardComponent,
    AudioPreviewPlayerComponent
  ],
  template: `
    <article class="post-card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Post Header -->
      <header class="flex items-center justify-between p-4 pb-2">
        <div class="flex items-center gap-3">
          <a [routerLink]="['/social/profile', post.user.username || post.user.id]" class="shrink-0">
            <p-avatar 
              [image]="post.user.avatar || undefined"
              [label]="!post.user.avatar ? getInitials() : undefined"
              size="large"
              shape="circle"
              styleClass="cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
            />
          </a>
          <div class="flex flex-col">
            <a 
              [routerLink]="['/social/profile', post.user.username || post.user.id]"
              class="font-semibold text-gray-900 dark:text-white hover:underline"
            >
              {{ post.user.name || 'Usuário' }}
            </a>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              @if (post.user.username) {
                <span>&#64;{{ post.user.username }}</span>
                <span>•</span>
              }
              <span>{{ post.createdAt | timeAgo }}</span>
            </div>
          </div>
        </div>
        
        @if (showActions) {
          <button 
            pButton 
            type="button" 
            icon="pi pi-ellipsis-h" 
            class="p-button-text p-button-rounded p-button-plain"
            (click)="menu.toggle($event)"
            pTooltip="Mais opções"
            tooltipPosition="left"
          ></button>
          <p-menu #menu [model]="menuItems()" [popup]="true" appendTo="body" />
        }
      </header>

      <!-- Post Content -->
      <div class="px-4 py-2">
        <p class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-word">{{ post.content }}</p>
      </div>

      <!-- Post Media -->
      @if (post.mediaUrl) {
        <div class="mt-2">
          <img 
            [src]="post.mediaUrl" 
            [alt]="'Imagem do post de ' + (post.user.name || 'usuário')"
            class="w-full max-h-[500px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
            (click)="openMedia()"
          />
        </div>
      }

      <!-- Book/Chapter Preview - Use specialized cards based on post type -->
      @if (post.type === 'BOOK_UPDATE' && post.book) {
        <div class="mx-4 mt-3">
          <app-book-update-card 
            [book]="post.book"
            [description]="getBookDescription()"
            [isNewBook]="true"
          />
        </div>
      }

      @if (post.type === 'CHAPTER_PREVIEW' && post.book && post.chapter) {
        <div class="mx-4 mt-3">
          <app-chapter-preview-card 
            [book]="post.book"
            [chapter]="post.chapter"
            [excerpt]="getChapterExcerpt()"
          />
        </div>
      }

      @if (post.type === 'AUDIO_PREVIEW' && post.book && post.chapter && post.mediaUrl) {
        <div class="mx-4 mt-3">
          <app-audio-preview-player 
            [book]="post.book"
            [chapter]="post.chapter"
            [audioUrl]="post.mediaUrl"
          />
        </div>
      }

      <!-- Standard Book/Chapter Preview for other types -->
      @if (post.book && !['BOOK_UPDATE', 'CHAPTER_PREVIEW', 'AUDIO_PREVIEW'].includes(post.type)) {
        <div class="mx-4 mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div class="flex items-center gap-3">
            @if (post.book.coverUrl) {
              <img [src]="post.book.coverUrl" [alt]="post.book.title" class="w-12 h-16 object-cover rounded" />
            }
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ post.book.title }}</p>
              <p class="text-sm text-gray-500">por {{ post.book.author }}</p>
              @if (post.chapter) {
                <p class="text-sm text-primary-600">📖 {{ post.chapter.title }}</p>
              }
            </div>
          </div>
        </div>
      }

      <!-- Shared Post -->
      @if (post.sharedPost && post.type === 'SHARED') {
        <div class="mx-4 mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div class="flex items-center gap-2 mb-2">
            <p-avatar 
              [image]="post.sharedPost.user.avatar || undefined"
              [label]="!post.sharedPost.user.avatar ? 'U' : undefined"
              shape="circle"
              size="normal"
            />
            <span class="font-medium text-sm">{{ post.sharedPost.user.name }}</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{{ post.sharedPost.content }}</p>
        </div>
      }

      <!-- Post Stats -->
      @if (post.likeCount > 0 || post.commentCount > 0 || post.shareCount > 0) {
        <div class="px-4 py-2 flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 dark:border-gray-700 mt-2">
          @if (post.likeCount > 0) {
            <span class="flex items-center gap-1">
              <i class="pi pi-heart-fill text-red-500"></i>
              {{ post.likeCount }}
            </span>
          }
          @if (post.commentCount > 0) {
            <span>{{ post.commentCount }} {{ post.commentCount === 1 ? 'comentário' : 'comentários' }}</span>
          }
          @if (post.shareCount > 0) {
            <span>{{ post.shareCount }} {{ post.shareCount === 1 ? 'compartilhamento' : 'compartilhamentos' }}</span>
          }
        </div>
      }

      <!-- Action Buttons -->
      @if (showActions) {
        <footer class="flex items-center justify-around py-2 px-4 border-t border-gray-100 dark:border-gray-700">
          <!-- Like Button -->
          <button 
            pButton 
            type="button"
            [icon]="isLiked() ? 'pi pi-heart-fill' : 'pi pi-heart'"
            [class]="isLiked() ? 'p-button-text p-button-danger' : 'p-button-text p-button-secondary'"
            [label]="likeButtonLabel()"
            (click)="onLikeClick()"
            [loading]="likeLoading()"
            class="flex-1 justify-center"
          ></button>

          <!-- Comment Button -->
          <button 
            pButton 
            type="button"
            icon="pi pi-comment"
            class="p-button-text p-button-secondary flex-1 justify-center"
            [label]="commentButtonLabel()"
            (click)="onCommentClick()"
          ></button>

          <!-- Share Button -->
          <button 
            pButton 
            type="button"
            icon="pi pi-share-alt"
            class="p-button-text p-button-secondary flex-1 justify-center"
            [label]="shareButtonLabel()"
            (click)="onShareClick()"
            [disabled]="post.type === 'SHARED'"
          ></button>
        </footer>
      }
    </article>

    <!-- Share Modal -->
    <app-share-modal 
      [post]="post"
      [(visible)]="shareModalVisible"
      (shared)="onPostShared($event)"
    />
  `,
  styles: [`
    .post-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .post-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    :host ::ng-deep .p-button.p-button-text {
      font-weight: 500;
    }

    :host ::ng-deep .p-button.p-button-text:hover {
      background: rgba(0, 0, 0, 0.04);
    }

    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class PostCardComponent {
  private readonly router = inject(Router);
  private readonly likeService = inject(LikeService);
  private readonly authService = inject(AuthService);

  @Input({ required: true }) post!: Post;
  @Input() showActions = true;

  @Output() liked = new EventEmitter<{ postId: string; liked: boolean; likeCount: number }>();
  @Output() commented = new EventEmitter<string>();
  @Output() shared = new EventEmitter<string>();
  @Output() deleted = new EventEmitter<string>();

  // State
  isLiked = signal(false);
  localLikeCount = signal(0);
  localShareCount = signal(0);
  likeLoading = signal(false);
  shareModalVisible = false;

  // Computed
  likeButtonLabel = computed(() => {
    const count = this.localLikeCount();
    return count > 0 ? `Curtir (${count})` : 'Curtir';
  });

  commentButtonLabel = computed(() => {
    const count = this.post?.commentCount || 0;
    return count > 0 ? `Comentar (${count})` : 'Comentar';
  });

  shareButtonLabel = computed(() => {
    const count = this.localShareCount();
    return count > 0 ? `Compartilhar (${count})` : 'Compartilhar';
  });

  menuItems = computed((): MenuItem[] => {
    const items: MenuItem[] = [];
    const currentUser = this.authService.currentUser();
    const isOwner = currentUser?.id === this.post?.userId;

    if (isOwner) {
      items.push(
        { label: 'Editar', icon: 'pi pi-pencil', command: () => this.onEditClick() },
        { label: 'Excluir', icon: 'pi pi-trash', command: () => this.onDeleteClick() }
      );
    } else {
      items.push(
        { label: 'Copiar link', icon: 'pi pi-link', command: () => this.copyLink() },
        { label: 'Denunciar', icon: 'pi pi-flag', command: () => this.onReportClick() }
      );
    }

    return items;
  });

  ngOnInit(): void {
    // Initialize local state from post data
    this.isLiked.set(this.post?.isLiked || false);
    this.localLikeCount.set(this.post?.likeCount || 0);
    this.localShareCount.set(this.post?.shareCount || 0);
  }

  ngOnChanges(): void {
    // Update when post input changes
    if (this.post) {
      this.isLiked.set(this.post.isLiked || false);
      this.localLikeCount.set(this.post.likeCount || 0);
      this.localShareCount.set(this.post.shareCount || 0);
    }
  }

  getInitials(): string {
    const name = this.post?.user?.name || 'U';
    return name.substring(0, 2).toUpperCase();
  }

  onLikeClick(): void {
    if (this.likeLoading()) return;

    // Optimistic update
    const wasLiked = this.isLiked();
    const newLiked = !wasLiked;
    const newCount = newLiked ? this.localLikeCount() + 1 : this.localLikeCount() - 1;

    this.isLiked.set(newLiked);
    this.localLikeCount.set(Math.max(0, newCount));
    this.likeLoading.set(true);

    this.likeService.toggleLike(this.post.id).subscribe({
      next: (response) => {
        // Update with server response
        this.isLiked.set(response.liked);
        this.localLikeCount.set(response.likeCount);
        this.likeLoading.set(false);
        this.liked.emit({ postId: this.post.id, liked: response.liked, likeCount: response.likeCount });
      },
      error: (err) => {
        // Revert optimistic update
        console.error('[PostCard] Error toggling like:', err);
        this.isLiked.set(wasLiked);
        this.localLikeCount.set(wasLiked ? newCount + 1 : newCount - 1);
        this.likeLoading.set(false);
      }
    });
  }

  onCommentClick(): void {
    this.commented.emit(this.post.id);
    // Navigate to post detail with comments
    this.router.navigate(['/social/post', this.post.id], { fragment: 'comments' });
  }

  onShareClick(): void {
    // Cannot share a post that is already a share
    if (this.post.type === 'SHARED') {
      return;
    }
    this.shareModalVisible = true;
  }

  onPostShared(sharedPost: Post): void {
    // Update local share count
    this.localShareCount.update(count => count + 1);
    this.shared.emit(this.post.id);
  }

  onEditClick(): void {
    // TODO: Open edit modal
  }

  onDeleteClick(): void {
    this.deleted.emit(this.post.id);
  }

  onReportClick(): void {
    // TODO: Open report modal
  }

  openMedia(): void {
    // TODO: Open media in lightbox
  }

  copyLink(): void {
    const url = `${window.location.origin}/social/post/${this.post.id}`;
    navigator.clipboard.writeText(url);
  }

  // Helper methods for preview cards
  getBookDescription(): string {
    // Extract description from post content if it's a book update
    if (this.post.type === 'BOOK_UPDATE') {
      const lines = this.post.content.split('\n\n');
      return lines.length > 1 ? lines[1] : '';
    }
    return '';
  }

  getChapterExcerpt(): string {
    // Extract excerpt from post content if it's a chapter preview
    if (this.post.type === 'CHAPTER_PREVIEW') {
      const match = this.post.content.match(/"([^"]+)"/);
      return match ? match[1] : '';
    }
    return '';
  }
}
