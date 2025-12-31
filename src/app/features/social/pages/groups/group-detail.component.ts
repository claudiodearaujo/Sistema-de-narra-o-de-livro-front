import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../../../core/services/group.service';
import { CampaignService } from '../../../../core/services/campaign.service';
import { Group, GroupMember, Campaign, GroupRole } from '../../../../core/models/group.model';
import { CampaignCreateModalComponent } from '../campaigns/campaign-create-modal.component';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CampaignCreateModalComponent],
  template: `
    <div class="max-w-4xl mx-auto p-4">
      <!-- Loading -->
      @if (loading()) {
        <div class="animate-pulse">
          <div class="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6"></div>
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      }

      @if (!loading() && group()) {
        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6">
          <!-- Cover -->
          <div class="h-48 bg-gradient-to-br from-purple-500 to-pink-500 relative">
            @if (group()!.coverUrl) {
              <img [src]="group()!.coverUrl" [alt]="group()!.name" class="w-full h-full object-cover" />
            }
          </div>
          
          <!-- Info -->
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ group()!.name }}</h1>
                @if (group()!.description) {
                  <p class="text-gray-600 dark:text-gray-400 mt-2">{{ group()!.description }}</p>
                }
                
                <div class="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {{ group()!.memberCount }} membros
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Criado por {{ group()!.owner.name }}
                  </span>
                  <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                    {{ getPrivacyLabel(group()!.privacy) }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="shrink-0 flex gap-2">
                @if (group()!.isMember) {
                  @if (canManage()) {
                    <button 
                      (click)="showSettings.set(true)"
                      class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  }
                  @if (group()!.memberRole !== 'OWNER') {
                    <button 
                      (click)="leaveGroup()"
                      [disabled]="actionLoading()"
                      class="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      Sair do grupo
                    </button>
                  }
                } @else {
                  <button 
                    (click)="joinGroup()"
                    [disabled]="actionLoading()"
                    class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors">
                    @if (actionLoading()) {
                      Entrando...
                    } @else {
                      Participar
                    }
                  </button>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button 
            (click)="activeTab.set('campaigns')"
            [class]="activeTab() === 'campaigns' 
              ? 'flex-1 py-2 px-4 bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 font-medium rounded-md shadow-sm' 
              : 'flex-1 py-2 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'">
            Campanhas ({{ campaigns().length }})
          </button>
          <button 
            (click)="activeTab.set('members'); loadMembers()"
            [class]="activeTab() === 'members' 
              ? 'flex-1 py-2 px-4 bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 font-medium rounded-md shadow-sm' 
              : 'flex-1 py-2 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'">
            Membros ({{ group()!.memberCount }})
          </button>
        </div>

        <!-- Content -->
        @if (activeTab() === 'campaigns') {
          <div>
            <!-- Create Campaign Button -->
            @if (canModerate() && group()!.isMember) {
              <button 
                (click)="showCreateCampaign.set(true)"
                class="w-full p-4 mb-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Criar Nova Campanha
              </button>
            }

            <!-- Campaigns List -->
            @if (campaigns().length > 0) {
              <div class="space-y-4">
                @for (campaign of campaigns(); track campaign.id) {
                  <a 
                    [routerLink]="['/social/campaigns', campaign.id]"
                    class="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-start justify-between gap-4">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                          <h3 class="font-semibold text-lg text-gray-900 dark:text-white">{{ campaign.name }}</h3>
                          <span [class]="'px-2 py-0.5 text-xs rounded-full ' + getStatusClass(campaign.status)">
                            {{ getStatusLabel(campaign.status) }}
                          </span>
                        </div>
                        @if (campaign.description) {
                          <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">{{ campaign.description }}</p>
                        }
                        <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {{ campaign.books.length }} livros
                          </span>
                          <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {{ campaign._count.progress }} participantes
                          </span>
                          @if (campaign.livraReward > 0) {
                            <span class="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {{ campaign.livraReward }} Livras
                            </span>
                          }
                        </div>
                      </div>
                      
                      <!-- Books preview -->
                      <div class="shrink-0 flex -space-x-2">
                        @for (book of campaign.books.slice(0, 3); track book.id) {
                          @if (book.book.coverUrl) {
                            <img [src]="book.book.coverUrl" [alt]="book.book.title" 
                              class="w-10 h-14 rounded border-2 border-white dark:border-gray-800 object-cover" />
                          } @else {
                            <div class="w-10 h-14 rounded border-2 border-white dark:border-gray-800 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                              <span class="text-white text-xs font-bold">{{ book.book.title.charAt(0) }}</span>
                            </div>
                          }
                        }
                        @if (campaign.books.length > 3) {
                          <div class="w-10 h-14 rounded border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <span class="text-xs text-gray-600 dark:text-gray-400">+{{ campaign.books.length - 3 }}</span>
                          </div>
                        }
                      </div>
                    </div>
                  </a>
                }
              </div>
            } @else {
              <div class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhuma campanha ainda</h3>
                <p class="text-gray-600 dark:text-gray-400">
                  @if (canModerate()) {
                    Crie a primeira campanha de leitura do grupo!
                  } @else {
                    Este grupo ainda não tem campanhas de leitura.
                  }
                </p>
              </div>
            }
          </div>
        }

        @if (activeTab() === 'members') {
          <div>
            @if (membersLoading()) {
              <div class="space-y-3">
                @for (i of [1, 2, 3, 4]; track i) {
                  <div class="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl animate-pulse">
                    <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div class="flex-1 space-y-2">
                      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="space-y-2">
                @for (member of members(); track member.id) {
                  <div class="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl">
                    <!-- Avatar -->
                    @if (member.user.avatar) {
                      <img [src]="member.user.avatar" [alt]="member.user.name" class="w-12 h-12 rounded-full object-cover" />
                    } @else {
                      <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span class="text-white font-bold">{{ member.user.name.charAt(0).toUpperCase() }}</span>
                      </div>
                    }

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                      <a [routerLink]="['/social/profile', member.user.username]" class="font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400">
                        {{ member.user.name }}
                      </a>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ getRoleLabel(member.role) }} • Desde {{ formatDate(member.joinedAt) }}
                      </p>
                    </div>

                    <!-- Role Badge -->
                    <span [class]="'px-3 py-1 text-xs rounded-full ' + getRoleBadgeClass(member.role)">
                      {{ getRoleLabel(member.role) }}
                    </span>

                    <!-- Actions (for admins) -->
                    @if (canManage() && member.role !== 'OWNER' && member.user.id !== currentUserId()) {
                      <div class="relative">
                        <button 
                          (click)="toggleMemberMenu(member.id)"
                          class="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        @if (openMemberMenu() === member.id) {
                          <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            @if (member.role !== 'ADMIN') {
                              <button 
                                (click)="updateRole(member, 'ADMIN')"
                                class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                                Promover a Admin
                              </button>
                            }
                            @if (member.role !== 'MODERATOR') {
                              <button 
                                (click)="updateRole(member, 'MODERATOR')"
                                class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                                Tornar Moderador
                              </button>
                            }
                            @if (member.role !== 'MEMBER') {
                              <button 
                                (click)="updateRole(member, 'MEMBER')"
                                class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                                Rebaixar a Membro
                              </button>
                            }
                            <button 
                              (click)="removeMember(member)"
                              class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                              Remover do Grupo
                            </button>
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>

              @if (hasMoreMembers()) {
                <div class="mt-4 text-center">
                  <button 
                    (click)="loadMoreMembers()"
                    class="px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg">
                    Carregar mais
                  </button>
                </div>
              }
            }
          </div>
        }
      }

      <!-- Not Found -->
      @if (!loading() && !group()) {
        <div class="text-center py-12">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Grupo não encontrado</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">O grupo que você procura não existe ou foi removido.</p>
          <a routerLink="/social/groups" class="text-purple-600 dark:text-purple-400 hover:underline">
            Voltar para grupos
          </a>
        </div>
      }
    </div>

    <!-- Create Campaign Modal -->
    @if (showCreateCampaign()) {
      <app-campaign-create-modal 
        [groupId]="groupId()"
        (close)="showCreateCampaign.set(false)"
        (created)="onCampaignCreated($event)" />
    }
  `
})
export class GroupDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly groupService = inject(GroupService);
  private readonly campaignService = inject(CampaignService);

  groupId = signal<string>('');
  group = signal<Group | null>(null);
  campaigns = signal<Campaign[]>([]);
  members = signal<GroupMember[]>([]);
  
  loading = signal(true);
  actionLoading = signal(false);
  membersLoading = signal(false);
  hasMoreMembers = signal(false);
  
  activeTab = signal<'campaigns' | 'members'>('campaigns');
  showSettings = signal(false);
  showCreateCampaign = signal(false);
  openMemberMenu = signal<string | null>(null);
  
  currentUserId = signal<string>('');
  membersPage = 1;

  ngOnInit() {
    // Get current user ID from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserId.set(JSON.parse(user).id);
    }

    this.route.params.subscribe(params => {
      this.groupId.set(params['id']);
      this.loadGroup();
    });
  }

  loadGroup() {
    this.loading.set(true);
    
    this.groupService.getGroupById(this.groupId()).subscribe({
      next: (group) => {
        this.group.set(group);
        this.loading.set(false);
        this.loadCampaigns();
      },
      error: (error) => {
        console.error('Error loading group:', error);
        this.loading.set(false);
      }
    });
  }

  loadCampaigns() {
    this.campaignService.getCampaignsByGroup(this.groupId()).subscribe({
      next: (response) => {
        this.campaigns.set(response.data);
      },
      error: (error) => {
        console.error('Error loading campaigns:', error);
      }
    });
  }

  loadMembers() {
    if (this.members().length > 0) return;
    
    this.membersLoading.set(true);
    this.membersPage = 1;
    
    this.groupService.getMembers(this.groupId(), 1, 20).subscribe({
      next: (response) => {
        this.members.set(response.data);
        this.hasMoreMembers.set(response.hasMore);
        this.membersLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.membersLoading.set(false);
      }
    });
  }

  loadMoreMembers() {
    this.membersPage++;
    this.groupService.getMembers(this.groupId(), this.membersPage, 20).subscribe({
      next: (response) => {
        this.members.update(current => [...current, ...response.data]);
        this.hasMoreMembers.set(response.hasMore);
      },
      error: (error) => {
        console.error('Error loading more members:', error);
      }
    });
  }

  joinGroup() {
    this.actionLoading.set(true);
    this.groupService.joinGroup(this.groupId()).subscribe({
      next: (membership) => {
        this.group.update(g => g ? { 
          ...g, 
          isMember: true, 
          memberRole: membership.role,
          memberCount: g.memberCount + 1 
        } : g);
        this.actionLoading.set(false);
      },
      error: (error) => {
        console.error('Error joining group:', error);
        this.actionLoading.set(false);
      }
    });
  }

  leaveGroup() {
    if (!confirm('Tem certeza que deseja sair deste grupo?')) return;
    
    this.actionLoading.set(true);
    this.groupService.leaveGroup(this.groupId()).subscribe({
      next: () => {
        this.group.update(g => g ? { 
          ...g, 
          isMember: false, 
          memberRole: undefined,
          memberCount: g.memberCount - 1 
        } : g);
        this.actionLoading.set(false);
      },
      error: (error) => {
        console.error('Error leaving group:', error);
        this.actionLoading.set(false);
      }
    });
  }

  updateRole(member: GroupMember, newRole: GroupRole) {
    this.openMemberMenu.set(null);
    this.groupService.updateMemberRole(this.groupId(), member.user.id, newRole).subscribe({
      next: (updated) => {
        this.members.update(members => 
          members.map(m => m.id === member.id ? { ...m, role: updated.role } : m)
        );
      },
      error: (error) => {
        console.error('Error updating role:', error);
      }
    });
  }

  removeMember(member: GroupMember) {
    if (!confirm(`Tem certeza que deseja remover ${member.user.name} do grupo?`)) return;
    
    this.openMemberMenu.set(null);
    this.groupService.removeMember(this.groupId(), member.user.id).subscribe({
      next: () => {
        this.members.update(members => members.filter(m => m.id !== member.id));
        this.group.update(g => g ? { ...g, memberCount: g.memberCount - 1 } : g);
      },
      error: (error) => {
        console.error('Error removing member:', error);
      }
    });
  }

  toggleMemberMenu(memberId: string) {
    this.openMemberMenu.update(current => current === memberId ? null : memberId);
  }

  onCampaignCreated(campaign: Campaign) {
    this.showCreateCampaign.set(false);
    this.campaigns.update(campaigns => [campaign, ...campaigns]);
  }

  canManage(): boolean {
    const role = this.group()?.memberRole;
    return role === 'OWNER' || role === 'ADMIN';
  }

  canModerate(): boolean {
    const role = this.group()?.memberRole;
    return role === 'OWNER' || role === 'ADMIN' || role === 'MODERATOR';
  }

  getPrivacyLabel(privacy: string): string {
    const labels: Record<string, string> = {
      PUBLIC: 'Público',
      PRIVATE: 'Privado',
      INVITE_ONLY: 'Apenas convite'
    };
    return labels[privacy] || privacy;
  }

  getRoleLabel(role: GroupRole): string {
    const labels: Record<GroupRole, string> = {
      OWNER: 'Dono',
      ADMIN: 'Admin',
      MODERATOR: 'Moderador',
      MEMBER: 'Membro'
    };
    return labels[role] || role;
  }

  getRoleBadgeClass(role: GroupRole): string {
    const classes: Record<GroupRole, string> = {
      OWNER: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      ADMIN: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      MODERATOR: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      MEMBER: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
    };
    return classes[role] || 'bg-gray-100 text-gray-700';
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
      DRAFT: 'bg-gray-100 text-gray-700',
      ACTIVE: 'bg-green-100 text-green-700',
      COMPLETED: 'bg-blue-100 text-blue-700',
      CANCELLED: 'bg-red-100 text-red-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
