import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

// Core
import { Post, PostBook } from '../../../core/models/post.model';

/**
 * Book Update Card Component - Sprint 7
 * 
 * Displays a book update post with cover, title, and action button.
 */
@Component({
  selector: 'app-book-update-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    TagModule
  ],
  templateUrl: './book-update-card.component.html',
  styleUrl: './book-update-card.component.css'
})
export class BookUpdateCardComponent {
  @Input() book: PostBook | undefined;
  @Input() description: string = '';
  @Input() isNewBook: boolean = true;
}
