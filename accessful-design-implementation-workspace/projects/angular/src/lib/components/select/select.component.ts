import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface AfSelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

/**
 * Select dropdown component with form control support
 *
 * @example
 * <af-select
 *   label="Role"
 *   [options]="roleOptions"
 *   [(ngModel)]="selectedRole"
 *   hint="Choose your primary role"
 * ></af-select>
 */
@Component({
  selector: 'af-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfSelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="af-field" [class.af-field--error]="error">
      <label *ngIf="label" class="af-field__label" [attr.for]="selectId">
        {{ label }}
        <span *ngIf="required" aria-label="required"> *</span>
      </label>

      <select
        [id]="selectId"
        class="af-select"
        [disabled]="disabled"
        [required]="required"
        [attr.aria-invalid]="error ? true : null"
        [attr.aria-describedby]="getAriaDescribedBy()"
        (change)="onChange($event)"
        (blur)="onTouched()"
      >
        <option *ngIf="placeholder" value="" [disabled]="true" [selected]="isPlaceholderSelected">
          {{ placeholder }}
        </option>
        <option
          *ngFor="let option of options"
          [selected]="isOptionSelected(option)"
          [disabled]="option.disabled || false"
        >
          {{ option.label }}
        </option>
      </select>

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
export class AfSelectComponent implements ControlValueAccessor {
  private static nextId = 0;

  /** Select label */
  @Input() label = '';

  /** Placeholder option */
  @Input() placeholder = '';

  /** Options array */
  @Input() options: AfSelectOption[] = [];

  /** Hint text shown below select */
  @Input() hint = '';

  /** Error message */
  @Input() error = '';

  /** Whether select is required */
  @Input() required = false;

  /** Whether select is disabled */
  @Input() disabled = false;

  /** Value comparison function (for object values) */
  @Input() compareWith: (a: any, b: any) => boolean = (a, b) => a === b;

  /** Unique select ID */
  @Input() selectId = `af-select-${AfSelectComponent.nextId++}`;

  value: any = null;
  onChangeCallback: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  get hintId(): string {
    return `${this.selectId}-hint`;
  }

  get errorId(): string {
    return `${this.selectId}-error`;
  }

  getAriaDescribedBy(): string | null {
    if (this.error) return this.errorId;
    if (this.hint) return this.hintId;
    return null;
  }

  get isPlaceholderSelected(): boolean {
    if (!this.placeholder) return false;
    if (this.value === null || this.value === undefined || this.value === '') return true;
    return !this.hasMatchingOption();
  }

  private hasMatchingOption(): boolean {
    return this.options.some(option => this.compareWith(option.value, this.value));
  }

  isOptionSelected(option: AfSelectOption): boolean {
    if (this.isPlaceholderSelected) return false;
    return this.compareWith(option.value, this.value);
  }

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const index = target.selectedIndex;
    const offset = this.placeholder ? 1 : 0;

    if (this.placeholder && index === 0) {
      this.value = null;
      this.onChangeCallback(null);
      return;
    }

    const option = this.options[index - offset];
    const nextValue = option ? option.value : null;
    this.value = nextValue;
    this.onChangeCallback(nextValue);
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value ?? null;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
