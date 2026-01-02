import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { SelectButton } from 'primeng/selectbutton';
import { Message } from 'primeng/message';
import { StoryService, CreateStoryDto, StoryType, Story } from '../../../../core';

@Component({
  selector: 'app-story-creator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Dialog,
    Button,
    Textarea,
    SelectButton,
    Message,
  ],
  templateUrl: './story-creator.component.html',
  styleUrl: './story-creator.component.css',
})
export class StoryCreatorComponent {
  private readonly storyService = inject(StoryService);

  // State
  visible = false;
  selectedType: StoryType = 'TEXT';
  content = '';
  imageUrl = '';
  creating = signal(false);
  error = signal<string | null>(null);

  // Events
  created = output<Story>();

  storyTypes = [
    { label: 'Texto', value: 'TEXT' as StoryType },
    { label: 'Citação', value: 'QUOTE' as StoryType },
    { label: 'Imagem', value: 'IMAGE' as StoryType },
  ];

  open(): void {
    this.visible = true;
    this.reset();
  }

  onClose(): void {
    if (!this.creating()) {
      this.visible = false;
      this.reset();
    }
  }

  isValid(): boolean {
    if (this.creating()) return false;

    switch (this.selectedType) {
      case 'TEXT':
      case 'QUOTE':
        return this.content.trim().length > 0;
      case 'IMAGE':
        return this.imageUrl.trim().length > 0;
      default:
        return false;
    }
  }

  createStory(): void {
    if (!this.isValid()) return;

    this.creating.set(true);
    this.error.set(null);

    const dto: CreateStoryDto = {
      type: this.selectedType,
      content: this.content.trim() || undefined,
      mediaUrl: this.selectedType === 'IMAGE' ? this.imageUrl.trim() : undefined,
    };

    this.storyService.createStory(dto).subscribe({
      next: (story) => {
        this.creating.set(false);
        this.created.emit(story);
        this.visible = false;
        this.reset();
      },
      error: (err) => {
        this.creating.set(false);
        this.error.set(err.error?.error || 'Erro ao criar story. Tente novamente.');
        console.error('[StoryCreator] Error:', err);
      },
    });
  }

  private reset(): void {
    this.selectedType = 'TEXT';
    this.content = '';
    this.imageUrl = '';
    this.error.set(null);
  }
}
