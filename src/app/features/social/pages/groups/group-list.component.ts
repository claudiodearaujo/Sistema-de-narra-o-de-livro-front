import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../../core/services/group.service';
import { Group, GroupsResponse } from '../../../../core/models/group.model';
import { GroupCreateModalComponent } from './group-create-modal.component';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, GroupCreateModalComponent],
  template: `
    <div class="max-w-4xl mx-auto p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Grupos Literários</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Descubra comunidades de leitores e escritores</p>
        </div>
        <button 
          (click)="showCreateModal.set(true)"
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Criar Grupo
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button 
          (click)="activeTab.set('discover')"
          [class]="activeTab() === 'discover' 
            ? 'flex-1 py-2 px-4 bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 font-medium rounded-md shadow-sm' 
            : 'flex-1 py-2 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'">
          Descobrir
        </button>
        <button 
          (click)="activeTab.set('my'); loadMyGroups()"
          [class]="activeTab() === 'my' 
            ? 'flex-1 py-2 px-4 bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 font-medium rounded-md shadow-sm' 
            : 'flex-1 py-2 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'">
          Meus Grupos
        </button>
      </div>

      <!-- Search -->
      @if (activeTab() === 'discover') {
        <div class="mb-6">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearchChange()"
              placeholder="Buscar grupos..."
              class="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
        </div>
      }

      <!-- Loading -->
      @if (loading()) {
        <div class="space-y-4">
          @for (i of [1, 2, 3]; track i) {
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
              <div class="flex gap-4">
                <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Groups List -->
      @if (!loading() && groups().length > 0) {
        <div class="space-y-4">
          @for (group of groups(); track group.id) {
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex gap-4">
                <!-- Cover Image -->
                <div class="shrink-0">
                  @if (group.coverUrl) {
                    <img [src]="group.coverUrl" [alt]="group.name" class="w-16 h-16 rounded-lg object-cover" />
                  } @else {
                    <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                      <span class="text-2xl font-bold text-white">{{ group.name.charAt(0).toUpperCase() }}</span>
                    </div>
                  }
                </div>
                
                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <a [routerLink]="['/social/groups', group.id]" class="font-semibold text-lg text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                        {{ group.name }}
                      </a>
                      @if (group.description) {
                        <p class="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{{ group.description }}</p>
                      }
                    </div>
                    
                    <!-- Join/Leave Button -->
                    @if (group.isMember) {
                      <span class="shrink-0 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm rounded-full">
                        {{ getRoleDisplay(group.memberRole) }}
                      </span>
                    } @else {
                      <button 
                        (click)="joinGroup(group)"
                        [disabled]="joiningGroup() === group.id"
                        class="shrink-0 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white text-sm rounded-lg transition-colors">
                        @if (joiningGroup() === group.id) {
                          <span class="flex items-center gap-2">
                            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Entrando...
                          </span>
                        } @else {
                          Participar
                        }
                      </button>
                    }
                  </div>
                  
                  <!-- Stats -->
                  <div class="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {{ group.memberCount }} membros
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {{ group._count.campaigns }} campanhas
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Criado por {{ group.owner.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Load More -->
        @if (hasMore()) {
          <div class="mt-6 text-center">
            <button 
              (click)="loadMore()"
              [disabled]="loadingMore()"
              class="px-6 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
              @if (loadingMore()) {
                Carregando...
              } @else {
                Carregar mais
              }
            </button>
          </div>
        }
      }

      <!-- Empty State -->
      @if (!loading() && groups().length === 0) {
        <div class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ activeTab() === 'my' ? 'Você ainda não participa de nenhum grupo' : 'Nenhum grupo encontrado' }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ activeTab() === 'my' ? 'Descubra grupos para participar!' : 'Tente buscar por outro termo' }}
          </p>
          @if (activeTab() === 'my') {
            <button 
              (click)="activeTab.set('discover')"
              class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
              Descobrir Grupos
            </button>
          }
        </div>
      }
    </div>

    <!-- Create Group Modal -->
    @if (showCreateModal()) {
      <app-group-create-modal 
        (close)="showCreateModal.set(false)"
        (created)="onGroupCreated($event)" />
    }
  `
})
export class GroupListComponent implements OnInit {
  private readonly groupService = inject(GroupService);

  groups = signal<Group[]>([]);
  loading = signal(true);
  loadingMore = signal(false);
  hasMore = signal(false);
  activeTab = signal<'discover' | 'my'>('discover');
  searchQuery = '';
  page = 1;
  joiningGroup = signal<string | null>(null);
  showCreateModal = signal(false);

  private searchTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.loading.set(true);
    this.page = 1;

    if (this.activeTab() === 'my') {
      this.loadMyGroups();
    } else {
      this.loadDiscoverGroups();
    }
  }

  loadDiscoverGroups() {
    this.groupService.discoverGroups(this.page, 20, this.searchQuery || undefined)
      .subscribe({
        next: (response) => {
          this.groups.set(response.data);
          this.hasMore.set(response.hasMore);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading groups:', error);
          this.loading.set(false);
        }
      });
  }

  loadMyGroups() {
    this.loading.set(true);
    this.groupService.getMyGroups(this.page, 20)
      .subscribe({
        next: (response) => {
          this.groups.set(response.data.map(g => ({ ...g, isMember: true })));
          this.hasMore.set(response.hasMore);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading my groups:', error);
          this.loading.set(false);
        }
      });
  }

  loadMore() {
    this.loadingMore.set(true);
    this.page++;

    const request$ = this.activeTab() === 'my'
      ? this.groupService.getMyGroups(this.page, 20)
      : this.groupService.discoverGroups(this.page, 20, this.searchQuery || undefined);

    request$.subscribe({
      next: (response) => {
        this.groups.update(current => [...current, ...response.data]);
        this.hasMore.set(response.hasMore);
        this.loadingMore.set(false);
      },
      error: (error) => {
        console.error('Error loading more groups:', error);
        this.loadingMore.set(false);
      }
    });
  }

  onSearchChange() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.loadGroups();
    }, 300);
  }

  joinGroup(group: Group) {
    this.joiningGroup.set(group.id);
    this.groupService.joinGroup(group.id).subscribe({
      next: (membership) => {
        this.groups.update(groups => 
          groups.map(g => 
            g.id === group.id 
              ? { ...g, isMember: true, memberRole: membership.role, memberCount: g.memberCount + 1 }
              : g
          )
        );
        this.joiningGroup.set(null);
      },
      error: (error) => {
        console.error('Error joining group:', error);
        this.joiningGroup.set(null);
      }
    });
  }

  onGroupCreated(group: Group) {
    this.showCreateModal.set(false);
    this.groups.update(groups => [{ ...group, isMember: true, memberRole: 'OWNER' }, ...groups]);
  }

  getRoleDisplay(role?: string): string {
    if (!role) return 'Membro';
    const roleNames: Record<string, string> = {
      OWNER: 'Dono',
      ADMIN: 'Admin',
      MODERATOR: 'Mod',
      MEMBER: 'Membro'
    };
    return roleNames[role] || role;
  }
}
