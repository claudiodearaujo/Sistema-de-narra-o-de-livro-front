import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TextareaModule } from 'primeng/textarea';
import { SkeletonModule } from 'primeng/skeleton';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

// Core
import { CommentService, Comment, CreateCommentDto } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

/**
 * Comment List Component
 * 
 * Displays comments for a post with support for:
 * - Creating new comments
 * - Replying to comments
 * - Editing/deleting own comments
 * - Loading more comments
 */
@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    AvatarModule,
    TextareaModule,
    SkeletonModule,
    MenuModule,
    TimeAgoPipe
  ],
  template: `
    <div class="comment-list">
      <!-- Comment Input -->
      <div class="comment-input flex gap-3 mb-4">
        <p-avatar 
          [image]="currentUserAvatar() || undefined"
          [label]="!currentUserAvatar() ? currentUserInitials() : undefined"
          shape="circle"
        />
        <div class="flex-1">
          <textarea 
            pTextarea
            [(ngModel)]="newComment"
            [placeholder]="replyingTo() ? 'Escreva uma resposta...' : 'Escreva um comentário...'"
            [rows]="2"
            class="w-full"
            (keydown.enter)="onSubmitComment($event)"
          ></textarea>
          <div class="flex items-center justify-between mt-2">
            @if (replyingTo()) {
              <span class="text-sm text-gray-500">
                Respondendo a <strong>{{ replyingTo()?.user?.name }}</strong>
                <button 
                  pButton 
                  type="button" 
                  icon="pi pi-times" 
                  class="p-button-text p-button-sm p-button-plain ml-1"
                  (click)="cancelReply()"
                ></button>
              </span>
            } @else {
              <span></span>
            }
            <button 
              pButton 
              type="button"
              label="Comentar"
              icon="pi pi-send"
              [loading]="submitting()"
              [disabled]="!newComment.trim()"
              (click)="submitComment()"
              class="p-button-sm"
            ></button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      @if (loading() && comments().length === 0) {
        @for (i of [1, 2, 3]; track i) {
          <div class="flex gap-3 mb-4">
            <p-skeleton shape="circle" size="2.5rem" />
            <div class="flex-1">
              <p-skeleton width="30%" height="1rem" styleClass="mb-2" />
              <p-skeleton width="100%" height="2rem" />
            </div>
          </div>
        }
      }

      <!-- Empty State -->
      @if (!loading() && comments().length === 0) {
        <div class="text-center py-8 text-gray-500">
          <i class="pi pi-comments text-4xl mb-2"></i>
          <p>Nenhum comentário ainda.</p>
          <p class="text-sm">Seja o primeiro a comentar!</p>
        </div>
      }

      <!-- Comments -->
      @for (comment of comments(); track comment.id) {
        <div class="comment mb-4" [class.ml-12]="comment.parentId">
          <div class="flex gap-3">
            <a [routerLink]="['/social/profile', comment.user.username || comment.user.id]">
              <p-avatar 
                [image]="comment.user.avatar || undefined"
                [label]="!comment.user.avatar ? getInitials(comment.user.name) : undefined"
                shape="circle"
                size="normal"
              />
            </a>
            <div class="flex-1">
              <div class="bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2">
                <div class="flex items-center gap-2">
                  <a 
                    [routerLink]="['/social/profile', comment.user.username || comment.user.id]"
                    class="font-semibold text-sm hover:underline"
                  >
                    {{ comment.user.name }}
                  </a>
                  <span class="text-xs text-gray-500">{{ comment.createdAt | timeAgo }}</span>
                </div>
                
                @if (editingComment()?.id === comment.id) {
                  <textarea 
                    pTextarea
                    [(ngModel)]="editContent"
                    [rows]="2"
                    class="w-full mt-2"
                  ></textarea>
                  <div class="flex gap-2 mt-2">
                    <button 
                      pButton 
                      type="button" 
                      label="Salvar" 
                      class="p-button-sm"
                      [loading]="submitting()"
                      (click)="saveEdit(comment.id)"
                    ></button>
                    <button 
                      pButton 
                      type="button" 
                      label="Cancelar" 
                      class="p-button-sm p-button-text"
                      (click)="cancelEdit()"
                    ></button>
                  </div>
                } @else {
                  <p class="text-sm mt-1">{{ comment.content }}</p>
                }
              </div>

              <!-- Comment Actions -->
              @if (!editingComment() || editingComment()?.id !== comment.id) {
                <div class="flex items-center gap-3 mt-1 ml-2 text-xs">
                  <button 
                    class="text-gray-500 hover:text-primary-600 font-medium"
                    (click)="onLikeComment(comment)"
                  >
                    {{ comment.likeCount > 0 ? comment.likeCount + ' ' : '' }}Curtir
                  </button>
                  <button 
                    class="text-gray-500 hover:text-primary-600 font-medium"
                    (click)="startReply(comment)"
                  >
                    Responder
                  </button>
                  @if (isOwner(comment)) {
                    <button 
                      class="text-gray-500 hover:text-primary-600 font-medium"
                      (click)="startEdit(comment)"
                    >
                      Editar
                    </button>
                    <button 
                      class="text-gray-500 hover:text-red-600 font-medium"
                      (click)="deleteComment(comment)"
                    >
                      Excluir
                    </button>
                  }
                </div>
              }

              <!-- Replies Count -->
              @if (comment.replyCount && comment.replyCount > 0 && !comment.replies?.length) {
                <button 
                  class="text-sm text-primary-600 hover:underline mt-2 ml-2"
                  (click)="loadReplies(comment)"
                >
                  Ver {{ comment.replyCount }} {{ comment.replyCount === 1 ? 'resposta' : 'respostas' }}
                </button>
              }

              <!-- Replies -->
              @if (comment.replies?.length) {
                <div class="mt-3 space-y-3">
                  @for (reply of comment.replies; track reply.id) {
                    <div class="flex gap-3">
                      <a [routerLink]="['/social/profile', reply.user.username || reply.user.id]">
                        <p-avatar 
                          [image]="reply.user.avatar || undefined"
                          [label]="!reply.user.avatar ? getInitials(reply.user.name) : undefined"
                          shape="circle"
                          size="normal"
                        />
                      </a>
                      <div class="flex-1">
                        <div class="bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2">
                          <div class="flex items-center gap-2">
                            <a 
                              [routerLink]="['/social/profile', reply.user.username || reply.user.id]"
                              class="font-semibold text-sm hover:underline"
                            >
                              {{ reply.user.name }}
                            </a>
                            <span class="text-xs text-gray-500">{{ reply.createdAt | timeAgo }}</span>
                          </div>
                          <p class="text-sm mt-1">{{ reply.content }}</p>
                        </div>
                        <div class="flex items-center gap-3 mt-1 ml-2 text-xs">
                          <button 
                            class="text-gray-500 hover:text-primary-600 font-medium"
                            (click)="onLikeComment(reply)"
                          >
                            {{ reply.likeCount > 0 ? reply.likeCount + ' ' : '' }}Curtir
                          </button>
                          @if (isOwner(reply)) {
                            <button 
                              class="text-gray-500 hover:text-red-600 font-medium"
                              (click)="deleteComment(reply)"
                            >
                              Excluir
                            </button>
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- Load More -->
      @if (hasMore()) {
        <div class="text-center mt-4">
          <button 
            pButton 
            type="button"
            label="Carregar mais comentários"
            class="p-button-text"
            [loading]="loadingMore()"
            (click)="loadMore()"
          ></button>
        </div>
      }
    </div>
  `,
  styles: [`
    .comment-list {
      max-height: 600px;
      overflow-y: auto;
    }

    :host ::ng-deep .p-inputtextarea {
      resize: none;
    }
  `]
})
export class CommentListComponent implements OnInit {
  private readonly commentService = inject(CommentService);
  private readonly authService = inject(AuthService);

