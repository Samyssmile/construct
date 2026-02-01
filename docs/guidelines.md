# Construct Design Guidelines

## Goal

A consistent, accessible, professional design system for modern web applications built with Angular, React, Svelte, or vanilla HTML/CSS.

**Accessibility is Priority #1.**

## Do / Don't

### Do

- Use semantic HTML (`button`, `input`, `label`, `table`, `nav`)
- Use design tokens for colors, spacing, typography, and border radius
- Maintain clear state logic (hover, focus, active, disabled, error)
- Use consistent sizes (sm, md, lg) for form controls and buttons
- Establish clear hierarchies (Primary vs. Secondary actions)
- Test all components with keyboard navigation (Tab, Shift+Tab, Enter, Space)

### Don't

- Don't rely on color alone for status information without text or icons
- Don't create custom controls without ARIA roles and keyboard support
- Don't use fixed pixel layouts for content that can grow
- Don't use low-contrast text or disabled states that are unreadable
- Don't add unnecessary animations for critical actions

## Accessibility Rules (Minimum)

- **Visible Focus**: All interactive elements must have visible focus indication
- **Labels**: Every form input must have a label (explicit `<label>` or `aria-label`)
- **Keyboard Navigation**: Full support for dropdowns, tabs, modals, tooltips, datepickers
- **ARIA**: Use ARIA attributes only where semantic HTML isn't sufficient
- **Links**: Links must be distinguishable without color alone (e.g., underline)
- **Contrast**: Text, icons, and focus rings must meet WCAG AA standards
- **Disabled States**: Must be recognizable, but content should remain readable
- **Motion**: Respect `prefers-reduced-motion` for animations
- **Live Regions**: Use `aria-live` for toasts and status messages
- **Modal**: Requires `aria-modal`, `role="dialog"`, and focus trap

## Keyboard Patterns for Composite Components

### Tabs
- **Arrow keys**: Move focus between tabs
- **Home/End**: Jump to first/last tab
- **Enter/Space**: Activate tab
- **Implementation**: Use roving tabindex (active tab `tabindex="0"`, others `tabindex="-1"`)

### Dropdown (Action-List)
- **Trigger**: Uses `aria-expanded` and `aria-controls`
- **Open**: Focus moves to first item
- **Esc**: Closes and returns focus to trigger
- **Items**: Normal buttons/links in tab order

### Dropdown (Role=menu)
- **Only use if implementing**: Arrow-key navigation, Home/End, typeahead, and roving tabindex
- Most dropdowns should use Action-List pattern instead

### Datepicker
- **Arrow keys**: Move by day in calendar grid
- **PageUp/PageDown**: Switch months
- **Home/End**: Jump to start/end of week
- **Enter/Space**: Select date
- **Esc**: Close and return focus to trigger

### Modal
- **Focus trap**: Focus stays within modal
- **Initial focus**: Set to first focusable element or designated element
- **Esc**: Close modal
- **Close**: Return focus to trigger element

### Tooltip
- **Open**: On hover and focus
- **Close**: On blur and Esc
- **Role**: `role="tooltip"` with `aria-describedby`

## Component States

Use these attributes for state management:

- **error**: `aria-invalid="true"` + visible error text
- **disabled**: `disabled` or `aria-disabled="true"`
- **selected**: `aria-selected="true"`
- **current**: `aria-current="page"`
- **expanded**: `aria-expanded="true|false"`

## Fonts

- **Default**: Fonts are loaded via Google Fonts in `foundations.css` (Sora, Source Sans 3, JetBrains Mono)
- **Self-hosting**: For CSP or privacy requirements, replace Google Fonts import with local `@font-face` rules
- **Weights**: Ensure 400, 500, 600, and 700 are available

## Governance

- **New components require**: Design tokens, state definitions, accessibility notes, Storybook story
- **Before merge**: Visual QA + keyboard testing + contrast check
- **Review process**: At least one accessibility review for new interactive components

---

**Construct** - Build accessible design constructs
