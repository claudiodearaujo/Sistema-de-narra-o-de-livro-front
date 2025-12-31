import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { TabsModule } from 'primeng/tabs';

/**
 * Search Component
 * 
 * Search for users, posts, and books.
 */
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    TabsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  loading = signal(false);
  hasSearched = signal(false);
  
  users = signal<any[]>([]);
  posts = signal<any[]>([]);
  books = signal<any[]>([]);

  trendingTags = ['suspense', 'romance', 'ficção científica', 'fantasia', 'mistério'];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  search(): void {
    if (!this.searchQuery.trim()) return;

    this.loading.set(true);
    this.hasSearched.set(true);

    // Simulating search API call
    setTimeout(() => {
      this.users.set([
        { id: '1', name: 'Maria Silva', username: 'mariasilva', initials: 'MS', followers: 1234 },
        { id: '2', name: 'Mariana Santos', username: 'marianasantos', initials: 'MS', followers: 567 },
      ]);

      this.posts.set([
        { id: '1', author: 'João Pereira', preview: 'Este é um post sobre ' + this.searchQuery, likes: 42 },
        { id: '2', author: 'Ana Costa', preview: 'Falando sobre ' + this.searchQuery + ' no meu novo livro...', likes: 89 },
      ]);

      this.books.set([
        { id: '1', title: 'O Mistério de ' + this.searchQuery, author: 'Maria Silva', chapters: 12 },
      ]);

      this.loading.set(false);
    }, 800);
  }

  searchTag(tag: string): void {
    this.searchQuery = tag;
    this.search();
  }

  goToProfile(username: string): void {
    this.router.navigate(['/social/profile', username]);
  }

  goToPost(postId: string): void {
    this.router.navigate(['/social/post', postId]);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.hasSearched.set(false);
    this.users.set([]);
    this.posts.set([]);
    this.books.set([]);
  }
}
