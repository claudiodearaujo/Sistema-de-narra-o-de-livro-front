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
  templateUrl: './livra-packages.component.html',
  styleUrl: './livra-packages.component.css',
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
