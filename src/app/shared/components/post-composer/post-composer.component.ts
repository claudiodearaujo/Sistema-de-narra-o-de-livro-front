import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';

// Core
import { PostService } from '../../../core/services/post.service';
import { Post, PostType, CreatePostDto } from '../../../core/models/post.model';

/**
 * Post Composer Component
 * 
 * A modal dialog for creating new posts.
 * Features:
 * - Text content with character limit
 * - Image upload (URL for now)
 * - Post type selection
 * - Character counter
 */
@Component({
  selector: 'app-post-composer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    TextareaModule,
    AvatarModule,
    TooltipModule,
    ProgressSpinnerModule,
    SelectModule
  ],
  templateUrl: './post-composer.component.html',
  styleUrl: './post-composer.component.css'
})
export class PostComposerComponent {
  private readonly postService = inject(PostService);
  private readonly messageService = inject(MessageService);

  /** Whether the dialog is visible */
  @Input() visible = false;

  /** User's display name for avatar */
  @Input() userName = '';

  /** User's avatar URL */
  @Input() userAvatar?: string;

  /** Emitted when visibility changes */
  @Output() visibleChange = new EventEmitter<boolean>();

  /** Emitted when a post is successfully created */
  @Output() postCreated = new EventEmitter<Post>();

  // State
  content = signal('');
  mediaUrl = signal('');
  postType = signal<PostType>('TEXT');
  submitting = signal(false);
  showImageInput = signal(false);

  // Constants
  readonly MAX_CHARACTERS = 2000;

  // Post type options
  postTypeOptions = [
    { label: 'Texto', value: 'TEXT' },
    { label: 'Imagem', value: 'IMAGE' },
    { label: 'Atualização de Livro', value: 'BOOK_UPDATE' }
  ];

  /**
   * Get remaining characters count
   */
  get remainingCharacters(): number {
    return this.MAX_CHARACTERS - this.content().length;
  }

  /**
   * Check if content is valid
   */
  get isValid(): boolean {
    const contentTrimmed = this.content().trim();
    return contentTrimmed.length > 0 && contentTrimmed.length <= this.MAX_CHARACTERS;
  }

  /**
   * Get user initials for avatar fallback
   */
  getInitials(): string {
    if (!this.userName) return '?';
    return this.userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  /**
   * Toggle image URL input visibility
   */
  toggleImageInput(): void {
    this.showImageInput.update(v => !v);
    if (!this.showImageInput()) {
      this.mediaUrl.set('');
    } else {
      this.postType.set('IMAGE');
    }
  }

  /**
   * Handle content change
   */
  onContentChange(value: string): void {
    this.content.set(value);
  }

  /**
   * Handle media URL change
   */
  onMediaUrlChange(value: string): void {
    this.mediaUrl.set(value);
  }

  /**
   * Close the dialog
   */
  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.reset();
  }

  /**
   * Reset form state
   */
  reset(): void {
    this.content.set('');
    this.mediaUrl.set('');
    this.postType.set('TEXT');
    this.showImageInput.set(false);
  }

  /**
   * Submit the post
   */
  submit(): void {
    if (!this.isValid || this.submitting()) return;

    this.submitting.set(true);

    const dto: CreatePostDto = {
      type: this.mediaUrl() ? 'IMAGE' : this.postType(),
      content: this.content().trim(),
      mediaUrl: this.mediaUrl() || undefined
    };

    this.postService.createPost(dto).subscribe({
      next: (post) => {
        this.submitting.set(false);
        this.postCreated.emit(post);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Post publicado com sucesso!'
        });
        this.close();
      },
      error: (err) => {
        console.error('[PostComposer] Error creating post:', err);
        this.submitting.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.error || 'Não foi possível publicar o post'
        });
      }
    });
  }
}
