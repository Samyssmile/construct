import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Checkbox component with form control support
 *
 * @example
 * <af-checkbox [(ngModel)]="rememberMe">
 *   Remember me
 * </af-checkbox>
 */
@Component({
  selector: 'af-checkbox',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfCheckboxComponent),
      multi: true
    }
  ],
  template: `
    <label class="af-check">
      <input
        class="af-check__input"
        type="checkbox"
        [checked]="checked"
        [disabled]="disabled"
        (change)="onChange($event)"
        (blur)="onTouched()"
      />
      <span class="af-check__label">
        <ng-content></ng-content>
      </span>
    </label>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AfCheckboxComponent implements ControlValueAccessor {
  /** Whether checkbox is disabled */
  @Input() disabled = false;

  checked = false;
  onChangeCallback: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.onChangeCallback(this.checked);
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.checked = !!value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
