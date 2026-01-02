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
  templateUrl: './story-viewer.component.html',
  styleUrl: './story-viewer.component.css',
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
