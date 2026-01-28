import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField } from '../schemas';

interface FormRendererProps {
  form: Form;
  onSubmit: (data: any) => void;
  className?: string;
}

export const FormRenderer: React.FC<FormRendererProps> = ({ form, onSubmit, className }) => {
  // Dynamically create Zod schema from form fields
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  
  form.fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny = z.string();
    
    if (field.type === 'email') {
      fieldSchema = z.string().email('Invalid email address');
    } else if (field.type === 'number') {
      fieldSchema = z.number();
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
              
              {field.type === 'text' || field.type === 'email' || field.type === 'number' ? (
                <input
                  type={field.type === 'number' ? 'number' : 'text'}
                  {...methods.register(field.id, { valueAsNumber: field.type === 'number' })}
                  placeholder={field.placeholder}
                  className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-2 text-xl transition-colors bg-transparent"
                />
              ) : field.type === 'textarea' ? (
                <textarea
                  {...methods.register(field.id)}
                  placeholder={field.placeholder}
                  className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-2 text-xl transition-colors bg-transparent min-h-[100px]"
                />
              ) : null}
              
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
