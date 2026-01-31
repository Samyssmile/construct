import { Meta, StoryObj } from '@storybook/angular';
import { AfCardComponent } from './card.component';
import { AfButtonComponent } from '../button/button.component';

const meta: Meta<AfCardComponent> = {
  title: 'Angular/Card',
  component: AfCardComponent,
  args: {
    interactive: false
  },
  render: (args) => ({
    props: args,
    imports: [AfCardComponent, AfButtonComponent],
    template: `
      <af-card [interactive]="interactive">
        <div header>
          <h3>Team</h3>
          <af-button variant="ghost" size="sm">Edit</af-button>
        </div>
        <div body>
          <p>Shared ownership and clear permissions.</p>
          <p class="af-muted">Updated 2 days ago</p>
        </div>
        <div footer>
          <span class="af-muted">12 members</span>
          <af-button variant="secondary" size="sm">Open</af-button>
        </div>
      </af-card>
    `
  })
};

export default meta;

export const Default: StoryObj<AfCardComponent> = {};
