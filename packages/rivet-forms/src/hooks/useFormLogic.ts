import { useMemo } from 'react';
import { FormSchema } from '../types/form.types';
import { getVisibleFields } from '../logic/conditionalEngine';

export interface FormLogicResult {
    visibleFieldIds: Set<string>;
    calculatedValues: Record<string, any>;
}

export const useFormLogic = (schema: FormSchema, formValues: Record<string, any>): FormLogicResult => {
    // 1. Calculate Visibility
    const visibleFieldIds = useMemo(() => {
        return getVisibleFields(schema, formValues);
    }, [schema, formValues]);

    // 2. Calculate Field Values
    const calculatedValues = useMemo(() => {
        const results: Record<string, any> = {};

        schema.calculations.forEach(calc => {
            let formula = calc.formula;
            let canEvaluate = true;

            // Simple template replacement: {{fieldId}}
            const variableRegex = /\{\{([^}]+)\}\}/g;
            const substitutedFormula = formula.replace(variableRegex, (match, fieldId) => {
                const value = formValues[fieldId.trim()];
                if (value === undefined || value === null || value === '') {
                    // If a required field for calculation is missing, we might want to skip or use 0
                    // For now, let's treat it as 0 for numbers or empty string
                    return '0';
                }
                return typeof value === 'string' ? `"${value}"` : value;
            });

            try {
                // Warning: new Function is used here for simplicity in a hackathon context.
                // In a production environment, use a safer expression parser.
                const evaluation = new Function(`return ${substitutedFormula}`);
                results[calc.targetFieldId] = evaluation();
            } catch (error) {
                console.error(`Error evaluating formula for field ${calc.targetFieldId}:`, error);
                results[calc.targetFieldId] = undefined;
            }
        });

        return results;
    }, [schema.calculations, formValues]);

    return {
        visibleFieldIds,
        calculatedValues,
    };
};
