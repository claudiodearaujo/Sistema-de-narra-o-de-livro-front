import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Achievement } from '../../../../core/models/achievement.model';

import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-achievement-unlock-toast',
  standalone: true,
  imports: [CommonModule, ToastModule, ButtonModule],
  template: `
    @if (visible) {
      <div class="achievement-toast" [@slideIn]>
        <div class="toast-header">
          <span class="confetti">🎉</span>
          <h3>Conquista Desbloqueada!</h3>
          <button class="close-btn" (click)="close()">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="toast-body">
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <div class="achievement-details">
            <h4>{{ achievement.name }}</h4>
            <p>{{ achievement.description }}</p>
            @if (achievement.livraReward > 0) {
              <div class="reward-earned">
                <span class="livra-icon">💎</span>
                <span>+{{ achievement.livraReward }} Livras!</span>
              </div>
            }
          </div>
        </div>
        <div class="toast-footer">
          <button pButton 
                  label="Ver Conquistas" 
                  icon="pi pi-trophy" 
                  class="p-button-text"
                  (click)="viewAchievements.emit(); close()"></button>
        </div>
      </div>
    }
  `,
  styles: [`
    .achievement-toast {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 2px solid gold;
      border-radius: 16px;
      padding: 1rem;
      min-width: 320px;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(255, 215, 0, 0.3);
      color: white;
    }

    .toast-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;

      .confetti {
        font-size: 1.5rem;
        animation: bounce 0.5s ease infinite alternate;
      }

      h3 {
        flex: 1;
        margin: 0;
        font-size: 1.1rem;
        color: gold;
      }

      .close-btn {
        background: none;
        border: none;
        color: rgba(255,255,255,0.7);
        cursor: pointer;
        padding: 0.25rem;

        &:hover {
          color: white;
        }
      }
    }

    .toast-body {
      display: flex;
      gap: 1rem;
      align-items: center;

      .achievement-icon {
        font-size: 3rem;
        animation: pop 0.3s ease-out;
      }

      .achievement-details {
        flex: 1;

        h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
        }

        p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .reward-earned {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.5rem;
          font-size: 1rem;
          font-weight: bold;
          color: #ffd700;
          animation: pulse 1s ease infinite;

          .livra-icon {
            font-size: 1.2rem;
          }
        }
      }
    }

    .toast-footer {
      margin-top: 1rem;
      text-align: center;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 0.75rem;

      ::ng-deep .p-button {
        color: gold !important;
      }
    }

    @keyframes bounce {
      from { transform: translateY(0); }
      to { transform: translateY(-5px); }
    }

    @keyframes pop {
      0% { transform: scale(0); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    @media (max-width: 480px) {
      .achievement-toast {
        left: 10px;
        right: 10px;
        min-width: auto;
      }
    }
  `],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('0.3s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.2s ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class AchievementUnlockToastComponent implements OnInit, OnDestroy {
  @Input({ required: true }) achievement!: Achievement;
  @Input() duration = 8000; // Auto-close after 8 seconds
  @Output() closed = new EventEmitter<void>();
  @Output() viewAchievements = new EventEmitter<void>();

  visible = true;
  private timeoutId?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    if (this.duration > 0) {
      this.timeoutId = setTimeout(() => this.close(), this.duration);
    }
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  close() {
    this.visible = false;
    setTimeout(() => this.closed.emit(), 200);
  }
}
