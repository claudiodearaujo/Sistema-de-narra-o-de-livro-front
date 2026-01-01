import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { PwaService } from '../../../core/services/pwa.service';

@Component({
  selector: 'app-install-prompt',
  standalone: true,
  imports: [CommonModule, Button],
  template: `
    @if (showPrompt()) {
      <div class="install-prompt">
        <div class="prompt-content">
          <div class="prompt-icon">📚</div>
          <div class="prompt-text">
            <h4>Instalar LIVRIA</h4>
            <p>Tenha acesso rápido ao app na sua tela inicial</p>
          </div>
        </div>
        <div class="prompt-actions">
          <p-button 
            label="Agora não" 
            [text]="true" 
            size="small"
            (onClick)="dismiss()"
          />
          <p-button 
            label="Instalar" 
            icon="pi pi-download"
            size="small"
            (onClick)="install()"
          />
        </div>
      </div>
    }
  `,
  styles: [`
    .install-prompt {
      position: fixed;
      bottom: 80px;
      left: var(--space-4);
      right: var(--space-4);
      background: var(--surface-card);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--surface-border);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      animation: slideUp 0.3s ease;

      @media (min-width: 768px) {
        left: auto;
        right: var(--space-6);
        bottom: var(--space-6);
        max-width: 360px;
      }
    }

    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .prompt-content {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .prompt-icon {
      font-size: 32px;
    }

    .prompt-text {
      h4 {
        margin: 0;
        font-size: var(--text-lg);
        font-family: var(--font-heading);
        color: var(--color-primary-700);
      }

      p {
        margin: var(--space-1) 0 0;
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }
    }

    .prompt-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-2);
    }
  `],
})
export class InstallPromptComponent {
  private readonly pwaService = inject(PwaService);

  showPrompt = signal(false);

  constructor() {
    // Show prompt after a delay if installable
    setTimeout(() => {
      if (this.pwaService.isInstallable() && !this.pwaService.isInstalled()) {
        // Check if user has dismissed before
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
          this.showPrompt.set(true);
        }
      }
    }, 5000);
  }

  async install(): Promise<void> {
    const installed = await this.pwaService.promptInstall();
    this.showPrompt.set(false);
    if (installed) {
      console.log('[InstallPrompt] App installed!');
    }
  }

  dismiss(): void {
    this.showPrompt.set(false);
    // Don't show again for 7 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  }
}
