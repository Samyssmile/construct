import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AfButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'accent' | 'link';
export type AfButtonSize = 'sm' | 'md' | 'lg';
export type AfButtonType = 'button' | 'submit' | 'reset';

/**
 * Button component from Accessful Design System
 *
 * @example
 * <af-button variant="primary" (click)="handleClick()">Click me</af-button>
 *
 * @example
 * <af-button variant="secondary" size="sm" [disabled]="loading">
 *   Save
 * </af-button>
 */
@Component({
  selector: 'af-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="buttonClasses"
      (click)="handleClick($event)">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class AfButtonComponent {
  /** Button variant/style */
  @Input() variant: AfButtonVariant = 'primary';

  /** Button size */
  @Input() size: AfButtonSize = 'md';

  /** Button type attribute */
  @Input() type: AfButtonType = 'button';

  /** Whether button is disabled */
  @Input() disabled = false;

  /** Click event emitter */
  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const classes = ['af-button'];

    if (this.variant !== 'primary') {
      classes.push(`af-button--${this.variant}`);
    }

    if (this.size !== 'md') {
      classes.push(`af-button--${this.size}`);
    }

    return classes.join(' ');
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}
