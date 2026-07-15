export type ElementCollection = Element | Iterable<Element> | ArrayLike<Element>;
export type ControllerReason = string;
export type InitialFocus = Element | string | (() => Element | null) | null;

export interface CloseOptions {
  restoreFocus?: boolean;
}

export interface OpenCloseDetail<TController> {
  controller: TController;
  reason: ControllerReason;
}

export interface DialogController {
  readonly container: Element;
  readonly dialog: Element;
  readonly trigger: Element | null;
  readonly isOpen: boolean;
  open(reason?: ControllerReason): boolean;
  close(reason?: ControllerReason, options?: CloseOptions): boolean;
  toggle(reason?: ControllerReason): boolean;
  destroy(): void;
}

export interface DialogControllerOptions {
  container: Element;
  dialog?: Element;
  trigger?: Element | null;
  backdrop?: Element | false;
  closeButtons?: ElementCollection;
  initialFocus?: InitialFocus;
  open?: boolean;
  triggerAction?: 'open' | 'toggle';
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  trapFocus?: boolean;
  returnFocus?: boolean;
  lockScroll?: boolean;
  onOpen?(detail: OpenCloseDetail<DialogController>): void;
  onClose?(detail: OpenCloseDetail<DialogController>): void;
}

export function createModalController(options: DialogControllerOptions): DialogController;
export function createDrawerController(options: DialogControllerOptions): DialogController;

export interface TabsSelectDetail {
  controller: TabsController;
  index: number;
  tab: Element;
  panel: Element;
  reason: ControllerReason;
}

export interface TabsControllerOptions {
  tablist: Element;
  tabs?: ElementCollection;
  panels?: ElementCollection;
  orientation?: 'horizontal' | 'vertical';
  activation?: 'automatic' | 'manual';
  loop?: boolean;
  selectedIndex?: number;
  onSelect?(detail: TabsSelectDetail): void;
}

export interface TabsController {
  readonly tablist: Element;
  readonly tabs: Element[];
  readonly panels: Element[];
  readonly selectedIndex: number;
  select(
    target: number | Element,
    options?: { focus?: boolean; reason?: ControllerReason },
  ): boolean;
  destroy(): void;
}

export function createTabsController(options: TabsControllerOptions): TabsController;

export interface ToggleGroupValueChangeDetail {
  controller: ToggleGroupController;
  item: Element | null;
  previousValue: string | string[] | null;
  value: string | string[] | null;
  reason: ControllerReason;
}

export interface ToggleGroupControllerBaseOptions {
  root: Element;
  items?: ElementCollection;
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
  allowEmpty?: boolean;
  onValueChange?(detail: ToggleGroupValueChangeDetail): void;
}

export interface SingleToggleGroupControllerOptions extends ToggleGroupControllerBaseOptions {
  type?: 'single';
  value?: string | number | null;
}

export interface MultipleToggleGroupControllerOptions extends ToggleGroupControllerBaseOptions {
  type: 'multiple';
  value?: Iterable<string | number> | null;
}

export type ToggleGroupControllerOptions =
  | SingleToggleGroupControllerOptions
  | MultipleToggleGroupControllerOptions;

export interface ToggleGroupControllerBase {
  readonly root: Element;
  readonly items: Element[];
  toggle(target: number | Element, reason?: ControllerReason): boolean;
  destroy(): void;
}

export interface SingleToggleGroupController extends ToggleGroupControllerBase {
  readonly value: string | null;
  setValue(value: string | number | null, reason?: ControllerReason): boolean;
}

export interface MultipleToggleGroupController extends ToggleGroupControllerBase {
  readonly value: string[];
  setValue(value: Iterable<string | number> | null, reason?: ControllerReason): boolean;
}

export type ToggleGroupController = SingleToggleGroupController | MultipleToggleGroupController;

export function createToggleGroupController(
  options: MultipleToggleGroupControllerOptions,
): MultipleToggleGroupController;
export function createToggleGroupController(
  options: SingleToggleGroupControllerOptions,
): SingleToggleGroupController;

export interface DropdownSelectDetail {
  controller: DropdownController;
  index: number;
  item: Element;
  value: string;
  reason: ControllerReason;
}

export interface DropdownControllerOptions {
  root?: Element;
  trigger: Element;
  menu: Element;
  items?: ElementCollection;
  open?: boolean;
  closeOnEscape?: boolean;
  closeOnOutside?: boolean;
  closeOnSelect?: boolean;
  typeaheadTimeout?: number;
  onOpen?(detail: OpenCloseDetail<DropdownController>): void;
  onClose?(detail: OpenCloseDetail<DropdownController>): void;
  onSelect?(detail: DropdownSelectDetail): void;
}

export interface DropdownController {
  readonly root: Element;
  readonly trigger: Element;
  readonly menu: Element;
  readonly items: Element[];
  readonly isOpen: boolean;
  open(reason?: ControllerReason, options?: { focus?: 'first' | 'last' }): boolean;
  close(reason?: ControllerReason, options?: CloseOptions): boolean;
  toggle(reason?: ControllerReason): boolean;
  select(target: number | Element, reason?: ControllerReason): boolean;
  destroy(): void;
}

export function createDropdownController(options: DropdownControllerOptions): DropdownController;

