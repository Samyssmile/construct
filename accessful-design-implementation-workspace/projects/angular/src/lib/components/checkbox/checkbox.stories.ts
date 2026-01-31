import { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { AfCheckboxComponent } from './checkbox.component';

const meta: Meta<AfCheckboxComponent> = {
  title: 'Angular/Checkbox',
  component: AfCheckboxComponent,
  args: {
    disabled: false,
    checked: false
  },
  render: (args) => ({
    props: args,
    imports: [FormsModule, AfCheckboxComponent],
    template: `
      <af-checkbox [disabled]="disabled" [(ngModel)]="checked">
        Remember me
      </af-checkbox>
    `
  })
};

export default meta;

export const Default: StoryObj<AfCheckboxComponent> = {};
