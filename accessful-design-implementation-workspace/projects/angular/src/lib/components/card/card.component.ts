import { Component, Input, Output, EventEmitter, ContentChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Card component for containing content
 *
 * @example
 * <af-card [interactive]="true" (cardClick)="handleClick()">
 *   <div header>
 *     <h3>Title</h3>
 *     <button>Action</button>
 *   </div>
 *   <div body>
 *     <p>Card content</p>
 *   </div>
 *   <div footer>
 *     <span>Footer content</span>
 *   </div>
 * </af-card>
 */
@Component({
  selector: 'af-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      [class]="cardClasses"
      (click)="onCardClick()">
      <div *ngIf="hasHeader" class="af-card__header">
        <ng-content select="[header]"></ng-content>
      </div>
      <div class="af-card__body">
        <ng-content select="[body]"></ng-content>
        <ng-content></ng-content>
      </div>
      <div *ngIf="hasFooter" class="af-card__footer">
        <ng-content select="[footer]"></ng-content>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AfCardComponent {
  /** Whether card is interactive (clickable/hoverable) */
  @Input() interactive = false;

  /** Click event emitter */
  @Output() cardClick = new EventEmitter<void>();

  hasHeader = false;
  hasFooter = false;

  @ContentChild('[header]', { read: ElementRef })
  set headerContent(value: ElementRef | undefined) {
    this.hasHeader = !!value;
  }

  @ContentChild('[footer]', { read: ElementRef })
  set footerContent(value: ElementRef | undefined) {
    this.hasFooter = !!value;
  }

  get cardClasses(): string {
    const classes = ['af-card'];
    if (this.interactive) {
      classes.push('af-card--interactive');
    }
    return classes.join(' ');
  }

  onCardClick(): void {
    if (this.interactive) {
      this.cardClick.emit();
    }
  }
}
