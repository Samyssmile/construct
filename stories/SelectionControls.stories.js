export default {
  title: 'Components/Selection Controls'
};

export const Checkbox = () => `
  <div class="af-stack" style="--af-stack-space: var(--space-3);">
    <label class="af-check">
      <input class="af-check__input" type="checkbox" checked />
      <span class="af-check__label">Remember me</span>
    </label>
    <label class="af-check">
      <input class="af-check__input" type="checkbox" />
      <span class="af-check__label">Send weekly reports</span>
    </label>
    <label class="af-check">
      <input class="af-check__input" type="checkbox" disabled />
      <span class="af-check__label">Disabled</span>
    </label>
  </div>
`;

export const Radio = () => `
  <div class="af-stack" style="--af-stack-space: var(--space-3);">
    <label class="af-radio">
      <input class="af-radio__input" type="radio" name="plan" checked />
      <span class="af-radio__label">Standard</span>
    </label>
    <label class="af-radio">
      <input class="af-radio__input" type="radio" name="plan" />
      <span class="af-radio__label">Premium</span>
    </label>
  </div>
`;

export const Switch = () => `
  <div class="af-stack" style="--af-stack-space: var(--space-3);">
    <label class="af-switch">
      <input class="af-switch__input" type="checkbox" role="switch" checked />
      <span class="af-switch__label">Auto renew</span>
    </label>
    <label class="af-switch">
      <input class="af-switch__input" type="checkbox" role="switch" />
      <span class="af-switch__label">Weekly summary</span>
    </label>
  </div>
`;
