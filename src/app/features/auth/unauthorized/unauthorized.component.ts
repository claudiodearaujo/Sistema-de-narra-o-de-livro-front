import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink, ButtonModule],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-card">
        <div class="icon-wrapper">
          <i class="pi pi-ban"></i>
        </div>
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
        <div class="actions">
          <p-button 
            label="Voltar ao início" 
            routerLink="/writer"
            icon="pi pi-home"
          />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
  background: color-mix(in srgb, var(--surface-ground) 35%, transparent);

   padding: 1rem;
    }

    .unauthorized-card {
      background: var(--surface-card);
      border-radius: 1rem;
      padding: 3rem;
      text-align: center;
      max-width: 400px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .icon-wrapper {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-accent-500) 0%, var(--color-accent-600) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .icon-wrapper i {
      font-size: 2.5rem;
      color: white;
    }

    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-primary-700);
      font-family: var(--font-heading);
      margin: 0 0 0.75rem;
    }

    p {
      color: var(--text-secondary);
      margin: 0 0 2rem;
    }

    .actions {
      display: flex;
      justify-content: center;
    }
  `]
})
export class UnauthorizedComponent {}
