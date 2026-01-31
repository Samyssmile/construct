import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { AfModalComponent } from './modal.component';
import { AfButtonComponent } from '../button/button.component';

@Component({
  selector: 'af-modal-story',
  standalone: true,
  imports: [AfModalComponent, AfButtonComponent],
  template: `
    <af-button (clicked)="open = true">Open modal</af-button>
    <af-modal [open]="open" title="Confirm action" (closed)="open = false">
      <div body>
        <p>Are you sure you want to continue?</p>
      </div>
      <div footer>
        <af-button variant="secondary" (clicked)="open = false">Cancel</af-button>
        <af-button (clicked)="open = false">Confirm</af-button>
      </div>
    </af-modal>
  `
})
class ModalStoryComponent {
  open = true;
}

const meta: Meta<AfModalComponent> = {
  title: 'Angular/Modal',
  component: AfModalComponent,
  render: () => ({
    component: ModalStoryComponent
  })
};

export default meta;

export const Default: StoryObj<AfModalComponent> = {};
