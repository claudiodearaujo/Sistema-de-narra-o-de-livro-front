/**
 * Upgrade Prompt Modal Component
 * Shows upgrade prompt when user hits a limit
 * Sprint 9: Planos e Pagamentos
 */
import { Component, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SubscriptionService } from '../../../../core/services/subscription.service';
import { SubscriptionPlan, getPlanDisplayName } from '../../../../core/models/subscription.model';

export interface UpgradePromptData {
  title?: string;
  message: string;
  feature?: string;
  currentLimit?: number;
  upgradeBenefit?: string;
}

@Component({
  selector: 'app-upgrade-prompt-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    TagModule,
  ],
  templateUrl: './upgrade-prompt-modal.component.html',
  styleUrl: './upgrade-prompt-modal.component.css',
})
export class UpgradePromptModalComponent {
  private router = inject(Router);
  private subscriptionService = inject(SubscriptionService);

  @Input() visible = false;
  @Input() data: UpgradePromptData | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  currentPlan = signal<SubscriptionPlan>('FREE');

  getPlanDisplayName = getPlanDisplayName;

  ngOnInit() {
    this.subscriptionService.currentPlan$.subscribe(
      plan => this.currentPlan.set(plan)
    );
  }

  onClose() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.closed.emit();
  }

  goToPlans() {
    this.onClose();
    this.router.navigate(['/subscription/plans']);
  }
}
