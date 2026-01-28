# rivet-forms

Core library for the Rivet Form Builder. Provides components and hooks for building dynamic, logic-driven forms.

## Features

- **FormBuilder**: The main UI component for building forms.
- **Conditional Logic Engine**: Sophisticated logic for field visibility and rules.
- **Calculated Fields**: Support for field formulas.
- **Tailwind-powered**: Easily customizable using CSS variables.

## Installation

```bash
npm install rivet-forms
# or
pnpm add rivet-forms
```

## Basic Usage

```tsx
import { FormBuilder } from 'rivet-forms';
import 'rivet-forms/dist/index.css';

const MyForm = () => {
    return (
        <FormBuilder 
            onSave={(schema) => console.log(schema)} 
        />
    );
};
```

### Calculation Engine
The engine supports complex formulas for calculated fields:
- **Field References**: `{fieldId}` or `@fieldId`
- **Operators**: `+`, `-`, `*`, `/`, `%`
- **Functions**: `SUM(...)`, `AVG(...)`, `MIN(...)`, `MAX(...)`
- **Dependent Calculations**: Calculations can reference other calculated fields.

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
