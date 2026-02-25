# install-now / i-now

[![npm version](https://img.shields.io/npm/v/install-now.svg)](https://www.npmjs.com/package/install-now)
[![npm version](https://img.shields.io/npm/v/i-now.svg)](https://www.npmjs.com/package/i-now)
[![npm downloads](https://img.shields.io/npm/dm/install-now.svg)](https://www.npmjs.com/package/install-now)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Smart dependency installer - automatically detects package manager and installs dependencies

## Project Overview

This is a monorepo project containing two npm packages:
- `install-now` - Full name version
- `i-now` - Short alias version

Both packages share the same core code, only the package names differ.

## Features

- ✅ Automatically detects if `node_modules` exists
- ✅ If not, automatically detects and selects the appropriate package manager
- ✅ Supports multiple package managers: `bun`, `pnpm`, `yarn`, `cnpm`, `npm`
- ✅ Smart install command selection:
  - Uses `ci` command when lock files exist (npm/pnpm/yarn)
  - Uses `install` command when no lock files exist
- ✅ Cross-platform support (Windows, macOS, Linux)
- ✅ Supports custom priority configuration

## Quick Start

Recommended: use `npx` to run directly:

```bash
# Using full name
npx install-now

# Using short alias (recommended)
npx i-now
```

### As npm script

In your project's `package.json`:

```json
{
  "scripts": {
    "predev": "npx -y i-now",
    "dev": "your-dev-command"
  }
}
```

This way, when users run `npm run dev` for the first time, dependencies will be automatically checked and installed.

## Configuration

The tool supports customizing package manager priority through the `install-now` field in `package.json`.

### Configuration Field

Add the `install-now` field to `package.json`:

```json
{
  "install-now": ["yarn.lock", "pnpm:lock", "yarn", "pnpm"]
}
```

### Priority Rule Types

#### 1. Lock File Rules

Format: `"package-manager.lock"` or `"package-manager:lock"`

Examples:
- `"yarn.lock"` or `"yarn:lock"` - Checks if `yarn.lock` file exists
- `"pnpm.lock"` or `"pnpm:lock"` - Checks if `pnpm-lock.yaml` file exists
- `"bun.lock"` or `"bun:lock"` - Checks if `bun.lockb` file exists
- `"npm.lock"` or `"npm:lock"` - Checks if `package-lock.json` file exists

**Detection Rules**:
- If the corresponding lock file exists and the package manager command is available, use that package manager
- If the lock file doesn't exist or the command is unavailable, skip and continue to the next rule

#### 2. Command Check Rules

Format: Direct package manager name

Examples: `"yarn"`, `"pnpm"`, `"bun"`, `"cnpm"`, `"npm"`

**Detection Rules**:
- Check if the package manager command exists in the system
- If the command exists, use that package manager
- If the command doesn't exist, skip and continue to the next rule

#### 3. packageManager Field Rule

Format: `"packageManager"`

**Detection Rules**:
- Read the `packageManager` field from `package.json` (format like `"pnpm@8.0.0"`)
- Parse the package manager name and check if the command is available
- If available, use that package manager
- If the field doesn't exist or parsing fails, skip and continue to the next rule

### Default Priority Rules

If the `install-now` field is not configured, the tool will use the following default priority:

```json
[
  "bun.lock",
  "pnpm.lock",
  "yarn.lock",
  "npm.lock",
  "packageManager",
  "bun",
  "pnpm",
  "yarn",
  "cnpm",
  "npm"
]
```

**Default Rules Explanation**:
1. First check lock files (bun → pnpm → yarn → npm)
2. Then use the `packageManager` field from `package.json`
3. Finally check available package manager commands in the system by priority

### Configuration Examples

#### Example 1: Prefer yarn, then pnpm

```json
{
  "install-now": ["yarn", "pnpm"]
}
```

#### Example 2: Check lock files first, then use packageManager field

```json
{
  "install-now": ["yarn.lock", "pnpm:lock", "packageManager", "yarn", "pnpm"]
}
```

#### Example 3: Only use pnpm

```json
{
  "install-now": ["pnpm"]
}
```

### Install Command Selection

The tool automatically selects install commands based on whether lock files are used:

- **When using lock files**:
  - `npm` / `pnpm` / `yarn` → Use `ci` command (e.g., `npm ci`, `pnpm ci`, `yarn install --frozen-lockfile`)
  - `bun` → Use `install` command (bun doesn't support ci)

- **When not using lock files**:
  - All package managers → Use `install` command (can generate lock files)

## Discussion

### Why this naming?

- `install-now` - Clear semantics, expresses "install immediately"
- `i-now` - Short and easy to use, `i` = install, `now` = immediately

### Why not use the `ci` package?

- The `ci` package doesn't support `bun` and `cnpm`
- We need more flexible detection logic
- Need to support "use ci when lock exists, use install when no lock" logic

## License

MIT

# TODO

- npm i
- npm ci
- yarn
- pnpm i
- bun i
- bun ci
