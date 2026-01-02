import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  Achievement, 
  isAchievementUnlocked, 
  getAchievementProgress, 
  formatAchievementDate 
} from '../../../../core/models/achievement.model';

import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-achievement-card',
  standalone: true,
  imports: [CommonModule, ProgressBarModule, TagModule, TooltipModule],
  templateUrl: './achievement-card.component.html',
  styleUrl: './achievement-card.component.css'
})
export class AchievementCardComponent {
  @Input({ required: true }) achievement!: Achievement;
  @Input() compact = false;
  @Input() showProgress = true;
  @Input() showReward = true;

  get isUnlocked(): boolean {
    return isAchievementUnlocked(this.achievement);
  }

  get progress(): number {
    return getAchievementProgress(this.achievement);
  }

  formatDate(date: Date | string | null | undefined): string {
    return formatAchievementDate(date);
  }
}
