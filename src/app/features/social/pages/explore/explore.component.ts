import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { ChipModule } from 'primeng/chip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Core
import { PostService } from '../../../../core/services/post.service';
import { Post } from '../../../../core/models/post.model';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';
import { InfiniteScrollDirective } from '../../../../shared/directives/infinite-scroll.directive';

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
    ChipModule,
    ToastModule,
    TimeAgoPipe,
    InfiniteScrollDirective
  ],
  providers: [MessageService],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly postService = inject(PostService);
  private readonly messageService = inject(MessageService);

  // Posts state
  posts = signal<Post[]>([]);
  loadingPosts = signal(false);
  loadingMore = signal(false);
  page = signal(1);
  hasMore = signal(true);

  // Other content state
  loading = signal(true);
  trendingTopics = signal<TrendingTopic[]>([]);
  suggestedUsers = signal<SuggestedUser[]>([]);
  featuredBooks = signal<FeaturedBook[]>([]);
  popularGenres = signal<string[]>([]);

  // Computed
  isScrollDisabled = computed(() => 
    this.loadingPosts() || this.loadingMore() || !this.hasMore()
  );

  ngOnInit() {
    this.loadExploreData();
    this.loadExplorePosts();
  }

  /**
   * Load trending posts from API
   */
  loadExplorePosts(): void {
    this.loadingPosts.set(true);

    this.postService.getExplore(1, 20).subscribe({
      next: (response) => {
        this.posts.set(response.posts);
        this.hasMore.set(response.pagination.hasMore);
        this.page.set(1);
        this.loadingPosts.set(false);
      },
      error: (err) => {
        console.error('[ExploreComponent] Error loading posts:', err);
        this.loadingPosts.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os posts em destaque'
        });
      }
    });
  }

  /**
   * Load more posts (infinite scroll)
   */
  loadMorePosts(): void {
    if (this.loadingMore() || !this.hasMore()) return;

    const nextPage = this.page() + 1;
    this.loadingMore.set(true);

    this.postService.getExplore(nextPage, 20).subscribe({
      next: (response) => {
        this.posts.update(posts => [...posts, ...response.posts]);
        this.hasMore.set(response.pagination.hasMore);
        this.page.set(nextPage);
        this.loadingMore.set(false);
      },
      error: (err) => {
        console.error('[ExploreComponent] Error loading more posts:', err);
        this.loadingMore.set(false);
      }
    });
  }

  /**
   * Toggle like on a post
   */
  togglePostLike(post: Post): void {
    const previousState = post.isLiked;
    const previousCount = post.likeCount;

    post.isLiked = !previousState;
    post.likeCount += post.isLiked ? 1 : -1;
    this.posts.update(posts => [...posts]);

    this.postService.toggleLike(post.id).subscribe({
      next: (response) => {
        post.isLiked = response.liked;
        post.likeCount = response.likeCount;
        this.posts.update(posts => [...posts]);
      },
      error: () => {
        post.isLiked = previousState;
        post.likeCount = previousCount;
        this.posts.update(posts => [...posts]);
      }
    });
  }

  async loadExploreData() {
    this.loading.set(true);
    
    // Simulate API call for trending topics, users, books
    // TODO: Replace with real API calls when endpoints are ready
    await new Promise(resolve => setTimeout(resolve, 500));
    
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

  goToPost(postId: string): void {
    this.router.navigate(['/social/post', postId]);
  }

  goToProfile(username: string): void {
    this.router.navigate(['/social/profile', username]);
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
