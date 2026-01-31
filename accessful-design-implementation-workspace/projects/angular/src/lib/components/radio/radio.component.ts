import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Radio button component with form control support
 *
 * @example
 * <af-radio name="plan" value="standard" [(ngModel)]="selectedPlan">
 *   Standard
 * </af-radio>
 * <af-radio name="plan" value="premium" [(ngModel)]="selectedPlan">
 *   Premium
 * </af-radio>
 */
@Component({
  selector: 'af-radio',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfRadioComponent),
      multi: true
    }
  ],
  template: `
    <label class="af-radio">
      <input
        class="af-radio__input"
        type="radio"
        [name]="name"
        [value]="value"
        [checked]="isChecked"
        [disabled]="disabled"
        (change)="onChange($event)"
        (blur)="onTouched()"
      />
      <span class="af-radio__label">
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
export class AfRadioComponent implements ControlValueAccessor {
  /** Radio group name */
  @Input() name = '';

  /** Radio value */
  @Input() value: any;

  /** Whether radio is disabled */
  @Input() disabled = false;

  modelValue: any;
  onChangeCallback: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  get isChecked(): boolean {
    return this.modelValue === this.value;
  }

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.modelValue = this.value;
      this.onChangeCallback(this.value);
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.modelValue = value;
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
