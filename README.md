# Construct - Design System

> Build accessible design constructs for modern web applications

**Construct** is an open-source, token-based design system foundation that provides a consistent, accessible UI across Angular, React, Svelte, and vanilla HTML/CSS.

## ✨ Features

- **Design Tokens** - Single source of truth for colors, typography, spacing, and more
- **Framework-Agnostic CSS** - Works with any framework or vanilla HTML
- **Accessibility First** - WCAG 2.1 AA compliant, keyboard navigation, ARIA support
- **Token Pipeline** - Automated build system (JSON → CSS Variables + TypeScript)
- **Comprehensive Components** - 16+ production-ready components
- **Storybook Documentation** - Interactive component explorer with a11y testing
- **TypeScript Support** - Full type definitions for tokens

## 🚀 Quick Start

### Installation

```bash
npm install @construct/design
```

### Usage

Import the foundation styles and components:

```css
@import "@construct/design/foundations.css";
@import "@construct/design/components/components.css";
```

Use the components in your HTML:

```html
<button class="ct-button">Primary Button</button>
<button class="ct-button ct-button--secondary">Secondary</button>
```

Or use design tokens directly:

```css
.custom-component {
  background: var(--color-brand-primary);
  padding: var(--space-4);
  border-radius: var(--radius-control);
}
```

## 📦 What's Included

```
@construct/design/
├── tokens/                     # Design tokens (JSON, CSS, TS)
│   ├── primitives.json         # Base values (colors, sizes)
│   ├── semantic.light.json     # Semantic mappings
│   ├── tokens.css              # CSS Custom Properties
│   ├── tokens.json             # Resolved JSON output
│   └── tokens.ts               # TypeScript exports
├── components/                 # Framework-agnostic styles
│   ├── components.css          # All component styles
│   └── README.md               # Component documentation
├── foundations.css             # Reset, typography, layout utilities
└── docs/                       # Guidelines & best practices
    └── guidelines.md
```

## 🎨 Design Tokens

Construct uses a two-tier token system:

### Primitives
Raw design values (colors, spacing, typography)

```json
{
  "color": {
    "ocean": {
      "700": "#174C5D"
    }
  },
  "space": {
    "4": 8
  }
}
```

### Semantic
Contextual aliases that reference primitives

```json
{
  "color": {
    "brand": {
      "primary": "{color.ocean.700}"
    }
  }
}
```

### Build Pipeline

The token build system automatically generates:
- **CSS Variables** (`--color-brand-primary`)
- **TypeScript exports** with type definitions
- **Resolved JSON** for tooling

```bash
npm run build
```

## 🧩 Components

### Base Components
- Button (6 variants, 3 sizes)
- Input (text, email, password, search)
- Select (native dropdown)
- Textarea
- Checkbox
- Radio
- Switch

### Complex Components
- Card
- Table / Data Table
- Modal
- Toast (notifications)
- Tabs
- Dropdown
- Pagination
- Breadcrumbs
- Datepicker

[View all components in Storybook](https://your-org.github.io/construct-design)

## ♿ Accessibility

Accessibility is a core principle of Construct:

- ✅ Semantic HTML
- ✅ ARIA attributes where needed
- ✅ Full keyboard navigation
- ✅ Focus management
- ✅ WCAG 2.1 AA contrast standards
- ✅ Screen reader support
- ✅ Respects `prefers-reduced-motion`
- ✅ Live regions for dynamic content

See [Guidelines](docs/guidelines.md) for detailed accessibility rules.

## 🛠️ Development

### Run Storybook

```bash
npm run storybook
```

Open http://localhost:6006

### Build Tokens

```bash
npm run build
```

### Check Token Outputs

```bash
npm run check
```

## 🎯 Framework Support

### Current: CSS/HTML
All components work with vanilla HTML and can be used with any framework.

### Planned: Framework Libraries
- Angular (standalone components)
- React (React 18+)
- Svelte (Svelte 4+)

## 📖 Documentation

- [Design Guidelines](docs/guidelines.md) - Do/Don'ts, accessibility rules
- [Component Usage](components/README.md) - HTML patterns and examples
- [Token Details](tokens/README.md) - Token structure and naming

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines (coming soon).

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Credits

Built with accessibility and modern design principles in mind.

---

**Construct** - Build accessible design constructs
