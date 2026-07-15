# Security Policy

## Supported Versions

The latest published `2.x` release of `@neuravision/construct` receives security updates.

| Version | Supported |
|---------|-----------|
| 2.x     | ✅ |
| < 2.0   | ❌ |

## Reporting a Vulnerability

Please **do not** report security vulnerabilities through public GitHub issues.

Instead, use GitHub's private vulnerability reporting:

1. Go to the [**Security** tab](https://github.com/Samyssmile/construct/security) of this repository
2. Click **"Report a vulnerability"**
3. Provide a clear description, affected versions, and reproduction steps

We will acknowledge your report as soon as possible and keep you updated on the fix.

## Scope

Construct ships CSS and design tokens plus opt-in, dependency-free headless behavior modules. Importing
the behavior entry has no side effect; consumers explicitly attach controllers to caller-owned DOM.
Reports we are especially interested in:

- CSS that could enable content injection or clickjacking in consuming apps
- Focus, event, or overlay behavior that can expose or activate unintended UI
- Custom-theme compiler inputs that escape their declared selector or output boundary
- Supply-chain concerns in the published package contents
- Accessibility regressions that create a safety/usability risk

Thank you for helping keep Construct and its users safe.
