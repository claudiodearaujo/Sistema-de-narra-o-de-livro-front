import { Component, Input, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { FormsModule } from '@angular/forms';

// Core
import { PostBook, PostChapter } from '../../../core/models/post.model';

/**
 * Audio Preview Player Component - Sprint 7
 * 
 * Displays an audio preview with waveform-style player.
 */
@Component({
  selector: 'app-audio-preview-player',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    TagModule,
    SliderModule,
    ProgressBarModule,
    FormsModule
  ],
  template: `
    <div class="audio-preview-card bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl overflow-hidden border border-purple-200 dark:border-purple-700">
      <!-- Header -->
      <div class="bg-purple-100 dark:bg-purple-800/50 px-4 py-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="pi pi-volume-up text-purple-600 dark:text-purple-400"></i>
          <span class="text-sm font-medium text-purple-800 dark:text-purple-200">
            Narração disponível
          </span>
        </div>
        <p-tag value="🎧 Áudio" severity="info" />
      </div>

      <!-- Content -->
      <div class="p-4">
        <!-- Book/Chapter Info -->
        <div class="flex items-center gap-3 mb-4">
          @if (book?.coverUrl) {
            <img 
              [src]="book!.coverUrl" 
              [alt]="book!.title"
              class="w-12 h-16 object-cover rounded shadow-sm"
            />
          }
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 dark:text-white truncate">
              {{ chapter?.title || 'Narração' }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
              {{ book?.title }} • {{ book?.author }}
            </p>
          </div>
        </div>

        <!-- Audio Player -->
        <div class="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
          <!-- Waveform Visualization (Static) -->
          <div class="flex items-center gap-1 h-12 mb-3">
            @for (bar of waveformBars; track $index) {
              <div 
                class="flex-1 rounded-full transition-all duration-300"
                [style.height.%]="bar"
                [class]="isPlaying() && $index <= currentBarIndex() ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'"
              ></div>
            }
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-4">
            <button 
              pButton 
              type="button"
              [icon]="isPlaying() ? 'pi pi-pause' : 'pi pi-play'"
              class="p-button-rounded p-button-lg"
              [class]="isPlaying() ? 'p-button-primary' : 'p-button-secondary'"
              (click)="togglePlay()"
            ></button>

            <!-- Progress -->
            <div class="flex-1">
              <p-slider 
                [(ngModel)]="progress"
                [min]="0"
                [max]="100"
                (onChange)="onSeek($event)"
                styleClass="w-full"
              />
            </div>

            <!-- Time -->
            <div class="text-sm text-gray-500 dark:text-gray-400 min-w-[80px] text-right">
              {{ formatTime(currentTime()) }} / {{ formatTime(duration()) }}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center gap-2">
            <button 
              pButton 
              type="button"
              icon="pi pi-download"
              class="p-button-text p-button-sm p-button-secondary"
              pTooltip="Baixar áudio"
            ></button>
            <button 
              pButton 
              type="button"
              icon="pi pi-external-link"
              class="p-button-text p-button-sm p-button-secondary"
              pTooltip="Abrir no player completo"
            ></button>
          </div>

          <a 
            [routerLink]="['/books', book?.id, 'chapter', chapter?.id, 'listen']"
            pButton
            type="button"
            label="Ouvir completo"
            icon="pi pi-headphones"
            class="p-button-sm"
          ></a>
        </div>
      </div>

      <!-- Hidden Audio Element -->
      <audio 
        #audioPlayer
        [src]="audioUrl"
        (timeupdate)="onTimeUpdate()"
        (loadedmetadata)="onMetadataLoaded()"
        (ended)="onEnded()"
        preload="metadata"
      ></audio>
    </div>
  `,
  styles: [`
    .audio-preview-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .audio-preview-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    :host ::ng-deep .p-slider .p-slider-handle {
      width: 16px;
      height: 16px;
    }

    :host ::ng-deep .p-slider .p-slider-range {
      background: var(--purple-500);
    }
  `]
})
export class AudioPreviewPlayerComponent {
  @Input() book: PostBook | undefined;
  @Input() chapter: PostChapter | undefined;
  @Input() audioUrl: string = '';
  
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  isPlaying = signal(false);
  currentTime = signal(0);
  duration = signal(0);
  progress = 0;
  currentBarIndex = signal(0);

  // Generate random waveform bars for visual effect
  waveformBars = Array.from({ length: 40 }, () => Math.floor(Math.random() * 60) + 20);

  togglePlay(): void {
    const audio = this.audioPlayer?.nativeElement;
    if (!audio) return;

    if (this.isPlaying()) {
      audio.pause();
      this.isPlaying.set(false);
    } else {
      audio.play();
      this.isPlaying.set(true);
    }
  }

  onTimeUpdate(): void {
    const audio = this.audioPlayer?.nativeElement;
    if (!audio) return;

    this.currentTime.set(audio.currentTime);
    this.progress = (audio.currentTime / audio.duration) * 100;
    this.currentBarIndex.set(Math.floor((audio.currentTime / audio.duration) * this.waveformBars.length));
  }

  onMetadataLoaded(): void {
    const audio = this.audioPlayer?.nativeElement;
    if (!audio) return;
    this.duration.set(audio.duration);
  }

  onEnded(): void {
    this.isPlaying.set(false);
    this.progress = 0;
    this.currentBarIndex.set(0);
  }

  onSeek(event: any): void {
    const audio = this.audioPlayer?.nativeElement;
    if (!audio || !audio.duration) return;

    const seekTime = (event.value / 100) * audio.duration;
    audio.currentTime = seekTime;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
