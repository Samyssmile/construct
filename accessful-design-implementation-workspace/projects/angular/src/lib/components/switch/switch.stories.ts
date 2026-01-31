import { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { AfSwitchComponent } from './switch.component';

const meta: Meta<AfSwitchComponent> = {
  title: 'Angular/Switch',
  component: AfSwitchComponent,
  args: {
    disabled: false,
    checked: true
  },
  render: (args) => ({
    props: args,
    imports: [FormsModule, AfSwitchComponent],
    template: `
      <af-switch [disabled]="disabled" [(ngModel)]="checked">
        Auto renew
      </af-switch>
    `
  })
};

export default meta;

export const Default: StoryObj<AfSwitchComponent> = {};
