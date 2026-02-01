export default {
  title: 'Components/Button'
};

export const Variants = () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-4);">
    <div class="ct-cluster">
      <button class="ct-button">Primary</button>
      <button class="ct-button ct-button--secondary">Secondary</button>
      <button class="ct-button ct-button--outline">Outline</button>
      <button class="ct-button ct-button--ghost">Ghost</button>
      <button class="ct-button ct-button--accent">Accent</button>
      <button class="ct-button ct-button--danger">Danger</button>
      <button class="ct-button ct-button--link">Link</button>
    </div>
    <div class="ct-cluster">
      <button class="ct-button ct-button--sm">Small</button>
      <button class="ct-button">Medium</button>
      <button class="ct-button ct-button--lg">Large</button>
      <button class="ct-button" disabled>Disabled</button>
    </div>
  </div>
`;

export const WithIcons = () => `
  <div class="ct-cluster">
    <button class="ct-button">
      <span class="ct-button__icon" aria-hidden="true">+</span>
      Add item
    </button>
    <button class="ct-button ct-button--secondary">
      <span class="ct-button__icon" aria-hidden="true">?</span>
      Help
    </button>
    <button class="ct-button ct-button--icon" aria-label="Settings">
      <span class="ct-button__icon" aria-hidden="true">*</span>
    </button>
  </div>
`;
