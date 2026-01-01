import { Component, Input, Output, EventEmitter, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Core
import { Post } from '../../../core/models/post.model';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/auth/services/auth.service';

/**
 * Share Modal Component - Sprint 7
 * 
 * Modal for sharing/quoting posts with optional commentary.
 */
@Component({
  selector: 'app-share-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    TextareaModule,
    AvatarModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-dialog 
      [(visible)]="visible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '500px', maxWidth: '95vw' }"
      header="Compartilhar post"
      (onHide)="onClose()"
    >
      @if (post) {
        <div class="share-modal-content">
          <!-- User Input Area -->
          <div class="flex gap-3 mb-4">
            <p-avatar 
              [image]="currentUser()?.avatar || undefined"
              [label]="!currentUser()?.avatar ? getInitials() : undefined"
              size="large"
              shape="circle"
            />
            <div class="flex-1">
              <textarea 
                pTextarea
                [(ngModel)]="quoteText"
                [rows]="3"
                [autoResize]="true"
                placeholder="Adicione um comentário (opcional)..."
                class="w-full"
                [maxlength]="280"
              ></textarea>
              <div class="text-right text-sm text-secondary mt-1">
                {{ quoteText.length }}/280
              </div>
            </div>
          </div>

          <!-- Original Post Preview -->
          <div class="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-4 border border-surface-border">
            <div class="flex items-center gap-2 mb-2">
              <p-avatar 
                [image]="post.user.avatar || undefined"
                [label]="!post.user.avatar ? 'U' : undefined"
                shape="circle"
                size="normal"
              />
              <div>
                <span class="font-medium text-sm">{{ post.user.name }}</span>
                @if (post.user.username) {
                  <span class="text-secondary text-sm ml-1">&#64;{{ post.user.username }}</span>
                }
              </div>
            </div>
            <p class="text-sm text-secondary line-clamp-3">{{ post.content }}</p>
            
            @if (post.mediaUrl) {
              <img 
                [src]="post.mediaUrl" 
                alt="Post image"
                class="mt-2 rounded-lg max-h-32 object-cover"
              />
            }

            @if (post.book) {
              <div class="mt-2 flex items-center gap-2 p-2 bg-surface-card rounded">
                @if (post.book.coverUrl) {
                  <img [src]="post.book.coverUrl" [alt]="post.book.title" class="w-8 h-10 object-cover rounded" />
                }
                <div>
                  <p class="text-xs font-medium">{{ post.book.title }}</p>
                  <p class="text-xs text-secondary">{{ post.book.author }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-2">
          <button 
            pButton 
            type="button" 
            label="Cancelar" 
            class="p-button-text p-button-secondary"
            (click)="onClose()"
          ></button>
          <button 
            pButton 
            type="button" 
            label="Compartilhar" 
            icon="pi pi-share-alt"
            (click)="onShare()"
            [loading]="sharing()"
          ></button>
        </div>
      </ng-template>
    </p-dialog>

    <p-toast />
  `,
  styles: [`
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ShareModalComponent {
  private readonly postService = inject(PostService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  @Input() post: Post | null = null;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() shared = new EventEmitter<Post>();

  currentUser = this.authService.currentUser;
  quoteText = '';
  sharing = signal(false);

  getInitials(): string {
    const name = this.currentUser()?.name || 'U';
    return name.substring(0, 2).toUpperCase();
  }

  onClose(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.quoteText = '';
  }

  onShare(): void {
    if (!this.post || this.sharing()) return;

    // Cannot share a post that is already a share
    if (this.post.type === 'SHARED') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Ação não permitida',
        detail: 'Não é possível compartilhar um post que já é compartilhamento'
      });
      return;
    }

    this.sharing.set(true);

    const content = this.quoteText.trim() || undefined;

    this.postService.sharePost(this.post.id, content).subscribe({
      next: (sharedPost) => {
        this.sharing.set(false);
        this.shared.emit(sharedPost);
        this.messageService.add({
          severity: 'success',
          summary: 'Compartilhado!',
          detail: 'Post compartilhado com sucesso'
        });
        this.onClose();
      },
      error: (err) => {
        this.sharing.set(false);
        console.error('[ShareModal] Error sharing post:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.error || 'Não foi possível compartilhar o post'
        });
      }
    });
  }
}
