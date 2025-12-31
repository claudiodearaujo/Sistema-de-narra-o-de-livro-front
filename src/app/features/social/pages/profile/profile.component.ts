import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

import { ProfileService, UserProfile, UserPost, UserBook } from '../../../../core/services/profile.service';
import { FollowService, FollowResponse } from '../../../../core/services/follow.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { AchievementService } from '../../../../core/services/achievement.service';
import { UserAchievement } from '../../../../core/models/achievement.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    TabsModule,
    AvatarModule,
    SkeletonModule,
    CardModule,
    DialogModule,
    TooltipModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly profileService = inject(ProfileService);
  private readonly followService = inject(FollowService);
  private readonly authService = inject(AuthService);
  private readonly achievementService = inject(AchievementService);
  private readonly destroy$ = new Subject<void>();

  loading = signal(true);
  profile = signal<UserProfile | null>(null);
  posts = signal<UserPost[]>([]);
  books = signal<UserBook[]>([]);
  achievements = signal<UserAchievement[]>([]);
  
  // Error states
  error = signal<string | null>(null);
  notFound = signal(false);
  
  loadingPosts = signal(false);
  loadingBooks = signal(false);
  loadingFollow = signal(false);
  
  postsPage = signal(1);
  booksPage = signal(1);
  hasMorePosts = signal(false);
  hasMoreBooks = signal(false);
  
  showFollowersDialog = signal(false);
  showFollowingDialog = signal(false);
  
  currentTab = signal<'posts' | 'books'>('posts');
  
  isOwnProfile = computed(() => {
    const p = this.profile();
    const currentUser = this.authService.currentUser();
    return p && currentUser && p.id === currentUser.id;
  });

  isFollowing = computed(() => {
    const p = this.profile();
    return p?.isFollowing ?? false;
  });
  
  xpProgress = computed(() => {
    const p = this.profile();
    if (!p || !p.stats.level || !p.stats.xp) return 0;
    const xpForNextLevel = p.stats.level * 1000;
    return (p.stats.xp / xpForNextLevel) * 100;
  });

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const username = params['username'];
      this.loadProfile(username);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProfile(username: string) {
    this.loading.set(true);
    this.error.set(null);
    this.notFound.set(false);
    this.postsPage.set(1);
    this.booksPage.set(1);
    
    forkJoin({
      profile: this.profileService.getProfile(username),
      posts: this.profileService.getUserPosts(username, 1, 10)
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ profile, posts }) => {
        this.profile.set(profile);
        this.posts.set(posts.posts);
        this.hasMorePosts.set(posts.pagination.hasMore);
        this.loading.set(false);
        
        // Load achievements for profile
        this.loadAchievements(profile.id);
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
        this.loading.set(false);
        
        if (err.status === 404) {
          this.notFound.set(true);
          this.error.set('Usuário não encontrado');
        } else if (err.status === 0) {
          this.error.set('Erro de conexão. Verifique sua internet.');
        } else {
          this.error.set('Erro ao carregar perfil. Tente novamente.');
        }
      }
    });
  }

  onTabChange(tab: 'posts' | 'books') {
    this.currentTab.set(tab);
    if (tab === 'books' && this.books().length === 0) {
      this.loadBooks();
    }
  }

  loadBooks() {
    const p = this.profile();
    if (!p?.username || this.loadingBooks()) return;
    
    this.loadingBooks.set(true);
    this.profileService.getUserBooks(p.username, 1, 10).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.books.set(response.books);
        this.hasMoreBooks.set(response.pagination.hasMore);
        this.booksPage.set(1);
        this.loadingBooks.set(false);
      },
      error: () => this.loadingBooks.set(false)
    });
  }

  loadMorePosts() {
    const p = this.profile();
    if (!p?.username || this.loadingPosts()) return;
    
    this.loadingPosts.set(true);
    const nextPage = this.postsPage() + 1;
    
    this.profileService.getUserPosts(p.username, nextPage, 10).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.posts.update(posts => [...posts, ...response.posts]);
        this.hasMorePosts.set(response.pagination.hasMore);
        this.postsPage.set(nextPage);
        this.loadingPosts.set(false);
      },
      error: () => this.loadingPosts.set(false)
    });
  }

  loadMoreBooks() {
    const p = this.profile();
    if (!p?.username || this.loadingBooks()) return;
    
    this.loadingBooks.set(true);
    const nextPage = this.booksPage() + 1;
    
    this.profileService.getUserBooks(p.username, nextPage, 10).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.books.update(books => [...books, ...response.books]);
        this.hasMoreBooks.set(response.pagination.hasMore);
        this.booksPage.set(nextPage);
        this.loadingBooks.set(false);
      },
      error: () => this.loadingBooks.set(false)
    });
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    }).format(d);
  }

  toggleFollow() {
    const p = this.profile();
    if (!p || this.loadingFollow()) return;
    
    this.loadingFollow.set(true);
    
    const action$ = p.isFollowing 
      ? this.followService.unfollow(p.id)
      : this.followService.follow(p.id);
    
    action$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: FollowResponse) => {
        this.profile.set({
          ...p,
          isFollowing: response.following,
          stats: {
            ...p.stats,
            followers: response.followerCount
          }
        });
        this.loadingFollow.set(false);
      },
      error: () => this.loadingFollow.set(false)
    });
  }

  openFollowers() {
    this.showFollowersDialog.set(true);
  }

  openFollowing() {
    this.showFollowingDialog.set(true);
  }

  loadAchievements(userId: string) {
    this.achievementService.getUserAchievements(userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.achievements.set(response.achievements.slice(0, 6)); // Show max 6
      },
      error: (err) => {
        console.error('Failed to load achievements:', err);
      }
    });
  }
}
