import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';
import { LivraService } from '../../../../core/services/livra.service';
import {
  LivraBalance,
  LivraTransaction,
  TransactionFilters,
  LivraTransactionType,
  getTransactionTypeInfo,
} from '../../../../core/models/livra.model';
import { LivraPackagesComponent } from '../../../subscription/components/livra-packages/livra-packages.component';

@Component({
  selector: 'app-livras-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    ProgressSpinnerModule,
    TagModule,
    TooltipModule,
    DividerModule,
    TimelineModule,
    LivraPackagesComponent,
  ],
  template: `
    <div class="livras-page">
      <!-- Header -->
      <div class="page-header">
        <h1><i class="pi pi-bolt mr-2"></i>Minhas Livras</h1>
        <p class="text-color-secondary">Gerencie seu saldo e veja seu histórico de transações</p>
      </div>

      <!-- Balance Cards -->
      <div class="balance-cards">
        <!-- Main Balance -->
        <p-card styleClass="balance-main-card">
          <div class="balance-main">
            <div class="balance-icon">
              <i class="pi pi-bolt"></i>
            </div>
            <div class="balance-info">
              <span class="balance-label">Saldo Atual</span>
              <span class="balance-value">{{ balance()?.balance ?? 0 | number }}</span>
              <span class="balance-sublabel">Livras disponíveis</span>
            </div>
          </div>
        </p-card>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <p-card styleClass="stat-card earned">
            <div class="stat-content">
              <i class="pi pi-arrow-up stat-icon"></i>
              <div class="stat-info">
                <span class="stat-value">{{ balance()?.lifetime ?? 0 | number }}</span>
                <span class="stat-label">Total Ganho</span>
              </div>
            </div>
          </p-card>

          <p-card styleClass="stat-card spent">
            <div class="stat-content">
              <i class="pi pi-arrow-down stat-icon"></i>
              <div class="stat-info">
                <span class="stat-value">{{ balance()?.spent ?? 0 | number }}</span>
                <span class="stat-label">Total Gasto</span>
              </div>
            </div>
          </p-card>
        </div>
      </div>

      <!-- How to Earn Section -->
      <p-card header="Como ganhar Livras" styleClass="how-to-card">
        <div class="how-to-grid">
          <div class="how-to-item">
            <i class="pi pi-heart-fill text-accent-500"></i>
            <span class="how-to-label">Receber curtidas</span>
            <span class="how-to-amount">+2 por curtida</span>
          </div>
          <div class="how-to-item">
            <i class="pi pi-comment text-primary-500"></i>
            <span class="how-to-label">Receber comentários</span>
            <span class="how-to-amount">+3 por comentário</span>
          </div>
          <div class="how-to-item">
            <i class="pi pi-user-plus text-primary-600"></i>
            <span class="how-to-label">Ganhar seguidores</span>
            <span class="how-to-amount">+5 por seguidor</span>
          </div>
          <div class="how-to-item">
            <i class="pi pi-pencil text-primary-700"></i>
            <span class="how-to-label">Criar posts</span>
            <span class="how-to-amount">+1 por post</span>
          </div>
          <div class="how-to-item">
            <i class="pi pi-trophy text-livra-500"></i>
            <span class="how-to-label">Completar campanhas</span>
            <span class="how-to-amount">+50 por campanha</span>
          </div>
          <div class="how-to-item">
            <i class="pi pi-shield text-primary-500"></i>
            <span class="how-to-label">Conquistar medalhas</span>
            <span class="how-to-amount">+10 ou mais</span>
          </div>
        </div>
      </p-card>

      <!-- Buy Livras Section (Sprint 9) -->
      <p-card styleClass="buy-livras-card">
        <app-livra-packages />
      </p-card>

      <!-- Transaction History -->
      <p-card header="Histórico de Transações" styleClass="transactions-card">
        <ng-template pTemplate="header">
          <div class="transactions-header">
            <h3><i class="pi pi-history mr-2"></i>Histórico de Transações</h3>
            
            <!-- Filters -->
            <div class="filters">
              <p-select
                [options]="typeOptions"
                [(ngModel)]="selectedType"
                placeholder="Todos os tipos"
                [showClear]="true"
                (onChange)="loadTransactions()"
                styleClass="filter-dropdown"
              ></p-select>

              <p-datepicker
                [(ngModel)]="dateRange"
                selectionMode="range"
                [showIcon]="true"
                placeholder="Período"
                dateFormat="dd/mm/yy"
                (onSelect)="loadTransactions()"
                [showClear]="true"
                styleClass="filter-calendar"
              ></p-datepicker>
            </div>
          </div>
        </ng-template>

        @if (loading()) {
          <div class="loading-container">
            <p-progressSpinner strokeWidth="4" />
          </div>
        } @else if (transactions().length === 0) {
          <div class="empty-state">
            <i class="pi pi-inbox text-4xl text-color-secondary mb-3"></i>
            <p class="text-color-secondary">Nenhuma transação encontrada</p>
          </div>
        } @else {
          <!-- Period Summary -->
          <div class="period-summary">
            <div class="summary-item earned">
              <span class="summary-label">Ganho no período</span>
              <span class="summary-value">+{{ periodTotals().earned | number }}</span>
            </div>
            <div class="summary-item spent">
              <span class="summary-label">Gasto no período</span>
              <span class="summary-value">-{{ periodTotals().spent | number }}</span>
            </div>
          </div>

          <!-- Transactions List -->
          <div class="transactions-list">
            @for (tx of transactions(); track tx.id) {
              <div class="transaction-item" [class.earned]="tx.amount > 0" [class.spent]="tx.amount < 0">
                <div class="tx-icon" [class]="getTypeInfo(tx.type).color">
                  <i class="pi" [class]="getTypeInfo(tx.type).icon"></i>
                </div>
                
                <div class="tx-info">
                  <span class="tx-label">{{ getTypeInfo(tx.type).label }}</span>
                  <span class="tx-date">{{ tx.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                
                <div class="tx-amount" [class.positive]="tx.amount > 0" [class.negative]="tx.amount < 0">
                  {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount | number }}
                </div>
                
                <div class="tx-balance">
                  <span class="balance-label">Saldo:</span>
                  <span class="balance-value">{{ tx.balance | number }}</span>
                </div>
              </div>
            }
          </div>

          <!-- Load More -->
          @if (hasMore()) {
            <div class="load-more">
              <p-button
                label="Carregar mais"
                icon="pi pi-refresh"
                [loading]="loadingMore()"
                (onClick)="loadMore()"
                [outlined]="true"
              />
            </div>
          }
        }
      </p-card>
    </div>
  `,
  styles: [`
    .livras-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
    }

    .balance-cards {
      display: grid;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    :host ::ng-deep .balance-main-card {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
      border: none;
    }

    :host ::ng-deep .balance-main-card .p-card-body {
      color: white;
    }

    .balance-main {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem;
    }

    .balance-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
    }

    .balance-info {
      display: flex;
      flex-direction: column;
    }

    .balance-label {
      font-size: 0.875rem;
      opacity: 0.8;
    }

    .balance-value {
      font-size: 3rem;
      font-weight: 700;
      line-height: 1.2;
    }

    .balance-sublabel {
      font-size: 0.875rem;
      opacity: 0.7;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    :host ::ng-deep .stat-card.earned .p-card-body {
      background: linear-gradient(135deg, var(--green-50) 0%, var(--green-100) 100%);
    }

    :host ::ng-deep .stat-card.spent .p-card-body {
      background: linear-gradient(135deg, var(--red-50) 0%, var(--red-100) 100%);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      font-size: 1.5rem;
      padding: 0.75rem;
      border-radius: 50%;
    }

    .stat-card.earned .stat-icon {
      background: var(--green-100);
      color: var(--green-600);
    }

    .stat-card.spent .stat-icon {
      background: var(--red-100);
      color: var(--red-600);
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
    }

    .how-to-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .how-to-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 1rem;
      border-radius: 0.5rem;
      background: var(--surface-50);
      gap: 0.5rem;
    }

    .how-to-item i {
      font-size: 1.5rem;
    }

    .how-to-label {
      font-weight: 500;
    }

    .how-to-amount {
      color: var(--green-600);
      font-weight: 600;
    }

    .transactions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      padding: 1rem;
    }

    .transactions-header h3 {
      margin: 0;
    }

    .filters {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    :host ::ng-deep .filter-dropdown,
    :host ::ng-deep .filter-calendar {
      min-width: 180px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 3rem;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem;
    }

    .period-summary {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: var(--surface-50);
      border-radius: 0.5rem;
    }

    .summary-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .summary-label {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
    }

    .summary-value {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .summary-item.earned .summary-value {
      color: var(--green-600);
    }

    .summary-item.spent .summary-value {
      color: var(--red-600);
    }

    .transactions-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .transaction-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 0.5rem;
      background: var(--surface-card);
      border: 1px solid var(--surface-border);
      transition: all 0.2s ease;
    }

    .transaction-item:hover {
      border-color: var(--primary-300);
      background: var(--surface-hover);
    }

    .tx-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-100);
    }

    .tx-icon i {
      font-size: 1rem;
    }

    .tx-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .tx-label {
      font-weight: 500;
    }

    .tx-date {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
    }

    .tx-amount {
      font-weight: 600;
      font-size: 1.125rem;
    }

    .tx-amount.positive {
      color: var(--green-600);
    }

    .tx-amount.negative {
      color: var(--red-600);
    }

    .tx-balance {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-size: 0.875rem;
    }

    .tx-balance .balance-label {
      color: var(--text-color-secondary);
      font-size: 0.75rem;
    }

    .load-more {
      display: flex;
      justify-content: center;
      margin-top: 1.5rem;
    }

    @media (max-width: 768px) {
      .livras-page {
        padding: 1rem;
      }

      .balance-value {
        font-size: 2rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .transactions-header {
        flex-direction: column;
        align-items: stretch;
      }

      .filters {
        flex-direction: column;
      }

      .transaction-item {
        flex-wrap: wrap;
      }

      .tx-balance {
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid var(--surface-border);
      }
    }
  `],
})
export class LivrasPageComponent implements OnInit {
  private livraService = inject(LivraService);

