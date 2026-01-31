export default {
  title: 'Components/Button'
};

export const Variants = () => `
  <div class="af-stack" style="--af-stack-space: var(--space-4);">
    <div class="af-cluster">
      <button class="af-button">Primary</button>
      <button class="af-button af-button--secondary">Secondary</button>
      <button class="af-button af-button--outline">Outline</button>
      <button class="af-button af-button--ghost">Ghost</button>
      <button class="af-button af-button--accent">Accent</button>
      <button class="af-button af-button--danger">Danger</button>
      <button class="af-button af-button--link">Link</button>
    </div>
    <div class="af-cluster">
      <button class="af-button af-button--sm">Small</button>
      <button class="af-button">Medium</button>
      <button class="af-button af-button--lg">Large</button>
      <button class="af-button" disabled>Disabled</button>
    </div>
  </div>
`;

export const WithIcons = () => `
  <div class="af-cluster">
    <button class="af-button">
      <span class="af-button__icon" aria-hidden="true">+</span>
      Add item
    </button>
    <button class="af-button af-button--secondary">
      <span class="af-button__icon" aria-hidden="true">?</span>
      Help
    </button>
    <button class="af-button af-button--icon" aria-label="Settings">
      <span class="af-button__icon" aria-hidden="true">*</span>
    </button>
  </div>
`;
