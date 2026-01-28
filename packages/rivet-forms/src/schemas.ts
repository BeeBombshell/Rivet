import { z } from 'zod';

export const FieldTypeSchema = z.enum([
    'text',
    'textarea',
    'number',
    'email',
    'date',
    'select',
    'checkbox',
    'radio',
    'section',
    'page-break'
]);

export type FieldType = z.infer<typeof FieldTypeSchema>;

export const FormFieldSchema = z.object({
    id: z.string(),
    type: FieldTypeSchema,
    label: z.string(),
    placeholder: z.string().optional(),
    helpText: z.string().optional(),
    required: z.boolean().default(false),
    options: z.array(z.object({
        label: z.string(),
        value: z.string()
    })).optional(),
    validation: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
        pattern: z.string().optional(),
    }).optional()
});

export type FormField = z.infer<typeof FormFieldSchema>;

export const FormSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    fields: z.array(FormFieldSchema)
});

export type Form = z.infer<typeof FormSchema>;
