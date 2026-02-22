# SwiftClick

A macOS auto-clicker built with Electron, React, and TypeScript.

## Features

- Configurable click interval (10ms – 5000ms)
- Left, right, or middle mouse button support
- Single or double click modes
- Optional click count limit (up to 1000 clicks, or unlimited)
- Global hotkey to toggle clicking from anywhere
- Settings persisted across sessions

## Requirements

- macOS (uses native Objective-C bindings for mouse input)

## Development Setup

### Install

```bash
bun run install
```

### Run in Development

```bash
bun run dev
```

### Type Check

```bash
bun run typecheck
```

### Lint & Format

```bash
bun run lint
bun run format
```

## Build

```bash
# Build for macOS (creates a distributable .dmg)
bun run build:mac
```

## Tech Stack

- [Electron](https://www.electronjs.org/) — desktop shell
- [electron-vite](https://electron-vite.org/) — build tooling
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) — UI
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [koffi](https://koffi.dev/) + [objc-js](https://github.com/iamEvanYT/objc-js) — native macOS mouse input
