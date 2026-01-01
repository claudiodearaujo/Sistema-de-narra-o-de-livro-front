import { Component, EventEmitter, Input, Output, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampaignService } from '../../../../core/services/campaign.service';
import { Campaign } from '../../../../core/models/group.model';

interface BookOption {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  selected: boolean;
}

@Component({
  selector: 'app-campaign-create-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        (click)="close.emit()">
      </div>

      <!-- Modal -->
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nova Campanha de Leitura</h2>
          <button 
            (click)="close.emit()"
            class="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="p-4 space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome da campanha *
            </label>
            <input 
              type="text"
              [(ngModel)]="name"
              name="name"
              required
              maxlength="100"
              placeholder="Ex: Maratona de Fantasia 2025"
              class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição
            </label>
            <textarea 
              [(ngModel)]="description"
              name="description"
              rows="2"
              maxlength="500"
              placeholder="Descreva o objetivo da campanha..."
              class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none">
            </textarea>
          </div>

          <!-- Dates -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data de início
              </label>
              <input 
                type="date"
                [(ngModel)]="startDate"
                name="startDate"
                class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data de término
              </label>
              <input 
                type="date"
                [(ngModel)]="endDate"
                name="endDate"
                class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>

          <!-- Livra Reward -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recompensa em Livras
            </label>
            <div class="relative">
              <input 
                type="number"
                [(ngModel)]="livraReward"
                name="livraReward"
                min="0"
                max="1000"
                class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Livras</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">Livras que os membros ganham ao completar a campanha</p>
          </div>

          <!-- Books Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Livros da campanha *
            </label>
            
            <!-- Search books -->
            <div class="relative mb-3">
              <input 
                type="text"
                [(ngModel)]="bookSearch"
                name="bookSearch"
                (input)="searchBooks()"
                placeholder="Buscar livros..."
                class="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>

            <!-- Selected books -->
            @if (selectedBooks().length > 0) {
              <div class="mb-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <p class="text-sm font-medium text-primary-700 dark:text-primary-400 mb-2">
                  {{ selectedBooks().length }} livro(s) selecionado(s)
                </p>
                <div class="flex flex-wrap gap-2">
                  @for (book of selectedBooks(); track book.id) {
                    <span class="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-md text-sm">
                      {{ book.title }}
                      <button 
                        type="button"
                        (click)="toggleBook(book)"
                        class="text-gray-500 hover:text-red-500">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  }
                </div>
              </div>
            }

            <!-- Available books -->
            @if (booksLoading()) {
              <div class="text-center py-4 text-gray-500">Carregando livros...</div>
            } @else if (availableBooks().length > 0) {
              <div class="max-h-48 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                @for (book of availableBooks(); track book.id) {
                  <label 
                    class="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors"
                    [class]="book.selected ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'">
                    <input 
                      type="checkbox"
                      [checked]="book.selected"
                      (change)="toggleBook(book)"
                      class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    @if (book.coverUrl) {
                      <img [src]="book.coverUrl" class="w-8 h-12 rounded object-cover" />
                    } @else {
                      <div class="w-8 h-12 rounded bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                        <span class="text-white text-xs font-bold">{{ book.title.charAt(0) }}</span>
                      </div>
                    }
                    <div class="flex-1 min-w-0">
                      <p class="font-medium text-gray-900 dark:text-white text-sm truncate">{{ book.title }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ book.author }}</p>
                    </div>
                  </label>
                }
              </div>
            } @else {
              <div class="text-center py-4 text-gray-500 text-sm">
                Nenhum livro encontrado. Crie livros primeiro.
              </div>
            }
          </div>

          <!-- Error -->
          @if (error()) {
            <div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-sm text-red-600 dark:text-red-400">{{ error() }}</p>
            </div>
          }

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <button 
              type="button"
              (click)="close.emit()"
              class="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors">
              Cancelar
            </button>
            <button 
              type="submit"
              [disabled]="loading() || !name.trim() || selectedBooks().length === 0"
              class="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg font-medium transition-colors">
              @if (loading()) {
                <span class="flex items-center justify-center gap-2">
                  <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando...
                </span>
              } @else {
                Criar Campanha
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CampaignCreateModalComponent implements OnInit {
  @Input() groupId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<Campaign>();

  private readonly campaignService = inject(CampaignService);

  name = '';
  description = '';
  startDate = '';
  endDate = '';
  livraReward = 50;
  bookSearch = '';
  
  loading = signal(false);
  booksLoading = signal(false);
  error = signal<string | null>(null);
  
  availableBooks = signal<BookOption[]>([]);
  selectedBooks = signal<BookOption[]>([]);

  private searchTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.booksLoading.set(true);
    
    // Fetch books from the API - using fetch directly since we don't have a books service injected
    fetch(`${this.getApiUrl()}/books`)
      .then(res => res.json())
      .then(books => {
        const bookOptions: BookOption[] = books.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          coverUrl: book.coverUrl,
          selected: false
        }));
        this.availableBooks.set(bookOptions);
        this.booksLoading.set(false);
      })
      .catch(err => {
        console.error('Error loading books:', err);
        this.booksLoading.set(false);
      });
  }

  searchBooks() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      const search = this.bookSearch.toLowerCase();
      this.availableBooks.update(books => 
        books.map(book => ({
          ...book,
          // Keep selected state but filter display
        })).filter(book => 
          book.title.toLowerCase().includes(search) || 
          book.author.toLowerCase().includes(search) ||
          book.selected
        )
      );
    }, 300);
  }

  toggleBook(book: BookOption) {
    book.selected = !book.selected;
    
    if (book.selected) {
      this.selectedBooks.update(books => [...books, book]);
    } else {
      this.selectedBooks.update(books => books.filter(b => b.id !== book.id));
    }
    
    this.availableBooks.update(books => [...books]);
  }

  onSubmit() {
    if (!this.name.trim() || this.selectedBooks().length === 0) return;

    this.loading.set(true);
    this.error.set(null);

    this.campaignService.createCampaign(this.groupId, {
      name: this.name.trim(),
      description: this.description.trim() || undefined,
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined,
      livraReward: this.livraReward,
      bookIds: this.selectedBooks().map(b => b.id)
    }).subscribe({
      next: (campaign) => {
        this.loading.set(false);
        this.created.emit(campaign);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.error || 'Erro ao criar campanha');
      }
    });
  }

  private getApiUrl(): string {
    // Get from environment
    return 'http://localhost:3000/api';
  }
}
