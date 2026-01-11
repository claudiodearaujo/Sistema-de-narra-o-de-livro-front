import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RouteLoadingService } from './core/services/route-loading.service';
import { AnalyticsService } from './core/services/analytics.service';
import { ScrollTrackerDirective } from './shared/directives/scroll-tracker.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, ProgressSpinnerModule, ScrollTrackerDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  protected readonly routeLoading = inject(RouteLoadingService);
  private readonly analytics = inject(AnalyticsService);

  ngOnInit(): void {
    // Track UTM campaign parameters on app start
    this.analytics.trackCampaignFromUrl();
  }
}
