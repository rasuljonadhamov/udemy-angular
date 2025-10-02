import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notifications = signal<Notification[]>([]);

  show(
    message: string,
    type: Notification['type'] = 'info',
    duration: number = 3000
  ): void {
    const id = Date.now().toString();
    const notification: Notification = { id, message, type, duration };

    this.notifications.update((notifications) => [
      ...notifications,
      notification,
    ]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  showSuccess(message: string, duration?: number): void {
    this.success(message, duration);
  }

  showError(message: string, duration?: number): void {
    this.error(message, duration);
  }

  remove(id: string): void {
    this.notifications.update((notifications) =>
      notifications.filter((n) => n.id !== id)
    );
  }

  clear(): void {
    this.notifications.set([]);
  }
}