  // State
  balance = signal<LivraBalance | null>(null);
  transactions = signal<LivraTransaction[]>([]);
  loading = signal(true);
  loadingMore = signal(false);
  hasMore = signal(false);
  currentPage = 1;

  // Filters
  selectedType: LivraTransactionType | null = null;
  dateRange: Date[] | null = null;
  typeOptions = this.livraService.getTransactionTypeOptions();

  // Computed
  periodTotals = computed(() => this.livraService.calculateTotals(this.transactions()));

  ngOnInit() {
    this.loadBalance();
    this.loadTransactions();
  }

  loadBalance() {
    this.livraService.getBalance().subscribe((balance) => {
      this.balance.set(balance);
    });
  }

  loadTransactions() {
    this.loading.set(true);
    this.currentPage = 1;

    const filters: TransactionFilters = {};
    if (this.selectedType) {
      filters.type = this.selectedType;
    }
    if (this.dateRange && this.dateRange.length === 2) {
      filters.startDate = this.dateRange[0];
      filters.endDate = this.dateRange[1];
    }

    this.livraService.getTransactions(1, 20, filters).subscribe({
      next: (result) => {
        this.transactions.set(result.transactions);
        this.hasMore.set(result.hasMore);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  loadMore() {
    this.loadingMore.set(true);
    this.currentPage++;

    const filters: TransactionFilters = {};
    if (this.selectedType) {
      filters.type = this.selectedType;
    }
    if (this.dateRange && this.dateRange.length === 2) {
      filters.startDate = this.dateRange[0];
      filters.endDate = this.dateRange[1];
    }

    this.livraService.getTransactions(this.currentPage, 20, filters).subscribe({
      next: (result) => {
        this.transactions.update((current) => [...current, ...result.transactions]);
        this.hasMore.set(result.hasMore);
        this.loadingMore.set(false);
      },
      error: () => {
        this.loadingMore.set(false);
      },
    });
  }

  getTypeInfo(type: LivraTransactionType) {
    return getTransactionTypeInfo(type);
  }
}
