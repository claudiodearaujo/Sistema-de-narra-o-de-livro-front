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
  template: `
    <p-dialog
      [(visible)]="visible"
      [header]="data?.title || 'Limite Atingido'"
      [modal]="true"
      [dismissableMask]="true"
      [draggable]="false"
      [resizable]="false"
      styleClass="w-full max-w-md"
      (onHide)="onClose()"
    >
      <div class="text-center">
        <!-- Icon -->
        <div class="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-lock text-amber-500 text-3xl"></i>
        </div>

        <!-- Message -->
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          {{ data?.message }}
        </p>

        <!-- Current vs Upgrade -->
        @if (data?.currentLimit && data?.upgradeBenefit) {
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <div class="flex items-center justify-between text-sm">
              <div>
                <div class="text-gray-500">Seu plano atual</div>
                <div class="font-semibold">{{ getPlanDisplayName(currentPlan()) }}</div>
                <div class="text-gray-600">{{ data?.currentLimit }} {{ data?.feature }}</div>
              </div>
              <i class="pi pi-arrow-right text-gray-400"></i>
              <div>
                <div class="text-gray-500">Com upgrade</div>
                <div class="font-semibold text-primary-500">{{ data?.upgradeBenefit }}</div>
              </div>
            </div>
          </div>
        }

        <!-- Benefits -->
        <div class="text-left mb-4">
          <h4 class="font-semibold mb-2">Vantagens do upgrade:</h4>
          <ul class="text-sm space-y-1">
            <li class="flex items-center">
              <i class="pi pi-check text-green-500 mr-2"></i>
              <span>Mais livros e personagens</span>
            </li>
            <li class="flex items-center">
              <i class="pi pi-check text-green-500 mr-2"></i>
              <span>Mais minutos de áudio TTS</span>
            </li>
            <li class="flex items-center">
              <i class="pi pi-check text-green-500 mr-2"></i>
              <span>Livras mensais grátis</span>
            </li>
            <li class="flex items-center">
              <i class="pi pi-check text-green-500 mr-2"></i>
              <span>Vozes premium</span>
            </li>
          </ul>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex flex-col gap-2">
          <button
            pButton
            label="Ver Planos"
            icon="pi pi-arrow-up"
            class="w-full"
            (click)="goToPlans()"
          ></button>
          <button
            pButton
            label="Talvez Depois"
            severity="secondary"
            [text]="true"
            class="w-full"
            (click)="onClose()"
          ></button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
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
