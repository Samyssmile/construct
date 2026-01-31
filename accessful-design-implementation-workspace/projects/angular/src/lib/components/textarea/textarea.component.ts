import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Textarea component with form control support
 *
 * @example
 * <af-textarea
 *   label="Notes"
 *   placeholder="Enter your notes..."
 *   [(ngModel)]="notes"
 *   [rows]="5"
 * ></af-textarea>
 */
@Component({
  selector: 'af-textarea',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfTextareaComponent),
      multi: true
    }
  ],
  template: `
    <div class="af-field" [class.af-field--error]="error">
      <label *ngIf="label" class="af-field__label" [attr.for]="textareaId">
        {{ label }}
        <span *ngIf="required" aria-label="required"> *</span>
      </label>

      <textarea
        [id]="textareaId"
        class="af-textarea"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [required]="required"
        [rows]="rows"
        [attr.aria-invalid]="error ? true : null"
        [attr.aria-describedby]="getAriaDescribedBy()"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
      ></textarea>

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
export class AfTextareaComponent implements ControlValueAccessor {
  private static nextId = 0;

  /** Textarea label */
  @Input() label = '';

  /** Placeholder text */
  @Input() placeholder = '';

  /** Hint text shown below textarea */
  @Input() hint = '';

  /** Error message */
  @Input() error = '';

  /** Whether textarea is required */
  @Input() required = false;

  /** Whether textarea is disabled */
  @Input() disabled = false;

  /** Number of visible rows */
  @Input() rows = 3;

  /** Unique textarea ID */
  @Input() textareaId = `af-textarea-${AfTextareaComponent.nextId++}`;

  value: string = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get hintId(): string {
    return `${this.textareaId}-hint`;
  }

  get errorId(): string {
    return `${this.textareaId}-error`;
  }

  getAriaDescribedBy(): string | null {
    if (this.error) return this.errorId;
    if (this.hint) return this.hintId;
    return null;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
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
