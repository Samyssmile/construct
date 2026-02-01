export default {
  title: 'Components/File Upload'
};

export const DragDrop = () => `
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
`;
