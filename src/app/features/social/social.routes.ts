import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/guards/auth.guard';

/**
 * Social Network Module Routes
 * 
 * This module handles all social features:
 * - Feed: Personalized post feed from followed users
 * - Explore: Discover trending posts and users
 * - Profile: User profiles with posts and stats
 * - Notifications: Real-time notifications
 * - Search: Search for users, posts, and books
 */
export const SOCIAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/social-layout.component').then(m => m.SocialLayoutComponent),
    canActivate: [authGuard],
    children: [
      // Feed - Main social page
      {
        path: 'feed',
        loadComponent: () => import('./pages/feed/feed.component').then(m => m.FeedComponent),
        title: 'Feed | Livria'
      },

      // Explore - Discover content
      {
        path: 'explore',
        loadComponent: () => import('./pages/explore/explore.component').then(m => m.ExploreComponent),
        title: 'Explorar | Livria'
      },

      // Profile - User profiles
      {
        path: 'profile/:username',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'Perfil | Livria'
      },

      // My Profile - Current user profile
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'Meu Perfil | Livria'
      },

      // Post Detail
      {
        path: 'post/:id',
        loadComponent: () => import('./pages/post-detail/post-detail.component').then(m => m.PostDetailComponent),
        title: 'Post | Livria'
      },

      // Search
      {
        path: 'search',
        loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent),
        title: 'Buscar | Livria'
      },

      // Notifications
      {
        path: 'notifications',
        loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent),
        title: 'Notificações | Livria'
      },

      // Messages / Direct Messages
      {
        path: 'messages',
        loadComponent: () => import('./pages/messages/messages.component').then(m => m.MessagesComponent),
        title: 'Mensagens | Livria'
      },

      // Conversation Detail
      {
        path: 'messages/:userId',
        loadComponent: () => import('./pages/conversation/conversation.component').then(m => m.ConversationComponent),
        title: 'Conversa | Livria'
      },

      // Default redirect to feed
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'feed'
      }
    ]
  }
];
