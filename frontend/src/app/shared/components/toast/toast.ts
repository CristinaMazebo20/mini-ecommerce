import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let notification of notificationService.notifications()" 
           class="toast" 
           [class.toast-success]="notification.type === 'success'"
           [class.toast-error]="notification.type === 'error'"
           [class.toast-info]="notification.type === 'info'"
           [class.toast-warning]="notification.type === 'warning'">
        <div class="toast-icon">
          <span *ngIf="notification.type === 'success'">✅</span>
          <span *ngIf="notification.type === 'error'">❌</span>
          <span *ngIf="notification.type === 'info'">ℹ️</span>
          <span *ngIf="notification.type === 'warning'">⚠️</span>
        </div>
        <div class="toast-message">{{ notification.message }}</div>
        <button class="toast-close" (click)="notificationService.hide(notification.id)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .toast {
      min-width: 280px;
      max-width: 350px;
      background: white;
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
      border-left: 4px solid;
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

    .toast-success {
      border-left-color: #10b981;
      background: #ecfdf5;
    }
    [data-theme="dark"] .toast-success {
      background: #064e3b;
    }

    .toast-error {
      border-left-color: #ef4444;
      background: #fef2f2;
    }
    [data-theme="dark"] .toast-error {
      background: #7f1d1d;
    }

    .toast-info {
      border-left-color: #3b82f6;
      background: #eff6ff;
    }
    [data-theme="dark"] .toast-info {
      background: #1e3a8a;
    }

    .toast-warning {
      border-left-color: #f59e0b;
      background: #fffbeb;
    }
    [data-theme="dark"] .toast-warning {
      background: #78350f;
    }

    .toast-icon {
      font-size: 20px;
    }

    .toast-message {
      flex: 1;
      font-size: 14px;
      color: #1f2937;
    }
    [data-theme="dark"] .toast-message {
      color: #f1f5f9;
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #9ca3af;
      padding: 0 4px;
    }
    .toast-close:hover {
      color: #4b5563;
    }
  `]
})
export class ToastComponent {
  constructor(public notificationService: NotificationService) {}
}