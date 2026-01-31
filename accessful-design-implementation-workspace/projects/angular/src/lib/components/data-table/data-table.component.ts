import { Component, Input, Output, EventEmitter } from '@angular/core';
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

@Component({
  selector: 'af-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class AfDataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: AfColumn[] = [];
  @Input() config: AfDataTableConfig = { striped: true, compact: true };

  @Output() rowClick = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();

  selectedRows: Set<any> = new Set();
  allSelected = false;

  get tableClasses(): string {
    const classes = ['af-table'];
    if (this.config.striped) classes.push('af-table--striped');
    if (this.config.compact) classes.push('af-table--compact');
    return classes.join(' ');
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  toggleSelection(row: any, event: Event): void {
    event.stopPropagation();
    if (this.selectedRows.has(row)) {
      this.selectedRows.delete(row);
    } else {
      this.selectedRows.add(row);
    }
    this.updateAllSelected();
    this.selectionChange.emit([...this.selectedRows]);
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.data.forEach(row => this.selectedRows.add(row));
    } else {
      this.selectedRows.clear();
    }
    this.allSelected = checked;
    this.selectionChange.emit([...this.selectedRows]);
  }

  isSelected(row: any): boolean {
    return this.selectedRows.has(row);
  }

  private updateAllSelected(): void {
    this.allSelected = this.data.length > 0 && this.data.every(row => this.selectedRows.has(row));
  }
}
