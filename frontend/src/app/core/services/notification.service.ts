import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSignal = signal<Notification[]>([]);
  public notifications = this.notificationsSignal.asReadonly();
  private nextId = 0;

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000): void {
    const id = this.nextId++;
    const notification: Notification = { id, message, type, duration };
    
    this.notificationsSignal.update(list => [...list, notification]);
    
    setTimeout(() => {
      this.hide(id);
    }, duration);
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  hide(id: number): void {
    this.notificationsSignal.update(list => list.filter(n => n.id !== id));
  }

  clear(): void {
    this.notificationsSignal.set([]);
  }
}