export interface SelectMenuValueChangeDetail {
  controller: SelectMenuController;
  index: number;
  option: Element;
  previousValue: string | null;
  value: string;
  reason: ControllerReason;
}

export interface SelectMenuControllerOptions {
  root?: Element;
  trigger: Element;
  listbox: Element;
  options?: ElementCollection;
  valueElement?: Element;
  value?: string | number | null;
  open?: boolean;
  closeOnEscape?: boolean;
  closeOnOutside?: boolean;
  typeaheadTimeout?: number;
  getOptionLabel?(option: Element, index: number): string;
  getOptionValue?(option: Element, index: number): string | number;
  onOpen?(detail: OpenCloseDetail<SelectMenuController>): void;
  onClose?(detail: OpenCloseDetail<SelectMenuController>): void;
  onValueChange?(detail: SelectMenuValueChangeDetail): void;
}

export interface SelectMenuController {
  readonly root: Element;
  readonly trigger: Element;
  readonly listbox: Element;
  readonly options: Element[];
  readonly isOpen: boolean;
  readonly value: string | null;
  open(reason?: ControllerReason): boolean;
  close(reason?: ControllerReason, options?: CloseOptions): boolean;
  toggle(reason?: ControllerReason): boolean;
  select(target: number | Element, reason?: ControllerReason): boolean;
  setValue(value: string | number, reason?: ControllerReason): boolean;
  destroy(): void;
}

export function createSelectMenuController(
  options: SelectMenuControllerOptions,
): SelectMenuController;

export interface ComboboxQueryChangeDetail {
  controller: ComboboxController;
  query: string;
  results: Element[];
}

export interface ComboboxValueChangeDetail {
  controller: ComboboxController;
  index: number;
  option: Element | null;
  previousValue: string | null;
  value: string | null;
  reason: ControllerReason;
}

export interface ComboboxControllerOptions {
  root?: Element;
  input: HTMLInputElement | HTMLTextAreaElement;
  listbox: Element;
  toggleButton?: Element;
  status?: Element;
  options?: ElementCollection;
  value?: string | number | null;
  open?: boolean;
  autocomplete?: 'list' | 'none';
  filter?: boolean | ((option: Element, query: string, index: number) => boolean);
  openOnFocus?: boolean;
  openOnInput?: boolean;
  closeOnEscape?: boolean;
  closeOnOutside?: boolean;
  clearSelectionOnInput?: boolean;
  setInputValue?: boolean;
  getOptionLabel?(option: Element, index: number): string;
  getOptionValue?(option: Element, index: number): string | number;
  formatStatus?(count: number, query: string): string;
  onOpen?(detail: OpenCloseDetail<ComboboxController>): void;
  onClose?(detail: OpenCloseDetail<ComboboxController>): void;
  onQueryChange?(detail: ComboboxQueryChangeDetail): void;
  onValueChange?(detail: ComboboxValueChangeDetail): void;
}

export interface ComboboxController {
  readonly root: Element;
  readonly input: HTMLInputElement | HTMLTextAreaElement;
  readonly listbox: Element;
  readonly options: Element[];
  readonly isOpen: boolean;
  readonly query: string;
  readonly value: string | null;
  open(reason?: ControllerReason): boolean;
  close(reason?: ControllerReason, options?: CloseOptions): boolean;
  toggle(reason?: ControllerReason): boolean;
  select(target: number | Element, reason?: ControllerReason): boolean;
  setValue(value: string | number | null, reason?: ControllerReason): boolean;
  refresh(): Element[];
  destroy(): void;
}

export function createComboboxController(options: ComboboxControllerOptions): ComboboxController;

export interface TooltipControllerOptions {
  root?: Element;
  trigger: Element;
  tooltip: Element;
  open?: boolean;
  openDelay?: number;
  closeDelay?: number;
  onOpen?(detail: OpenCloseDetail<TooltipController>): void;
  onClose?(detail: OpenCloseDetail<TooltipController>): void;
}

export interface TooltipController {
  readonly root: Element;
  readonly trigger: Element;
  readonly tooltip: Element;
  readonly isOpen: boolean;
  open(reason?: ControllerReason): boolean;
  close(reason?: ControllerReason): boolean;
  destroy(): void;
}

export function createTooltipController(options: TooltipControllerOptions): TooltipController;

export interface PopoverControllerOptions {
  root?: Element;
  trigger: Element;
  popover: Element;
  closeButtons?: ElementCollection;
  initialFocus?: InitialFocus;
  open?: boolean;
  openOnFocus?: boolean;
  openOnHover?: boolean;
  focusOnOpen?: boolean;
  openDelay?: number;
  closeDelay?: number;
  closeOnEscape?: boolean;
  closeOnOutside?: boolean;
  closeOnFocusOutside?: boolean;
  onOpen?(detail: OpenCloseDetail<PopoverController>): void;
  onClose?(detail: OpenCloseDetail<PopoverController>): void;
}

export interface PopoverController {
  readonly root: Element;
  readonly trigger: Element;
  readonly popover: Element;
  readonly isOpen: boolean;
  open(reason?: ControllerReason, options?: { focus?: boolean }): boolean;
  close(reason?: ControllerReason, options?: CloseOptions): boolean;
  toggle(reason?: ControllerReason): boolean;
  destroy(): void;
}

export function createPopoverController(options: PopoverControllerOptions): PopoverController;
