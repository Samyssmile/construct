import { createDialogController } from './internal/dialog-controller.js';

const controllers = new WeakMap();

/**
 * Adds modal dialog behavior to existing Construct markup.
 *
 * Required DOM contract: `container` is the state/backdrop element and `dialog`
 * is the focus scope carrying the dialog semantics. They may be the same element.
 */
export function createModalController(options) {
  return createDialogController(options, controllers, {
    idPrefix: 'ct-modal',
    name: 'Modal',
    triggerAction: 'open',
  });
}
