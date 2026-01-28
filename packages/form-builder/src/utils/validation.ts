import { z } from 'zod';
import { FormSchema } from '../types/form.types';
import { FieldType, FormField } from '../types/field.types';

/**
 * Generates a Zod schema based on the provided FormSchema.
 * This schema can be used to validate form submissions.
 * @param formSchema The form schema containing fields and validation rules.
 * @returns A Zod object schema.
 */
export const generateZodSchema = (formSchema: FormSchema) => {
    const shape: Record<string, z.ZodTypeAny> = {};

    formSchema.fields.forEach((field) => {
        shape[field.id] = createFieldSchema(field);
    });

    return z.object(shape);
};

/**
 * Validates form data against a FormSchema.
 * @param formSchema The form schema.
 * @param data The form data to validate.
 * @returns Validation result.
 */
export const validateFormValues = (formSchema: FormSchema, data: Record<string, any>) => {
    const schema = generateZodSchema(formSchema);
    return schema.safeParse(data);
};

/**
 * Creates a Zod schema for a single form field.
 * @param field The field configuration.
 * @returns A Zod schema for the field value.
 */
const createFieldSchema = (field: FormField): z.ZodTypeAny => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
        case FieldType.NUMBER:
        case FieldType.RATING:
            let numSchema = z.number({
                invalid_type_error: `${field.label} must be a number`,
            });
            if (field.validation?.min !== undefined) {
                numSchema = numSchema.min(field.validation.min, field.validation.message);
            }
            if (field.validation?.max !== undefined) {
                numSchema = numSchema.max(field.validation.max, field.validation.message);
            }
            fieldSchema = numSchema;
            break;

        case FieldType.CHECKBOX:
            fieldSchema = z.array(z.string()).min(field.required ? 1 : 0, field.validation?.message || `Please select at least one option for ${field.label}`);
            break;

        case FieldType.EMAIL:
            fieldSchema = z.string().email(field.validation?.message || 'Invalid email address');
            break;

        case FieldType.URL:
            fieldSchema = z.string().url(field.validation?.message || 'Invalid URL');
            break;

        case FieldType.DATE:
            // Could be string or Date depending on implementation, usually string from HTML input
            fieldSchema = z.string().or(z.date());
            break;

        default:
            let strSchema = z.string();
            if (field.validation?.pattern) {
                strSchema = strSchema.regex(new RegExp(field.validation.pattern), field.validation.message);
            }
            if (field.validation?.min !== undefined) {
                strSchema = strSchema.min(field.validation.min, field.validation.message);
            }
            if (field.validation?.max !== undefined) {
                strSchema = strSchema.max(field.validation.max, field.validation.message);
            }
            fieldSchema = strSchema;
            break;
    }

    // Handle required vs optional
    const isRequired = field.required || field.validation?.required;

    if (!isRequired) {
        // If not required, allow it to be optional or null or empty string
        if (fieldSchema instanceof z.ZodString) {
            fieldSchema = fieldSchema.optional().or(z.literal(''));
        } else {
            fieldSchema = fieldSchema.optional();
        }
    } else {
        // If required, ensure it's not empty for strings
        if (fieldSchema instanceof z.ZodString) {
            fieldSchema = fieldSchema.min(1, field.validation?.message || `${field.label} is required`);
        }
    }

    return fieldSchema;
};
