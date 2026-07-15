import { expect, within, userEvent } from 'storybook/test';

const renderStatus = ({
  status,
  label,
  detail = '',
  live = false,
  state = '',
} = {}) => `
  <span class="ct-status"
    data-status="${status}"
    ${state ? `data-state="${state}"` : ''}
    ${status === 'connecting' || state === 'loading' ? 'aria-busy="true"' : ''}
    ${live ? 'role="status" aria-live="polite" aria-atomic="true"' : ''}>
    <span class="ct-status__indicator" aria-hidden="true"></span>
    <span class="ct-status__label">${label}</span>
    ${detail ? `<span class="ct-status__detail">${detail}</span>` : ''}
  </span>`;

export default {
  title: 'Components/Feedback/Live Status',
  parameters: {
    docs: {
      description: {
        component:
          'Generic status and connection indicator. Status is always communicated with visible text; the dot is decorative. Add `role="status"`, `aria-live="polite"`, and `aria-atomic="true"` only to a region whose text changes dynamically.',
      },
    },
  },
};

export const ConnectionStates = {
  render: () => `
    <div class="ct-stack" style="--ct-stack-space: var(--space-4);">
      ${renderStatus({ status: 'online', label: 'Online', detail: 'Updated now' })}
      ${renderStatus({ status: 'connecting', label: 'Connecting', detail: 'Retrying' })}
      ${renderStatus({ status: 'degraded', label: 'Degraded', detail: 'High latency' })}
      ${renderStatus({ status: 'offline', label: 'Offline', detail: 'Last seen 2m ago' })}
      ${renderStatus({ status: 'error', label: 'Connection failed', detail: 'Action required' })}
    </div>`,
  play: async ({ canvasElement }) => {
    const statuses = canvasElement.querySelectorAll('.ct-status');
    expect(statuses).toHaveLength(5);

    for (const status of statuses) {
      expect(status.querySelector('.ct-status__indicator')).toHaveAttribute('aria-hidden', 'true');
      expect(status.querySelector('.ct-status__label').textContent.trim().length).toBeGreaterThan(0);
    }

    expect(statuses[1]).toHaveAttribute('aria-busy', 'true');
    expect(statuses[4]).toHaveAttribute('data-status', 'error');
  },
};

export const LiveConnection = {
  render: () => `
    <div class="ct-stack" style="--ct-stack-space: var(--space-4);">
      <span class="ct-status" data-status="connecting" data-state="loading"
        aria-busy="true" role="status" aria-live="polite" aria-atomic="true">
        <span class="ct-status__indicator" aria-hidden="true"></span>
        <span class="ct-status__label">Connecting</span>
      </span>
      <button class="ct-button ct-button--secondary ct-button--sm" type="button">Simulate connection</button>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole('status');
    const button = canvas.getByRole('button', { name: 'Simulate connection' });

    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('aria-atomic', 'true');
    expect(region).toHaveAttribute('aria-busy', 'true');

    button.addEventListener('click', () => {
      region.dataset.status = 'online';
      region.dataset.state = 'ready';
      region.setAttribute('aria-busy', 'false');
      region.querySelector('.ct-status__label').textContent = 'Online';
    }, { once: true });

    await userEvent.click(button);
    expect(region).toHaveAttribute('data-status', 'online');
    expect(region).toHaveAttribute('aria-busy', 'false');
    expect(region).toHaveTextContent('Online');
  },
};

export const ThemeMatrix = {
  render: () => `
    <div class="ct-stack" style="--ct-stack-space: var(--space-4);">
      ${['light', 'dark', 'high-contrast'].map(theme => `
        <section data-theme="${theme}" style="padding: var(--space-5); background: var(--color-bg-canvas); color: var(--color-text-primary); border: var(--border-thin) solid var(--color-border-default); border-radius: var(--radius-md);">
          <h3 style="margin: 0 0 var(--space-4); font-size: var(--font-size-sm);">${theme}</h3>
          <div class="ct-cluster">
            ${renderStatus({ status: 'online', label: 'Online' })}
            ${renderStatus({ status: 'connecting', label: 'Connecting' })}
            ${renderStatus({ status: 'degraded', label: 'Degraded' })}
            ${renderStatus({ status: 'error', label: 'Error' })}
          </div>
        </section>`).join('')}
    </div>`,
  play: async ({ canvasElement }) => {
    const themedSections = canvasElement.querySelectorAll('[data-theme]');
    expect(themedSections).toHaveLength(3);

    for (const section of themedSections) {
      const statuses = section.querySelectorAll('.ct-status');
      expect(statuses).toHaveLength(4);
      for (const status of statuses) {
        expect(getComputedStyle(status).color).not.toBe('rgba(0, 0, 0, 0)');
      }
    }
  },
};
