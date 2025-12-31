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
  template: `
    <p-dialog 
      header="Criar Story" 
      [(visible)]="visible" 
      [modal]="true" 
      [style]="{ width: '90vw', maxWidth: '500px' }"
      [closable]="!creating()"
      (onHide)="onClose()"
    >
      <!-- Story Type Selection -->
      <div class="type-selection mb-4">
        <p-selectbutton 
          [options]="storyTypes" 
          [(ngModel)]="selectedType"
          optionLabel="label" 
          optionValue="value"
          [disabled]="creating()"
        />
      </div>

      <!-- Text Story -->
      @if (selectedType === 'TEXT' || selectedType === 'QUOTE') {
        <div class="text-content mb-4">
          <label class="block mb-2 font-medium">
            {{ selectedType === 'QUOTE' ? 'Citação' : 'Texto' }}
          </label>
          <textarea 
            pInputTextarea
            [(ngModel)]="content"
            [rows]="5"
            [placeholder]="selectedType === 'QUOTE' ? 'Digite uma citação inspiradora...' : 'O que você está pensando?'"
            class="w-full"
            [maxlength]="500"
            [disabled]="creating()"
          ></textarea>
          <small class="text-500">{{ content.length }}/500 caracteres</small>
        </div>
      }

      <!-- Image Story -->
      @if (selectedType === 'IMAGE') {
        <div class="image-content mb-4">
          @if (!imageUrl) {
            <div class="upload-area">
              <label class="block mb-2 font-medium">Imagem</label>
              <input 
                type="text" 
                pInputText 
                [(ngModel)]="imageUrl" 
                placeholder="Cole a URL da imagem..."
                class="w-full mb-2"
                [disabled]="creating()"
              />
              <small class="text-500">Suporta URLs de imagens JPG, PNG, GIF</small>
            </div>
          } @else {
            <div class="image-preview">
              <img [src]="imageUrl" alt="Preview" class="preview-image" />
              <p-button 
                icon="pi pi-times" 
                [rounded]="true" 
                severity="danger"
                size="small"
                (onClick)="imageUrl = ''"
                styleClass="remove-image-btn"
              />
            </div>
          }

          <div class="caption-input mt-3">
            <label class="block mb-2 font-medium">Legenda (opcional)</label>
            <textarea 
              pInputTextarea
              [(ngModel)]="content"
              [rows]="2"
              placeholder="Adicione uma legenda..."
              class="w-full"
              [maxlength]="200"
              [disabled]="creating()"
            ></textarea>
          </div>
        </div>
      }

      <!-- Error Message -->
      @if (error()) {
        <p-message severity="error" [text]="error()!" styleClass="mb-3 w-full" />
      }

      <!-- Footer Actions -->
      <ng-template pTemplate="footer">
        <p-button 
          label="Cancelar" 
          [text]="true" 
          (onClick)="onClose()"
          [disabled]="creating()"
        />
        <p-button 
          label="Publicar Story" 
          icon="pi pi-send"
          (onClick)="createStory()"
          [loading]="creating()"
          [disabled]="!isValid()"
        />
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .type-selection {
      :host ::ng-deep .p-selectbutton {
        display: flex;
        width: 100%;

        .p-button {
          flex: 1;
        }
      }
    }

    .image-preview {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      background: var(--surface-100);

      .preview-image {
        width: 100%;
        max-height: 300px;
        object-fit: contain;
      }

      .remove-image-btn {
        position: absolute;
        top: 8px;
        right: 8px;
      }
    }

    .upload-area {
      padding: 20px;
      border: 2px dashed var(--surface-300);
      border-radius: 8px;
      text-align: center;
    }
  `],
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
