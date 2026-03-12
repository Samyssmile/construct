export default {
  title: 'Forms/Selection Controls'
};

export const Checkbox = () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-3);">
    <label class="ct-check">
      <input class="ct-check__input" type="checkbox" checked />
      <span class="ct-check__label">Remember me</span>
    </label>
    <label class="ct-check">
      <input class="ct-check__input" type="checkbox" />
      <span class="ct-check__label">Send weekly reports</span>
    </label>
    <label class="ct-check">
      <input class="ct-check__input" type="checkbox" disabled />
      <span class="ct-check__label">Disabled</span>
    </label>
  </div>
`;

export const Radio = () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-3);">
    <label class="ct-radio">
      <input class="ct-radio__input" type="radio" name="plan" checked />
      <span class="ct-radio__label">Standard</span>
    </label>
    <label class="ct-radio">
      <input class="ct-radio__input" type="radio" name="plan" />
      <span class="ct-radio__label">Premium</span>
    </label>
  </div>
`;

export const Switch = () => `
  <div class="ct-stack" style="--ct-stack-space: var(--space-3);">
    <label class="ct-switch">
      <input class="ct-switch__input" type="checkbox" role="switch" checked />
      <span class="ct-switch__label">Auto renew</span>
    </label>
    <label class="ct-switch">
      <input class="ct-switch__input" type="checkbox" role="switch" />
      <span class="ct-switch__label">Weekly summary</span>
    </label>
  </div>
`;
