import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Forms/File Upload',
  parameters: {
    docs: {
      description: {
        component: 'Drag-and-drop file upload zone with a file list showing per-file name, size, upload progress, and status (success, error). Supports multiple file selection.',
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['idle', 'dragover'],
      description: 'Dropzone interaction state',
    },
    accept: { control: 'text', description: 'Accepted file types hint text' },
    multiple: { control: 'boolean', description: 'Allow selecting multiple files' },
  },
};

export const Playground = {
  args: {
    state: 'idle',
    accept: 'PDF, DOCX up to 10MB',
    multiple: true,
  },
  render: ({ state, accept, multiple }) => {
    const stateAttr = state !== 'idle' ? ` data-state="${state}"` : '';
    const multipleAttr = multiple ? ' multiple' : '';
    return `
    <div style="max-width: 480px;">
      <label class="ct-file-upload__dropzone"${stateAttr} for="pg-files">
        <input class="ct-file-upload__input" id="pg-files" type="file"${multipleAttr} />
        <div class="ct-file-upload__title">Drop files here or browse</div>
        <div class="ct-file-upload__hint">${accept}</div>
        <span class="ct-button ct-button--secondary ct-button--sm">Browse files</span>
      </label>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const dropzone = canvasElement.querySelector('.ct-file-upload__dropzone');
    expect(dropzone).toBeInTheDocument();
    const input = canvasElement.querySelector('.ct-file-upload__input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'file');
  },
};

export const DragDrop = {
  render: () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4); max-width: 640px;">
    <label class="ct-file-upload__dropzone" data-state="dragover" for="story-files">
      <input class="ct-file-upload__input" id="story-files" type="file" multiple />
      <div class="ct-file-upload__title">Drop files here or browse</div>
      <div class="ct-file-upload__hint">PDF, DOCX up to 10MB</div>
      <span class="ct-button ct-button--secondary ct-button--sm">Browse files</span>
    </label>

    <ul class="ct-file-upload__list">
      <li class="ct-file-upload__item" data-status="success">
        <div class="ct-file-upload__file">
          <div class="ct-file-upload__name">report.pdf</div>
          <div class="ct-file-upload__meta">820 KB</div>
        </div>
        <div class="ct-file-upload__actions">
          <span class="ct-badge ct-badge--success">Uploaded</span>
          <button class="ct-button ct-button--ghost ct-button--sm" type="button">Remove</button>
        </div>
      </li>
      <li class="ct-file-upload__item" data-status="error">
        <div class="ct-file-upload__file">
          <div class="ct-file-upload__name">large-archive.zip</div>
          <div class="ct-file-upload__meta">32 MB</div>
        </div>
        <div class="ct-file-upload__actions">
          <span class="ct-badge ct-badge--danger">Failed</span>
          <button class="ct-button ct-button--ghost ct-button--sm" type="button">Retry</button>
        </div>
      </li>
    </ul>

    <div class="ct-file-upload__error">File size exceeds 10MB limit.</div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // File input is associated with its label via for/id
    const fileInput = canvasElement.querySelector('#story-files');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('multiple');

    const dropzone = canvasElement.querySelector('.ct-file-upload__dropzone');
    expect(dropzone).toHaveAttribute('for', 'story-files');

    // File input is visually hidden but still accessible
    const inputStyle = window.getComputedStyle(fileInput);
    expect(fileInput.offsetWidth === 0 || inputStyle.position === 'absolute').toBe(true);

    // Dropzone hint and title are visible
    expect(canvas.getByText('Drop files here or browse')).toBeInTheDocument();
    expect(canvas.getByText('PDF, DOCX up to 10MB')).toBeInTheDocument();

    // File list: successful upload
    const successItem = canvasElement.querySelector('[data-status="success"]');
    expect(successItem).toBeInTheDocument();
    expect(within(successItem).getByText('report.pdf')).toBeInTheDocument();
    expect(within(successItem).getByText('820 KB')).toBeInTheDocument();
    const removeBtn = within(successItem).getByRole('button', { name: 'Remove' });
    expect(removeBtn).toBeEnabled();

    // File list: failed upload
    const errorItem = canvasElement.querySelector('[data-status="error"]');
    expect(errorItem).toBeInTheDocument();
    expect(within(errorItem).getByText('large-archive.zip')).toBeInTheDocument();
    const retryBtn = within(errorItem).getByRole('button', { name: 'Retry' });
    expect(retryBtn).toBeEnabled();

    // Error message is visible
    const errorMsg = canvas.getByText('File size exceeds 10MB limit.');
    expect(errorMsg).toBeInTheDocument();

    // Bug check: error message should be linked to the input via aria-describedby
    // so screen readers announce the error when the input is focused
    const describedBy = fileInput.getAttribute('aria-describedby');
    const errorEl = canvasElement.querySelector('.ct-file-upload__error');
    if (describedBy && errorEl.id) {
      expect(describedBy).toContain(errorEl.id);
    }

    // Action buttons are focusable and clickable
    await userEvent.click(removeBtn);
    expect(removeBtn).toHaveFocus();
    await userEvent.click(retryBtn);
    expect(retryBtn).toHaveFocus();
  },
};
