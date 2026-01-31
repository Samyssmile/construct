import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AfColumn {
  key: string;
  header: string;
  sortable?: boolean;
}

export interface AfDataTableConfig {
  striped?: boolean;
  compact?: boolean;
}

export type AfSortDirection = 'asc' | 'desc';

export interface AfSortState {
  key: string;
  direction: AfSortDirection;
}

@Component({
  selector: 'af-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class AfDataTableComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() columns: AfColumn[] = [];
  @Input() config: AfDataTableConfig = { striped: true, compact: true };

  /** Sort state (controlled). */
  @Input() sort: AfSortState | null = null;

  /** Row id key or accessor for stable selection. */
  @Input() rowId: string | ((row: any) => string | number) | null = null;

  @Output() rowClick = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();

  /** Sort change event. */
  @Output() sortChange = new EventEmitter<AfSortState | null>();

  private selectedRowIds: Set<any> = new Set();
  private internalSort: AfSortState | null = null;
  allSelected = false;

  get tableClasses(): string {
    const classes = ['af-table'];
    if (this.config.striped) classes.push('af-table--striped');
    if (this.config.compact) classes.push('af-table--compact');
    return classes.join(' ');
  }

  get sortedData(): any[] {
    const sort = this.activeSort;
    if (!sort) return [...this.data];
    if (!this.columns.some(column => column.key === sort.key)) return [...this.data];
    const sorted = [...this.data];
    sorted.sort((a, b) => this.compareValues(a?.[sort.key], b?.[sort.key], sort.direction));
    return sorted;
  }

  get activeSort(): AfSortState | null {
    return this.sort ?? this.internalSort;
  }

  getAriaSort(column: AfColumn): string | null {
    if (!column.sortable) return null;
    const sort = this.activeSort;
    if (!sort || sort.key !== column.key) return 'none';
    return sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  toggleSort(column: AfColumn): void {
    if (!column.sortable) return;
    const current = this.activeSort;
    let next: AfSortState | null;

    if (!current || current.key !== column.key) {
      next = { key: column.key, direction: 'asc' };
    } else if (current.direction === 'asc') {
      next = { key: column.key, direction: 'desc' };
    } else {
      next = null;
    }

    if (this.sort) {
      this.sortChange.emit(next);
    } else {
      this.internalSort = next;
      this.sortChange.emit(next);
    }
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  toggleSelection(row: any, event: Event): void {
    event.stopPropagation();
    const rowId = this.getRowId(row);
    if (this.selectedRowIds.has(rowId)) {
      this.selectedRowIds.delete(rowId);
    } else {
      this.selectedRowIds.add(rowId);
    }
    this.updateAllSelected();
    this.selectionChange.emit(this.getSelectedRows());
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.data.forEach(row => this.selectedRowIds.add(this.getRowId(row)));
    } else {
      this.selectedRowIds.clear();
    }
    this.allSelected = checked;
    this.selectionChange.emit(this.getSelectedRows());
  }

  isSelected(row: any): boolean {
    return this.selectedRowIds.has(this.getRowId(row));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rowId']) {
      this.selectedRowIds.clear();
    }
    if (changes['data'] || changes['rowId']) {
      this.syncSelectionWithData();
      this.updateAllSelected();
    }
  }

  private updateAllSelected(): void {
    this.allSelected = this.data.length > 0 && this.data.every(row => this.selectedRowIds.has(this.getRowId(row)));
  }

  private getRowId(row: any): any {
    if (typeof this.rowId === 'function') {
      return this.rowId(row);
    }
    if (typeof this.rowId === 'string' && row && row[this.rowId] !== undefined) {
      return row[this.rowId];
    }
    return row;
  }

  private getSelectedRows(): any[] {
    return this.data.filter(row => this.selectedRowIds.has(this.getRowId(row)));
  }

  private syncSelectionWithData(): void {
    if (!this.rowId) {
      this.selectedRowIds.clear();
      return;
    }
    const validIds = new Set(this.data.map(row => this.getRowId(row)));
    this.selectedRowIds.forEach(id => {
      if (!validIds.has(id)) {
        this.selectedRowIds.delete(id);
      }
    });
  }

  private compareValues(a: any, b: any, direction: AfSortDirection): number {
    const sortFactor = direction === 'asc' ? 1 : -1;
    if (a == null && b == null) return 0;
    if (a == null) return 1 * sortFactor;
    if (b == null) return -1 * sortFactor;

    if (typeof a === 'number' && typeof b === 'number') {
      return (a - b) * sortFactor;
    }
    if (a instanceof Date && b instanceof Date) {
      return (a.getTime() - b.getTime()) * sortFactor;
    }

    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' }) * sortFactor;
  }
}
