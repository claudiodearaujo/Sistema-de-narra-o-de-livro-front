import { Component, OnInit, OnDestroy, inject, signal, input, output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { StoryService, UserStories, Story } from '../../../../core';

@Component({
  selector: 'app-story-viewer',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    ButtonModule,
    ProgressBarModule,
  ],
  template: `
    <div class="story-viewer-overlay" (click)="onOverlayClick($event)">
      <div class="story-viewer">
        <!-- Progress bars -->
        <div class="progress-container">
          @for (story of currentUserStories()?.stories || []; track story.id; let i = $index) {
            <div class="progress-bar-wrapper">
              <p-progressBar 
                [value]="getProgressValue(i)" 
                [showValue]="false"
                styleClass="story-progress"
              />
            </div>
          }
        </div>

        <!-- Header -->
        <div class="story-header">
          <div class="user-info">
            @if (currentUserStories()?.userAvatar) {
              <p-avatar 
                [image]="currentUserStories()!.userAvatar!" 
                shape="circle" 
                size="normal"
              />
            } @else {
              <p-avatar 
                [label]="getInitials(currentUserStories()?.userName || '')" 
                shape="circle" 
                size="normal"
                styleClass="bg-primary"
              />
            }
            <div class="user-details">
              <span class="user-name">{{ currentUserStories()?.userName }}</span>
              <span class="story-time">{{ getTimeSince(currentStory()?.createdAt || '') }}</span>
            </div>
          </div>
          <div class="header-actions">
            <p-button 
              icon="pi pi-times" 
              [rounded]="true" 
              [text]="true" 
              severity="secondary"
              (onClick)="close.emit()"
            />
          </div>
        </div>

        <!-- Story Content -->
        <div class="story-content" (click)="onContentClick($event)">
          <!-- Left tap area (previous) -->
          <div class="tap-area left" (click)="previousStory()"></div>
          
          <!-- Story Display -->
          @if (currentStory(); as story) {
            @switch (story.type) {
              @case ('IMAGE') {
                <img [src]="story.mediaUrl" [alt]="story.content || 'Story'" class="story-image" />
                @if (story.content) {
                  <div class="story-text-overlay">{{ story.content }}</div>
                }
              }
              @case ('TEXT') {
                <div class="story-text">
                  <p>{{ story.content }}</p>
                </div>
              }
              @case ('QUOTE') {
                <div class="story-quote">
                  <i class="pi pi-quote-left quote-icon"></i>
                  <p>{{ story.content }}</p>
                </div>
              }
              @default {
                <div class="story-text">
                  <p>{{ story.content }}</p>
                </div>
              }
            }
          }

          <!-- Right tap area (next) -->
          <div class="tap-area right" (click)="nextStory()"></div>
        </div>

        <!-- Footer (for owner: view count) -->
        @if (isOwner()) {
          <div class="story-footer">
            <div class="view-count" (click)="showViewers.emit(currentStory()!)">
              <i class="pi pi-eye"></i>
              <span>{{ currentStory()?.viewCount || 0 }} visualizações</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .story-viewer-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .story-viewer {
      width: 100%;
      max-width: 420px;
      height: 100%;
      max-height: 100vh;
      position: relative;
      display: flex;
      flex-direction: column;
      background: #000;

      @media (min-width: 768px) {
        max-height: 90vh;
        border-radius: 16px;
        overflow: hidden;
      }
    }

    .progress-container {
      display: flex;
      gap: 4px;
      padding: 8px 12px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;

      .progress-bar-wrapper {
        flex: 1;

        :host ::ng-deep .story-progress {
          height: 3px;
          background: rgba(255, 255, 255, 0.3);

          .p-progressbar-value {
            background: white;
          }
        }
      }
    }

    .story-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 12px 8px;
      position: absolute;
      top: 12px;
      left: 0;
      right: 0;
      z-index: 10;

      .user-info {
        display: flex;
        align-items: center;
        gap: 10px;

        .user-details {
          display: flex;
          flex-direction: column;

          .user-name {
            color: white;
            font-weight: 600;
            font-size: 14px;
          }

          .story-time {
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
          }
        }
      }

      .header-actions {
        :host ::ng-deep .p-button {
          color: white !important;
        }
      }
    }

    .story-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;

      .tap-area {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 30%;
        z-index: 5;

        &.left {
          left: 0;
          cursor: w-resize;
        }

        &.right {
          right: 0;
          cursor: e-resize;
        }
      }

      .story-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

      .story-text-overlay {
        position: absolute;
        bottom: 80px;
        left: 20px;
        right: 20px;
        color: white;
        font-size: 16px;
        text-align: center;
        padding: 12px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 8px;
      }

      .story-text {
        padding: 40px;
        text-align: center;
        
        p {
          color: white;
          font-size: 24px;
          line-height: 1.5;
          margin: 0;
        }
      }

      .story-quote {
        padding: 40px;
        text-align: center;

        .quote-icon {
          color: var(--color-primary-400);
          font-size: 48px;
          margin-bottom: 20px;
        }

        p {
          color: white;
          font-size: 22px;
          font-style: italic;
          line-height: 1.6;
          margin: 0;
        }
      }
    }

    .story-footer {
      padding: var(--space-4);
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 10;

      .view-count {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        color: white;
        font-size: var(--text-sm);
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `],
})
export class StoryViewerComponent implements OnInit, OnDestroy {
  private readonly storyService = inject(StoryService);

