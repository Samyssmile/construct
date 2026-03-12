import { expect, within, userEvent } from 'storybook/test';

export default {
  title: 'Components/Datepicker',
};

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
        <input class="ct-input" id="datepicker-demo" type="text" placeholder="Select date" />
        <div class="ct-datepicker__popover" role="dialog" aria-label="Choose date">
          <div class="ct-datepicker__header">
            <button class="ct-button ct-button--ghost ct-button--icon" aria-label="Previous month">Prev</button>
            <div class="ct-datepicker__title" aria-live="polite">March 2026</div>
            <button class="ct-button ct-button--ghost ct-button--icon" aria-label="Next month">Next</button>
          </div>
          <div class="ct-datepicker__grid" aria-label="March 2026">
            <div class="ct-datepicker__weekday" abbr="Monday">Mo</div>
            <div class="ct-datepicker__weekday" abbr="Tuesday">Tu</div>
            <div class="ct-datepicker__weekday" abbr="Wednesday">We</div>
            <div class="ct-datepicker__weekday" abbr="Thursday">Th</div>
            <div class="ct-datepicker__weekday" abbr="Friday">Fr</div>
            <div class="ct-datepicker__weekday" abbr="Saturday">Sa</div>
            <div class="ct-datepicker__weekday" abbr="Sunday">Su</div>
            <button class="ct-datepicker__day" data-outside="true" aria-label="23 February 2026">23</button>
            <button class="ct-datepicker__day" data-outside="true" aria-label="24 February 2026">24</button>
            <button class="ct-datepicker__day" data-outside="true" aria-label="25 February 2026">25</button>
            <button class="ct-datepicker__day" data-outside="true" aria-label="26 February 2026">26</button>
            <button class="ct-datepicker__day" data-outside="true" aria-label="27 February 2026">27</button>
            <button class="ct-datepicker__day" data-outside="true" aria-label="28 February 2026">28</button>
            <button class="ct-datepicker__day" aria-label="1 March 2026">1</button>
            <button class="ct-datepicker__day" aria-label="2 March 2026">2</button>
            <button class="ct-datepicker__day" aria-label="3 March 2026">3</button>
            <button class="ct-datepicker__day" aria-label="4 March 2026">4</button>
            <button class="ct-datepicker__day" aria-label="5 March 2026">5</button>
            <button class="ct-datepicker__day" aria-label="6 March 2026">6</button>
            <button class="ct-datepicker__day" aria-label="7 March 2026">7</button>
            <button class="ct-datepicker__day" aria-label="8 March 2026">8</button>
            <button class="ct-datepicker__day" aria-label="9 March 2026">9</button>
            <button class="ct-datepicker__day" aria-label="10 March 2026">10</button>
            <button class="ct-datepicker__day" aria-label="11 March 2026">11</button>
            <button class="ct-datepicker__day" aria-label="12 March 2026" data-today="true">12</button>
            <button class="ct-datepicker__day" aria-label="13 March 2026">13</button>
            <button class="ct-datepicker__day" aria-label="14 March 2026">14</button>
            <button class="ct-datepicker__day" aria-label="15 March 2026">15</button>
            <button class="ct-datepicker__day" aria-label="16 March 2026">16</button>
            <button class="ct-datepicker__day" aria-label="17 March 2026">17</button>
            <button class="ct-datepicker__day" aria-label="18 March 2026">18</button>
            <button class="ct-datepicker__day" aria-label="19 March 2026">19</button>
            <button class="ct-datepicker__day" aria-label="20 March 2026">20</button>
            <button class="ct-datepicker__day" aria-label="21 March 2026">21</button>
            <button class="ct-datepicker__day" aria-label="22 March 2026">22</button>
            <button class="ct-datepicker__day" aria-label="23 March 2026">23</button>
            <button class="ct-datepicker__day" aria-label="24 March 2026">24</button>
            <button class="ct-datepicker__day" aria-label="25 March 2026">25</button>
            <button class="ct-datepicker__day" aria-label="26 March 2026" aria-pressed="true">26</button>
            <button class="ct-datepicker__day" aria-label="27 March 2026">27</button>
            <button class="ct-datepicker__day" aria-label="28 March 2026">28</button>
            <button class="ct-datepicker__day" aria-label="29 March 2026">29</button>
            <button class="ct-datepicker__day" aria-label="30 March 2026">30</button>
            <button class="ct-datepicker__day" aria-label="31 March 2026">31</button>
            <button class="ct-datepicker__day" data-outside="true" aria-label="1 April 2026">1</button>
            <button class="ct-datepicker__day" data-outside="true" aria-label="2 April 2026">2</button>
            <button class="ct-datepicker__day" data-outside="true" aria-label="3 April 2026">3</button>
            <button class="ct-datepicker__day" data-outside="true" aria-label="4 April 2026">4</button>
            <button class="ct-datepicker__day" data-outside="true" aria-label="5 April 2026">5</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Input has label association
    const dateInput = canvas.getByLabelText('Date');
    expect(dateInput).toHaveAttribute('placeholder', 'Select date');

    // Calendar dialog is accessible
    const dialog = canvas.getByRole('dialog', { name: 'Choose date' });
    expect(dialog).toBeInTheDocument();

    // Navigation buttons have accessible names
    const prevBtn = canvas.getByRole('button', { name: 'Previous month' });
    const nextBtn = canvas.getByRole('button', { name: 'Next month' });
    expect(prevBtn).toBeEnabled();
    expect(nextBtn).toBeEnabled();

    // Month title is a live region (announces month changes to screen readers)
    const title = canvas.getByText('March 2026');
    expect(title.closest('[aria-live]')).not.toBeNull();

    // Grid container has accessible label for screen reader context
    const grid = canvasElement.querySelector('.ct-datepicker__grid');
    expect(grid).toHaveAttribute('aria-label', 'March 2026');

    // Weekday headers present with full-name abbreviations via abbr attribute
    const weekdays = canvasElement.querySelectorAll('.ct-datepicker__weekday');
    expect(weekdays).toHaveLength(7);
    for (const weekday of weekdays) {
      const abbr = weekday.getAttribute('abbr');
      expect(abbr).toBeTruthy();
      expect(abbr.length).toBeGreaterThan(2);
    }

    // Every day button has an aria-label with full date context
    const dayButtons = canvasElement.querySelectorAll('.ct-datepicker__day');
    expect(dayButtons.length).toBeGreaterThanOrEqual(35);
    for (const day of dayButtons) {
      const label = day.getAttribute('aria-label');
      expect(label).toBeTruthy();
      expect(label).toMatch(/\d{1,2}\s\w+\s\d{4}/);
    }

    // Today is clearly marked
    const todayBtn = canvasElement.querySelector('[data-today="true"]');
    expect(todayBtn).toHaveTextContent('12');
    expect(todayBtn).toHaveAttribute('aria-label', '12 March 2026');

    // Selected day has aria-pressed and correct label
    const selectedBtn = canvasElement.querySelector('[aria-pressed="true"]');
    expect(selectedBtn).toHaveTextContent('26');
    expect(selectedBtn).toHaveAttribute('aria-label', '26 March 2026');

    // Outside-month days are marked and have correct month in label
    const outsideDays = canvasElement.querySelectorAll('[data-outside="true"]');
    expect(outsideDays.length).toBeGreaterThan(0);
    const firstOutside = outsideDays[0];
    expect(firstOutside.getAttribute('aria-label')).toMatch(/February|April/);

    // Day button is focusable via click
    await userEvent.click(dayButtons[10]);
    expect(dayButtons[10]).toHaveFocus();

    // Navigation buttons receive focus on click
    await userEvent.click(prevBtn);
    expect(prevBtn).toHaveFocus();
    await userEvent.click(nextBtn);
    expect(nextBtn).toHaveFocus();
  },
};
