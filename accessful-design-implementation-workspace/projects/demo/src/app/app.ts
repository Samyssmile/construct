import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import {
  // Form Components
  AfButtonComponent,
  AfInputComponent,
  AfSelectComponent, AfSelectOption,
  AfTextareaComponent,
  AfCheckboxComponent,
  AfRadioComponent,
  AfSwitchComponent,
  // Layout Components
  AfCardComponent,
  AfDataTableComponent, AfColumn,
  // Overlay Components
  AfModalComponent,
  AfToastContainerComponent, AfToastService,
  // Navigation Components
  AfTabsComponent, AfTabPanelComponent,
  AfDropdownComponent, AfDropdownItem,
  AfPaginationComponent,
  AfBreadcrumbsComponent, AfBreadcrumb,
  // Date Components
  AfDatepickerComponent
} from '@accessful/angular';

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  owner: string;
  tasks: number;
  updated: string;
}

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    JsonPipe,
    AfButtonComponent,
    AfInputComponent,
    AfSelectComponent,
    AfTextareaComponent,
    AfCheckboxComponent,
    AfRadioComponent,
    AfSwitchComponent,
    AfCardComponent,
    AfDataTableComponent,
    AfModalComponent,
    AfToastContainerComponent,
    AfTabsComponent,
    AfTabPanelComponent,
    AfDropdownComponent,
    AfPaginationComponent,
    AfBreadcrumbsComponent,
    AfDatepickerComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Accessful Design System - Angular Components');

  // Form state
  protected email = signal('');
  protected name = signal('');
  protected role = signal('');
  protected notes = signal('');
  protected rememberMe = signal(false);
  protected selectedPlan = signal('standard');
  protected autoRenew = signal(true);
  protected selectedDate = signal<Date | null>(null);

  // Select options
  protected roleOptions: AfSelectOption[] = [
    { value: 'designer', label: 'Designer' },
    { value: 'engineer', label: 'Engineer' },
    { value: 'manager', label: 'Manager' }
  ];

  // DataTable
  protected readonly projects = signal<Project[]>([
    { id: 1, name: 'Alpha', description: 'Enterprise rollout', status: 'Active', owner: 'J. Chen', tasks: 128, updated: 'Jan 24, 2026' },
    { id: 2, name: 'Beta', description: 'Onboarding flow', status: 'Paused', owner: 'L. Hart', tasks: 64, updated: 'Jan 18, 2026' },
    { id: 3, name: 'Gamma', description: 'Mobile rework', status: 'Active', owner: 'S. Rivera', tasks: 92, updated: 'Jan 10, 2026' }
  ]);

  protected readonly columns = signal<AfColumn[]>([
    { key: 'name', header: 'Project' },
    { key: 'status', header: 'Status' },
    { key: 'owner', header: 'Owner' }
  ]);

  // Modal
  protected isModalOpen = signal(false);

  protected activeTab = 'overview';

  // Dropdown
  protected dropdownItems: AfDropdownItem[] = [
    { label: 'Edit', value: 'edit' },
    { label: 'Duplicate', value: 'duplicate' },
    { separator: true, label: '', value: null },
    { label: 'Archive', value: 'archive' }
  ];

  // Pagination
  protected currentPage = signal(1);
  protected totalPages = 5;

  // Breadcrumbs
  protected breadcrumbs: AfBreadcrumb[] = [
    { label: 'Home', url: '#' },
    { label: 'Components', url: '#' },
    { label: 'Demo' }
  ];

  constructor(protected toastService: AfToastService) {}

  // Event handlers
  protected onRowClick(row: Project): void {
    this.toastService.info('Row clicked', row.name);
  }

  protected onSelectionChange(selected: Project[]): void {
    console.log('Selection changed:', selected);
  }

  protected showToast(): void {
    this.toastService.success('Success', 'Your changes were saved.');
  }

  protected handleDropdownAction(action: string): void {
    this.toastService.info('Action', `You clicked: ${action}`);
  }

  protected onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
