import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Forms/Datepicker',
  parameters: {
    docs: {
      description: {
        component: 'Calendar date picker with popover panel, month/year navigation, range selection, unavailable days, and keyboard-accessible date grid. Uses `role="dialog"`, `role="grid"`, and `aria-label` for screen reader support. Supports day, month, and year grid views.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Field label' },
    placeholder: { control: 'text', description: 'Input placeholder text' },
    disabled: { control: 'boolean', description: 'Disable the date input' },
  },
};

export const Playground = {
  args: {
    label: 'Date',
    placeholder: 'Select date',
    disabled: false,
  },
  render: ({ label, placeholder, disabled }) => {
    const disabledAttr = disabled ? ' disabled' : '';
    const inputId = 'pg-datepicker';
    return `
    <div class="ct-field">
      <label class="ct-field__label" for="${inputId}">${label}</label>
      <div class="ct-datepicker" data-state="closed">
        <input class="ct-input" id="${inputId}" type="text" placeholder="${placeholder}"${disabledAttr} />
      </div>
    </div>`;
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('.ct-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  },
};

function initDatepickerKeyboard(canvasElement) {
  const datepicker = canvasElement.querySelector('.ct-datepicker');
  if (!datepicker) return;
  const trigger = datepicker.querySelector('.ct-input');
  const popover = datepicker.querySelector('.ct-datepicker__popover');
  const grid = datepicker.querySelector('[role="grid"]');
  if (!grid || !popover) return;

  function getDays() {
    return Array.from(grid.querySelectorAll('.ct-datepicker__day:not(:disabled)'));
  }

  function moveFocus(days, index) {
    days.forEach((d, i) => d.setAttribute('tabindex', i === index ? '0' : '-1'));
    days[index].focus();
  }

  function getFocusedIndex(days) {
    return days.findIndex((d) => d.tabIndex === 0);
  }

  grid.addEventListener('keydown', (e) => {
    const days = getDays();
    let idx = getFocusedIndex(days);
    if (idx === -1) idx = 0;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        moveFocus(days, Math.min(idx + 1, days.length - 1));
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moveFocus(days, Math.max(idx - 1, 0));
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveFocus(days, Math.min(idx + 7, days.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveFocus(days, Math.max(idx - 7, 0));
        break;
      case 'Home':
        e.preventDefault();
        moveFocus(days, idx - (idx % 7));
        break;
      case 'End':
        e.preventDefault();
        moveFocus(days, Math.min(idx - (idx % 7) + 6, days.length - 1));
        break;
      case 'PageUp':
        e.preventDefault();
        datepicker.querySelector('[aria-label="Previous month"]')?.click();
        break;
      case 'PageDown':
        e.preventDefault();
        datepicker.querySelector('[aria-label="Next month"]')?.click();
        break;
      case 'Escape':
        e.preventDefault();
        datepicker.removeAttribute('data-state');
        trigger?.focus();
        break;
    }
  });

  // Focus trap: confine Tab within the open popover
  popover.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(
      popover.querySelectorAll('button:not(:disabled), [tabindex="0"]')
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

export const Datepicker = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: true,
        height: 520,
      },
    },
  },
  render: () => `
  <div style="min-height: 520px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="ct-field">
      <label class="ct-field__label" for="datepicker-demo">Date</label>
      <div class="ct-datepicker" data-state="open">
        <input class="ct-input" id="datepicker-demo" type="text" placeholder="Select date" role="combobox" aria-haspopup="dialog" aria-expanded="true" aria-controls="datepicker-popover-demo" />
        <div id="datepicker-popover-demo" class="ct-datepicker__popover" role="dialog" aria-modal="true" aria-label="Choose date">
          <div class="ct-datepicker__header">
            <button class="ct-button ct-button--ghost ct-button--icon" aria-label="Previous month">Prev</button>
            <div class="ct-datepicker__title" aria-live="polite">March 2026</div>
            <button class="ct-button ct-button--ghost ct-button--icon" aria-label="Next month">Next</button>
          </div>
          <div role="grid" class="ct-datepicker__grid" aria-label="March 2026">
            <div role="row" class="ct-datepicker__row">
              <abbr role="columnheader" class="ct-datepicker__weekday" title="Monday">Mo</abbr>
              <abbr role="columnheader" class="ct-datepicker__weekday" title="Tuesday">Tu</abbr>
              <abbr role="columnheader" class="ct-datepicker__weekday" title="Wednesday">We</abbr>
              <abbr role="columnheader" class="ct-datepicker__weekday" title="Thursday">Th</abbr>
              <abbr role="columnheader" class="ct-datepicker__weekday" title="Friday">Fr</abbr>
              <abbr role="columnheader" class="ct-datepicker__weekday" title="Saturday">Sa</abbr>
              <abbr role="columnheader" class="ct-datepicker__weekday" title="Sunday">Su</abbr>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="23 February 2026">23</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="24 February 2026">24</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="25 February 2026">25</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="26 February 2026">26</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="27 February 2026">27</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="28 February 2026">28</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="1 March 2026">1</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="2 March 2026">2</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="3 March 2026">3</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="4 March 2026">4</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="5 March 2026">5</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="6 March 2026">6</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="7 March 2026">7</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="8 March 2026">8</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="9 March 2026">9</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="10 March 2026">10</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="11 March 2026">11</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="12 March 2026" data-today="true">12</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="13 March 2026">13</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="14 March 2026">14</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="15 March 2026">15</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="16 March 2026">16</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="17 March 2026">17</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="18 March 2026">18</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="19 March 2026">19</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="20 March 2026">20</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="21 March 2026">21</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="22 March 2026">22</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="23 March 2026">23</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="24 March 2026">24</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="25 March 2026">25</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="0" aria-selected="true" aria-label="26 March 2026">26</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="27 March 2026">27</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="28 March 2026">28</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="29 March 2026">29</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="30 March 2026">30</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="31 March 2026">31</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="1 April 2026">1</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="2 April 2026">2</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="3 April 2026">3</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="4 April 2026">4</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="5 April 2026">5</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    // Set up keyboard navigation and focus trap behavior
    initDatepickerKeyboard(canvasElement);

    const canvas = within(canvasElement);

    // Input has label association
    const dateInput = canvas.getByLabelText('Date');
    expect(dateInput).toHaveAttribute('placeholder', 'Select date');

    // Input uses combobox role to permit aria-expanded, and declares a dialog popup
    expect(dateInput).toHaveAttribute('role', 'combobox');
    expect(dateInput).toHaveAttribute('aria-haspopup', 'dialog');
    expect(dateInput).toHaveAttribute('aria-expanded', 'true');
    expect(dateInput).toHaveAttribute('aria-controls', 'datepicker-popover-demo');

    // Calendar dialog has aria-modal to signal focus containment
    const dialog = canvas.getByRole('dialog', { name: 'Choose date' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Navigation buttons have accessible names
    const prevBtn = canvas.getByRole('button', { name: 'Previous month' });
    const nextBtn = canvas.getByRole('button', { name: 'Next month' });
    expect(prevBtn).toBeEnabled();
    expect(nextBtn).toBeEnabled();

    // Month title is a live region (announces month changes to screen readers)
    const title = canvas.getByText('March 2026');
    expect(title.closest('[aria-live]')).not.toBeNull();

    // Grid has role="grid" with accessible label
    const grid = canvasElement.querySelector('[role="grid"]');
    expect(grid).not.toBeNull();
    expect(grid).toHaveAttribute('aria-label', 'March 2026');

    // Weekday headers use <abbr> elements with role="columnheader" and full title
    const weekdays = canvasElement.querySelectorAll('.ct-datepicker__weekday');
    expect(weekdays).toHaveLength(7);
    for (const weekday of weekdays) {
      expect(weekday.tagName.toLowerCase()).toBe('abbr');
      expect(weekday.getAttribute('role')).toBe('columnheader');
      const titleAttr = weekday.getAttribute('title');
      expect(titleAttr).toBeTruthy();
      expect(titleAttr.length).toBeGreaterThan(2);
    }

    // Rows wrap each week with role="row"
    const rows = canvasElement.querySelectorAll('[role="row"]');
    expect(rows.length).toBeGreaterThanOrEqual(7); // 1 header row + 6 week rows

    // Day buttons have role="gridcell" and full-date aria-labels
    const dayButtons = Array.from(canvasElement.querySelectorAll('.ct-datepicker__day'));
    expect(dayButtons.length).toBeGreaterThanOrEqual(35);
    for (const day of dayButtons) {
      expect(day.getAttribute('role')).toBe('gridcell');
      const label = day.getAttribute('aria-label');
      expect(label).toBeTruthy();
      expect(label).toMatch(/\d{1,2}\s\w+\s\d{4}/);
    }

    // Today is clearly marked
    const todayBtn = canvasElement.querySelector('[data-today="true"]');
    expect(todayBtn).toHaveTextContent('12');
    expect(todayBtn).toHaveAttribute('aria-label', '12 March 2026');

    // Selected day uses aria-selected (semantically correct for gridcell), not aria-pressed
    const selectedBtn = canvasElement.querySelector('[aria-selected="true"]');
    expect(selectedBtn).not.toBeNull();
    expect(selectedBtn).toHaveTextContent('26');
    expect(selectedBtn).toHaveAttribute('aria-label', '26 March 2026');

    // Roving tabindex: exactly one day has tabindex="0" (the selected day)
    const tabbableDays = canvasElement.querySelectorAll('.ct-datepicker__day[tabindex="0"]');
    expect(tabbableDays).toHaveLength(1);
    expect(tabbableDays[0]).toBe(selectedBtn);

    // Outside-month days are marked and have correct month in label
    const outsideDays = canvasElement.querySelectorAll('[data-outside="true"]');
    expect(outsideDays.length).toBeGreaterThan(0);
    expect(outsideDays[0].getAttribute('aria-label')).toMatch(/February|April/);

    // --- Keyboard navigation ---
    const selectedIndex = dayButtons.indexOf(selectedBtn);

    // ArrowRight moves focus to next day
    selectedBtn.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(dayButtons[selectedIndex + 1]).toHaveFocus();

    // ArrowLeft moves focus back
    await userEvent.keyboard('{ArrowLeft}');
    expect(selectedBtn).toHaveFocus();

    // ArrowDown moves focus one week forward (7 days)
    await userEvent.keyboard('{ArrowDown}');
    expect(dayButtons[selectedIndex + 7]).toHaveFocus();

    // ArrowUp moves focus one week back
    await userEvent.keyboard('{ArrowUp}');
    expect(selectedBtn).toHaveFocus();

    // Home moves focus to start of current week row
    await userEvent.keyboard('{Home}');
    const weekStart = selectedIndex - (selectedIndex % 7);
    expect(dayButtons[weekStart]).toHaveFocus();

    // End moves focus to end of current week row
    dayButtons[weekStart].focus();
    await userEvent.keyboard('{End}');
    expect(dayButtons[weekStart + 6]).toHaveFocus();

    // Escape closes the popover and returns focus to trigger
    await userEvent.keyboard('{Escape}');
    const datepickerEl = canvasElement.querySelector('.ct-datepicker');
    expect(datepickerEl.getAttribute('data-state')).not.toBe('open');
    expect(dateInput).toHaveFocus();
  },
};

/* ─── Weekday helpers for grid HTML ─────────────────────────────── */

const WEEKDAY_ROW = `
  <div role="row" class="ct-datepicker__row">
    <abbr role="columnheader" class="ct-datepicker__weekday" title="Monday">Mo</abbr>
    <abbr role="columnheader" class="ct-datepicker__weekday" title="Tuesday">Tu</abbr>
    <abbr role="columnheader" class="ct-datepicker__weekday" title="Wednesday">We</abbr>
    <abbr role="columnheader" class="ct-datepicker__weekday" title="Thursday">Th</abbr>
    <abbr role="columnheader" class="ct-datepicker__weekday" title="Friday">Fr</abbr>
    <abbr role="columnheader" class="ct-datepicker__weekday" title="Saturday">Sa</abbr>
    <abbr role="columnheader" class="ct-datepicker__weekday" title="Sunday">Su</abbr>
  </div>`;

/**
 * Range selection with start/end/in-range data attributes.
 */
export const RangeSelection = {
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: true, height: 520 } },
  },
  render: () => `
  <div style="min-height: 520px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="ct-field">
      <label class="ct-field__label" for="range-demo">Date range</label>
      <div class="ct-datepicker" data-state="open">
        <input class="ct-input" id="range-demo" type="text" placeholder="Start – End" role="combobox" aria-haspopup="dialog" aria-expanded="true" aria-controls="range-popover" />
        <div id="range-popover" class="ct-datepicker__popover" role="dialog" aria-modal="true" aria-label="Choose date range">
          <div class="ct-datepicker__header">
            <button class="ct-button ct-button--ghost ct-button--icon" aria-label="Previous month">Prev</button>
            <div class="ct-datepicker__title" aria-live="polite">March 2026</div>
            <button class="ct-button ct-button--ghost ct-button--icon" aria-label="Next month">Next</button>
          </div>
          <div role="grid" class="ct-datepicker__grid" aria-label="March 2026">
            ${WEEKDAY_ROW}
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="23 February 2026">23</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="24 February 2026">24</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="25 February 2026">25</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="26 February 2026">26</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="27 February 2026">27</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="28 February 2026">28</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="1 March 2026">1</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="2 March 2026">2</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="3 March 2026">3</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="4 March 2026">4</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="5 March 2026">5</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="6 March 2026">6</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="7 March 2026">7</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="8 March 2026">8</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="9 March 2026">9</button>
              <button role="gridcell" class="ct-datepicker__day" aria-selected="true" data-range-start tabindex="0" aria-label="10 March 2026">10</button>
              <button role="gridcell" class="ct-datepicker__day" data-in-range tabindex="-1" aria-label="11 March 2026">11</button>
              <button role="gridcell" class="ct-datepicker__day" data-in-range data-today="true" tabindex="-1" aria-label="12 March 2026">12</button>
              <button role="gridcell" class="ct-datepicker__day" data-in-range tabindex="-1" aria-label="13 March 2026">13</button>
              <button role="gridcell" class="ct-datepicker__day" data-in-range tabindex="-1" aria-label="14 March 2026">14</button>
              <button role="gridcell" class="ct-datepicker__day" data-in-range tabindex="-1" aria-label="15 March 2026">15</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" data-in-range tabindex="-1" aria-label="16 March 2026">16</button>
              <button role="gridcell" class="ct-datepicker__day" data-in-range tabindex="-1" aria-label="17 March 2026">17</button>
              <button role="gridcell" class="ct-datepicker__day" aria-selected="true" data-range-end tabindex="-1" aria-label="18 March 2026">18</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="19 March 2026">19</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="20 March 2026">20</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="21 March 2026">21</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="22 March 2026">22</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="23 March 2026">23</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="24 March 2026">24</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="25 March 2026">25</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="26 March 2026">26</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="27 March 2026">27</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="28 March 2026">28</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="29 March 2026">29</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="30 March 2026">30</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="31 March 2026">31</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="1 April 2026">1</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="2 April 2026">2</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="3 April 2026">3</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="4 April 2026">4</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="5 April 2026">5</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    // Range start day is marked
    const rangeStart = canvasElement.querySelector('[data-range-start]');
    expect(rangeStart).not.toBeNull();
    expect(rangeStart).toHaveTextContent('10');
    expect(rangeStart).toHaveAttribute('aria-selected', 'true');

    // Range end day is marked
    const rangeEnd = canvasElement.querySelector('[data-range-end]');
    expect(rangeEnd).not.toBeNull();
    expect(rangeEnd).toHaveTextContent('18');
    expect(rangeEnd).toHaveAttribute('aria-selected', 'true');

    // In-range days exist between start and end
    const inRangeDays = canvasElement.querySelectorAll('[data-in-range]');
    expect(inRangeDays.length).toBeGreaterThanOrEqual(6);

    // Range start has left-rounded border radius (via CSS)
    const startStyle = window.getComputedStyle(rangeStart);
    expect(startStyle.borderTopRightRadius).toBe('0px');

    // Range end has right-rounded border radius (via CSS)
    const endStyle = window.getComputedStyle(rangeEnd);
    expect(endStyle.borderTopLeftRadius).toBe('0px');

    // In-range days have no border radius (via CSS)
    const midStyle = window.getComputedStyle(inRangeDays[0]);
    expect(midStyle.borderRadius).toBe('0px');
  },
};

