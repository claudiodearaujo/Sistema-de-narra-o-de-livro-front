import { Component, signal, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Feed Component
 * 
 * Main feed page showing posts from followed users.
 * Features:
 * - Infinite scroll
 * - Pull to refresh (mobile)
 * - Post composer
 * - Story bar
 */
@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    SkeletonModule,
    AvatarModule,
    TooltipModule
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit, OnDestroy {
  @ViewChild('sentinel') sentinel!: ElementRef;

  // State signals
  posts = signal<Post[]>([]);
  loading = signal(false);
  page = signal(1);
  hasMore = signal(true);

  // Story mock data
  storyUsers = [1, 2, 3, 4, 5];

  private observer?: IntersectionObserver;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadPosts();
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setupIntersectionObserver(): void {
    setTimeout(() => {
      if (!this.sentinel?.nativeElement) return;

      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !this.loading() && this.hasMore()) {
            this.loadMore();
          }
        },
        { threshold: 0.1 }
      );

      this.observer.observe(this.sentinel.nativeElement);
    }, 100);
  }

  loadPosts(): void {
    this.loading.set(true);

    setTimeout(() => {
      const mockPosts: Post[] = [
        {
          id: '1',
          user: { id: '1', name: 'Maria Silva', username: 'mariasilva', initials: 'MS' },
          content: 'Acabei de terminar o capítulo 10 do meu novo livro! 📚 Estou muito animada com o rumo que a história está tomando. O que vocês acham de suspenses com reviravoltas?',
          likeCount: 42,
          commentCount: 8,
          isLiked: false,
          timeAgo: '2h'
        },
        {
          id: '2',
          user: { id: '2', name: 'João Pereira', username: 'joaopereira', initials: 'JP' },
          content: 'Dica para escritores: sempre mantenha um bloco de notas por perto. As melhores ideias surgem nos momentos mais inesperados! ✍️',
          likeCount: 156,
          commentCount: 23,
          isLiked: true,
          timeAgo: '5h'
        },
        {
          id: '3',
          user: { id: '3', name: 'Ana Costa', username: 'anacosta', initials: 'AC' },
          content: 'Novo capítulo disponível! "A Sombra do Passado" está cada vez mais intenso. Quem já leu?',
          imageUrl: 'https://picsum.photos/600/400?random=1',
          likeCount: 89,
          commentCount: 15,
          isLiked: false,
          timeAgo: '8h'
        }
      ];

      this.posts.set(mockPosts);
      this.loading.set(false);
    }, 1000);
  }

  loadMore(): void {
    if (this.loading() || !this.hasMore()) return;

    this.page.update(p => p + 1);
    this.loading.set(true);

    setTimeout(() => {
      if (this.page() > 3) {
        this.hasMore.set(false);
        this.loading.set(false);
        return;
      }

      const morePosts: Post[] = [
        {
          id: `${this.page()}-1`,
          user: { id: '4', name: 'User ' + this.page(), username: 'user' + this.page(), initials: 'U' + this.page() },
          content: 'Este é um post carregado na página ' + this.page(),
          likeCount: Math.floor(Math.random() * 100),
          commentCount: Math.floor(Math.random() * 20),
          isLiked: false,
          timeAgo: this.page() + 'd'
        }
      ];

      this.posts.update(posts => [...posts, ...morePosts]);
      this.loading.set(false);
    }, 1000);
  }

  toggleLike(post: Post): void {
    post.isLiked = !post.isLiked;
    post.likeCount += post.isLiked ? 1 : -1;
  }

  openPostModal(): void {
    console.log('Open post modal');
  }

  goToProfile(username: string): void {
    this.router.navigate(['/social/profile', username]);
  }

  goToPost(postId: string): void {
    this.router.navigate(['/social/post', postId]);
  }

  goToExplore(): void {
    this.router.navigate(['/social/explore']);
  }
}

interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    initials: string;
  };
  content: string;
  imageUrl?: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  timeAgo: string;
}
