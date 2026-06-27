import remarkGfm from 'remark-gfm';

/** @type { import('@storybook/html-vite').StorybookConfig } */

// On-brand favicon (ink tile · orange datum · concrete "C") — replaces the
// default Storybook mark. Inlined as a data URI so no static dir wiring is needed.
const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%2316130F'/%3E%3Crect x='6' y='7.5' width='3' height='17' rx='1.5' fill='%23F4581C'/%3E%3Cpath d='M24 9.6 A8.6 8.6 0 1 0 24 22.4' fill='none' stroke='%23FAFAF8' stroke-width='3.6' stroke-linecap='round'/%3E%3C/svg%3E";

const config = {
  stories: ['../stories/**/*.stories.js', '../stories/docs/*.mdx'],
  addons: [
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-docs',
      // Enable GitHub-flavoured markdown so the docs' pipe tables render as
      // real <table>s (MDX v3 does not include GFM by default).
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm]
          }
        }
      }
    },
    '@storybook/addon-themes',
    '@storybook/addon-vitest'
  ],

  framework: {
    name: '@storybook/html-vite',
    options: {}
  },

  managerHead: (head) => `
    ${head}
    <link rel="icon" type="image/svg+xml" href="${FAVICON}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" />
    <style>
      /* ---- Construct chrome polish -----------------------------------------
         The base look comes from theme.js (stable). These rules only touch
         stable structural hooks (data-* attributes), never hashed emotion
         class names, per Storybook's manager-CSS fragility. */

      /* The datum: the selected story carries one safety-orange edge — the same
         signature the design system uses for "what is active/current".
         (The selected node is a div.sidebar-item[data-selected], not an <a>.) */
      .sidebar-item[data-selected='true'] {
        box-shadow: inset 3px 0 0 0 #F4581C;
        font-weight: 700;
      }

      /* Section roots (GET STARTED / FOUNDATIONS / COMPONENTS / PATTERNS):
         engineered, tracked-out labels. */
      .sidebar-subheading {
        letter-spacing: 0.12em !important;
        font-weight: 700 !important;
        color: #66604E !important;
      }

      /* Crisper type rendering for the Manrope chrome. */
      body, .sidebar-container {
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
      }
    </style>
  `
};

export default config;
