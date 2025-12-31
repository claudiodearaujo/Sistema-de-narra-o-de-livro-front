import { Routes } from '@angular/router';

export const LIVRAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/livras-page/livras-page.component').then(
        (m) => m.LivrasPageComponent
      ),
  },
];
