import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormSchema } from '../types/form.types';
import { FormField, FieldType, FieldOption } from '../types/field.types';
import {
    TextField,
    EmailField,
    NumberField,
    TextareaField,
    SelectField,
    CheckboxField,
    RadioField,
    DateField,
    FileUploadField
} from './fields';

interface FormRendererProps {
  form: FormSchema;
  onSubmit: (data: any) => void;
  className?: string;
}

export const FormRenderer: React.FC<FormRendererProps> = ({ form, onSubmit, className }) => {
  // Dynamically create Zod schema from form fields
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  
  form.fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny = z.string();
    
    if (field.type === FieldType.EMAIL) {
      fieldSchema = z.string().email('Invalid email address');
    } else if (field.type === FieldType.SELECT || field.type === FieldType.RADIO) {
      fieldSchema = z.string();
    } else if (field.type === FieldType.CHECKBOX) {
      fieldSchema = z.array(z.string());
    } else if (field.type === FieldType.DATE) {
        fieldSchema = z.string(); // Or z.date() if we parse it
    } else if (field.type === FieldType.FILE) {
        fieldSchema = z.any();
    }
    
    if (field.required) {
      if (fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.min(1, `${field.label} is required`);
      }
    } else {
      fieldSchema = fieldSchema.optional().or(z.literal(''));
    }
    
    schemaShape[field.id] = fieldSchema;
  });

  const dynamicSchema = z.object(schemaShape);

  const methods = useForm({
    resolver: zodResolver(dynamicSchema),
  });

  return (
    <div className={className}>
      <h1 className="text-4xl font-bold mb-2">{form.title}</h1>
      {form.description && <p className="text-gray-500 mb-8">{form.description}</p>}
      
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          {form.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="block text-lg font-medium text-gray-900">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              <div className="mt-2">
                {renderField(field, methods)}
              </div>
              
              {methods.formState.errors[field.id] && (
                <p className="text-red-500 text-sm">
                  {methods.formState.errors[field.id]?.message as string}
                </p>
              )}
            </div>
          ))}
          
          <button
            type="submit"
            className="mt-8 bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
          >
            Submit
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

const renderField = (field: FormField, methods: any) => {
    const { register, setValue, watch, formState: { errors } } = methods;
    const value = watch(field.id);
    const error = errors[field.id]?.message as string;
    const props = {
        field,
        value,
        onChange: (val: any) => setValue(field.id, val, { shouldValidate: true }),
        error,
    };

    switch (field.type) {
        case FieldType.TEXT:
            return <TextField {...(props as any)} />;
        case FieldType.EMAIL:
            return <EmailField {...(props as any)} />;
        case FieldType.NUMBER:
            return <NumberField {...(props as any)} />;
        case FieldType.TEXTAREA:
            return <TextareaField {...(props as any)} />;
        case FieldType.SELECT:
            return <SelectField {...(props as any)} />;
        case FieldType.CHECKBOX:
            return <CheckboxField {...(props as any)} />;
        case FieldType.RADIO:
            return <RadioField {...(props as any)} />;
        case FieldType.DATE:
            return <DateField {...(props as any)} />;
        case FieldType.FILE:
            return <FileUploadField {...(props as any)} />;
        default:
            return null;
    }
};
