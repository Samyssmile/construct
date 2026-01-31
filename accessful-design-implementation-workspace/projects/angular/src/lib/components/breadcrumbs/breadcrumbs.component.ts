import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AfBreadcrumb {
  label: string;
  url?: string;
}

/**
 * Breadcrumbs navigation component
 *
 * @example
 * <af-breadcrumbs [items]="breadcrumbs"></af-breadcrumbs>
 */
@Component({
  selector: 'af-breadcrumbs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="af-breadcrumbs" aria-label="Breadcrumb">
      <ol class="af-breadcrumbs__list">
        @for (item of items; track $index; let isLast = $last) {
          <li class="af-breadcrumbs__item">
            @if (!isLast && item.url) {
              <a class="af-breadcrumbs__link" [href]="item.url">
                {{ item.label }}
              </a>
              <span class="af-breadcrumbs__separator">/</span>
            } @else {
              <span class="af-breadcrumbs__current">{{ item.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AfBreadcrumbsComponent {
  /** Breadcrumb items */
  @Input() items: AfBreadcrumb[] = [];
}
