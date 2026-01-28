# @rivet/form-builder

Core library for the Rivet Form Builder. Provides a powerful, modular 3-column Editor and a flexible Form Renderer for dynamic, logic-driven forms with a Tally-style UX.

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

## Quick Start

### 1. The Editor
Use `FormBuilder` to create a form building experience in your app.

```tsx
import { FormBuilder } from '@rivet/form-builder';
import '@rivet/form-builder/styles.css'; // Optional: if not using custom styles

const MyEditor = () => {
  const handleSchemaChange = (schema) => {
    console.log('Form Schema Updated:', schema);
  };

  return (
    <div style={{ height: '100vh' }}>
      <FormBuilder 
        onChange={handleSchemaChange} 
      />
    </div>
  );
};
```

### 2. The Renderer
Use `FormRenderer` to display and handle submissions for the forms you've built.

```tsx
import { FormRenderer } from '@rivet/form-builder';

const MyForm = ({ schema }) => {
  const handleSubmit = (data) => {
    console.log('Form Submitted:', data);
  };

  return (
    <FormRenderer 
      form={schema} 
      onSubmit={handleSubmit} 
    />
  );
};
```

## Component API

### `FormBuilder`
The primary interface for building forms.

| Prop | Type | Description |
| :--- | :--- | :--- |
| `initialData` | `FormSchema` | (Optional) The initial form structure to load into the builder. |
| `onChange` | `(schema: FormSchema) => void` | (Optional) Callback triggered whenever the form structure changes. |

### `FormRenderer`
The component that renders the final form to the end-user.

| Prop | Type | Description |
| :--- | :--- | :--- |
| `form` | `FormSchema` | **Required**. The schema object defining the form. |
| `onSubmit` | `(data: any) => void` | **Required**. Callback triggered on successful form submission. |
| `className` | `string` | (Optional) Additional CSS classes for the container. |

---

## Schema Format Reference

The `@rivet/form-builder` uses a JSON-based schema to define the form structure.

### `FormSchema`
```typescript
{
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  logicRules: LogicRule[];
  calculations: Calculation[];
  settings?: FormSettings;
}
```

### `FormField`
Each field in the `fields` array follows this structure:
```typescript
{
  id: string;
  type: 'text' | 'email' | 'number' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'date' | 'phone' | 'url' | 'file' | 'signature' | 'rating';
  label: string;
  placeholder?: string;
  required: boolean;
  defaultValue?: any;
  helpText?: string;
  options?: { label: string; value: string }[]; // For select, radio, checkbox
}
```

### `LogicRule`
Used for conditional visibility and field states.
```typescript
{
  id: string;
  conditions: {
    fieldId: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | ...;
    value: any;
  }[];
  conditionType: 'all' | 'any';
  action: 'show' | 'hide' | 'enable' | 'disable';
  targetFieldIds: string[];
}
```

### `Calculation`
Used for dynamic values based on other fields.
```typescript
{
  id: string;
  formula: string; // e.g., "{{field1}} + {{field2}} * 0.1"
  targetFieldId: string;
  sourceFieldIds: string[];
}
```

---

## Styling Customization

Rivet uses CSS variables for easy theme customization. You can override these in your global CSS:

```css
:root {
  --rivet-primary: #3b82f6;    /* Primary brand color */
  --rivet-bg: #ffffff;         /* Background color */
  --rivet-input-bg: #f9fafb;   /* Input field background */
  --rivet-border: #e5e7eb;     /* Border color */
  --rivet-error: #ef4444;      /* Error text color */
}
```

The library also uses Tailwind CSS classes internally. If you are using Tailwind in your project, ensure that the `@rivet/form-builder` package is included in your `tailwind.config.js` content array:

```javascript
module.exports = {
  content: [
    // ... your project paths
    './node_modules/@rivet/form-builder/dist/**/*.{js,mjs,css}',
  ],
}
```

## Examples

### Contact Form (Basic)
A simple form with name, email, and message.
- [View Schema Example](./examples/basic.json)

### Survey with Logic
If "Do you like coffee?" is "Yes", show "How many cups a day?".
- [View Schema Example](./examples/logic.json)

### Order Form with Calculations
Calculate "Total Price" = "Quantity" * "Price Per Item".
- [View Schema Example](./examples/calc.json)

## Utilities

The library exports several utility functions for schema management:

- `generateZodSchema(formSchema)`: Returns a Zod object for validation.
- `validateFormValues(formSchema, data)`: Helper to validate data against a schema.
- `serializeSchema(schema)` / `deserializeSchema(json)`: Formatted JSON helpers.

## License

ISC
