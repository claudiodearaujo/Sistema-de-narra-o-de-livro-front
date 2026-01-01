/**
 * Livra Packages Component
 * Displays available Livra packages for purchase
 * Sprint 9: Planos e Pagamentos
 */
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SubscriptionService } from '../../../../core/services/subscription.service';
import { LivraPackage } from '../../../../core/models/subscription.model';

@Component({
  selector: 'app-livra-packages',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    
    <div class="mb-6">
      <h2 class="text-xl font-bold font-heading text-primary-700 dark:text-primary-300 mb-2">Comprar Livras</h2>
      <p class="text-secondary">
        Precisa de mais Livras? Compre pacotes para desbloquear recursos premium.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      @for (pkg of packages(); track pkg.id) {
        <p-card [styleClass]="getCardClass(pkg)">
          <ng-template pTemplate="content">
            <div class="text-center">
              @if (getBestValue(pkg)) {
                <p-tag value="Melhor Valor" severity="success" class="mb-2" />
              }

              <div class="text-4xl font-bold text-primary-500 mb-2">
                {{ pkg.amount }}
              </div>
              <div class="text-sm text-secondary mb-4">Livras</div>

              <div class="text-2xl font-semibold mb-1">
                R$ {{ pkg.displayPrice }}
              </div>
              <div class="text-xs text-secondary mb-4">
                R$ {{ pkg.pricePerLivra }} / Livra
              </div>

              <button
                pButton
                label="Comprar"
                class="w-full"
                [loading]="loadingPackage() === pkg.id"
                (click)="purchasePackage(pkg)"
              ></button>
            </div>
          </ng-template>
        </p-card>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .best-value-card {
      border: 2px solid var(--color-primary-500);
    }
  `],
})
export class LivraPackagesComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  private messageService = inject(MessageService);

  packages = signal<LivraPackage[]>([]);
  loadingPackage = signal<string | null>(null);

  ngOnInit() {
    this.loadPackages();
  }

  private loadPackages() {
    this.subscriptionService.getLivraPackages().subscribe({
      next: (pkgs) => this.packages.set(pkgs),
      error: (err) => {
        console.error('Error loading packages:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os pacotes',
        });
      },
    });
  }

  getBestValue(pkg: LivraPackage): boolean {
    // The package with the lowest price per Livra is the best value
    const allPackages = this.packages();
    if (allPackages.length === 0) return false;
    
    const minPricePerLivra = Math.min(
      ...allPackages.map(p => parseFloat(p.pricePerLivra))
    );
    return parseFloat(pkg.pricePerLivra) === minPricePerLivra;
  }

  getCardClass(pkg: LivraPackage): string {
    if (this.getBestValue(pkg)) {
      return 'best-value-card';
    }
    return '';
  }

  async purchasePackage(pkg: LivraPackage) {
    this.loadingPackage.set(pkg.id);

    try {
      await this.subscriptionService.redirectToLivraCheckout(pkg.id);
    } catch (error: any) {
      console.error('Purchase error:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: error.error?.error || 'Não foi possível iniciar a compra',
      });
      this.loadingPackage.set(null);
    }
  }
}
