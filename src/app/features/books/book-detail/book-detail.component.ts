import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BookService } from '../../../services/book.service';
import { Book, BookStats } from '../../../models/book.model';
import { ChapterListComponent } from '../../chapters/chapter-list/chapter-list.component';
import { CharacterListComponent } from '../../characters/character-list/character-list.component';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { ChapterFormComponent } from '../../chapters/chapter-form/chapter-form.component';

@Component({
    selector: 'app-book-detail',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        TagModule,
        Toast,
        ChapterListComponent,
        
     
    ],
    providers: [MessageService, DialogService],
    templateUrl: './book-detail.component.html',
    styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit, OnDestroy {
    book?: Book;
    stats?: BookStats;
    loading = false;
    bookId?: string;
    activeTab: string | number = '0';
    private pageViewTime: number = 0;
    private pageViewInterval: any;
    ref: DynamicDialogRef<ChapterFormComponent> | null | undefined;

    @ViewChild(ChapterListComponent) chapterListComponent?: ChapterListComponent;

    constructor(
        private bookService: BookService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private analytics: AnalyticsService,
        private dialogService: DialogService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.bookId = params['id'];
                this.loadBook();
                this.loadStats();
            }
        });

        // Track time on page
        this.pageViewInterval = setInterval(() => {
            this.pageViewTime += 1;
        }, 1000);
    }

    ngOnDestroy() {
        // Track total time spent on page
        if (this.book && this.pageViewTime > 0) {
            this.analytics.trackTimeOnPage(
                `Book Details: ${this.book.title}`,
                this.pageViewTime
            );
        }

        // Clear interval
        if (this.pageViewInterval) {
            clearInterval(this.pageViewInterval);
        }
    }

    loadBook() {
        if (!this.bookId) return;

        this.loading = true;
        this.bookService.getById(this.bookId).subscribe({
            next: (book: Book) => {
                this.book = book;
                this.loading = false;

                // Track book view
                this.analytics.trackBookView(book.id, book.title);
                this.analytics.trackPageView(
                    `Book Details: ${book.title}`,
                    `/writer/books/${book.id}`
                );
            },
            error: (error) => {
                console.error('Error loading book:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao carregar livro'
                });
                this.loading = false;

                // Track error
                this.analytics.trackError(
                    'book_load_error',
                    error.message || 'Failed to load book',
                    'book-detail'
                );

                this.router.navigate(['/writer/books']);
            }
        });
    }

    loadStats() {
        if (!this.bookId) return;

        this.bookService.getStats(this.bookId).subscribe({
            next: (stats: BookStats) => {
                this.stats = stats;
            },
            error: (error) => {
                console.error('Error loading stats:', error);
            }
        });
    }

    editBook() {
        if (this.bookId && this.book) {
            // Track edit action
            this.analytics.trackNavigation(
                'book-detail',
                'book-edit',
                'edit_button_click'
            );

            this.router.navigate(['/writer/books', this.bookId, 'edit']);
        }
    }

    backToList() {
        // Track navigation
        this.analytics.trackNavigation(
            'book-detail',
            'book-list',
            'back_button_click'
        );

        this.router.navigate(['/writer/books']);
    }

    onTabChange(value: string | number | undefined) {
        if (value !== undefined) {
            this.activeTab = value;

            // Track tab switch
            const tabName = value === '0' ? 'chapters' : 'characters';
            this.analytics.trackTabSwitch(tabName, 'book-detail');
        }
    }

    viewCharacters() {
        // Track quick action
        this.analytics.trackQuickAction('view_characters', this.bookId);
        this.analytics.trackCharactersView(this.bookId || '');

        // Switch to Characters tab (which will be value '1')
        this.activeTab = '1';
        // Optionally scroll to the tabs
        const tabsElement = document.querySelector('p-tabs');
        if (tabsElement) {
            tabsElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    newChapter() {
        if (this.bookId) {
            // Track quick action
            this.analytics.trackQuickAction('new_chapter', this.bookId);
            this.analytics.trackNavigation(
                'book-detail',
                'chapter-create',
                'new_chapter_button_click'
            );

            this.router.navigate(['/writer/books', this.bookId, 'chapters', 'new']);
            this.ref = this.dialogService.open(ChapterFormComponent, {
                header: 'Novo Capítulo',
                width: '50%',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                data: { bookId: this.bookId }
            });

            if (this.ref) {
                this.ref.onClose.subscribe((result) => {
                    if (result) {
                        this.loadStats();
                        // Recarrega a lista de capítulos no componente filho
                        if (this.chapterListComponent) {
                            this.chapterListComponent.loadChapters();
                        }
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Capítulo criado'
                        });
                    }
                });
            }
        }
    }
}
