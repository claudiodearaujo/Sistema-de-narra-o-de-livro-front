import { Component, computed, signal, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { MenuItem, MessageService as PrimeMessageService } from 'primeng/api';

// Components
import { PostComposerComponent } from '../../../shared/components/post-composer/post-composer.component';
import { PostService } from '../../../core/services/post.service';
import { Post } from '../../../core/models/post.model';

import { AuthService } from '../../../core/auth/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MessageService } from '../../../core/services/message.service';
import { WebSocketService } from '../../../core/services/websocket.service';

/**
 * Social Layout Component
 * 
 * Main layout for the social network module with:
 * - Header with logo, search, and user actions
 * - Sidebar navigation (desktop)
 * - Bottom navigation (mobile)
 * - Main content area with router outlet
 */
@Component({
  selector: 'app-social-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    ButtonModule,
    AvatarModule,
    BadgeModule,
    TooltipModule,
    RippleModule,
    MenuModule,
    ToastModule,
    PostComposerComponent
  ],
  providers: [PrimeMessageService],
  templateUrl: './social-layout.component.html',
  styleUrl: './social-layout.component.css'
})
export class SocialLayoutComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly msgService = inject(MessageService);
  private readonly wsService = inject(WebSocketService);
  private readonly router = inject(Router);
  private readonly postService = inject(PostService);
  private readonly primeMessageService = inject(PrimeMessageService);

  // Signals
  isMobile = signal(false);
  showPostComposer = signal(false);
  showRightSidebar = signal(true);
  currentUser = computed(() => this.authService.currentUser());

  // Real-time counts from services
  readonly notificationCount = computed(() => {
    const count = this.notificationService.unreadCount();
    return count > 0 ? (count > 99 ? '99+' : count.toString()) : '';
  });

  readonly messageCount = computed(() => {
    const count = this.msgService.unreadCount();
    return count > 0 ? (count > 99 ? '99+' : count.toString()) : '';
  });

  // Navigation items
  navItems = [
    { label: 'Feed', icon: 'pi pi-home', route: '/social/feed' },
    { label: 'Explorar', icon: 'pi pi-compass', route: '/social/explore' },
    { label: 'Grupos', icon: 'pi pi-users', route: '/social/groups' },
    { label: 'Buscar', icon: 'pi pi-search', route: '/social/search' },
    { label: 'Notificações', icon: 'pi pi-bell', route: '/social/notifications' },
    { label: 'Mensagens', icon: 'pi pi-envelope', route: '/social/messages' },
    { label: 'Perfil', icon: 'pi pi-user', route: '/social/profile' },
  ];

  mobileNavItems = [
    { label: 'Feed', icon: 'pi pi-home', route: '/social/feed' },
    { label: 'Explorar', icon: 'pi pi-compass', route: '/social/explore' },
    { label: 'Grupos', icon: 'pi pi-users', route: '/social/groups' },
    { label: 'Buscar', icon: 'pi pi-search', route: '/social/search' },
    { label: 'Perfil', icon: 'pi pi-user', route: '/social/profile' },
  ];

  userMenuItems: MenuItem[] = [];

  private routerSubscription?: Subscription;
  private currentRoute = '';

  constructor() {
    this.checkMobile();
    this.initUserMenu();
  }

  ngOnInit(): void {
    // Connect WebSocket for real-time updates
    if (!this.wsService.isConnected()) {
      this.wsService.connect();
    }

    // Load initial counts
    this.notificationService.getCount().subscribe();
    this.msgService.getUnreadCount().subscribe();

    // Track current route for active state
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });

    this.currentRoute = this.router.url;
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkMobile();
  }

  private checkMobile(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  private initUserMenu(): void {
    this.userMenuItems = [
      {
        label: 'Meu Perfil',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/social/profile'])
      },
      {
        label: 'Configurações',
        icon: 'pi pi-cog',
        command: () => this.router.navigate(['/auth/profile'])
      },
      {
        label: 'Área do Escritor',
        icon: 'pi pi-pencil',
        command: () => this.router.navigate(['/writer'])
      },
      { separator: true },
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  getInitials(): string {
    const user = this.currentUser();
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  goToFeed(): void {
    this.router.navigate(['/social/feed']);
  }

  goToSearch(): void {
    this.router.navigate(['/social/search']);
  }

  goToNotifications(): void {
    this.router.navigate(['/social/notifications']);
  }

  goToMessages(): void {
    this.router.navigate(['/social/messages']);
  }

  openNewPost(): void {
    this.showPostComposer.set(true);
  }

  onPostCreated(post: Post): void {
    // Show success toast
    this.primeMessageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Post publicado com sucesso!'
    });
    
    // Navigate to feed if not already there
    if (this.router.url !== '/social/feed') {
      this.router.navigate(['/social/feed']);
    } else {
      // Force refresh by navigating away and back
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/social/feed']);
      });
    }
  }

  private logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
