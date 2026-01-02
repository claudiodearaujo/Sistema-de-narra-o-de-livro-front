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
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
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
