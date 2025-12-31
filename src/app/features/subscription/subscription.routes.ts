/**
 * Subscription Routes
 * Sprint 9: Planos e Pagamentos
 */
import { Routes } from '@angular/router';

export const subscriptionRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/my-subscription-page/my-subscription-page.component').then(
        (m) => m.MySubscriptionPageComponent
      ),
  },
  {
    path: 'plans',
    loadComponent: () =>
      import('./pages/plans-page/plans-page.component').then(
        (m) => m.PlansPageComponent
      ),
  },
  {
    path: 'success',
    loadComponent: () =>
      import('./pages/success-page/success-page.component').then(
        (m) => m.SuccessPageComponent
      ),
  },
];
