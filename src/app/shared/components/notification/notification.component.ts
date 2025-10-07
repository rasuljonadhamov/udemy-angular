import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications">
      @for (notification of notificationService.notifications(); track notification.id) {
        <div 
          class="notification"
          [class]="'notification-' + notification.type"
          (click)="notificationService.remove(notification.id)"
        >
          <div class="notification-content">
            <span class="notification-message">{{ notification.message }}</span>
            <button class="notification-close" type="button">×</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .notifications {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      max-width: 400px;
    }

    .notification {
      margin-bottom: 10px;
      padding: 12px 16px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      animation: slideIn 0.3s ease-out;
    }

    .notification-success {
      background: #d4edda;
      color: #155724;
      border-left: 4px solid #28a745;
    }

    .notification-error {
      background: #f8d7da;
      color: #721c24;
      border-left: 4px solid #dc3545;
    }

    .notification-warning {
      background: #fff3cd;
      color: #856404;
      border-left: 4px solid #ffc107;
    }

    .notification-info {
      background: #d1ecf1;
      color: #0c5460;
      border-left: 4px solid #17a2b8;
    }

    .notification-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .notification-message {
      flex: 1;
      margin-right: 10px;
    }

    .notification-close {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      opacity: 0.7;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .notification-close:hover {
      opacity: 1;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .notifications {
        left: 20px;
        right: 20px;
        max-width: none;
      }
    }
  `]
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
}