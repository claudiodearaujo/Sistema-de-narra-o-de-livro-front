import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  banner: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  joinedAt: Date;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  booksCount: number;
  livraBalance: number;
  level: number;
  xp: number;
  achievements: Achievement[];
  isFollowing: boolean;
  isOwnProfile: boolean;
}

interface Achievement {
  id: string;
  name: string;
  icon: string;
  unlockedAt: Date;
}

interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
}

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
    DialogModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  loading = signal(true);
  profile = signal<UserProfile | null>(null);
  posts = signal<Post[]>([]);
  showFollowersDialog = signal(false);
  showFollowingDialog = signal(false);
  
  xpProgress = computed(() => {
    const p = this.profile();
    if (!p) return 0;
    const xpForNextLevel = p.level * 1000;
    return (p.xp / xpForNextLevel) * 100;
  });

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const username = params['username'];
      this.loadProfile(username);
    });
  }

  async loadProfile(username: string) {
    this.loading.set(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.profile.set({
      id: '1',
      username: username,
      displayName: 'Maria Silva',
      avatar: null,
      banner: null,
      bio: 'Escritora apaixonada por fantasia e ficção científica. Autora de "O Reino das Sombras".',
      location: 'São Paulo, Brasil',
      website: 'https://mariasilva.com',
      joinedAt: new Date('2023-01-15'),
      followersCount: 5420,
      followingCount: 342,
      postsCount: 156,
      booksCount: 3,
      livraBalance: 15000,
      level: 12,
      xp: 7500,
      achievements: [
        { id: '1', name: 'Primeiro Post', icon: 'pi-pencil', unlockedAt: new Date() },
        { id: '2', name: 'Autor Verificado', icon: 'pi-check-circle', unlockedAt: new Date() },
        { id: '3', name: '1000 Seguidores', icon: 'pi-users', unlockedAt: new Date() }
      ],
      isFollowing: false,
      isOwnProfile: username === 'meu_usuario'
    });
    
    this.posts.set([
      {
        id: '1',
        content: 'Acabei de finalizar o capítulo 15! Muito animada com o rumo que a história está tomando.',
        imageUrl: null,
        likesCount: 234,
        commentsCount: 45,
        createdAt: new Date()
      },
      {
        id: '2',
        content: 'Dica de leitura: "A Sombra do Vento" de Carlos Ruiz Zafón. Um livro incrível!',
        imageUrl: null,
        likesCount: 156,
        commentsCount: 23,
        createdAt: new Date(Date.now() - 86400000)
      }
    ]);
    
    this.loading.set(false);
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

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  }

  toggleFollow() {
    const p = this.profile();
    if (p) {
      this.profile.set({
        ...p,
        isFollowing: !p.isFollowing,
        followersCount: p.isFollowing ? p.followersCount - 1 : p.followersCount + 1
      });
    }
  }

  openFollowers() {
    this.showFollowersDialog.set(true);
  }

  openFollowing() {
    this.showFollowingDialog.set(true);
  }
}
