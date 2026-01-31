import { Component, Input, Output, EventEmitter, HostListener, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AfDropdownItem {
  label: string;
  value: any;
  disabled?: boolean;
  separator?: boolean;
}

/**
 * Dropdown menu component
 *
 * @example
 * <af-dropdown
 *   label="Actions"
 *   [items]="menuItems"
 *   (itemSelected)="handleAction($event)">
 * </af-dropdown>
 */
@Component({
  selector: 'af-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="af-dropdown" [attr.data-state]="isOpen ? 'open' : 'closed'">
      <button
        #trigger
        class="af-button af-button--secondary af-dropdown__trigger"
        [attr.aria-expanded]="isOpen"
        [attr.aria-controls]="menuId"
        [attr.aria-haspopup]="true"
        type="button"
        (click)="toggle()">
        {{ label }}
      </button>
      <div *ngIf="isOpen" class="af-dropdown__menu" [id]="menuId">
        @for (item of items; track $index) {
          @if (item.separator) {
            <div class="af-dropdown__separator" role="separator"></div>
          } @else {
            <button
              #itemButton
              class="af-dropdown__item"
              [disabled]="item.disabled"
              [attr.aria-disabled]="item.disabled ? true : null"
              type="button"
              (click)="selectItem(item)">
              {{ item.label }}
            </button>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class AfDropdownComponent {
  private static nextId = 0;

  /** Dropdown button label */
  @Input() label = 'Actions';

  /** Menu items */
  @Input() items: AfDropdownItem[] = [];

  /** Item selected event */
  @Output() itemSelected = new EventEmitter<any>();

  @ViewChild('trigger', { read: ElementRef }) triggerRef?: ElementRef<HTMLButtonElement>;
  @ViewChildren('itemButton') itemButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  isOpen = false;
  menuId = `af-dropdown-menu-${AfDropdownComponent.nextId++}`;

  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  selectItem(item: AfDropdownItem): void {
    if (!item.disabled) {
      this.itemSelected.emit(item.value);
      this.close(true);
    }
  }

  private open(): void {
    this.isOpen = true;
    queueMicrotask(() => this.focusFirstItem());
  }

  private close(returnFocus = false): void {
    this.isOpen = false;
    if (returnFocus) {
      this.triggerRef?.nativeElement.focus();
    }
  }

  private focusFirstItem(): void {
    const first = this.itemButtons?.find(ref => !ref.nativeElement.disabled);
    first?.nativeElement.focus();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.af-dropdown')) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.close(true);
    }
  }
}
