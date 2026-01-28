# Rivet Form Builder

A premium, high-performance form builder library with a Tally-style 3-column UX, built for modern React projects.

## Project Overview

Rivet Form Builder is a monorepo designed to provide a complete solution for building and rendering dynamic forms. It features a sophisticated "No-Code" editor and a robust rendering engine with support for complex conditional logic and real-time calculations.

## Monorepo Structure

This project is managed using `pnpm` workspaces and `Turborepo`.

- **`packages/form-builder`**: The core library (`@rivet/form-builder`).
  - Contains the `FormBuilder` (Editor) component.
  - Contains the `FormRenderer` (Runtime) component.
  - Includes logic engines for conditions and calculations.
- **`apps/demo`**: A Next.js 15 application demonstrating the library.
  - Showcases real-time schema editing and live preview.
  - Includes example templates (Basic, Survey, Order).
  - Demonstrates JSON import/export functionality.

## Development Setup

### Prerequisites

- **Node.js**: v18 or higher.
- **pnpm**: v8 or higher (recommended).

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/rivet-form-builder.git
   cd rivet-form-builder
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start development mode**:
   This will start both the library build and the demo application in watch mode.
   ```bash
   pnpm dev
   ```

## Running the Demo App

The demo app is available at `http://localhost:3000` after running `pnpm dev`.

### Key Features of the Demo:
- **Toggle Mode**: Switch between "Build" (Editor) and "Preview" (Renderer) modes.
- **Live Schema**: View the underlying JSON schema updated in real-time in the side-drawer.
- **Templates**: Load pre-defined form examples to see logic and calculations in action.
- **Import/Export**: Download your created form as a `.json` file or upload an existing one.

## Publishing Instructions

To publish a new version of the `@rivet/form-builder` package:

1. **Build the package**:
   ```bash
   pnpm build
   ```

2. **Version the package**:
   Navigate to the package directory and update the version.
   ```bash
   cd packages/form-builder
   npm version patch # or minor/major
   ```

3. **Publish to NPM**:
   ```bash
   pnpm publish --access public
   ```

*Note: Ensure you are logged into the correct NPM account via `pnpm login`.*

## Contributing

1. Create a new branch for your feature or bugfix.
2. Ensure types are consistent across the `packages/form-builder/src/types` directory.
3. Run `pnpm lint` before submitting a pull request.

## License

ISC
