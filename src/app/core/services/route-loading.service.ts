import { Injectable, computed, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RouteLoadingService {
  private readonly pendingTransitions = signal(0);

  readonly isNavigating = computed(() => this.pendingTransitions() > 0);

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.pendingTransitions.update(count => count + 1);
        return;
      }

      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.pendingTransitions.update(count => Math.max(count - 1, 0));
      }
    });
  }
}
