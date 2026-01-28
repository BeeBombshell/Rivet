# @rivet/form-builder

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
npm install @rivet/form-builder
# or
pnpm add @rivet/form-builder
```

## Basic Usage

### Editor

```tsx
import { FormBuilder } from '@rivet/form-builder';
import '@rivet/form-builder/styles.css';

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
import { FormRenderer } from '@rivet/form-builder';

const MyForm = () => {
    return (
        <FormRenderer 
            form={schema} 
            onSubmit={(data) => console.log('Form Submitted:', data)} 
        />
    );
};
```

### State Management Hook

`useFormBuilder` is a custom hook provided for developers who want to build their own UI around the Rivet state engine. It manages form schema, field actions, logic, and calculations with built-in undo/redo support.

```tsx
import { useFormBuilder } from '@rivet/form-builder';

const MyCustomBuilder = () => {
    const { schema, actions } = useFormBuilder(initialSchema);

    return (
        <div>
            <button onClick={() => actions.addField({ type: 'text', label: 'New Field', ... })}>
                Add Field
            </button>
            <button onClick={actions.undo} disabled={!actions.canUndo}>Undo</button>
            <button onClick={actions.redo} disabled={!actions.canRedo}>Redo</button>
            {/* Render your custom UI using schema.fields */}
        </div>
    );
};
```

#### Available Actions:
- **Fields**: `addField`, `removeField`, `updateField`, `reorderFields`
- **Logic**: `addLogicRule`, `removeLogicRule`
- **Calculations**: `addCalculation`, `removeCalculation`
- **History**: `undo`, `redo`, `canUndo`, `canRedo`
- **UI State**: `setSelectedFieldId`, `setIsDragging`

### Calculation Engine
The engine supports complex formulas for calculated fields:
- **Field References**: `{fieldId}` or `@fieldId`
- **Operators**: `+`, `-`, `*`, `/`, `%`
- **Functions**: `SUM(...)`, `AVG(...)`, `MIN(...)`, `MAX(...)`
- **Dependent Calculations**: Supports multi-level dependency resolution.

### Validation & Schema Utilities

The library provides utilities for schema management and dynamic form validation:

#### Schema Utilities
```tsx
import { serializeSchema, deserializeSchema, validateSchema, migrateSchema } from '@rivet/form-builder';

// Serialize schema to JSON
const json = serializeSchema(formSchema);

// Deserialize JSON to schema
const schema = deserializeSchema(json);

// Validate schema structure
const result = validateSchema(schemaObject);
if (!result.success) {
    console.log(result.error.errors);
}

// Migrate legacy schemas
const migratedSchema = migrateSchema(oldSchema);
```

#### Dynamic Form Validation
```tsx
import { generateZodSchema, validateFormValues } from '@rivet/form-builder';

// Generate Zod schema from form schema
const zodSchema = generateZodSchema(formSchema);

// Validate form data
const result = validateFormValues(formSchema, formData);
if (!result.success) {
    result.error.errors.forEach(err => {
        console.log(`${err.path}: ${err.message}`);
    });
}
```

**Supported Validations**:
- **Text/TextArea**: min/max length, regex patterns
- **Number/Rating**: min/max values
- **Email**: email format validation
- **URL**: URL format validation
- **Checkbox**: array validation with min selection
- **Date**: date/string validation
- **Required/Optional**: automatic handling based on field configuration

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
