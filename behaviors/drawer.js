import { createDialogController } from './internal/dialog-controller.js';

const controllers = new WeakMap();

/**
 * Adds modal drawer behavior to existing Construct markup.
 *
 * Drawers intentionally share the modal focus, dismissal, and nested scroll-lock
 * contract. Their trigger toggles by default, which can be overridden with
 * `triggerAction: 'open'`.
 */
export function createDrawerController(options) {
  return createDialogController(options, controllers, {
    idPrefix: 'ct-drawer',
    name: 'Drawer',
    triggerAction: 'toggle',
  });
}
