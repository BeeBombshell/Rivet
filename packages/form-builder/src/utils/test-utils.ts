import { FieldType } from '../types/field.types';
import { FormSchema } from '../types/form.types';
import { serializeSchema, deserializeSchema, validateSchema } from './schema';
import { generateZodSchema } from './validation';

const testSchema: FormSchema = {
    id: 'test-form',
    title: 'Test Form',
    fields: [
        {
            id: 'name',
            type: FieldType.TEXT,
            label: 'Name',
            required: true,
            placeholder: 'Enter name',
            validation: { min: 3 }
        },
        {
            id: 'age',
            type: FieldType.NUMBER,
            label: 'Age',
            required: false,
            placeholder: 'Enter age',
            validation: { min: 18 }
        },
        {
            id: 'email',
            type: FieldType.EMAIL,
            label: 'Email',
            required: true,
            placeholder: 'Enter email'
        }
    ],
    logicRules: [],
    calculations: []
};

console.log('--- Testing Serialization ---');
const json = serializeSchema(testSchema);
console.log('Serialized JSON length:', json.length);

const decoded = deserializeSchema(json);
console.log('Deserialized match:', JSON.stringify(testSchema) === JSON.stringify(decoded));

console.log('\n--- Testing Schema Validation ---');
const schemaValidation = validateSchema(testSchema);
console.log('Schema valid:', schemaValidation.success);
if (!schemaValidation.success) {
    console.log('Schema Errors:', schemaValidation.error.errors);
}

console.log('\n--- Testing Form Data Validation ---');
const zodSchema = generateZodSchema(testSchema);

const validData = {
    name: 'John Doe',
    age: 25,
    email: 'john@example.com'
};

const invalidData = {
    name: 'Jo',
    age: 15,
    email: 'not-an-email'
};

const validResult = zodSchema.safeParse(validData);
console.log('Valid data test:', validResult.success);

const invalidResult = zodSchema.safeParse(invalidData);
console.log('Invalid data test (expect false):', invalidResult.success);
if (!invalidResult.success) {
    console.log('Validation Errors count:', invalidResult.error.errors.length);
    invalidResult.error.errors.forEach(err => {
        console.log(`- ${err.path.join('.')}: ${err.message}`);
    });
}