  @Input({ required: true }) postId!: string;
  @Input() autoLoad = true;

  @Output() commentAdded = new EventEmitter<Comment>();
  @Output() commentDeleted = new EventEmitter<string>();

  // State
  comments = signal<Comment[]>([]);
  loading = signal(false);
  loadingMore = signal(false);
  submitting = signal(false);
  hasMore = signal(false);
  page = signal(1);
  
  newComment = '';
  editContent = '';
  replyingTo = signal<Comment | null>(null);
  editingComment = signal<Comment | null>(null);

  currentUserAvatar = () => this.authService.currentUser()?.avatar || null;
  currentUserInitials = () => {
    const name = this.authService.currentUser()?.name || 'U';
    return name.substring(0, 2).toUpperCase();
  };

  ngOnInit(): void {
    if (this.autoLoad) {
      this.loadComments();
    }
  }

  loadComments(): void {
    this.loading.set(true);
    this.commentService.getComments(this.postId, 1, 20).subscribe({
      next: (response) => {
        this.comments.set(response.comments);
        this.hasMore.set(response.hasMore);
        this.page.set(1);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[CommentList] Error loading comments:', err);
        this.loading.set(false);
      }
    });
  }

  loadMore(): void {
    if (this.loadingMore() || !this.hasMore()) return;

    this.loadingMore.set(true);
    const nextPage = this.page() + 1;

    this.commentService.getComments(this.postId, nextPage, 20).subscribe({
      next: (response) => {
        this.comments.update(comments => [...comments, ...response.comments]);
        this.hasMore.set(response.hasMore);
        this.page.set(nextPage);
        this.loadingMore.set(false);
      },
      error: (err) => {
        console.error('[CommentList] Error loading more:', err);
        this.loadingMore.set(false);
      }
    });
  }

