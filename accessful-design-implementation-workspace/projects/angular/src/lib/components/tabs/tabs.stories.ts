import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { AfTabsComponent, AfTabPanelComponent } from './tabs.component';

@Component({
  selector: 'af-tabs-story',
  standalone: true,
  imports: [AfTabsComponent, AfTabPanelComponent],
  template: `
    <af-tabs [(activeTab)]="activeTab">
      <af-tab-panel id="overview" label="Overview">
        <p class="af-muted">Overview content</p>
      </af-tab-panel>
      <af-tab-panel id="settings" label="Settings">
        <p class="af-muted">Settings content</p>
      </af-tab-panel>
      <af-tab-panel id="members" label="Members">
        <p class="af-muted">Members content</p>
      </af-tab-panel>
    </af-tabs>
  `
})
class TabsStoryComponent {
  activeTab = 'overview';
}

const meta: Meta<AfTabsComponent> = {
  title: 'Angular/Tabs',
  component: AfTabsComponent,
  render: () => ({
    component: TabsStoryComponent
  })
};

export default meta;

export const Default: StoryObj<AfTabsComponent> = {};
