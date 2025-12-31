import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

/**
 * Application Root Routes
 * 
 * Structure:
 * - /auth/*       - Authentication pages (login, signup, forgot-password, profile)
 * - /writer/*     - Writer Area module (books, chapters, characters, voices)
 * - /social/*     - Social Network module (future)
 * - /unauthorized - Access denied page
 * - /             - Redirects to /writer if authenticated, /auth/login otherwise
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

  // Default redirect
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'writer'
  },

  // Wildcard redirect
  {
    path: '**',
    redirectTo: 'writer'
  }
];
