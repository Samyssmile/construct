import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type AfInputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

/**
 * Input field component with form control support
 *
 * @example
 * <af-input
 *   label="Email"
 *   type="email"
 *   placeholder="name@company.com"
 *   [(ngModel)]="email"
 *   hint="We will not share this."
 * ></af-input>
 *
 * @example
 * <af-input
 *   label="Name"
 *   [error]="nameError"
 *   required
 * ></af-input>
 */
@Component({
  selector: 'af-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="af-field" [class.af-field--error]="error">
      <label *ngIf="label" class="af-field__label" [attr.for]="inputId">
        {{ label }}
        <span *ngIf="required" aria-label="required"> *</span>
      </label>

      <div *ngIf="iconPosition" class="af-input-wrap">
        <span *ngIf="iconPosition === 'left'" class="af-input__icon" aria-hidden="true">
          <ng-content select="[icon]"></ng-content>
        </span>
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [required]="required"
          [attr.aria-invalid]="error ? true : null"
          [attr.aria-describedby]="getAriaDescribedBy()"
          [class]="inputClasses"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />
        <span *ngIf="iconPosition === 'right'" class="af-input__icon" aria-hidden="true">
          <ng-content select="[icon]"></ng-content>
        </span>
      </div>

      <input
        *ngIf="!iconPosition"
        [id]="inputId"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [required]="required"
        [attr.aria-invalid]="error ? true : null"
        [attr.aria-describedby]="getAriaDescribedBy()"
        class="af-input"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />

      <div *ngIf="hint && !error" class="af-field__hint" [id]="hintId">
        {{ hint }}
      </div>

      <div *ngIf="error" class="af-field__error" [id]="errorId">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AfInputComponent implements ControlValueAccessor {
  private static nextId = 0;

  /** Input label */
  @Input() label = '';

  /** Input type */
  @Input() type: AfInputType = 'text';

  /** Placeholder text */
  @Input() placeholder = '';

  /** Hint text shown below input */
  @Input() hint = '';

  /** Error message - shows error state and message */
  @Input() error = '';

  /** Whether input is required */
  @Input() required = false;

  /** Whether input is disabled */
  @Input() disabled = false;

  /** Icon position (if icon content is projected) */
  @Input() iconPosition: 'left' | 'right' | null = null;

  /** Unique input ID */
  @Input() inputId = `af-input-${AfInputComponent.nextId++}`;

  value: string = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get hintId(): string {
    return `${this.inputId}-hint`;
  }

  get errorId(): string {
    return `${this.inputId}-error`;
  }

  get inputClasses(): string {
    const classes = ['af-input'];
    if (this.iconPosition) {
      classes.push('af-input--with-icon');
    }
    return classes.join(' ');
  }

  getAriaDescribedBy(): string | null {
    if (this.error) return this.errorId;
    if (this.hint) return this.hintId;
    return null;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