  loadReplies(comment: Comment): void {
    this.commentService.getReplies(comment.id, 1, 10).subscribe({
      next: (response) => {
        this.comments.update(comments =>
          comments.map(c =>
            c.id === comment.id
              ? { ...c, replies: response.comments }
              : c
          )
        );
      },
      error: (err) => {
        console.error('[CommentList] Error loading replies:', err);
      }
    });
  }

  submitComment(): void {
    const content = this.newComment.trim();
    if (!content || this.submitting()) return;

    this.submitting.set(true);
    const data: CreateCommentDto = {
      content,
      parentId: this.replyingTo()?.id
    };

    this.commentService.createComment(this.postId, data).subscribe({
      next: (comment) => {
        if (data.parentId) {
          // Add as reply
          this.comments.update(comments =>
            comments.map(c =>
              c.id === data.parentId
                ? { ...c, replies: [...(c.replies || []), comment], replyCount: (c.replyCount || 0) + 1 }
                : c
            )
          );
        } else {
          // Add as new comment at the beginning
          this.comments.update(comments => [comment, ...comments]);
        }
        
        this.newComment = '';
        this.replyingTo.set(null);
        this.submitting.set(false);
        this.commentAdded.emit(comment);
      },
      error: (err) => {
        console.error('[CommentList] Error creating comment:', err);
        this.submitting.set(false);
      }
    });
  }

  onSubmitComment(event: Event): void {
    const keyEvent = event as KeyboardEvent;
    if (!keyEvent.shiftKey) {
      event.preventDefault();
      this.submitComment();
    }
  }

  startReply(comment: Comment): void {
    this.replyingTo.set(comment);
    this.editingComment.set(null);
  }

  cancelReply(): void {
    this.replyingTo.set(null);
  }

  startEdit(comment: Comment): void {
    this.editingComment.set(comment);
    this.editContent = comment.content;
    this.replyingTo.set(null);
  }

  cancelEdit(): void {
    this.editingComment.set(null);
    this.editContent = '';
  }

  saveEdit(commentId: string): void {
    const content = this.editContent.trim();
    if (!content || this.submitting()) return;

    this.submitting.set(true);
    this.commentService.updateComment(commentId, content).subscribe({
      next: (updated) => {
        this.comments.update(comments =>
          comments.map(c => c.id === commentId ? { ...c, content: updated.content } : c)
        );
        this.cancelEdit();
        this.submitting.set(false);
      },
      error: (err) => {
        console.error('[CommentList] Error updating comment:', err);
        this.submitting.set(false);
      }
    });
  }

  deleteComment(comment: Comment): void {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) return;

    this.commentService.deleteComment(comment.id).subscribe({
      next: () => {
        if (comment.parentId) {
          // Remove from replies
          this.comments.update(comments =>
            comments.map(c =>
              c.id === comment.parentId
                ? { 
                    ...c, 
                    replies: c.replies?.filter(r => r.id !== comment.id),
                    replyCount: Math.max(0, (c.replyCount || 0) - 1)
                  }
                : c
            )
          );
        } else {
          // Remove from main list
          this.comments.update(comments => comments.filter(c => c.id !== comment.id));
        }
        this.commentDeleted.emit(comment.id);
      },
      error: (err) => {
        console.error('[CommentList] Error deleting comment:', err);
      }
    });
  }

  onLikeComment(comment: Comment): void {
    this.commentService.toggleCommentLike(comment.id).subscribe({
      next: (response) => {
        // Update like count
        const updateFn = (c: Comment) =>
          c.id === comment.id ? { ...c, likeCount: response.likeCount } : c;
        
        this.comments.update(comments =>
          comments.map(c => {
            const updated = updateFn(c);
            if (updated.replies) {
              return { ...updated, replies: updated.replies.map(updateFn) };
            }
            return updated;
          })
        );
      },
      error: (err) => {
        console.error('[CommentList] Error liking comment:', err);
      }
    });
  }

  isOwner(comment: Comment): boolean {
    const currentUser = this.authService.currentUser();
    return currentUser?.id === comment.userId;
  }

  getInitials(name?: string): string {
    return (name || 'U').substring(0, 2).toUpperCase();
  }
}
