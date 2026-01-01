/**
 * Plans Page Component
 * Displays subscription plans for upgrade
 * Sprint 9: Planos e Pagamentos
 */
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { SubscriptionService } from '../../../../core/services/subscription.service';
import {
  Plan,
  BillingPeriod,
  formatPrice,
  calculateYearlySavings,
  SubscriptionPlan,
} from '../../../../core/models/subscription.model';

@Component({
  selector: 'app-plans-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    SelectButtonModule,
    DividerModule,
    TagModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold font-heading text-primary-700 dark:text-primary-300 mb-2">
          Escolha seu Plano
        </h1>
        <p class="text-secondary max-w-2xl mx-auto">
          Desbloqueie todo o potencial do Livria com nossos planos premium. 
          Mais livros, mais vozes, mais possibilidades.
        </p>
      </div>

      <!-- Billing Period Toggle -->
      <div class="flex justify-center mb-8">
        <p-selectButton
          [options]="billingOptions"
          [(ngModel)]="billingPeriod"
          optionLabel="label"
          optionValue="value"
          styleClass="p-selectbutton-sm"
        />
        @if (billingPeriod() === 'yearly') {
          <p-tag 
            value="Economize até 17%!" 
            severity="success"
            class="ml-3"
          />
        }
      </div>

      <!-- Plans Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @for (plan of plans(); track plan.id) {
          <p-card
            [styleClass]="getCardClass(plan)"
          >
            <ng-template pTemplate="header">
              <div class="px-6 pt-6">
                @if (plan.id === 'PRO') {
                  <div class="text-center mb-2">
                    <p-tag value="Mais Popular" severity="info" />
                  </div>
                }
                <h2 class="text-2xl font-heading font-bold text-center mb-1">{{ plan.name }}</h2>
                <p class="text-secondary text-center text-sm">{{ plan.description }}</p>
              </div>
            </ng-template>

            <ng-template pTemplate="content">
              <!-- Price -->
              <div class="text-center my-6">
                <div class="flex items-baseline justify-center">
                  <span class="text-4xl font-bold">
                    {{ formatPrice(getPrice(plan)) }}
                  </span>
                  @if (plan.price.monthly > 0) {
                    <span class="text-secondary ml-1">
                      /{{ billingPeriod() === 'monthly' ? 'mês' : 'ano' }}
                    </span>
                  }
                </div>
                @if (billingPeriod() === 'yearly' && plan.price.monthly > 0) {
                  <div class="text-sm text-secondary mt-1">
                    {{ formatPrice(plan.price.yearly / 12) }}/mês
                    <span class="text-green-600 ml-1">
                      ({{ calculateSavings(plan) }}% off)
                    </span>
                  </div>
                }
              </div>

              <!-- Livras Monthly -->
              @if (plan.livrasMonthly > 0) {
                <div class="text-center mb-4">
                  <p-tag
                    [value]="'+' + plan.livrasMonthly + ' Livras/mês'"
                    severity="warn"
                  />
                </div>
              }

              <p-divider />

              <!-- Features -->
              <ul class="space-y-3 my-4">
                @for (feature of plan.features; track feature) {
                  <li class="flex items-start">
                    <i class="pi pi-check text-green-500 mr-2 mt-1"></i>
                    <span class="text-primary-700 dark:text-primary-300">{{ feature }}</span>
                  </li>
                }
              </ul>
            </ng-template>

            <ng-template pTemplate="footer">
              <div class="px-2">
                @if (plan.id === currentPlan()) {
                  <button
                    pButton
                    label="Plano Atual"
                    severity="secondary"
                    [disabled]="true"
                    class="w-full"
                  ></button>
                } @else if (plan.id === 'FREE') {
                  <button
                    pButton
                    label="Plano Básico"
                    severity="secondary"
                    [disabled]="true"
                    class="w-full"
                  ></button>
                } @else {
                  <button
                    pButton
                    [label]="getButtonLabel(plan)"
                    [severity]="plan.id === 'PRO' ? 'warn' : 'primary'"
                    class="w-full"
                    [loading]="isLoading()"
                    (click)="selectPlan(plan)"
                  ></button>
                }
              </div>
            </ng-template>
          </p-card>
        }
      </div>

      <!-- FAQ Section -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
        
        <div class="max-w-3xl mx-auto space-y-4">
          <p-card>
            <ng-template pTemplate="content">
              <h3 class="font-semibold mb-2">Posso cancelar a qualquer momento?</h3>
              <p class="text-secondary">
                Sim! Você pode cancelar sua assinatura a qualquer momento. 
                O acesso continua até o final do período pago.
              </p>
            </ng-template>
          </p-card>

          <p-card>
            <ng-template pTemplate="content">
              <h3 class="font-semibold mb-2">O que são Livras?</h3>
              <p class="text-secondary">
                Livras é nossa moeda virtual. Você ganha ao interagir na comunidade e 
                pode usar para desbloquear recursos premium como geração de áudio TTS.
              </p>
            </ng-template>
          </p-card>

          <p-card>
            <ng-template pTemplate="content">
              <h3 class="font-semibold mb-2">Posso mudar de plano depois?</h3>
              <p class="text-secondary">
                Sim! Você pode fazer upgrade ou downgrade a qualquer momento. 
                O valor será calculado proporcionalmente.
              </p>
            </ng-template>
          </p-card>
        </div>
      </div>

      <!-- Current Subscription Info -->
      @if (currentPlan() !== 'FREE') {
        <div class="mt-8 text-center">
          <button
            pButton
            label="Gerenciar Assinatura"
            severity="secondary"
            icon="pi pi-cog"
            (click)="openPortal()"
          ></button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .plan-card-featured {
      border: 2px solid var(--primary-color);
      transform: scale(1.02);
    }
  `],
})
export class PlansPageComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  plans = signal<Plan[]>([]);
  currentPlan = signal<SubscriptionPlan>('FREE');
  billingPeriod = signal<BillingPeriod>('monthly');
  isLoading = signal(false);

  billingOptions = [
    { label: 'Mensal', value: 'monthly' },
    { label: 'Anual', value: 'yearly' },
  ];

  formatPrice = formatPrice;

  ngOnInit() {
    this.loadPlans();
    this.loadCurrentSubscription();
  }

  private loadPlans() {
    this.subscriptionService.getPlans().subscribe({
      next: (plans) => this.plans.set(plans),
      error: (err) => {
        console.error('Error loading plans:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os planos',
        });
      },
    });
  }

  private loadCurrentSubscription() {
    this.subscriptionService.getSubscription().subscribe({
      next: (sub) => this.currentPlan.set(sub.plan),
      error: (err) => console.error('Error loading subscription:', err),
    });
  }

  getPrice(plan: Plan): number {
    return this.billingPeriod() === 'yearly' ? plan.price.yearly : plan.price.monthly;
  }

  calculateSavings(plan: Plan): number {
    return calculateYearlySavings(plan.price.monthly, plan.price.yearly);
  }

  getCardClass(plan: Plan): string {
    const base = 'h-full';
    if (plan.id === 'PRO') {
      return `${base} plan-card-featured`;
    }
    return base;
  }

  getButtonLabel(plan: Plan): string {
    if (this.currentPlan() === 'FREE') {
      return `Começar com ${plan.name}`;
    }
    if (plan.id === 'PRO' && this.currentPlan() === 'PREMIUM') {
      return 'Fazer Upgrade';
    }
    return `Mudar para ${plan.name}`;
  }

  async selectPlan(plan: Plan) {
    if (plan.id === 'FREE' || plan.id === this.currentPlan()) {
      return;
    }

    this.isLoading.set(true);

    try {
      await this.subscriptionService.redirectToCheckout(
        plan.id as 'PREMIUM' | 'PRO',
        this.billingPeriod()
      );
    } catch (error: any) {
      console.error('Checkout error:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: error.error?.error || 'Não foi possível iniciar o checkout',
      });
      this.isLoading.set(false);
    }
  }

  async openPortal() {
    try {
      await this.subscriptionService.redirectToPortal();
    } catch (error: any) {
      console.error('Portal error:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível abrir o portal',
      });
    }
  }
}
