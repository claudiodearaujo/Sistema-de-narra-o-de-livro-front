import { Component, OnInit, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { StoryService, UserStories } from '../../../../core';

@Component({
  selector: 'app-story-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AvatarModule,
    ProgressBarModule,
    ButtonModule,
    SkeletonModule,
  ],
  template: `
    <div class="story-bar">
      <!-- Create Story Button -->
      <div class="story-item create-story" (click)="onCreateClick()">
        <div class="story-avatar create">
          <i class="pi pi-plus"></i>
        </div>
        <span class="story-name">Criar</span>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        @for (i of [1, 2, 3, 4, 5]; track i) {
          <div class="story-item">
            <p-skeleton shape="circle" size="64px" />
            <p-skeleton width="50px" height="12px" styleClass="mt-2" />
          </div>
        }
      }

      <!-- Stories List -->
      @for (userStory of userStories(); track userStory.userId) {
        <div 
          class="story-item" 
          [class.has-unviewed]="userStory.hasUnviewed"
          (click)="onStoryClick(userStory)"
        >
          <div class="story-avatar-wrapper" [class.viewed]="!userStory.hasUnviewed">
            @if (userStory.userAvatar) {
              <p-avatar 
                [image]="userStory.userAvatar" 
                shape="circle" 
                size="large"
              />
            } @else {
              <p-avatar 
                [label]="getInitials(userStory.userName)" 
                shape="circle" 
                size="large"
                styleClass="bg-primary"
              />
            }
          </div>
          <span class="story-name">{{ getFirstName(userStory.userName) }}</span>
        </div>
      }

      <!-- Empty State -->
      @if (!loading() && userStories().length === 0) {
        <div class="empty-stories">
          <span class="text-500">Nenhum story disponível</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .story-bar {
      display: flex;
      gap: 16px;
      padding: 16px;
      overflow-x: auto;
      background: var(--surface-card);
      border-radius: 12px;
      margin-bottom: 16px;
      scrollbar-width: thin;

      &::-webkit-scrollbar {
        height: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--surface-300);
        border-radius: 4px;
      }
    }

    .story-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      min-width: 70px;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.05);
      }

      &.create-story .story-avatar.create {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: var(--primary-color);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
      }
    }

    .story-avatar-wrapper {
      padding: 3px;
      border-radius: 50%;
      background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);

      &.viewed {
        background: var(--surface-300);
      }

      :host ::ng-deep .p-avatar {
        border: 3px solid var(--surface-card);
      }
    }

    .story-name {
      font-size: 12px;
      color: var(--text-color);
      max-width: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }

    .empty-stories {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 200px;
      padding: 16px;
    }
  `],
})
export class StoryBarComponent implements OnInit {
  private readonly storyService = inject(StoryService);

  // State
  userStories = signal<UserStories[]>([]);
  loading = signal(true);

  // Events
  createStory = output<void>();
  viewStory = output<UserStories>();

  ngOnInit(): void {
    this.loadStories();
  }

  loadStories(): void {
    this.loading.set(true);
    this.storyService.getStoriesFeed().subscribe({
      next: (stories) => {
        this.userStories.set(stories);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[StoryBar] Error loading stories:', err);
        this.loading.set(false);
      },
    });
  }

  onCreateClick(): void {
    this.createStory.emit();
  }

  onStoryClick(userStory: UserStories): void {
    this.viewStory.emit(userStory);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  getFirstName(name: string): string {
    return name.split(' ')[0];
  }
}