  // Inputs
  userStories = input.required<UserStories[]>();
  startIndex = input<number>(0);
  currentUserId = input<string>('');

  // Outputs
  close = output<void>();
  showViewers = output<Story>();
  storyViewed = output<Story>();

  // State
  currentUserIndex = signal(0);
  currentStoryIndex = signal(0);
  progress = signal(0);

  private progressInterval: any;
  private readonly STORY_DURATION = 5000; // 5 seconds per story

  ngOnInit(): void {
    this.currentUserIndex.set(this.startIndex());
    this.startProgress();
    this.markCurrentAsViewed();
  }

  ngOnDestroy(): void {
    this.stopProgress();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.previousStory();
        break;
      case 'ArrowRight':
        this.nextStory();
        break;
      case 'Escape':
        this.close.emit();
        break;
    }
  }

  currentUserStories(): UserStories | undefined {
    return this.userStories()[this.currentUserIndex()];
  }

  currentStory(): Story | undefined {
    const userStories = this.currentUserStories();
    if (!userStories) return undefined;
    return userStories.stories[this.currentStoryIndex()];
  }

  isOwner(): boolean {
    return this.currentUserStories()?.userId === this.currentUserId();
  }

  getProgressValue(index: number): number {
    const currentIdx = this.currentStoryIndex();
    if (index < currentIdx) return 100;
    if (index > currentIdx) return 0;
    return this.progress();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  getTimeSince(createdAt: string): string {
    return this.storyService.getTimeSince(createdAt);
  }

  nextStory(): void {
    const userStories = this.currentUserStories();
    if (!userStories) return;

    if (this.currentStoryIndex() < userStories.stories.length - 1) {
      // Next story of same user
      this.currentStoryIndex.update((i) => i + 1);
      this.resetProgress();
      this.markCurrentAsViewed();
    } else if (this.currentUserIndex() < this.userStories().length - 1) {
      // Next user
      this.currentUserIndex.update((i) => i + 1);
      this.currentStoryIndex.set(0);
      this.resetProgress();
      this.markCurrentAsViewed();
    } else {
      // End of all stories
      this.close.emit();
    }
  }

  previousStory(): void {
    if (this.currentStoryIndex() > 0) {
      // Previous story of same user
      this.currentStoryIndex.update((i) => i - 1);
      this.resetProgress();
    } else if (this.currentUserIndex() > 0) {
      // Previous user (last story)
      this.currentUserIndex.update((i) => i - 1);
      const prevUserStories = this.currentUserStories();
      if (prevUserStories) {
        this.currentStoryIndex.set(prevUserStories.stories.length - 1);
      }
      this.resetProgress();
    }
  }

  onOverlayClick(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('story-viewer-overlay')) {
      this.close.emit();
    }
  }

  onContentClick(event: Event): void {
    event.stopPropagation();
  }

  private startProgress(): void {
    this.stopProgress();
    const increment = 100 / (this.STORY_DURATION / 50);
    
    this.progressInterval = setInterval(() => {
      this.progress.update((p) => {
        if (p >= 100) {
          this.nextStory();
          return 0;
        }
        return p + increment;
      });
    }, 50);
  }

  private stopProgress(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  private resetProgress(): void {
    this.progress.set(0);
  }

  private markCurrentAsViewed(): void {
    const story = this.currentStory();
    if (story && !story.isViewed) {
      this.storyService.markAsViewed(story.id).subscribe({
        next: () => {
          story.isViewed = true;
          this.storyViewed.emit(story);
        },
        error: (err) => console.error('[StoryViewer] Error marking as viewed:', err),
      });
    }
  }
}
