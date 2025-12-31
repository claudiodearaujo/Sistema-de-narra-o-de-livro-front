import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';
import { Subject, takeUntil } from 'rxjs';

import { NotificationService, Notification } from '../../../../core/services/notification.service';

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
export class NotificationsComponent implements OnInit, OnDestroy {
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  loading = signal(true);
  notifications = signal<Notification[]>([]);
  hasMore = signal(false);
  currentPage = 1;
  readonly pageSize = 20;

  // Computed values
  unreadCount = computed(() => this.notificationService.unreadCount());

  ngOnInit() {
    this.loadNotifications();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadNotifications(loadMore = false) {
    if (!loadMore) {
      this.loading.set(true);
      this.currentPage = 1;
    }

    this.notificationService.getNotifications(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (loadMore) {
          this.notifications.update(current => [...current, ...response.notifications]);
        } else {
          this.notifications.set(response.notifications);
        }
        this.hasMore.set(this.currentPage < response.pages);
        this.loading.set(false);
      },
      error: (err: Error) => {
        console.error('[Notifications] Error loading:', err);
        this.loading.set(false);
      }
    });
  }

  loadMore() {
    if (!this.hasMore()) return;
    this.currentPage++;
    this.loadNotifications(true);
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
    if (notification.actor?.username) {
      return ['/social/profile', notification.actor.username];
    }
    return null;
  }

  markAsRead(notification: Notification) {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          // Update local state
          this.notifications.update(list => 
            list.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
          );
        },
        error: (err: Error) => console.error('[Notifications] Error marking as read:', err)
      });
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
      },
      error: (err: Error) => console.error('[Notifications] Error marking all as read:', err)
    });
  }

  deleteNotification(notificationId: string, event: Event) {
    event.stopPropagation();
    this.notificationService.deleteNotification(notificationId).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notifications.update(list => list.filter(n => n.id !== notificationId));
      },
      error: (err: Error) => console.error('[Notifications] Error deleting:', err)
    });
  }

  clearAll() {
    this.notificationService.clearAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notifications.set([]);
      },
      error: (err: Error) => console.error('[Notifications] Error clearing all:', err)
    });
  }

  getUnreadNotifications(): Notification[] {
    return this.notifications().filter(n => !n.isRead);
  }

  getReadNotifications(): Notification[] {
    return this.notifications().filter(n => n.isRead);
  }
}
