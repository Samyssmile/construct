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

Construct ships as CSS and design tokens with no runtime JavaScript, so the attack surface is small.
Reports we are especially interested in:

- CSS that could enable content injection or clickjacking in consuming apps
- Supply-chain concerns in the published package contents
- Accessibility regressions that create a safety/usability risk

Thank you for helping keep Construct and its users safe.
