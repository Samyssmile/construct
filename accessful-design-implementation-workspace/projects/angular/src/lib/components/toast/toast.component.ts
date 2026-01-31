import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AfToastService, AfToast } from '../../services/toast.service';

/**
 * Toast notification container component
 * Place once in your app root template
 *
 * @example
 * <!-- app.component.html -->
 * <af-toast-container></af-toast-container>
 */
@Component({
  selector: 'af-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="af-toast-region" aria-live="polite" aria-atomic="false">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="af-toast"
          [attr.data-variant]="toast.variant"
          [attr.data-state]="'open'"
          role="status">
          <div class="af-toast__title">{{ toast.title }}</div>
          <div *ngIf="toast.description" class="af-toast__description">
            {{ toast.description }}
          </div>
          <button
            *ngIf="toast.action"
            class="af-button af-button--ghost"
            (click)="handleAction(toast)">
            {{ toast.action.label }}
          </button>
          <button
            class="af-button af-button--ghost"
            aria-label="Close"
            (click)="toastService.dismiss(toast.id)">
            ×
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class AfToastContainerComponent {
  toastService = inject(AfToastService);

  handleAction(toast: AfToast): void {
    if (toast.action) {
      toast.action.callback();
      this.toastService.dismiss(toast.id);
    }
  }
}
