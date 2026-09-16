// Shared by the standalone preview and Storybook. All artwork is CSS.
// Native links, details and radios need no composite-widget controller.
let instance = 0;

export const apertureMark = '<span class="ct-aperture-mark" aria-hidden="true"></span>';
export const apertureArrow = '<span class="ct-aperture-action__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg></span>';
export const apertureRule = '<div class="ct-aperture-rule" aria-hidden="true"></div>';

export function createApertureShowcase({ themeControls = false } = {}) {
  const id = `aperture-${++instance}`;
  const root = document.createElement('div');
  root.className = 'ct-aperture aperture-demo';
  root.lang = 'de';
  if (themeControls) root.dataset.theme = 'light';

  root.innerHTML = `
    <a class="aperture-demo__skip" href="#${id}-main">Zum Inhalt</a>
    <div class="aperture-demo__page" id="${id}-top">
      <header class="aperture-demo__header">
        <a class="ct-aperture-wordmark" href="#${id}-top" aria-label="Aperture – Anfang">
          ${apertureMark}aperture
        </a>
        <nav class="aperture-demo__nav" aria-label="Seitenabschnitte">
          <a class="aperture-demo__link" href="#${id}-grammar">Die Grammatik</a>
          <a class="aperture-demo__link" href="#${id}-idea">Der Gedanke</a>
        </nav>
        ${themeControls ? `
          <fieldset class="ct-aperture-choices">
            <legend>Farbschema</legend>
            ${[['light', 'Hell'], ['dark', 'Dunkel'], ['high-contrast', 'Kontrast']].map(([value, label]) => `
              <label class="ct-aperture-choice">
                <input type="radio" name="${id}-theme" value="${value}" ${value === 'light' ? 'checked' : ''}>
                ${label}
              </label>`).join('')}
          </fieldset>` : '<span class="ct-aperture-label">A Construct signature</span>'}
      </header>

      <main id="${id}-main" tabindex="-1">
        <section class="aperture-demo__hero" aria-labelledby="${id}-title">
          <div class="aperture-demo__intro">
            <p class="ct-aperture-label aperture-demo__eyebrow"><span>A Construct signature</span><span>Look 02</span></p>
            <h1 class="ct-aperture-display" id="${id}-title"><span class="ct-aperture-line">Raum für</span> <span class="ct-aperture-line">Eigenart.</span></h1>
            <p class="aperture-demo__description">Eine klare Form. Ein kleiner Versatz.
              Und plötzlich bleibt etwas im Kopf.</p>
            <a class="ct-aperture-action" href="#${id}-grammar">Aperture entdecken ${apertureArrow}</a>
          </div>
          <figure class="ct-aperture-poster" aria-label="Aperture: zwei versetzte Halbovale auf einer blauen Fläche">
            <div class="aperture-demo__poster-heading"><span class="ct-aperture-label">Offen für das Wesentliche.</span><span aria-hidden="true">02</span></div>
            <div class="ct-aperture-poster__art">${apertureMark}</div>
            <figcaption class="ct-aperture-poster__caption">
              <span class="ct-aperture-poster__title"><span class="ct-aperture-line">Open by</span> <span class="ct-aperture-line">design.</span></span>
              <span>Zwei Hälften.<br>Ein eigener Charakter.</span>
            </figcaption>
          </figure>
        </section>

        <div class="aperture-demo__edition">
          <span>Ein Spalt offen. Ein Stück weiter.</span>
          <span>Form mit Haltung. Raum für Inhalt.</span>
        </div>
        ${apertureRule}

        <section class="aperture-demo__section" id="${id}-grammar" aria-labelledby="${id}-grammar-title">
          <div class="aperture-demo__section-head">
            <div>
              <p class="ct-aperture-label">01 / Die Grammatik</p>
              <h2 class="ct-aperture-heading" id="${id}-grammar-title"><span class="ct-aperture-line">Eine Form.</span> <span class="ct-aperture-line">Viele Möglichkeiten.</span></h2>
            </div>
            <p>Das geteilte Oval gibt den Takt vor. In der großen Geste genauso wie im kleinen Detail.
              Alles andere lässt dem Inhalt Platz.</p>
          </div>

          <div class="aperture-demo__specimens">
            <article class="aperture-demo__specimen">
              <div class="aperture-demo__sample aperture-demo__sample--mark" aria-hidden="true">
                <span class="aperture-demo__sample-label">Eine Silhouette. Jeder Maßstab.</span>
                <div class="aperture-demo__marks">${apertureMark}${apertureMark}</div>
              </div>
              <div><h3><span class="aperture-demo__index" aria-hidden="true">01</span>Die Öffnung.</h3><p>Zwei Halbovale. Eine Fuge. Die Silhouette bleibt erkennbar, auch ohne Farbe.</p></div>
            </article>
            <article class="aperture-demo__specimen">
              <div class="aperture-demo__sample aperture-demo__sample--type" aria-hidden="true"><span class="aperture-demo__sample-label">Nicht ganz auf einer Linie.</span><div><span class="ct-aperture-line">Groß.</span><span class="ct-aperture-line">Gedacht.</span></div></div>
              <div><h3><span class="aperture-demo__index" aria-hidden="true">02</span>Der Versatz.</h3><p>Eine Zeile tritt aus der Achse. Aus einer Überschrift wird eine Komposition.</p></div>
            </article>
            <article class="aperture-demo__specimen">
              <div class="aperture-demo__sample aperture-demo__sample--action">
                <span class="aperture-demo__sample-label" aria-hidden="true">Die Form geht mit.</span>
                <a class="ct-aperture-action" href="#${id}-idea">Der Gedanke ${apertureArrow}</a>
                <a class="ct-aperture-action ct-aperture-action--quiet" href="#${id}-top">Zum Anfang ${apertureArrow}</a>
              </div>
              <div><h3><span class="aperture-demo__index" aria-hidden="true">03</span>Die Einladung.</h3><p>Wort und Pfeil. Getrennt durch eine Fuge, verbunden in einer Aktion. Der Versatz geht mit.</p></div>
            </article>
          </div>
        </section>

        <section class="aperture-demo__note" id="${id}-idea" aria-labelledby="${id}-idea-title">
          <div>
            <p class="ct-aperture-label">02 / Der Gedanke</p>
            <h2 class="ct-aperture-heading" id="${id}-idea-title"><span class="ct-aperture-line">Weniger.</span> <span class="ct-aperture-line">Aber eigen.</span></h2>
          </div>
          <div>
            <details class="ct-aperture-disclosure" open>
              <summary>Warum diese Form?</summary>
              <p>Ein geschlossenes Oval wäre ruhig. Die Teilung und der Versatz bringen Spannung hinein.
                Die Öffnung dazwischen wird zum Erkennungszeichen – vom kleinen Signet bis zum großen Plakat.</p>
            </details>
            <details class="ct-aperture-disclosure">
              <summary>Wie viel Farbe braucht es?</summary>
              <p>Eine entschiedene Farbfläche reicht. Papier, dunkle Schrift und viel freier Raum geben
                dem Kobaltblau Gewicht. Im dunklen Farbschema wird das Blau heller, damit die Form klar bleibt.</p>
            </details>
            <details class="ct-aperture-disclosure">
              <summary>Was hält alles zusammen?</summary>
              <p>Die wiederkehrende Silhouette, eng gesetzte große Schrift und der kleine Versatz.
                Sie verbinden Einstieg, Inhalte und Aktionen zu einer gemeinsamen Sprache.</p>
            </details>
          </div>
        </section>
      </main>

      <footer class="aperture-demo__footer">
        ${apertureRule}
        <div class="aperture-demo__signoff">
          <span class="ct-aperture-wordmark aperture-demo__signature">${apertureMark}aperture</span>
          <p>Ein eigener Blick.<br>Eine offene Haltung.</p>
        </div>
        <div class="aperture-demo__colophon">
          <span>Aperture / Construct</span>
          <span>Form mit Haltung. Seit dem ersten Detail.</span>
          <a class="aperture-demo__link" href="#${id}-top">Zurück nach oben ↑</a>
        </div>
      </footer>
    </div>`;

  // The handler belongs to this node, with no document/window subscriptions.
  // Removing the example releases both the handler and its theme controls.
  if (themeControls) {
    root.onchange = (event) => {
      if (event.target.matches('.ct-aperture-choice input')) {
        root.dataset.theme = event.target.value;
      }
    };
  }
  return root;
}
