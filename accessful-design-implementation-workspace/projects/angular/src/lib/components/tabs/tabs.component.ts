import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit, ViewChildren, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AfTab {
  id: string;
  label: string;
  disabled?: boolean;
}

/**
 * Tab panel component (used within af-tabs)
 */
@Component({
  selector: 'af-tab-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isActive"
      class="af-tabs__panel"
      role="tabpanel"
      [attr.id]="'panel-' + id"
      [attr.aria-labelledby]="'tab-' + id">
      <ng-content></ng-content>
    </div>
  `
})
export class AfTabPanelComponent {
  private static nextId = 0;

  @Input() id = '';
  @Input() label = '';
  @Input() isActive = false;
  @Input() disabled = false;

  ensureId(): string {
    if (!this.id) {
      this.id = `af-tab-${AfTabPanelComponent.nextId++}`;
    }
    return this.id;
  }
}

/**
 * Tabs component for organizing content into panels
 *
 * @example
 * <af-tabs [(activeTab)]="activeTab">
 *   <af-tab-panel id="overview" label="Overview">
 *     <p>Overview content</p>
 *   </af-tab-panel>
 *   <af-tab-panel id="settings" label="Settings">
 *     <p>Settings content</p>
 *   </af-tab-panel>
 * </af-tabs>
 */
@Component({
  selector: 'af-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="af-tabs">
      <div class="af-tabs__list" role="tablist">
        @for (tab of tabs; track tab.id) {
          <button
            #tabButton
            class="af-tabs__trigger"
            role="tab"
            [attr.aria-selected]="activeTab === tab.id"
            [attr.aria-controls]="'panel-' + tab.id"
            [attr.id]="'tab-' + tab.id"
            [attr.tabindex]="activeTab === tab.id ? 0 : -1"
            [disabled]="tab.disabled"
            [attr.data-tab-id]="tab.id"
            type="button"
            (click)="selectTab(tab.id)"
            (keydown)="onKeydown($event, tab.id)">
            {{ tab.label }}
          </button>
        }
      </div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AfTabsComponent implements AfterContentInit, OnChanges {
  /** Array of tabs (generated from projected tab panels) */
  tabs: AfTab[] = [];

  /** Currently active tab ID */
  @Input() activeTab = '';

  /** Active tab change event */
  @Output() activeTabChange = new EventEmitter<string>();

  @ContentChildren(AfTabPanelComponent) panels!: QueryList<AfTabPanelComponent>;
  @ViewChildren('tabButton') tabButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  ngAfterContentInit(): void {
    this.syncTabsFromPanels();
    this.panels.changes.subscribe(() => this.syncTabsFromPanels());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeTab'] && this.panels) {
      this.syncActivePanel();
    }
  }

  selectTab(id: string): void {
    if (this.activeTab !== id) {
      this.activeTab = id;
      this.activeTabChange.emit(id);
      this.syncActivePanel();
    }
  }

  onKeydown(event: KeyboardEvent, currentId: string): void {
    const enabledTabs = this.tabs.filter(tab => !tab.disabled);
    if (enabledTabs.length === 0) return;

    const currentIndex = enabledTabs.findIndex(tab => tab.id === currentId);
    const lastIndex = enabledTabs.length - 1;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown': {
        event.preventDefault();
        const next = enabledTabs[(currentIndex + 1) % enabledTabs.length];
        this.focusTab(next.id);
        break;
      }
      case 'ArrowLeft':
      case 'ArrowUp': {
        event.preventDefault();
        const prev = enabledTabs[(currentIndex - 1 + enabledTabs.length) % enabledTabs.length];
        this.focusTab(prev.id);
        break;
      }
      case 'Home': {
        event.preventDefault();
        this.focusTab(enabledTabs[0].id);
        break;
      }
      case 'End': {
        event.preventDefault();
        this.focusTab(enabledTabs[lastIndex].id);
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        this.selectTab(currentId);
        break;
      }
      default:
        break;
    }
  }

  private syncTabsFromPanels(): void {
    const panels = this.panels.toArray();
    this.tabs = panels.map(panel => ({
      id: panel.ensureId(),
      label: panel.label || panel.id,
      disabled: panel.disabled
    }));

    if (!this.activeTab || !this.tabs.some(tab => tab.id === this.activeTab && !tab.disabled)) {
      const firstEnabled = this.tabs.find(tab => !tab.disabled);
      if (firstEnabled) {
        this.activeTab = firstEnabled.id;
        this.activeTabChange.emit(firstEnabled.id);
      }
    }

    this.syncActivePanel();
  }

  private syncActivePanel(): void {
    if (!this.panels) return;
    this.panels.forEach(panel => {
      panel.isActive = panel.id === this.activeTab;
    });
  }

  private focusTab(id: string): void {
    const button = this.tabButtons?.find(ref => ref.nativeElement.dataset['tabId'] === id);
    button?.nativeElement.focus();
  }
}
