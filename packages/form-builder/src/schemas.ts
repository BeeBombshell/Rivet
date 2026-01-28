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

export const LogicRuleSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    conditions: z.array(z.object({
        fieldId: z.string(),
        operator: z.string(),
        value: z.any()
    })),
    conditionType: z.enum(['all', 'any']),
    action: z.string(),
    targetFieldIds: z.array(z.string())
});

export const CalculationSchema = z.object({
    id: z.string(),
    formula: z.string(),
    targetFieldId: z.string(),
    sourceFieldIds: z.array(z.string())
});

export const FormSettingsSchema = z.object({
    submitButtonText: z.string().optional(),
    successMessage: z.string().optional(),
    redirectUrl: z.string().optional(),
    theme: z.record(z.string()).optional()
});

export const FormSchemaObject = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    fields: z.array(FormFieldSchema),
    logicRules: z.array(LogicRuleSchema).default([]),
    calculations: z.array(CalculationSchema).default([]),
    settings: FormSettingsSchema.optional()
});