/**
 * Unavailable and highlighted days demonstrate min/max constraints and keyboard focus.
 */
export const UnavailableDays = {
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: true, height: 520 } },
  },
  render: () => `
  <div style="min-height: 520px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="ct-field">
      <label class="ct-field__label" for="unavail-demo">Appointment</label>
      <div class="ct-datepicker" data-state="open">
        <input class="ct-input" id="unavail-demo" type="text" placeholder="Select date" role="combobox" aria-haspopup="dialog" aria-expanded="true" aria-controls="unavail-popover" />
        <div id="unavail-popover" class="ct-datepicker__popover" role="dialog" aria-modal="true" aria-label="Choose appointment date">
          <div class="ct-datepicker__header">
            <button class="ct-button ct-button--ghost ct-button--icon" aria-label="Previous month">Prev</button>
            <div class="ct-datepicker__title" aria-live="polite">March 2026</div>
            <button class="ct-button ct-button--ghost ct-button--icon" aria-label="Next month">Next</button>
          </div>
          <div role="grid" class="ct-datepicker__grid" aria-label="March 2026">
            ${WEEKDAY_ROW}
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="23 February 2026">23</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="24 February 2026">24</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="25 February 2026">25</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="26 February 2026">26</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="27 February 2026">27</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="28 February 2026">28</button>
              <button role="gridcell" class="ct-datepicker__day" data-unavailable aria-disabled="true" tabindex="-1" aria-label="1 March 2026">1</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" data-unavailable aria-disabled="true" tabindex="-1" aria-label="2 March 2026">2</button>
              <button role="gridcell" class="ct-datepicker__day" data-unavailable aria-disabled="true" tabindex="-1" aria-label="3 March 2026">3</button>
              <button role="gridcell" class="ct-datepicker__day" data-unavailable aria-disabled="true" tabindex="-1" aria-label="4 March 2026">4</button>
              <button role="gridcell" class="ct-datepicker__day" data-unavailable aria-disabled="true" tabindex="-1" aria-label="5 March 2026">5</button>
              <button role="gridcell" class="ct-datepicker__day" data-unavailable aria-disabled="true" tabindex="-1" aria-label="6 March 2026">6</button>
              <button role="gridcell" class="ct-datepicker__day" data-unavailable aria-disabled="true" tabindex="-1" aria-label="7 March 2026">7</button>
              <button role="gridcell" class="ct-datepicker__day" data-unavailable aria-disabled="true" tabindex="-1" aria-label="8 March 2026">8</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="9 March 2026">9</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="10 March 2026">10</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="11 March 2026">11</button>
              <button role="gridcell" class="ct-datepicker__day" data-today="true" data-highlighted tabindex="0" aria-label="12 March 2026">12</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="13 March 2026">13</button>
              <button role="gridcell" class="ct-datepicker__day" data-unavailable aria-disabled="true" tabindex="-1" aria-label="14 March 2026">14</button>
              <button role="gridcell" class="ct-datepicker__day" data-unavailable aria-disabled="true" tabindex="-1" aria-label="15 March 2026">15</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="16 March 2026">16</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="17 March 2026">17</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="18 March 2026">18</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="19 March 2026">19</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="20 March 2026">20</button>
              <button role="gridcell" class="ct-datepicker__day" data-unavailable aria-disabled="true" tabindex="-1" aria-label="21 March 2026">21</button>
              <button role="gridcell" class="ct-datepicker__day" data-unavailable aria-disabled="true" tabindex="-1" aria-label="22 March 2026">22</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="23 March 2026">23</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="24 March 2026">24</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="25 March 2026">25</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="26 March 2026">26</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="27 March 2026">27</button>
              <button role="gridcell" class="ct-datepicker__day" data-unavailable aria-disabled="true" tabindex="-1" aria-label="28 March 2026">28</button>
              <button role="gridcell" class="ct-datepicker__day" data-unavailable aria-disabled="true" tabindex="-1" aria-label="29 March 2026">29</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="30 March 2026">30</button>
              <button role="gridcell" class="ct-datepicker__day" tabindex="-1" aria-label="31 March 2026">31</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="1 April 2026">1</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="2 April 2026">2</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="3 April 2026">3</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="4 April 2026">4</button>
              <button role="gridcell" class="ct-datepicker__day" data-outside="true" tabindex="-1" aria-label="5 April 2026">5</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    // Unavailable days have data-unavailable and aria-disabled
    const unavailable = canvasElement.querySelectorAll('[data-unavailable]');
    expect(unavailable.length).toBeGreaterThanOrEqual(5);
    for (const day of unavailable) {
      expect(day).toHaveAttribute('aria-disabled', 'true');
    }

    // Unavailable days show line-through text decoration (via CSS)
    const unavailStyle = window.getComputedStyle(unavailable[0]);
    expect(unavailStyle.textDecorationLine).toContain('line-through');

    // Highlighted day has data-highlighted attribute
    const highlighted = canvasElement.querySelector('[data-highlighted]');
    expect(highlighted).not.toBeNull();
    expect(highlighted).toHaveTextContent('12');

    // Highlighted day has visible outline (via CSS)
    const hlStyle = window.getComputedStyle(highlighted);
    expect(hlStyle.outlineStyle).not.toBe('none');
  },
};

/**
 * Month grid view for picking a month.
 */
export const MonthGrid = {
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: true, height: 420 } },
  },
  render: () => `
  <div style="min-height: 420px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="ct-field">
      <label class="ct-field__label" for="month-demo">Month</label>
      <div class="ct-datepicker" data-state="open">
        <input class="ct-input" id="month-demo" type="text" placeholder="Select month" role="combobox" aria-haspopup="dialog" aria-expanded="true" aria-controls="month-popover" />
        <div id="month-popover" class="ct-datepicker__popover" role="dialog" aria-modal="true" aria-label="Choose month">
          <div class="ct-datepicker__header">
            <button class="ct-button ct-button--ghost ct-button--icon" aria-label="Previous year">Prev</button>
            <button class="ct-datepicker__title" aria-live="polite">2026</button>
            <button class="ct-button ct-button--ghost ct-button--icon" aria-label="Next year">Next</button>
          </div>
          <div role="grid" class="ct-datepicker__month-grid" aria-label="2026">
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__month" tabindex="-1" aria-label="January 2026">Jan</button>
              <button role="gridcell" class="ct-datepicker__month" tabindex="-1" aria-label="February 2026">Feb</button>
              <button role="gridcell" class="ct-datepicker__month" aria-selected="true" tabindex="0" aria-label="March 2026">Mar</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__month" tabindex="-1" aria-label="April 2026">Apr</button>
              <button role="gridcell" class="ct-datepicker__month" tabindex="-1" aria-label="May 2026">May</button>
              <button role="gridcell" class="ct-datepicker__month" tabindex="-1" aria-label="June 2026">Jun</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__month" tabindex="-1" aria-label="July 2026">Jul</button>
              <button role="gridcell" class="ct-datepicker__month" tabindex="-1" aria-label="August 2026">Aug</button>
              <button role="gridcell" class="ct-datepicker__month" tabindex="-1" aria-label="September 2026">Sep</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__month" tabindex="-1" aria-label="October 2026">Oct</button>
              <button role="gridcell" class="ct-datepicker__month" tabindex="-1" aria-label="November 2026">Nov</button>
              <button role="gridcell" class="ct-datepicker__month" tabindex="-1" aria-label="December 2026">Dec</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    // Month grid has 12 months
    const months = canvasElement.querySelectorAll('.ct-datepicker__month');
    expect(months).toHaveLength(12);

    // Grid uses 3-column layout
    const grid = canvasElement.querySelector('.ct-datepicker__month-grid');
    expect(grid).toHaveAttribute('role', 'grid');
    const gridStyle = window.getComputedStyle(grid);
    expect(gridStyle.display).toBe('grid');

    // Selected month is marked
    const selected = canvasElement.querySelector('.ct-datepicker__month[aria-selected="true"]');
    expect(selected).not.toBeNull();
    expect(selected).toHaveTextContent('Mar');
    expect(selected).toHaveAttribute('aria-label', 'March 2026');

    // Roving tabindex: only selected month is tabbable
    const tabbable = canvasElement.querySelectorAll('.ct-datepicker__month[tabindex="0"]');
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]).toBe(selected);

    // Each month has an accessible label
    for (const month of months) {
      expect(month.getAttribute('aria-label')).toMatch(/\w+ 2026/);
    }
  },
};

