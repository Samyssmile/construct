import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Pagination component
 *
 * @example
 * <af-pagination
 *   [currentPage]="page"
 *   [totalPages]="10"
 *   (pageChange)="onPageChange($event)">
 * </af-pagination>
 */
@Component({
  selector: 'af-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="af-pagination" aria-label="Pagination">
      <ul class="af-pagination__list">
        <li>
          <button
            class="af-pagination__link"
            [attr.aria-disabled]="currentPage === 1 ? 'true' : null"
            [disabled]="currentPage === 1"
            type="button"
            (click)="goToPage(currentPage - 1)">
            {{ previousLabel }}
          </button>
        </li>
        @for (page of visiblePages; track page) {
          <li>
            @if (page === '...') {
              <span class="af-pagination__ellipsis">…</span>
            } @else {
              <button
                class="af-pagination__link"
                [attr.aria-current]="currentPage === page ? 'page' : null"
                type="button"
                (click)="goToPage(page)">
                {{ page }}
              </button>
            }
          </li>
        }
        <li>
          <button
            class="af-pagination__link"
            [attr.aria-disabled]="currentPage === totalPages ? 'true' : null"
            [disabled]="currentPage === totalPages"
            type="button"
            (click)="goToPage(currentPage + 1)">
            {{ nextLabel }}
          </button>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AfPaginationComponent {
  /** Current page number (1-indexed) */
  @Input() currentPage = 1;

  /** Total number of pages */
  @Input() totalPages = 1;

  /** Label for previous button */
  @Input() previousLabel = 'Prev';

  /** Label for next button */
  @Input() nextLabel = 'Next';

  /** Maximum number of page buttons to show */
  @Input() maxVisiblePages = 7;

  /** Page change event */
  @Output() pageChange = new EventEmitter<number>();

  get visiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const halfMax = Math.floor(this.maxVisiblePages / 2);

    let start = Math.max(1, this.currentPage - halfMax);
    let end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);

    if (end - start < this.maxVisiblePages - 1) {
      start = Math.max(1, end - this.maxVisiblePages + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < this.totalPages) {
      if (end < this.totalPages - 1) pages.push('...');
      pages.push(this.totalPages);
    }

    return pages;
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
