import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../../core/services/group.service';
import { Group, GroupPrivacy } from '../../../../core/models/group.model';

@Component({
  selector: 'app-group-create-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-create-modal.component.html',
  styleUrl: './group-create-modal.component.css',
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
