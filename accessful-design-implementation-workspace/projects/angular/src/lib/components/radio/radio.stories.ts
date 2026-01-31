import { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { AfRadioComponent } from './radio.component';

const meta: Meta<AfRadioComponent> = {
  title: 'Angular/Radio',
  component: AfRadioComponent,
  args: {
    value: 'standard',
    name: 'plan',
    model: 'standard',
    disabled: false
  },
  render: (args) => ({
    props: args,
    imports: [FormsModule, AfRadioComponent],
    template: `
      <div class="af-stack" style="--af-stack-space: var(--space-3);">
        <af-radio [name]="name" [value]="'standard'" [disabled]="disabled" [(ngModel)]="model">
          Standard
        </af-radio>
        <af-radio [name]="name" [value]="'premium'" [disabled]="disabled" [(ngModel)]="model">
          Premium
        </af-radio>
      </div>
    `
  })
};

export default meta;

export const Default: StoryObj<AfRadioComponent> = {};
