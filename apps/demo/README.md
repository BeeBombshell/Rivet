# Rivet Form Builder Demo App

A modern Next.js 15 application showcasing the premium 3-column Editor and robust Form Renderer of the `@rivet/form-builder` library.

## Key Features

- **Premium 3-Column Editor**: A Tally-inspired interface for building forms with a categorized palette, drag-and-drop canvas, and live configuration side panel.
- **Interactive Live Preview**: Toggle between "Editor" and "Preview" modes to see your form changes instantly.
- **Full Engine Showcase**: Tested with complex conditional logic rules and multi-level calculated fields.
- **Real-time Schema visualization**: A built-in terminal view to watch your form's JSON schema evolve as you build.

## Getting Started

### Installation

Ensure you have installed dependencies at the root:

```bash
pnpm install
```

### Development

Run the demo app (along with the library watch mode):

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Running the Demo

1. **Explore the Editor**: Try dragging new fields from the left palette onto the canvas.
2. **Configure Fields**: Select a field on the canvas to open the right-side configuration panel. 
3. **Test Examples**: Use the selector in the header to switch between pre-defined form scenarios:
    - **Basic**: A simple contact form.
    - **Survey**: Demonstrates how to use "Logic" in the config panel to show/hide fields.
    - **Order**: Shows how to use "Calculations" to automatically sum totals.
4. **Export/Import**: Save your work using the "Export" button and reload it later via "Import".
5. **Preview & Test**: Click "Preview Form" to see the final user-facing form. Fill it out and hit submit to see the captured data in the "Console" side-panel.

### Example Schemas

All examples are located in `src/examples/*.ts` and are exported via `src/examples/index.ts`. They provide a great starting point for understanding how the `FormSchema` is structured.

## Configuration

The demo app uses the `@rivet/form-builder` package from the workspace. Any changes made to the library source are reflected in real-time in the editor.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Drag & Drop**: `@dnd-kit`
- **Library**: `@rivet/form-builder` (Local Workspace)
