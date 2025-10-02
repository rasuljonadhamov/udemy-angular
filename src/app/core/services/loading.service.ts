import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingCount = signal(0);
  isLoading = signal(false);

  show(): void {
    this.loadingCount.update((count) => count + 1);
    this.isLoading.set(true);
  }

  hide(): void {
    this.loadingCount.update((count) => Math.max(0, count - 1));

    if (this.loadingCount() === 0) {
      this.isLoading.set(false);
    }
  }

  reset(): void {
    this.loadingCount.set(0);
    this.isLoading.set(false);
  }
}
