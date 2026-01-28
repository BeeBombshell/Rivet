# Rivet Form Builder

A modern, high-performance form builder library with a Tally-like UX, built for React projects.

## Project Structure

This is a monorepo managed by `pnpm` and `Turborepo`.

- **`packages/rivet-forms`**: The core form builder library.
- **`apps/demo`**: A Next.js 15 application demonstrating the usage of `rivet-forms`.

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

- **Tally-like UX**: Intuitive drag-and-drop interface for building forms.
- **Conditional Logic**: Powerful engine for field visibility and dynamic behavior.
- **Calculated Fields**: Support for complex formulas using `{fieldId}`, `@fieldId`, math operations, and functions like `SUM`, `AVG`, `MIN`, `MAX`. Supports dependent calculations.
- **Type Safety**: Built with TypeScript from the ground up.
- **Modern Stack**: Next.js, Tailwind CSS, React Hook Form, and Zod.

## License

ISC
