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
  templateUrl: './share-modal.component.html',
  styleUrl: './share-modal.component.css'
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
