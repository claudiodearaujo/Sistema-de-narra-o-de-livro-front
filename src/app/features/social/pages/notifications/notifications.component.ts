import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'achievement' | 'system';
  message: string;
  actor: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  } | null;
  targetId: string | null;
  targetType: 'post' | 'comment' | 'book' | 'chapter' | null;
  isRead: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    AvatarModule,
    SkeletonModule,
    BadgeModule,
    TabsModule
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  loading = signal(true);
  notifications = signal<Notification[]>([]);
  unreadCount = signal(0);

  ngOnInit() {
    this.loadNotifications();
  }

  async loadNotifications() {
    this.loading.set(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'like',
        message: 'curtiu seu post',
        actor: {
          id: '2',
          username: 'joao_leitor',
          displayName: 'João Santos',
          avatar: null
        },
        targetId: 'post-1',
        targetType: 'post',
        isRead: false,
        createdAt: new Date(Date.now() - 300000)
      },
      {
        id: '2',
        type: 'follow',
        message: 'começou a seguir você',
        actor: {
          id: '3',
          username: 'ana_books',
          displayName: 'Ana Costa',
          avatar: null
        },
        targetId: null,
        targetType: null,
        isRead: false,
        createdAt: new Date(Date.now() - 1800000)
      },
      {
        id: '3',
        type: 'comment',
        message: 'comentou no seu post',
        actor: {
          id: '4',
          username: 'pedro_fantasia',
          displayName: 'Pedro Lima',
          avatar: null
        },
        targetId: 'post-2',
        targetType: 'post',
        isRead: true,
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        id: '4',
        type: 'achievement',
        message: 'Você desbloqueou a conquista "Primeiro Post"!',
        actor: null,
        targetId: 'achievement-1',
        targetType: null,
        isRead: true,
        createdAt: new Date(Date.now() - 7200000)
      },
      {
        id: '5',
        type: 'mention',
        message: 'mencionou você em um comentário',
        actor: {
          id: '5',
          username: 'carla_escritora',
          displayName: 'Carla Mendes',
          avatar: null
        },
        targetId: 'comment-5',
        targetType: 'comment',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000)
      },
      {
        id: '6',
        type: 'system',
        message: 'Bem-vindo ao Livria! Complete seu perfil para ganhar 100 LIVRA.',
        actor: null,
        targetId: null,
        targetType: null,
        isRead: true,
        createdAt: new Date(Date.now() - 172800000)
      }
    ];
    
    this.notifications.set(mockNotifications);
    this.unreadCount.set(mockNotifications.filter(n => !n.isRead).length);
    this.loading.set(false);
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'like': return 'pi pi-heart-fill';
      case 'comment': return 'pi pi-comment';
      case 'follow': return 'pi pi-user-plus';
      case 'mention': return 'pi pi-at';
      case 'achievement': return 'pi pi-trophy';
      case 'system': return 'pi pi-bell';
      default: return 'pi pi-bell';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'like': return '#e74c3c';
      case 'comment': return '#3498db';
      case 'follow': return '#9b59b6';
      case 'mention': return '#e67e22';
      case 'achievement': return '#f1c40f';
      case 'system': return '#1abc9c';
      default: return 'var(--text-color-secondary)';
    }
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString('pt-BR');
  }

  getNotificationLink(notification: Notification): string[] | null {
    if (notification.targetType === 'post' && notification.targetId) {
      return ['/social/post', notification.targetId];
    }
    if (notification.actor) {
      return ['/social/profile', notification.actor.username];
    }
    return null;
  }

  markAsRead(notification: Notification) {
    if (!notification.isRead) {
      notification.isRead = true;
      this.unreadCount.update(count => count - 1);
    }
  }

  markAllAsRead() {
    const updated = this.notifications().map(n => ({ ...n, isRead: true }));
    this.notifications.set(updated);
    this.unreadCount.set(0);
  }

  getUnreadNotifications(): Notification[] {
    return this.notifications().filter(n => !n.isRead);
  }

  getReadNotifications(): Notification[] {
    return this.notifications().filter(n => n.isRead);
  }
}
