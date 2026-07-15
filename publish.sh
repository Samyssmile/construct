#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
START_DIR="$(pwd)"
AUTH_DIR=""
AUTH_CONFIG=""
PUBLISH_TOKEN="${NPM_TOKEN:-}"
unset NPM_TOKEN

cleanup() {
  local status=$?

  if [[ -n "$AUTH_CONFIG" ]]; then
    rm -f -- "$AUTH_CONFIG"
  fi
  if [[ -n "$AUTH_DIR" ]]; then
    rmdir -- "$AUTH_DIR" 2>/dev/null || true
  fi

  cd -- "$START_DIR" || true
  return "$status"
}

trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' HUP TERM

cd -- "$ROOT_DIR"

# --- Pre-flight checks ---
echo "🔍 Running pre-flight checks..."

echo "  → Auditing dependency vulnerabilities..."
npm run audit

echo "  → Building generated outputs..."
npm run build

echo "  → Verifying package contracts..."
npm run check

echo "  → Running tests..."
npm test

echo "  → Building Storybook..."
npm run storybook:build

echo "  → Verifying packed contents..."
npm pack --dry-run --ignore-scripts

echo "✅ All checks passed."

# --- Version info ---
NAME=$(node -p "require('./package.json').name")
VERSION=$(node -p "require('./package.json').version")
echo
echo "📦 Publishing: $NAME@$VERSION"

# --- Auth ---
if [[ -n "$PUBLISH_TOKEN" ]]; then
  AUTH_DIR="$(mktemp -d "${TMPDIR:-/tmp}/construct-npm-auth.XXXXXX")"
  AUTH_CONFIG="$AUTH_DIR/npmrc"
  chmod 700 "$AUTH_DIR"
  (umask 077 && printf '//registry.npmjs.org/:_authToken=%s\n' "$PUBLISH_TOKEN" > "$AUTH_CONFIG")
  PUBLISH_TOKEN=""
  chmod 600 "$AUTH_CONFIG"
  export NPM_CONFIG_USERCONFIG="$AUTH_CONFIG"
  echo "🔐 Using NPM_TOKEN for publish (no OTP required)."
  npm publish --access public
else
  OTP=""

  prompt_otp() {
    printf 'Enter your npm OTP: '
    read -r OTP
    OTP="${OTP//[[:space:]]/}"
  }

  prompt_otp
  while ! npm publish --access public --otp="$OTP"; do
    printf '⚠️ Publish failed. New OTP (Enter = retry): '
    read -r NEW_OTP
    NEW_OTP="${NEW_OTP//[[:space:]]/}"
    [[ -n "$NEW_OTP" ]] && OTP="$NEW_OTP"
  done
fi

echo
echo "✅ $NAME@$VERSION published"
echo "🎉 Done."
