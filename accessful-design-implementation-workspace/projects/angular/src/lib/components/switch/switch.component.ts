import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Switch/Toggle component with form control support
 *
 * @example
 * <af-switch [(ngModel)]="autoRenew">
 *   Auto renew
 * </af-switch>
 */
@Component({
  selector: 'af-switch',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfSwitchComponent),
      multi: true
    }
  ],
  template: `
    <label class="af-switch">
      <input
        class="af-switch__input"
        type="checkbox"
        role="switch"
        [checked]="checked"
        [disabled]="disabled"
        (change)="onChange($event)"
        (blur)="onTouched()"
      />
      <span class="af-switch__label">
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
export class AfSwitchComponent implements ControlValueAccessor {
  /** Whether switch is disabled */
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
