import { Component, Input, Output, EventEmitter, HostListener, OnDestroy, ContentChild, ElementRef, ViewChild, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Modal/Dialog component with accessibility features
 *
 * @example
 * <af-modal
 *   [open]="isOpen"
 *   title="Confirm action"
 *   (closed)="handleClose()">
 *   <div body>
 *     <p>Are you sure?</p>
 *   </div>
 *   <div footer>
 *     <button (click)="cancel()">Cancel</button>
 *     <button (click)="confirm()">Confirm</button>
 *   </div>
 * </af-modal>
 */
@Component({
  selector: 'af-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="open"
      class="af-modal"
      [attr.data-state]="open ? 'open' : 'closed'"
      role="dialog"
      [attr.aria-modal]="true"
      [attr.aria-labelledby]="titleId"
      (click)="onBackdropClick($event)">
        <div
          #dialog
          class="af-modal__dialog"
          tabindex="-1"
          (click)="$event.stopPropagation()">
        <div class="af-modal__header">
          <h2 [id]="titleId">{{ title }}</h2>
          <button
            *ngIf="showCloseButton"
            class="af-button af-button--ghost"
            aria-label="Close"
            (click)="close()">
            ×
          </button>
        </div>
        <div class="af-modal__body">
          <ng-content select="[body]"></ng-content>
          <ng-content></ng-content>
        </div>
        <div *ngIf="hasFooter" class="af-modal__footer">
          <ng-content select="[footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class AfModalComponent implements OnDestroy, OnChanges, AfterViewInit {
  private static nextId = 0;

  /** Whether modal is open */
  @Input() open = false;

  /** Modal title */
  @Input() title = '';

  /** Whether to show close button */
  @Input() showCloseButton = true;

  /** Whether clicking backdrop closes modal */
  @Input() closeOnBackdropClick = true;

  /** Close event emitter */
  @Output() closed = new EventEmitter<void>();

  /** Unique title ID for aria-labelledby */
  titleId = `af-modal-title-${AfModalComponent.nextId++}`;

  hasFooter = false;
  private previousActiveElement: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];
  private viewInitialized = false;

  @ViewChild('dialog', { read: ElementRef }) dialogRef?: ElementRef<HTMLElement>;

  @ContentChild('[footer]', { read: ElementRef })
  set footerContent(value: ElementRef | undefined) {
    this.hasFooter = !!value;
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    if (this.open) {
      this.onOpen();
    }
  }

  ngOnDestroy(): void {
    this.restoreFocus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      if (this.open) {
        if (this.viewInitialized) {
          this.onOpen();
        }
      } else {
        this.restoreFocus();
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.open) {
      this.close();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.open || event.key !== 'Tab') return;

    this.refreshFocusableElements();
    if (this.focusableElements.length === 0) {
      event.preventDefault();
      this.dialogRef?.nativeElement.focus();
      return;
    }

    const first = this.focusableElements[0];
    const last = this.focusableElements[this.focusableElements.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdropClick && event.target === event.currentTarget) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }

  private onOpen(): void {
    this.previousActiveElement = document.activeElement as HTMLElement;
    this.refreshFocusableElements();
    queueMicrotask(() => {
      if (!this.open) return;
      const first = this.focusableElements[0];
      if (first) {
        first.focus();
      } else {
        this.dialogRef?.nativeElement.focus();
      }
    });
  }

  private restoreFocus(): void {
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
      this.previousActiveElement = null;
    }
  }

  private refreshFocusableElements(): void {
    const dialog = this.dialogRef?.nativeElement;
    if (!dialog) {
      this.focusableElements = [];
      return;
    }
    const selectors = [
      'a[href]',
      'area[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];
    this.focusableElements = Array.from(dialog.querySelectorAll<HTMLElement>(selectors.join(',')))
      .filter(el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');
  }
}
