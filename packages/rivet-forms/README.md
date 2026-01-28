# rivet-forms

Core library for the Rivet Form Builder. Provides a powerful, modular 3-column Editor and a flexible Form Renderer for dynamic, logic-driven forms.

## Features

- **FormBuilder (3-Column Editor)**: 
    - **Field Palette**: Drag-and-drop field types categorization.
    - **Form Canvas**: Real-time form assembly with reordering support.
    - **Config Panel**: Context-aware sidebar for configuring field metadata, logic, and calculations.
- **FormRenderer**: High-performance component to render built forms with full support for conditional visibility and real-time calculations.
- **Conditional Logic Engine**: Sophisticated logic for field visibility and interaction rules.
- **Calculation Engine**: Support for native field formulas and aggregations.
- **Tailwind-powered**: Fully customizable design system using CSS variables and utility classes.

## Installation

```bash
npm install rivet-forms
# or
pnpm add rivet-forms
```

## Basic Usage

### Editor

```tsx
import { FormBuilder } from 'rivet-forms';
import 'rivet-forms/dist/index.css';

const MyEditor = () => {
    return (
        <FormBuilder 
            onChange={(schema) => console.log('Schema Updated:', schema)} 
        />
    );
};
```

### Renderer

```tsx
import { FormRenderer } from 'rivet-forms';

const MyForm = () => {
    return (
        <FormRenderer 
            form={schema} 
            onSubmit={(data) => console.log('Form Submitted:', data)} 
        />
    );
};
```

### Calculation Engine
The engine supports complex formulas for calculated fields:
- **Field References**: `{fieldId}` or `@fieldId`
- **Operators**: `+`, `-`, `*`, `/`, `%`
- **Functions**: `SUM(...)`, `AVG(...)`, `MIN(...)`, `MAX(...)`
- **Dependent Calculations**: Supports multi-level dependency resolution.

### Logic Operators Supported:
- `equals`, `notEquals`
- `contains`, `notContains`
- `greaterThan`, `lessThan`
- `greaterThanOrEqual`, `lessThanOrEqual`
- `isEmpty`, `isNotEmpty`
- `startsWith`, `endsWith`
- `between`

## Development

```bash
pnpm dev
```

Build:

```bash
pnpm build
```
