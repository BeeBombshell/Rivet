# Rivet Form Builder

A premium, high-performance form builder library with a Tally-style 3-column UX, built for React projects.

## Project Structure

This is a monorepo managed by `pnpm` and `Turborepo`.

- **`packages/rivet-forms`**: The core form builder library featuring the modular 3-column Editor.
- **`apps/demo`**: A Next.js 15 application demonstrating the usage of `rivet-forms` with live Editor/Preview toggle.

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v8+)

### Installation

```bash
pnpm install
```

### Development

Start the demo application and the library in watch mode:

```bash
pnpm dev
```

### Build

Build all packages and applications:

```bash
pnpm build
```

## Features

- **Tally-inspired 3-Column Editor**: 
    - **Field Palette**: Categorized draggable field types.
    - **Form Canvas**: Intuitive drop zones and reorderable fields.
    - **Config Panel**: Granular settings for every field, including logic and calculations.
- **Advanced Drag & Drop**: Seamless field addition and reordering powered by `@dnd-kit`.
- **Conditional Logic**: Powerful engine for field visibility and dynamic behavior.
- **Calculated Fields**: Support for complex formulas using `{fieldId}`, `@fieldId`, math operations, and functional aggregations (`SUM`, `AVG`, `MIN`, `MAX`).
- **Undo/Redo & State Management**: Global state management with built-in history stack for seamless undo/redo functionality.
- **Import/Export**: Full schema synchronization via JSON files.
- **Premium Aesthetics**: Styled with modern typography, smooth transitions, and a clean, modular design.
- **Type Safety**: Built with TypeScript from the ground up.

## License

ISC
