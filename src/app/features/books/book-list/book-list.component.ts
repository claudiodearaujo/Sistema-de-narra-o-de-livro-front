import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BookService } from '../../../services/book.service';
import { Book, BooksResponse } from '../../../models/book.model';
import { take } from 'rxjs';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
    selector: 'app-book-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ConfirmDialogModule,
        ToastModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
    books: Book[] = [];
    totalRecords = 0;
    loading = false;

    // Pagination
    page = 1;
    limit = 10;

    // Filters
    titleFilter = '';
    authorFilter = '';

    constructor(
        private bookService: BookService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private analytics: AnalyticsService
    ) { }

    ngOnInit() {
        this.analytics.trackPageView('Book List', '/writer/books');
        this.loadBooks();
    }

    loadBooks() {
        this.loading = true;
        this.bookService.getAll(
            this.page,
            this.limit,
            this.titleFilter || undefined,
            this.authorFilter || undefined
        ).pipe(take(1)).subscribe({
            next: (response: BooksResponse) => {
                this.books = response.data;
                this.totalRecords = response.total;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading books:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao carregar livros'
                });
                this.loading = false;
            }
        });
    }

    onPageChange(event: any) {
        this.page = event.first / event.rows + 1;
        this.limit = event.rows;
        this.loadBooks();
    }

    applyFilters() {
        this.page = 1;
        this.loadBooks();
    }

    clearFilters() {
        this.titleFilter = '';
        this.authorFilter = '';
        this.page = 1;
        this.loadBooks();
    }

    viewBook(id: string) {
        this.router.navigate(['/writer/books', id]);
    }

    editBook(id: string) {
        this.router.navigate(['/writer/books', id, 'edit']);
    }

    deleteBook(book: Book) {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir este livro?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.bookService.delete(book.id).subscribe({
                    next: () => {
                        this.analytics.trackBookDelete(book.id, book.title);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Livro excluído com sucesso'
                        });
                        this.loadBooks();
                    },
                    error: (error) => {
                        console.error('Error deleting book:', error);
                        this.analytics.trackError('book_delete_error', error.message || 'Failed to delete book', 'book-list');
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao excluir livro'
                        });
                    }
                });
            }
        });
    }

    createBook() {
        this.router.navigate(['/writer/books/new']);
    }
}
