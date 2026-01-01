import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../../core/services/group.service';
import { Group, GroupPrivacy } from '../../../../core/models/group.model';

@Component({
  selector: 'app-group-create-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        (click)="close.emit()">
      </div>

      <!-- Modal -->
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Criar Grupo</h2>
          <button 
            (click)="close.emit()"
            class="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="p-4 space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome do grupo *
            </label>
            <input 
              type="text"
              [(ngModel)]="name"
              name="name"
              required
              maxlength="100"
              placeholder="Ex: Clube do Livro de Fantasia"
              class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição
            </label>
            <textarea 
              [(ngModel)]="description"
              name="description"
              rows="3"
              maxlength="500"
              placeholder="Descreva o propósito do seu grupo..."
              class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none">
            </textarea>
            <p class="text-xs text-gray-500 mt-1">{{ description.length }}/500 caracteres</p>
          </div>

          <!-- Cover URL -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL da capa (opcional)
            </label>
            <input 
              type="url"
              [(ngModel)]="coverUrl"
              name="coverUrl"
              placeholder="https://exemplo.com/imagem.jpg"
              class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>

          <!-- Privacy -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Privacidade
            </label>
            <div class="space-y-2">
              @for (option of privacyOptions; track option.value) {
                <label 
                  class="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                  [class]="privacy === option.value 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'">
                  <input 
                    type="radio"
                    name="privacy"
                    [value]="option.value"
                    [(ngModel)]="privacy"
                    class="mt-1" />
                  <div>
                    <span class="font-medium text-gray-900 dark:text-white">{{ option.label }}</span>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ option.description }}</p>
                  </div>
                </label>
              }
            </div>
          </div>

          <!-- Error -->
          @if (error()) {
            <div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-sm text-red-600 dark:text-red-400">{{ error() }}</p>
            </div>
          }

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <button 
              type="button"
              (click)="close.emit()"
              class="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors">
              Cancelar
            </button>
            <button 
              type="submit"
              [disabled]="loading() || !name.trim()"
              class="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg font-medium transition-colors">
              @if (loading()) {
                <span class="flex items-center justify-center gap-2">
                  <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando...
                </span>
              } @else {
                Criar Grupo
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class GroupCreateModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<Group>();

  private readonly groupService = inject(GroupService);

  name = '';
  description = '';
  coverUrl = '';
  privacy: GroupPrivacy = 'PUBLIC';
  loading = signal(false);
  error = signal<string | null>(null);

  privacyOptions = [
    {
      value: 'PUBLIC' as GroupPrivacy,
      label: 'Público',
      description: 'Qualquer pessoa pode ver e entrar no grupo'
    },
    {
      value: 'PRIVATE' as GroupPrivacy,
      label: 'Privado',
      description: 'Apenas membros podem ver o conteúdo'
    },
    {
      value: 'INVITE_ONLY' as GroupPrivacy,
      label: 'Apenas convite',
      description: 'Novos membros precisam ser convidados'
    }
  ];

  onSubmit() {
    if (!this.name.trim()) return;

    this.loading.set(true);
    this.error.set(null);

    this.groupService.createGroup({
      name: this.name.trim(),
      description: this.description.trim() || undefined,
      coverUrl: this.coverUrl.trim() || undefined,
      privacy: this.privacy
    }).subscribe({
      next: (group) => {
        this.loading.set(false);
        this.created.emit(group);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.error || 'Erro ao criar grupo');
      }
    });
  }
}
