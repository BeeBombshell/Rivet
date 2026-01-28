import React, { useEffect, useMemo } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormSchema } from '../../types/form.types';
import { FieldType, FormField } from '../../types/field.types';
import { LogicAction, ConditionOperator, LogicRule, Calculation } from '../../types/logic.types';
import { FieldRenderer } from './FieldRenderer';

interface FormRendererProps {
    form: FormSchema;
    onSubmit: (data: any) => void;
    className?: string;
}

export const FormRenderer: React.FC<FormRendererProps> = ({ form, onSubmit, className }) => {
    const [isMounted, setIsMounted] = React.useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 1. Generate Zod Schema
    const dynamicSchema = useMemo(() => {
        // ... (schema generation stays the same)
        const shape: Record<string, z.ZodTypeAny> = {};
        
        form.fields.forEach((field) => {
            let fieldSchema: z.ZodTypeAny = z.any();

            switch (field.type) {
                case FieldType.TEXT:
                case FieldType.EMAIL:
                case FieldType.TEXTAREA:
                case FieldType.SELECT:
                case FieldType.RADIO:
                case FieldType.DATE:
                case FieldType.PHONE:
                case FieldType.URL:
                    fieldSchema = z.string();
                    if (field.type === FieldType.EMAIL) {
                        fieldSchema = (fieldSchema as z.ZodString).email('Invalid email address');
                    }
                    break;
                case FieldType.NUMBER:
                    fieldSchema = z.coerce.number();
                    break;
                case FieldType.CHECKBOX:
                    fieldSchema = z.array(z.string());
                    break;
                default:
                    fieldSchema = z.any();
            }

            if (field.required) {
                if (fieldSchema instanceof z.ZodString) {
                    fieldSchema = fieldSchema.min(1, `${field.label} is required`);
                } else if (fieldSchema instanceof z.ZodArray) {
                    fieldSchema = fieldSchema.min(1, `Please select at least one ${field.label}`);
                } else {
                    fieldSchema = fieldSchema.refine((val) => val !== undefined && val !== null, {
                        message: `${field.label} is required`,
                    });
                }
            } else {
                fieldSchema = fieldSchema.optional().nullable();
                if (fieldSchema instanceof z.ZodString) {
                    fieldSchema = fieldSchema.or(z.literal(''));
                }
            }
            
            shape[field.id] = fieldSchema;
        });

        return z.object(shape);
    }, [form.fields]);

    const methods = useForm({
        resolver: zodResolver(dynamicSchema),
        defaultValues: form.fields.reduce((acc, field) => {
            acc[field.id] = field.defaultValue ?? (field.type === FieldType.CHECKBOX ? [] : '');
            return acc;
        }, {} as Record<string, any>),
    });

    const { control, setValue, handleSubmit, getValues } = methods;
    const watchedValues = useWatch({ control });

    // 2. Logic Rules Evaluation
    const fieldStates = useMemo(() => {
        const states: Record<string, { hidden: boolean; disabled: boolean }> = {};
        
        // Initialize with field defaults
        form.fields.forEach(f => {
            states[f.id] = { hidden: !!f.hidden, disabled: !!f.disabled };
        });

        // Use getValues() as a fallback if useWatch hasn't provided values yet
        const currentValues = watchedValues || getValues() || {};

        const evaluateCondition = (condition: any) => {
            const value = currentValues[condition.fieldId];
            const target = condition.value;

            switch (condition.operator) {
                case ConditionOperator.EQUALS: return value === target;
                case ConditionOperator.NOT_EQUALS: return value !== target;
                case ConditionOperator.CONTAINS: return String(value || '').includes(String(target));
                case ConditionOperator.NOT_CONTAINS: return !String(value || '').includes(String(target));
                case ConditionOperator.GREATER_THAN: return Number(value || 0) > Number(target);
                case ConditionOperator.LESS_THAN: return Number(value || 0) < Number(target);
                case ConditionOperator.IS_EMPTY: return !value || (Array.isArray(value) && value.length === 0);
                case ConditionOperator.IS_NOT_EMPTY: return !!value && (!Array.isArray(value) || value.length > 0);
                default: return false;
            }
        };

        form.logicRules.forEach(rule => {
            const results = rule.conditions.map(evaluateCondition);
            const isTriggered = rule.conditionType === 'all' 
                ? results.every(r => r) 
                : results.some(r => r);

            if (isTriggered) {
                rule.targetFieldIds.forEach(targetId => {
                    if (!states[targetId]) return;
                    
                    switch (rule.action) {
                        case LogicAction.SHOW: states[targetId].hidden = false; break;
                        case LogicAction.HIDE: states[targetId].hidden = true; break;
                        case LogicAction.ENABLE: states[targetId].disabled = false; break;
                        case LogicAction.DISABLE: states[targetId].disabled = true; break;
                    }
                });
            }
        });

        return states;
    }, [watchedValues, form.logicRules, form.fields, getValues]);

    // 3. Calculations Evaluation
    useEffect(() => {
        const currentValues = watchedValues || getValues() || {};

        form.calculations.forEach(calc => {
            try {
                // Simple formula evaluator: replace {{fieldId}} with value
                let formula = calc.formula;
                calc.sourceFieldIds.forEach(sourceId => {
                    const val = currentValues[sourceId] ?? 0;
                    formula = formula.replace(new RegExp(`\\{\\{${sourceId}\\}\\}`, 'g'), String(val));
                });

                // Evaluation using Function constructor
                const result = new Function(`return ${formula}`)();
                
                // Compare with current form state using getValues for stability
                const currentVal = getValues(calc.targetFieldId);
                if (currentVal !== result) {
                    setValue(calc.targetFieldId, result, { shouldDirty: true });
                }
            } catch (e) {
                console.error('Calculation error:', e);
            }
        });
    }, [watchedValues, form.calculations, setValue, getValues]);

    // To prevent hydration mismatch in Next.js, we wrap the form in a Fragment 
    // and rely on stable defaultValues from getValues() during the first pass.

    return (
        <div className={className}>
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{form.title}</h1>
                {form.description && (
                    <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">{form.description}</p>
                )}
            </div>
            
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                    <div className="space-y-8">
                        {form.fields.map((field) => {
                            const state = fieldStates[field.id];
                            if (state?.hidden) return null;

                            return (
                                <FieldRenderer 
                                    key={field.id} 
                                    field={field} 
                                    disabled={state?.disabled}
                                />
                            );
                        })}
                    </div>
                    
                    <div className="pt-8 border-t border-gray-100">
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-black text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg hover:shadow-xl"
                        >
                            {form.settings?.submitButtonText || 'Submit Form'}
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};
