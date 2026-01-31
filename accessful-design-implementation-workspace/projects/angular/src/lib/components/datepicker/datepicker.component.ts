import { Component, Input, Output, EventEmitter, forwardRef, signal, computed, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

/**
 * Datepicker component with calendar popup
 *
 * @example
 * <af-datepicker
 *   label="Select date"
 *   placeholder="Pick a date"
 *   [(ngModel)]="selectedDate">
 * </af-datepicker>
 */
@Component({
  selector: 'af-datepicker',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AfDatepickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="af-field">
      <label *ngIf="label" class="af-field__label" [attr.for]="inputId">{{ label }}</label>

      <div class="af-datepicker" [attr.data-state]="isOpen() ? 'open' : 'closed'">
        <input
          #input
          class="af-input"
          type="text"
          [id]="inputId"
          [placeholder]="placeholder"
          [value]="formattedDate()"
          [disabled]="disabled"
          [attr.aria-haspopup]="'dialog'"
          [attr.aria-expanded]="isOpen()"
          [attr.aria-controls]="popoverId"
          [attr.aria-label]="label ? null : (placeholder || 'Select date')"
          (click)="toggle()"
          (keydown)="onInputKeydown($event)"
          (blur)="onTouched()"
          readonly
        />

        <div
          *ngIf="isOpen()"
          #popover
          class="af-datepicker__popover"
          role="dialog"
          [id]="popoverId"
          aria-label="Choose date">
          <div class="af-datepicker__header">
            <button
              class="af-button af-button--ghost af-button--icon"
              aria-label="Previous month"
              type="button"
              (click)="previousMonth()">
              ‹
            </button>
            <div class="af-datepicker__title">
              {{ monthNames[currentMonth()] }} {{ currentYear() }}
            </div>
            <button
              class="af-button af-button--ghost af-button--icon"
              aria-label="Next month"
              type="button"
              (click)="nextMonth()">
              ›
            </button>
          </div>

          <div class="af-datepicker__grid" (keydown)="onGridKeydown($event)">
            @for (day of weekdayLabels; track $index) {
              <div class="af-datepicker__weekday">{{ day }}</div>
            }
            @for (day of calendarDays(); track day.date.getTime()) {
              <button
                class="af-datepicker__day"
                [attr.data-date]="getDateKey(day.date)"
                [attr.data-outside]="!day.isCurrentMonth"
                [attr.data-today]="day.isToday"
                [attr.aria-selected]="day.isSelected ? 'true' : null"
                [attr.aria-current]="day.isToday ? 'date' : null"
                [attr.tabindex]="getDayTabIndex(day)"
                type="button"
                (click)="selectDate(day.date)">
                {{ day.date.getDate() }}
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AfDatepickerComponent implements ControlValueAccessor {
  private static nextId = 0;

  /** Input label */
  @Input() label = '';

  /** Placeholder text */
  @Input() placeholder = 'Select date';

  /** Whether datepicker is disabled */
  @Input() disabled = false;

  /** Date format for display */
  @Input() dateFormat = 'MMM dd, yyyy';

  /** Unique input ID */
  @Input() inputId = `af-datepicker-${AfDatepickerComponent.nextId++}`;

  /** Selected date change event */
  @Output() dateChange = new EventEmitter<Date>();

  @ViewChild('input', { read: ElementRef }) inputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('popover', { read: ElementRef }) popoverRef?: ElementRef<HTMLDivElement>;

  weekdayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  selectedDate = signal<Date | null>(null);
  currentMonth = signal(new Date().getMonth());
  currentYear = signal(new Date().getFullYear());
  isOpen = signal(false);
  focusedDate = signal<Date | null>(null);

  onChange: (value: Date | null) => void = () => {};
  onTouched: () => void = () => {};

  calendarDays = computed(() => {
    return this.generateCalendarDays();
  });

  formattedDate = computed(() => {
    const date = this.selectedDate();
    if (!date) return '';
    return this.formatDate(date);
  });

  get popoverId(): string {
    return `${this.inputId}-popover`;
  }

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  selectDate(date: Date): void {
    this.selectedDate.set(date);
    this.focusedDate.set(date);
    this.onChange(date);
    this.dateChange.emit(date);
    this.close(true);
  }

  previousMonth(): void {
    this.shiftMonth(-1);
  }

  nextMonth(): void {
    this.shiftMonth(1);
  }

  private generateCalendarDays(): CalendarDay[] {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    const selected = this.selectedDate();

    const days: CalendarDay[] = [];

    // Get day of week (0 = Sunday, adjust to Monday = 0)
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: this.isSameDay(date, today),
        isSelected: selected ? this.isSameDay(date, selected) : false
      });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: this.isSameDay(date, today),
        isSelected: selected ? this.isSameDay(date, selected) : false
      });
    }

    // Next month days to fill grid (6 rows * 7 days = 42)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: this.isSameDay(date, today),
        isSelected: selected ? this.isSameDay(date, selected) : false
      });
    }

    return days;
  }

  getDayTabIndex(day: CalendarDay): number {
    const focused = this.focusedDate();
    if (focused && this.isSameDay(day.date, focused)) return 0;
    if (!focused && day.isSelected) return 0;
    return -1;
  }

  getDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.open();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.close(true);
    }
  }

  onGridKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) return;
    const focused = this.focusedDate() || this.selectedDate() || new Date(this.currentYear(), this.currentMonth(), 1);
    let nextDate: Date | null = null;

    switch (event.key) {
      case 'ArrowRight':
        nextDate = this.addDays(focused, 1);
        break;
      case 'ArrowLeft':
        nextDate = this.addDays(focused, -1);
        break;
      case 'ArrowDown':
        nextDate = this.addDays(focused, 7);
        break;
      case 'ArrowUp':
        nextDate = this.addDays(focused, -7);
        break;
      case 'Home':
        nextDate = this.addDays(focused, -this.getWeekdayIndex(focused));
        break;
      case 'End':
        nextDate = this.addDays(focused, 6 - this.getWeekdayIndex(focused));
        break;
      case 'PageUp':
        nextDate = this.addMonths(focused, -1);
        break;
      case 'PageDown':
        nextDate = this.addMonths(focused, 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectDate(focused);
        return;
      case 'Escape':
        event.preventDefault();
        this.close(true);
        return;
      default:
        return;
    }

    if (nextDate) {
      event.preventDefault();
      this.setFocusedDate(nextDate);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.close(true);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.isOpen() && !target.closest('.af-datepicker')) {
      this.close(false);
    }
  }

  private open(): void {
    if (this.disabled || this.isOpen()) return;
    const selected = this.selectedDate();
    const focusDate = selected || new Date();
    this.currentMonth.set(focusDate.getMonth());
    this.currentYear.set(focusDate.getFullYear());
    this.focusedDate.set(focusDate);
    this.isOpen.set(true);
    queueMicrotask(() => this.focusDayButton(focusDate));
  }

  private close(returnFocus = false): void {
    this.isOpen.set(false);
    this.onTouched();
    if (returnFocus) {
      this.inputRef?.nativeElement.focus();
    }
  }

  private setFocusedDate(date: Date): void {
    this.currentMonth.set(date.getMonth());
    this.currentYear.set(date.getFullYear());
    this.focusedDate.set(date);
    queueMicrotask(() => this.focusDayButton(date));
  }

  private focusDayButton(date: Date): void {
    const popover = this.popoverRef?.nativeElement;
    if (!popover) return;
    const key = this.getDateKey(date);
    const button = popover.querySelector<HTMLButtonElement>(`.af-datepicker__day[data-date="${key}"]`);
    button?.focus();
  }

  private addDays(date: Date, delta: number): Date {
    const next = new Date(date);
    next.setDate(date.getDate() + delta);
    return next;
  }

  private addMonths(date: Date, delta: number): Date {
    const next = new Date(date);
    next.setMonth(date.getMonth() + delta);
    return next;
  }

  private getWeekdayIndex(date: Date): number {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  }

  private shiftMonth(delta: number): void {
    const base = this.focusedDate() || new Date(this.currentYear(), this.currentMonth(), 1);
    const next = this.addMonths(base, delta);
    this.setFocusedDate(next);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private formatDate(date: Date): string {
    const tokens: Record<string, string> = {
      yyyy: String(date.getFullYear()),
      MMM: this.monthNames[date.getMonth()].substring(0, 3),
      MM: String(date.getMonth() + 1).padStart(2, '0'),
      dd: String(date.getDate()).padStart(2, '0'),
      d: String(date.getDate())
    };

    return this.dateFormat.replace(/yyyy|MMM|MM|dd|d/g, token => tokens[token] ?? token);
  }

  // ControlValueAccessor implementation
  writeValue(value: Date | null): void {
    if (value) {
      this.selectedDate.set(value);
      this.currentMonth.set(value.getMonth());
      this.currentYear.set(value.getFullYear());
      this.focusedDate.set(value);
    } else {
      this.selectedDate.set(null);
      this.focusedDate.set(null);
    }
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
