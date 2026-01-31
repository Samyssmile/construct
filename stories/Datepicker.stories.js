export default {
  title: 'Components/Datepicker'
};

export const Datepicker = () => `
  <div style="min-height: 520px; padding: 24px; display: flex; align-items: flex-start;">
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
          <button class="af-datepicker__day" data-outside="true">23</button>
          <button class="af-datepicker__day" data-outside="true">24</button>
          <button class="af-datepicker__day" data-outside="true">25</button>
          <button class="af-datepicker__day" data-outside="true">26</button>
          <button class="af-datepicker__day" data-outside="true">27</button>
          <button class="af-datepicker__day" data-outside="true">28</button>
          <button class="af-datepicker__day">1</button>
          <button class="af-datepicker__day">2</button>
          <button class="af-datepicker__day">3</button>
          <button class="af-datepicker__day">4</button>
          <button class="af-datepicker__day">5</button>
          <button class="af-datepicker__day">6</button>
          <button class="af-datepicker__day">7</button>
          <button class="af-datepicker__day">8</button>
          <button class="af-datepicker__day">9</button>
          <button class="af-datepicker__day">10</button>
          <button class="af-datepicker__day">11</button>
          <button class="af-datepicker__day">12</button>
          <button class="af-datepicker__day">13</button>
          <button class="af-datepicker__day">14</button>
          <button class="af-datepicker__day">15</button>
          <button class="af-datepicker__day">16</button>
          <button class="af-datepicker__day">17</button>
          <button class="af-datepicker__day">18</button>
          <button class="af-datepicker__day">19</button>
          <button class="af-datepicker__day">20</button>
          <button class="af-datepicker__day">21</button>
          <button class="af-datepicker__day">22</button>
          <button class="af-datepicker__day">23</button>
          <button class="af-datepicker__day">24</button>
          <button class="af-datepicker__day" data-today="true">25</button>
          <button class="af-datepicker__day" aria-selected="true">26</button>
          <button class="af-datepicker__day">27</button>
          <button class="af-datepicker__day">28</button>
          <button class="af-datepicker__day">29</button>
          <button class="af-datepicker__day">30</button>
          <button class="af-datepicker__day">31</button>
          <button class="af-datepicker__day" data-outside="true">1</button>
          <button class="af-datepicker__day" data-outside="true">2</button>
          <button class="af-datepicker__day" data-outside="true">3</button>
          <button class="af-datepicker__day" data-outside="true">4</button>
          <button class="af-datepicker__day" data-outside="true">5</button>
        </div>
      </div>
    </div>
  </div>
`;

Datepicker.parameters = {
  layout: 'fullscreen',
  docs: {
    story: {
      inline: true,
      height: 520
    }
  }
};
