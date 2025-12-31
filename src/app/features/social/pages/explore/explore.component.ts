import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { ChipModule } from 'primeng/chip';

interface TrendingTopic {
  tag: string;
  posts: number;
}

interface SuggestedUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  bio: string | null;
  followersCount: number;
  isFollowing: boolean;
}

interface FeaturedBook {
  id: string;
  title: string;
  author: string;
  cover: string | null;
  rating: number;
  reviewsCount: number;
}

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    CardModule,
    TabsModule,
    AvatarModule,
    SkeletonModule,
    ChipModule
  ],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit {
  loading = signal(true);
  trendingTopics = signal<TrendingTopic[]>([]);
  suggestedUsers = signal<SuggestedUser[]>([]);
  featuredBooks = signal<FeaturedBook[]>([]);
  popularGenres = signal<string[]>([]);

  ngOnInit() {
    this.loadExploreData();
  }

  async loadExploreData() {
    this.loading.set(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.trendingTopics.set([
      { tag: 'FantasiaEpica', posts: 1243 },
      { tag: 'LivrosDoMes', posts: 892 },
      { tag: 'RomanceLiterario', posts: 756 },
      { tag: 'LeituraDomingo', posts: 543 },
      { tag: 'NovosAutores', posts: 421 }
    ]);
    
    this.suggestedUsers.set([
      {
        id: '1',
        username: 'maria_escritora',
        displayName: 'Maria Silva',
        avatar: null,
        bio: 'Escritora de fantasia e ficção científica',
        followersCount: 5420,
        isFollowing: false
      },
      {
        id: '2',
        username: 'joao_leitor',
        displayName: 'João Santos',
        avatar: null,
        bio: 'Leitor voraz de romances',
        followersCount: 3210,
        isFollowing: false
      },
      {
        id: '3',
        username: 'ana_bookworm',
        displayName: 'Ana Costa',
        avatar: null,
        bio: 'Resenhas literárias e dicas de leitura',
        followersCount: 8932,
        isFollowing: false
      }
    ]);
    
    this.featuredBooks.set([
      {
        id: '1',
        title: 'O Reino das Sombras',
        author: 'Carlos Mendes',
        cover: null,
        rating: 4.8,
        reviewsCount: 234
      },
      {
        id: '2',
        title: 'Além do Horizonte',
        author: 'Lucia Ferreira',
        cover: null,
        rating: 4.6,
        reviewsCount: 189
      }
    ]);
    
    this.popularGenres.set([
      'Fantasia', 'Romance', 'Ficção Científica', 'Terror', 
      'Mistério', 'Aventura', 'Drama', 'Comédia'
    ]);
    
    this.loading.set(false);
  }

  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  toggleFollow(user: SuggestedUser) {
    const users = this.suggestedUsers();
    const updated = users.map(u => 
      u.id === user.id ? { ...u, isFollowing: !u.isFollowing } : u
    );
    this.suggestedUsers.set(updated);
  }
}
