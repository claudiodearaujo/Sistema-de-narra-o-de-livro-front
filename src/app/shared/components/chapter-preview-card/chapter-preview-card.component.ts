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
  template: `
    <div class="chapter-preview-card bg-linear-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 rounded-xl overflow-hidden border border-secondary-200 dark:border-secondary-700">
      <!-- Header -->
      <div class="bg-secondary-100 dark:bg-secondary-800/50 px-4 py-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="pi pi-book text-primary-600 dark:text-primary-400"></i>
          <span class="text-sm font-medium text-primary-800 dark:text-primary-200 font-heading">
            {{ book?.title || 'Livro' }}
          </span>
        </div>
        <p-tag value="Novo Capítulo 📖" severity="success" />
      </div>

      <!-- Content -->
      <div class="p-4">
        <h3 class="font-bold text-lg text-primary-800 dark:text-primary-200 mb-2 font-heading">
          {{ chapter?.title || 'Capítulo' }}
        </h3>

        @if (excerpt) {
          <div class="bg-white/60 dark:bg-secondary-800/60 rounded-lg p-3 mb-4">
            <p class="text-primary-700 dark:text-primary-300 italic text-sm leading-relaxed line-clamp-4 font-body">
              "{{ excerpt }}"
            </p>
          </div>
        }

        <div class="flex items-center justify-between">
          <div class="text-sm text-secondary">
            <span>Capítulo {{ chapter?.orderIndex || 1 }}</span>
            @if (book?.author) {
              <span> • {{ book!.author }}</span>
            }
          </div>

          <a 
            [routerLink]="['/books', book?.id, 'chapter', chapter?.id]"
            pButton
            type="button"
            label="Ler capítulo"
            icon="pi pi-arrow-right"
            iconPos="right"
            class="p-button-sm"
          ></a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chapter-preview-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .chapter-preview-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .line-clamp-4 {
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ChapterPreviewCardComponent {
  @Input() book: PostBook | undefined;
  @Input() chapter: PostChapter | undefined;
  @Input() excerpt: string = '';
}