/**
 * Year grid view for picking a year.
 */
export const YearGrid = {
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: true, height: 420 } },
  },
  render: () => `
  <div style="min-height: 420px; padding: 24px; display: flex; align-items: flex-start;">
    <div class="ct-field">
      <label class="ct-field__label" for="year-demo">Year</label>
      <div class="ct-datepicker" data-state="open">
        <input class="ct-input" id="year-demo" type="text" placeholder="Select year" role="combobox" aria-haspopup="dialog" aria-expanded="true" aria-controls="year-popover" />
        <div id="year-popover" class="ct-datepicker__popover" role="dialog" aria-modal="true" aria-label="Choose year">
          <div class="ct-datepicker__header">
            <button class="ct-button ct-button--ghost ct-button--icon" aria-label="Previous decade">Prev</button>
            <div class="ct-datepicker__title" aria-live="polite">2020 – 2031</div>
            <button class="ct-button ct-button--ghost ct-button--icon" aria-label="Next decade">Next</button>
          </div>
          <div role="grid" class="ct-datepicker__year-grid" aria-label="2020 – 2031">
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__year" tabindex="-1" aria-label="2020">2020</button>
              <button role="gridcell" class="ct-datepicker__year" tabindex="-1" aria-label="2021">2021</button>
              <button role="gridcell" class="ct-datepicker__year" tabindex="-1" aria-label="2022">2022</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__year" tabindex="-1" aria-label="2023">2023</button>
              <button role="gridcell" class="ct-datepicker__year" tabindex="-1" aria-label="2024">2024</button>
              <button role="gridcell" class="ct-datepicker__year" tabindex="-1" aria-label="2025">2025</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__year" aria-selected="true" tabindex="0" aria-label="2026">2026</button>
              <button role="gridcell" class="ct-datepicker__year" tabindex="-1" aria-label="2027">2027</button>
              <button role="gridcell" class="ct-datepicker__year" tabindex="-1" aria-label="2028">2028</button>
            </div>
            <div role="row" class="ct-datepicker__row">
              <button role="gridcell" class="ct-datepicker__year" tabindex="-1" aria-label="2029">2029</button>
              <button role="gridcell" class="ct-datepicker__year" tabindex="-1" aria-label="2030">2030</button>
              <button role="gridcell" class="ct-datepicker__year" tabindex="-1" aria-label="2031">2031</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    // Year grid has 12 years
    const years = canvasElement.querySelectorAll('.ct-datepicker__year');
    expect(years).toHaveLength(12);

    // Grid uses 3-column layout
    const grid = canvasElement.querySelector('.ct-datepicker__year-grid');
    expect(grid).toHaveAttribute('role', 'grid');

    // Selected year is marked
    const selected = canvasElement.querySelector('.ct-datepicker__year[aria-selected="true"]');
    expect(selected).not.toBeNull();
    expect(selected).toHaveTextContent('2026');

    // Roving tabindex: only selected year is tabbable
    const tabbable = canvasElement.querySelectorAll('.ct-datepicker__year[tabindex="0"]');
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]).toBe(selected);

    // Each year has an accessible label
    for (const year of years) {
      const label = year.getAttribute('aria-label');
      expect(label).toMatch(/\d{4}/);
    }
  },
};
