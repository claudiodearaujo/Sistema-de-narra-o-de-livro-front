import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Layout for authentication pages (login, signup, forgot-password).
 * Minimal layout without navigation menu.
 */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-layout">
      <router-outlet />
    </div>
  `,
  styles: [`
    .auth-layout {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-accent-600) 100%);
    }
  `]
})
export class AuthLayoutComponent {}
