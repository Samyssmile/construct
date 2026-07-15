import { useEffect, useRef } from 'react';

import { createModalController } from '@neuravision/construct/behaviors';

export function SettingsModal() {
  const triggerRef = useRef(null);
  const containerRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const controller = createModalController({
      container: containerRef.current,
      dialog: dialogRef.current,
      trigger: triggerRef.current,
      initialFocus: '#display-name',
    });

    return () => controller.destroy();
  }, []);

  return (
    <>
      <button ref={triggerRef} className="ct-button" type="button">
        Edit settings
      </button>

      <div ref={containerRef} className="ct-modal" data-state="closed" hidden>
        <section
          ref={dialogRef}
          className="ct-modal__dialog"
          aria-labelledby="settings-title"
        >
          <header className="ct-modal__header">
            <h2 id="settings-title">Settings</h2>
            <button
              className="ct-button ct-button--ghost ct-button--icon"
              type="button"
              aria-label="Close settings"
              data-ct-dismiss
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>

          <div className="ct-modal__body">
            <div className="ct-field">
              <label className="ct-field__label" htmlFor="display-name">
                Display name
              </label>
              <input id="display-name" className="ct-input" autoComplete="name" />
            </div>
          </div>

          <footer className="ct-modal__footer">
            <button className="ct-button ct-button--secondary" type="button" data-ct-dismiss>
              Cancel
            </button>
            <button className="ct-button" type="button">
              Save
            </button>
          </footer>
        </section>
      </div>
    </>
  );
}
