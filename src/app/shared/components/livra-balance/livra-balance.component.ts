import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { LivraService } from '../../../core/services/livra.service';
import { LivraBalance, LivraUpdateEvent } from '../../../core/models/livra.model';

@Component({
  selector: 'app-livra-balance',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TooltipModule, BadgeModule],
  template: `
    <a 
      routerLink="/livras" 
      class="livra-balance-container"
      [pTooltip]="tooltipContent"
      tooltipPosition="bottom"
    >
      <div class="livra-icon" [class.pulse]="isAnimating">
        <i class="pi pi-bolt"></i>
      </div>
      
      <span class="balance-amount" [class.increase]="lastAmount > 0" [class.decrease]="lastAmount < 0">
        {{ displayBalance | number }}
      </span>
      
      <!-- Animation overlay -->
      @if (isAnimating && lastAmount !== 0) {
        <span 
          class="amount-change" 
          [class.positive]="lastAmount > 0" 
          [class.negative]="lastAmount < 0"
        >
          {{ lastAmount > 0 ? '+' : '' }}{{ lastAmount }}
        </span>
      }
    </a>
  `,
  styles: [`
    .livra-balance-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, var(--primary-100) 0%, var(--primary-50) 100%);
      border-radius: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      position: relative;
      overflow: visible;
    }

    .livra-balance-container:hover {
      background: linear-gradient(135deg, var(--primary-200) 0%, var(--primary-100) 100%);
      transform: scale(1.05);
    }

    .livra-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-500);
      border-radius: 50%;
      color: white;
      font-size: 0.75rem;
    }

    .livra-icon.pulse {
      animation: pulse 0.5s ease-in-out;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }

    .balance-amount {
      font-weight: 600;
      color: var(--primary-700);
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    .balance-amount.increase {
      color: var(--green-600);
    }

    .balance-amount.decrease {
      color: var(--red-600);
    }

    .amount-change {
      position: absolute;
      top: -1.5rem;
      right: 0;
      font-weight: bold;
      font-size: 0.875rem;
      animation: float-up 2s ease-out forwards;
      pointer-events: none;
    }

    .amount-change.positive {
      color: var(--green-500);
    }

    .amount-change.negative {
      color: var(--red-500);
    }

    @keyframes float-up {
      0% {
        opacity: 1;
        transform: translateY(0);
      }
      100% {
        opacity: 0;
        transform: translateY(-30px);
      }
    }
  `],
})
export class LivraBalanceComponent implements OnInit, OnDestroy {
  private livraService = inject(LivraService);
  private destroy$ = new Subject<void>();

  balance: LivraBalance | null = null;
  displayBalance = 0;
  isAnimating = false;
  lastAmount = 0;
  tooltipContent = 'Carregando...';

  ngOnInit() {
    // Subscribe to balance changes
    this.livraService.balance$.pipe(takeUntil(this.destroy$)).subscribe((balance) => {
      if (balance) {
        this.balance = balance;
        this.animateBalance(balance.balance);
        this.tooltipContent = `Saldo: ${balance.balance} Livras\nTotal ganho: ${balance.lifetime}\nTotal gasto: ${balance.spent}`;
      }
    });

    // Subscribe to live updates
    this.livraService.lastUpdate$.pipe(takeUntil(this.destroy$)).subscribe((update) => {
      if (update) {
        this.handleUpdate(update);
      }
    });

    // Load initial balance
    this.livraService.getBalance().subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private animateBalance(newBalance: number) {
    const duration = 500;
    const startBalance = this.displayBalance;
    const diff = newBalance - startBalance;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const eased = 1 - Math.pow(1 - progress, 3);
      
      this.displayBalance = Math.round(startBalance + diff * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  private handleUpdate(update: LivraUpdateEvent) {
    this.lastAmount = update.amount;
    this.isAnimating = true;

    // Update balance with animation
    this.animateBalance(update.balance);

    // Reset animation after delay
    setTimeout(() => {
      this.isAnimating = false;
      this.lastAmount = 0;
    }, 2500);
  }
}
