/**
 * My Subscription Page Component
 * Shows current subscription details and management
 * Sprint 9: Planos e Pagamentos
 */
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SubscriptionService } from '../../../../core/services/subscription.service';
import { LivraService } from '../../../../core/services/livra.service';
import {
  Subscription,
  getPlanDisplayName,
  getPlanIcon,
  formatPrice,
} from '../../../../core/models/subscription.model';

@Component({
  selector: 'app-my-subscription-page',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    DividerModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressBarModule,
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast />
    <p-confirmDialog />

    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <h1 class="text-2xl font-bold mb-6">Minha Assinatura</h1>

      <!-- Current Plan Card -->
      <p-card styleClass="mb-6">
        <ng-template pTemplate="content">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <i [class]="getPlanIcon(subscription()?.plan || 'FREE') + ' text-2xl text-primary-500'"></i>
              </div>
              <div>
                <h2 class="text-xl font-bold">
                  Plano {{ getPlanDisplayName(subscription()?.plan || 'FREE') }}
                </h2>
                <div class="flex items-center gap-2 mt-1">
                  @if (subscription()?.status === 'ACTIVE') {
                    <p-tag value="Ativo" severity="success" />
                  } @else if (subscription()?.status === 'CANCELLED') {
                    <p-tag value="Cancelado" severity="danger" />
                  } @else if (subscription()?.status === 'PAST_DUE') {
                    <p-tag value="Pagamento Pendente" severity="warn" />
                  }
                  @if (subscription()?.cancelAtPeriodEnd) {
                    <p-tag value="Cancela ao final do período" severity="warn" />
                  }
                </div>
              </div>
            </div>

            <div class="flex gap-2">
              @if (subscription()?.plan === 'FREE') {
                <button
                  pButton
                  label="Fazer Upgrade"
                  icon="pi pi-arrow-up"
                  (click)="goToPlans()"
                ></button>
              } @else {
                <button
                  pButton
                  label="Gerenciar"
                  icon="pi pi-cog"
                  severity="secondary"
                  (click)="openPortal()"
                ></button>
              }
            </div>
          </div>

          @if (subscription()?.currentPeriodEnd) {
            <p-divider />
            <div class="text-sm text-secondary">
              @if (subscription()?.cancelAtPeriodEnd) {
                <p>
                  Sua assinatura será cancelada em 
                  <strong>{{ formatDate(subscription()!.currentPeriodEnd) }}</strong>
                </p>
                <button
                  pButton
                  label="Manter Assinatura"
                  severity="success"
                  size="small"
                  class="mt-2"
                  (click)="resumeSubscription()"
                ></button>
              } @else {
                <p>
                  Próxima cobrança em 
                  <strong>{{ formatDate(subscription()!.currentPeriodEnd) }}</strong>
                </p>
              }
            </div>
          }
        </ng-template>
      </p-card>

      <!-- Features Card -->
      <p-card styleClass="mb-6">
        <ng-template pTemplate="header">
          <div class="px-4 pt-4">
            <h3 class="text-lg font-semibold">Seus Recursos</h3>
          </div>
        </ng-template>

        <ng-template pTemplate="content">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @if (features(); as f) {
              <div class="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div class="text-sm text-secondary">Livros</div>
                <div class="text-lg font-semibold">
                  {{ f.maxBooks === -1 ? 'Ilimitado' : f.maxBooks }}
                </div>
              </div>
              <div class="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div class="text-sm text-secondary">Personagens por Livro</div>
                <div class="text-lg font-semibold">
                  {{ f.maxCharactersPerBook === -1 ? 'Ilimitado' : f.maxCharactersPerBook }}
                </div>
              </div>
              <div class="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div class="text-sm text-secondary">Falas por Capítulo</div>
                <div class="text-lg font-semibold">
                  {{ f.maxSpeechesPerChapter === -1 ? 'Ilimitado' : f.maxSpeechesPerChapter }}
                </div>
              </div>
              <div class="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div class="text-sm text-secondary">Áudio TTS / mês</div>
                <div class="text-lg font-semibold">
                  {{ f.ttsMinutesPerMonth }} minutos
                </div>
              </div>
              <div class="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div class="text-sm text-secondary">Vozes Premium</div>
                <div class="text-lg font-semibold">
                  {{ f.canUsePremiumVoices ? 'Sim' : 'Não' }}
                </div>
              </div>
              <div class="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div class="text-sm text-secondary">Livras Mensais</div>
                <div class="text-lg font-semibold">
                  {{ f.monthlyLivras }}
                </div>
              </div>
            }
          </div>
        </ng-template>
      </p-card>

      <!-- Livra Balance Card -->
      <p-card styleClass="mb-6">
        <ng-template pTemplate="header">
          <div class="px-4 pt-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold">Saldo de Livras</h3>
            <button
              pButton
              label="Comprar Livras"
              icon="pi pi-plus"
              size="small"
              (click)="goToLivras()"
            ></button>
          </div>
        </ng-template>

        <ng-template pTemplate="content">
          @if (livraBalance(); as balance) {
            <div class="flex items-center gap-6">
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-500">
                  {{ balance.balance }}
                </div>
                <div class="text-sm text-secondary">Disponível</div>
              </div>
              <p-divider layout="vertical" />
              <div class="text-center">
                <div class="text-xl font-semibold text-green-500">
                  {{ balance.lifetime }}
                </div>
                <div class="text-sm text-secondary">Total Ganho</div>
              </div>
              <p-divider layout="vertical" />
              <div class="text-center">
                <div class="text-xl font-semibold text-orange-500">
                  {{ balance.spent }}
                </div>
                <div class="text-sm text-secondary">Total Gasto</div>
              </div>
            </div>
          }
        </ng-template>
      </p-card>

      <!-- Cancel Subscription (only for paid plans) -->
      @if (subscription()?.plan !== 'FREE' && !subscription()?.cancelAtPeriodEnd) {
        <div class="text-center mt-8">
          <button
            pButton
            label="Cancelar Assinatura"
            severity="danger"
            [text]="true"
            (click)="confirmCancel()"
          ></button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class MySubscriptionPageComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  private livraService = inject(LivraService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  subscription = signal<Subscription | null>(null);
  features = signal<any>(null);
  livraBalance = signal<any>(null);

  getPlanDisplayName = getPlanDisplayName;
  getPlanIcon = getPlanIcon;
  formatPrice = formatPrice;

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.subscriptionService.getSubscription().subscribe({
      next: (sub) => this.subscription.set(sub),
      error: (err) => console.error('Error loading subscription:', err),
    });

    this.subscriptionService.getPlanFeatures().subscribe({
      next: ({ features }) => this.features.set(features),
      error: (err) => console.error('Error loading features:', err),
    });

    this.livraService.getBalance().subscribe({
      next: (balance) => this.livraBalance.set(balance),
      error: (err) => console.error('Error loading balance:', err),
    });
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  goToPlans() {
    this.router.navigate(['/subscription/plans']);
  }

  goToLivras() {
    this.router.navigate(['/livras']);
  }

  async openPortal() {
    try {
      await this.subscriptionService.redirectToPortal();
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível abrir o portal',
      });
    }
  }

  confirmCancel() {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja cancelar sua assinatura? Você manterá o acesso até o final do período pago.',
      header: 'Cancelar Assinatura',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, cancelar',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.cancelSubscription(),
    });
  }

  cancelSubscription() {
    this.subscriptionService.cancelSubscription().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Assinatura será cancelada ao final do período',
        });
        this.loadData();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.error || 'Não foi possível cancelar a assinatura',
        });
      },
    });
  }

  resumeSubscription() {
    this.subscriptionService.resumeSubscription().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Assinatura reativada com sucesso',
        });
        this.loadData();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.error || 'Não foi possível reativar a assinatura',
        });
      },
    });
  }
}
