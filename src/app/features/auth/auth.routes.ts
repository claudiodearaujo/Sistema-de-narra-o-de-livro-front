import { Routes } from '@angular/router';
import { guestGuard } from '../../core/auth/guards/guest.guard';
import { authGuard } from '../../core/auth/guards/auth.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    title: 'Entrar | Sistema de Narração'
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent),
    title: 'Criar Conta | Sistema de Narração'
  },
  {
    path: 'forgot-password',
    canActivate: [guestGuard],
    loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    title: 'Recuperar Senha | Sistema de Narração'
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
    title: 'Meu Perfil | Sistema de Narração'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
