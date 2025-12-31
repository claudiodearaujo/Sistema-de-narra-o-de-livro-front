/**
 * Subscription Success Page Component
 * Shown after successful checkout
 * Sprint 9: Planos e Pagamentos
 */
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SubscriptionService } from '../../../../core/services/subscription.service';
import { getPlanDisplayName } from '../../../../core/models/subscription.model';

@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  template: `
    <div class="flex items-center justify-center min-h-[70vh]">
      <p-card styleClass="w-full max-w-md text-center">
        @if (isLoading()) {
          <ng-template pTemplate="content">
            <p-progressSpinner 
              styleClass="w-16 h-16"
              strokeWidth="4"
            />
            <p class="mt-4 text-gray-600">Confirmando seu pagamento...</p>
          </ng-template>
        } @else {
          <ng-template pTemplate="header">
            <div class="pt-8">
              <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <i class="pi pi-check text-green-500 text-4xl"></i>
              </div>
            </div>
          </ng-template>

          <ng-template pTemplate="content">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Assinatura Ativada!
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Parabéns! Você agora é um assinante {{ planName() }}.
              Aproveite todos os benefícios do seu novo plano!
            </p>

            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <h3 class="font-semibold mb-2">O que você ganhou:</h3>
              <ul class="text-left text-sm space-y-2">
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
                  <span>Suporte prioritário</span>
                </li>
              </ul>
            </div>
          </ng-template>

          <ng-template pTemplate="footer">
            <div class="flex flex-col gap-2 px-4 pb-4">
              <button
                pButton
                label="Começar a Escrever"
                icon="pi pi-book"
                (click)="goToBooks()"
              ></button>
              <button
                pButton
                label="Ver Minha Assinatura"
                severity="secondary"
                (click)="goToSubscription()"
              ></button>
            </div>
          </ng-template>
        }
      </p-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 2rem 1rem;
    }
  `],
})
export class SuccessPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private subscriptionService = inject(SubscriptionService);

  isLoading = signal(true);
  planName = signal('Premium');

  ngOnInit() {
    // Refresh subscription data
    this.subscriptionService.getSubscription().subscribe({
      next: (sub) => {
        this.planName.set(getPlanDisplayName(sub.plan));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  goToBooks() {
    this.router.navigate(['/books']);
  }

  goToSubscription() {
    this.router.navigate(['/subscription']);
  }
}
