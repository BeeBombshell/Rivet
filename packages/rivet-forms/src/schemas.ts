import { z } from 'zod';
import { FieldType } from './types/field.types';

export const FieldTypeSchema = z.nativeEnum(FieldType);

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

export const FormSchemaObject = z.object({
    title: z.string(),
    description: z.string().optional(),
    fields: z.array(FormFieldSchema)
});
