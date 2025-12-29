import { Routes } from '@angular/router';

const loadLayout = () => import('./features/layout/layout.component').then(m => m.LayoutComponent);
const loadDashboard = () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent);
const loadBookList = () => import('./features/books/book-list/book-list.component').then(m => m.BookListComponent);
const loadBookForm = () => import('./features/books/book-form/book-form.component').then(m => m.BookFormComponent);
const loadBookDetail = () => import('./features/books/book-detail/book-detail.component').then(m => m.BookDetailComponent);
const loadChapterDetail = () => import('./features/chapters/chapter-detail/chapter-detail.component').then(m => m.ChapterDetailComponent);
const loadCharacterList = () => import('./features/characters/character-list/character-list.component').then(m => m.CharacterListComponent);
const loadVoiceList = () => import('./features/voices/voice-list/voice-list.component').then(m => m.VoiceListComponent);

export const routes: Routes = [
    {
        path: '',
        loadComponent: loadLayout,
        children: [
            {
                path: '',
                pathMatch: 'full',
                title: 'Painel',
                loadComponent: loadDashboard
            },
            {
                path: 'books',
                title: 'Livros',
                loadComponent: loadBookList
            },
            {
                path: 'books/new',
                title: 'Novo Livro',
                loadComponent: loadBookForm
            },
            {
                path: 'books/:id',
                title: 'Detalhes do Livro',
                loadComponent: loadBookDetail
            },
            {
                path: 'books/:id/edit',
                title: 'Editar Livro',
                loadComponent: loadBookForm
            },
            {
                path: 'books/:id/characters',
                title: 'Personagens do Livro',
                loadComponent: loadCharacterList
            },
            {
                path: 'chapters/:id',
                title: 'Capítulo',
                loadComponent: loadChapterDetail
            },
            {
                path: 'characters',
                title: 'Personagens',
                loadComponent: loadCharacterList
            },
            {
                path: 'voices',
                title: 'Vozes',
                loadComponent: loadVoiceList
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
