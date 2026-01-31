export default {
  title: 'Components/Datepicker'
};

export const Datepicker = () => `
  <div class="af-datepicker" data-state="open">
    <input class="af-input" type="text" placeholder="Select date" />
    <div class="af-datepicker__popover" role="dialog" aria-label="Choose date">
      <div class="af-datepicker__header">
        <button class="af-button af-button--ghost af-button--icon" aria-label="Previous month">Prev</button>
        <div class="af-datepicker__title">March 2026</div>
        <button class="af-button af-button--ghost af-button--icon" aria-label="Next month">Next</button>
      </div>
      <div class="af-datepicker__grid">
        <div class="af-datepicker__weekday">Mo</div>
        <div class="af-datepicker__weekday">Tu</div>
        <div class="af-datepicker__weekday">We</div>
        <div class="af-datepicker__weekday">Th</div>
        <div class="af-datepicker__weekday">Fr</div>
        <div class="af-datepicker__weekday">Sa</div>
        <div class="af-datepicker__weekday">Su</div>
        <button class="af-datepicker__day" data-outside="true">24</button>
        <button class="af-datepicker__day" data-today="true">25</button>
        <button class="af-datepicker__day" aria-selected="true">26</button>
        <button class="af-datepicker__day">27</button>
        <button class="af-datepicker__day">28</button>
        <button class="af-datepicker__day">29</button>
        <button class="af-datepicker__day">30</button>
      </div>
    </div>
  </div>
`;

Datepicker.parameters = {
  layout: 'centered'
};
