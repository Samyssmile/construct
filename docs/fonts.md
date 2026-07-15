# Fonts

Construct foundations are network-free. They declare font-family tokens with resilient system fallbacks, but they do not download font files.

## System-font fallback

No extra step is required. Import the normal foundation stylesheet and the browser uses a locally installed Lato or JetBrains Mono face when available, then the generated system fallback stack.

```css
@import '@neuravision/construct/foundations.css';
```

This is the default for strict Content Security Policy, privacy-sensitive, offline, and embedded applications.

## Optional hosted preset

Projects that explicitly accept Google-hosted font requests can import the opt-in preset before foundations:

```css
@import '@neuravision/construct/fonts.css';
@import '@neuravision/construct/foundations.css';
```

The preset requests Lato 400/700/900 and JetBrains Mono 400/500/600/700. Do not use it when the product's privacy or CSP policy forbids third-party font requests.

## Self-hosting

Host the licensed font files in the product and define the faces in application CSS. The URLs below are examples; Construct intentionally does not publish third-party font binaries.

```css
@font-face {
  font-family: 'Lato';
  src: url('/fonts/lato-regular.woff2') format('woff2');
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Lato';
  src: url('/fonts/lato-bold.woff2') format('woff2');
  font-style: normal;
  font-weight: 700;
  font-display: swap;
}

@font-face {
  font-family: 'Lato';
  src: url('/fonts/lato-black.woff2') format('woff2');
  font-style: normal;
  font-weight: 900;
  font-display: swap;
}
```

Add the JetBrains Mono faces only if the application renders code or tabular data with the mono token. Preload only the files needed above the fold; indiscriminate preloading delays other critical resources.

## Product typefaces

A product can keep Construct's sizing and hierarchy while replacing the families. Override both primitive family variables after the Construct imports; the semantic aliases continue to follow them.

```css
:root {
  --font-family-brand: 'Company Sans', 'Segoe UI', sans-serif;
  --font-family-text: 'Company Sans', 'Segoe UI', sans-serif;
  --font-family-mono: 'Company Mono', 'SFMono-Regular', Menlo, monospace;
}
```

Verify every available weight, text reflow at 200% zoom, fallback metrics during loading, and contrast in all supported themes before release.
