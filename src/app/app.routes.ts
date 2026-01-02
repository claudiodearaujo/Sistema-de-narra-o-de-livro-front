import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

/**
 * Application Root Routes
 * 
 * Structure:
 * - /institutional/* - Public institutional pages (about, terms, privacy, etc.)
 * - /auth/*          - Authentication pages (login, signup, forgot-password, profile)
 * - /writer/*        - Writer Area module (books, chapters, characters, voices)
 * - /social/*        - Social Network module
 * - /unauthorized    - Access denied page
 * - /                - Redirects to /institutional/about (home page)
 */
export const routes: Routes = [
  // Authentication Routes (public)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // Unauthorized page
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/auth/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
    title: 'Acesso Negado'
  },

  // Writer Module (protected)
  {
    path: 'writer',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    loadChildren: () => import('./features/writer/writer.routes').then(m => m.WRITER_ROUTES)
  },

  // Social Module
  {
    path: 'social',
    canActivate: [authGuard],
    loadChildren: () => import('./features/social/social.routes').then(m => m.SOCIAL_ROUTES)
  },

  // Livras Module (Sprint 8)
  {
    path: 'livras',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    loadChildren: () => import('./features/livras/livras.routes').then(m => m.LIVRAS_ROUTES)
  },

  // Subscription Module (Sprint 9)
  {
    path: 'subscription',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    loadChildren: () => import('./features/subscription/subscription.routes').then(m => m.subscriptionRoutes)
  },

  // Achievements Module (Sprint 10)
  {
    path: 'achievements',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    loadChildren: () => import('./features/achievements/achievements.routes').then(m => m.achievementRoutes)
  },

  // Institutional Module (Public pages)
  {
    path: 'institutional',
    loadChildren: () => import('./features/institutional/institutional.routes').then(m => m.INSTITUTIONAL_ROUTES)
  },

  // Default redirect - Home page is the institutional home
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'institutional'
  },

  // Wildcard redirect
  {
    path: '**',
    redirectTo: 'institutional'
  }
];
