import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (alert()) {
      <div class="alert" [ngClass]="getAlertClass()" role="alert">
        <div class="flex items-center justify-between w-full">
          <span>{{ alert()?.message }}</span>
          <button
            type="button"
            (click)="close()"
            class="btn btn-sm btn-ghost"
          >
            ✕
          </button>
        </div>
      </div>
    }
  `,
})
export class AlertComponent {
  alert = input<Alert | null>(null);
  closeAlert = output<void>();

  getAlertClass(): string {
    const type = this.alert()?.type;
    const baseClass = 'alert';
    
    switch (type) {
      case 'success':
        return `${baseClass} alert-success`;
      case 'error':
        return `${baseClass} alert-error`;
      case 'warning':
        return `${baseClass} alert-warning`;
      case 'info':
        return `${baseClass} alert-info`;
      default:
        return baseClass;
    }
  }

  close() {
    this.closeAlert.emit();
  }
}
