import { FormSchema } from '../types/form.types';
import { FormSchemaObject } from '../schemas';

/**
 * Serializes a FormSchema object to a JSON string.
 * @param schema The FormSchema object to serialize.
 * @returns A JSON string representation of the schema.
 */
export const serializeSchema = (schema: FormSchema): string => {
    return JSON.stringify(schema, null, 2);
};

/**
 * Deserializes a JSON string to a FormSchema object.
 * @param json The JSON string to deserialize.
 * @returns The deserialized FormSchema object.
 * @throws Error if the JSON is invalid.
 */
export const deserializeSchema = (json: string): FormSchema => {
    try {
        return JSON.parse(json) as FormSchema;
    } catch (error) {
        throw new Error(`Failed to deserialize schema: ${error instanceof Error ? error.message : String(error)}`);
    }
};

/**
 * Validates a schema object against the Zod schema.
 * @param schema The schema object to validate.
 * @returns A Zod validation result.
 */
export const validateSchema = (schema: unknown) => {
    return FormSchemaObject.safeParse(schema);
};

/**
 * Migration utility for the form schema.
 * Ensures the schema has all required fields and handles structure updates.
 * @param schema The schema object to migrate.
 * @returns A migrated FormSchema object.
 */
export const migrateSchema = (schema: any): FormSchema => {
    // Current migration: ensure logicRules and calculations are present
    // as these were added in a recent update.
    return {
        id: schema.id || `form_${Date.now()}`,
        title: schema.title || 'Untitled Form',
        description: schema.description || '',
        fields: schema.fields || [],
        logicRules: schema.logicRules || [],
        calculations: schema.calculations || [],
        settings: schema.settings || {
            submitButtonText: 'Submit',
            successMessage: 'Thank you for your submission!',
        },
    };
};
