import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../../../core/services/campaign.service';
import { Campaign, CampaignProgress, CampaignBook } from '../../../../core/models/group.model';

@Component({
  selector: 'app-campaign-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto p-4">
      <!-- Loading -->
      @if (loading()) {
        <div class="animate-pulse space-y-4">
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div class="grid grid-cols-3 gap-4 mt-6">
            @for (i of [1, 2, 3]; track i) {
              <div class="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            }
          </div>
        </div>
      }

      @if (!loading() && campaign()) {
        <!-- Back Link -->
        <a 
          [routerLink]="['/social/groups', campaign()!.groupId]"
          class="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-4">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para {{ campaign()!.group.name }}
        </a>

        <!-- Header Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ campaign()!.name }}</h1>
                <span [class]="'px-3 py-1 text-sm rounded-full ' + getStatusClass(campaign()!.status)">
                  {{ getStatusLabel(campaign()!.status) }}
                </span>
              </div>
              @if (campaign()!.description) {
                <p class="text-gray-600 dark:text-gray-400 mb-4">{{ campaign()!.description }}</p>
              }
              
              <!-- Stats -->
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {{ campaign()!.books.length }} livros
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {{ campaign()!._count.progress }} participantes
                </span>
                @if (campaign()!.startDate) {
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formatDate(campaign()!.startDate) }} - {{ formatDate(campaign()!.endDate) }}
                  </span>
                }
                @if (campaign()!.livraReward > 0) {
                  <span class="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {{ campaign()!.livraReward }} Livras de recompensa
                  </span>
                }
              </div>
            </div>

            <!-- Join Button -->
            @if (campaign()!.status === 'ACTIVE') {
              @if (!myProgress()) {
                <button 
                  (click)="joinCampaign()"
                  [disabled]="actionLoading()"
                  class="shrink-0 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-xl font-medium transition-colors">
                  @if (actionLoading()) {
                    Entrando...
                  } @else {
                    Participar
                  }
                </button>
              }
            }
          </div>
        </div>

        <!-- My Progress -->
        @if (myProgress()) {
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meu Progresso</h2>
            
            <div class="flex items-center gap-4 mb-4">
              <div class="flex-1">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-600 dark:text-gray-400">
                    {{ myProgress()!.booksRead }} de {{ campaign()!.books.length }} livros
                  </span>
                  <span class="font-medium text-purple-600 dark:text-purple-400">
                    {{ getProgressPercent() }}%
                  </span>
                </div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                    [style.width.%]="getProgressPercent()">
                  </div>
                </div>
              </div>
              
              @if (myProgress()!.isCompleted) {
                <div class="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Concluída!
                </div>
              }
            </div>
          </div>
        }

        <!-- Books Grid -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Livros da Campanha</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (campaignBook of campaign()!.books; track campaignBook.id; let i = $index) {
              <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div class="flex gap-4">
                  <!-- Book Cover -->
                  @if (campaignBook.book.coverUrl) {
                    <img [src]="campaignBook.book.coverUrl" [alt]="campaignBook.book.title" 
                      class="w-16 h-24 rounded-lg object-cover shrink-0" />
                  } @else {
                    <div class="w-16 h-24 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                      <span class="text-white text-xl font-bold">{{ campaignBook.book.title.charAt(0) }}</span>
                    </div>
                  }
                  
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 dark:text-white truncate">{{ campaignBook.book.title }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ campaignBook.book.author }}</p>
                    
                    <!-- Complete button -->
                    @if (myProgress() && !myProgress()!.isCompleted && campaign()!.status === 'ACTIVE') {
                      @if (isBookCompleted(campaignBook)) {
                        <span class="inline-flex items-center gap-1 mt-3 text-sm text-green-600 dark:text-green-400">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Lido
                        </span>
                      } @else {
                        <button 
                          (click)="completeBook(campaignBook)"
                          [disabled]="completingBook() === campaignBook.bookId"
                          class="mt-3 px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-lg transition-colors">
                          @if (completingBook() === campaignBook.bookId) {
                            Marcando...
                          } @else {
                            Marcar como lido
                          }
                        </button>
                      }
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Leaderboard -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ranking</h2>
          
          @if (leaderboardLoading()) {
            <div class="space-y-3">
              @for (i of [1, 2, 3]; track i) {
                <div class="flex items-center gap-3 animate-pulse">
                  <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div class="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              }
            </div>
          } @else if (leaderboard().length > 0) {
            <div class="space-y-3">
              @for (entry of leaderboard(); track entry.id; let i = $index) {
                <div class="flex items-center gap-3 p-3 rounded-lg" [class]="i < 3 ? 'bg-purple-50 dark:bg-purple-900/20' : ''">
                  <!-- Position -->
                  <div class="w-8 h-8 flex items-center justify-center shrink-0">
                    @if (i === 0) {
                      <span class="text-2xl">🥇</span>
                    } @else if (i === 1) {
                      <span class="text-2xl">🥈</span>
                    } @else if (i === 2) {
                      <span class="text-2xl">🥉</span>
                    } @else {
                      <span class="text-gray-500 font-medium">{{ i + 1 }}</span>
                    }
                  </div>
                  
                  <!-- Avatar -->
                  @if (entry.user.avatar) {
                    <img [src]="entry.user.avatar" [alt]="entry.user.name" class="w-10 h-10 rounded-full object-cover" />
                  } @else {
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span class="text-white font-bold">{{ entry.user.name.charAt(0).toUpperCase() }}</span>
                    </div>
                  }
                  
                  <!-- Name -->
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 dark:text-white truncate">{{ entry.user.name }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ entry.booksRead }} de {{ campaign()!.books.length }} livros
                    </p>
                  </div>
                  
                  <!-- Completed Badge -->
                  @if (entry.isCompleted) {
                    <span class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                      Concluiu
                    </span>
                  }
                </div>
              }
            </div>
          } @else {
            <p class="text-center text-gray-500 dark:text-gray-400 py-4">
              Nenhum participante ainda. Seja o primeiro!
            </p>
          }
        </div>
      }

      <!-- Not Found -->
      @if (!loading() && !campaign()) {
        <div class="text-center py-12">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Campanha não encontrada</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">A campanha que você procura não existe ou foi removida.</p>
          <a routerLink="/social/groups" class="text-purple-600 dark:text-purple-400 hover:underline">
            Voltar para grupos
          </a>
        </div>
      }
    </div>
  `
})
export class CampaignDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly campaignService = inject(CampaignService);

  campaign = signal<Campaign | null>(null);
  myProgress = signal<CampaignProgress | null>(null);
  leaderboard = signal<CampaignProgress[]>([]);
  completedBooks = signal<Set<string>>(new Set());
  
  loading = signal(true);
  actionLoading = signal(false);
  leaderboardLoading = signal(true);
  completingBook = signal<string | null>(null);

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadCampaign(params['id']);
    });
  }

  loadCampaign(id: string) {
    this.loading.set(true);
    
    this.campaignService.getCampaignById(id).subscribe({
      next: (campaign) => {
        this.campaign.set(campaign);
        this.loading.set(false);
        
        // Check if user progress exists
        if (campaign.userProgress) {
          this.myProgress.set(campaign.userProgress);
          // Calculate which books are completed (simplified - just count)
          const completedSet = new Set<string>();
          for (let i = 0; i < campaign.userProgress.booksRead; i++) {
            if (campaign.books[i]) {
              completedSet.add(campaign.books[i].bookId);
            }
          }
          this.completedBooks.set(completedSet);
        }
        
        this.loadLeaderboard(id);
      },
      error: (error) => {
        console.error('Error loading campaign:', error);
        this.loading.set(false);
      }
    });
  }

  loadLeaderboard(campaignId: string) {
    this.leaderboardLoading.set(true);
    
    this.campaignService.getLeaderboard(campaignId).subscribe({
      next: (leaderboard) => {
        this.leaderboard.set(leaderboard);
        this.leaderboardLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading leaderboard:', error);
        this.leaderboardLoading.set(false);
      }
    });
  }

  joinCampaign() {
    if (!this.campaign()) return;
    
    this.actionLoading.set(true);
    this.campaignService.joinCampaign(this.campaign()!.id).subscribe({
      next: (progress) => {
        this.myProgress.set(progress);
        this.campaign.update(c => c ? { 
          ...c, 
          _count: { ...c._count, progress: c._count.progress + 1 } 
        } : c);
        this.actionLoading.set(false);
        this.loadLeaderboard(this.campaign()!.id);
      },
      error: (error) => {
        console.error('Error joining campaign:', error);
        this.actionLoading.set(false);
      }
    });
  }

  completeBook(campaignBook: CampaignBook) {
    if (!this.campaign()) return;
    
    this.completingBook.set(campaignBook.bookId);
    
    this.campaignService.completeBook(this.campaign()!.id, campaignBook.bookId).subscribe({
      next: (progress) => {
        this.myProgress.set(progress);
        this.completedBooks.update(set => {
          const newSet = new Set(set);
          newSet.add(campaignBook.bookId);
          return newSet;
        });
        this.completingBook.set(null);
        this.loadLeaderboard(this.campaign()!.id);
        
        // Show reward if earned
        if (progress.rewardEarned) {
          alert(`Parabéns! Você completou a campanha e ganhou ${progress.rewardEarned} Livras! 🎉`);
        }
      },
      error: (error) => {
        console.error('Error completing book:', error);
        this.completingBook.set(null);
      }
    });
  }

  isBookCompleted(campaignBook: CampaignBook): boolean {
    return this.completedBooks().has(campaignBook.bookId);
  }

  getProgressPercent(): number {
    if (!this.myProgress() || !this.campaign()) return 0;
    const total = this.campaign()!.books.length;
    if (total === 0) return 0;
    return Math.round((this.myProgress()!.booksRead / total) * 100);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      DRAFT: 'Rascunho',
      ACTIVE: 'Ativa',
      COMPLETED: 'Concluída',
      CANCELLED: 'Cancelada'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      COMPLETED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Não definida';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  }
}
