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
    <div class="chapter-preview-card bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl overflow-hidden border border-amber-200 dark:border-amber-700">
      <!-- Header -->
      <div class="bg-amber-100 dark:bg-amber-800/50 px-4 py-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="pi pi-book text-amber-600 dark:text-amber-400"></i>
          <span class="text-sm font-medium text-amber-800 dark:text-amber-200">
            {{ book?.title || 'Livro' }}
          </span>
        </div>
        <p-tag value="Novo Capítulo 📖" severity="warn" />
      </div>

      <!-- Content -->
      <div class="p-4">
        <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">
          {{ chapter?.title || 'Capítulo' }}
        </h3>

        @if (excerpt) {
          <div class="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 mb-4">
            <p class="text-gray-700 dark:text-gray-300 italic text-sm leading-relaxed line-clamp-4">
              "{{ excerpt }}"
            </p>
          </div>
        }

        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
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
            class="p-button-sm p-button-warning"
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
