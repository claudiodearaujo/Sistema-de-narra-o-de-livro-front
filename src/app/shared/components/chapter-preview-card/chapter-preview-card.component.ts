import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

// Core
import { PostBook, PostChapter } from '../../../core/models/post.model';

/**
 * Chapter Preview Card Component - Sprint 7
 * 
 * Displays a chapter preview with book info and excerpt.
 */
@Component({
  selector: 'app-chapter-preview-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    TagModule,
    DividerModule
  ],
  templateUrl: './chapter-preview-card.component.html',
  styleUrl: './chapter-preview-card.component.css'
})
export class ChapterPreviewCardComponent {
  @Input() book: PostBook | undefined;
  @Input() chapter: PostChapter | undefined;
  @Input() excerpt: string = '';
}
