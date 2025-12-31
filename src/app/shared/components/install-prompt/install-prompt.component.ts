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
      left: 16px;
      right: 16px;
      background: var(--surface-card);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      animation: slideUp 0.3s ease;

      @media (min-width: 768px) {
        left: auto;
        right: 24px;
        bottom: 24px;
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
      gap: 12px;
    }

    .prompt-icon {
      font-size: 32px;
    }

    .prompt-text {
      h4 {
        margin: 0;
        font-size: 16px;
        color: var(--text-color);
      }

      p {
        margin: 4px 0 0;
        font-size: 13px;
        color: var(--text-color-secondary);
      }
    }

    .prompt-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
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
