import { useMemo } from 'react';
import { FormSchema } from '../types/form.types';
import { getVisibleFields } from '../logic/conditionalEngine';
import { getCalculatedValues } from '../logic/calculationEngine';

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
        return getCalculatedValues(schema.calculations, formValues);
    }, [schema.calculations, formValues]);

    return {
        visibleFieldIds,
        calculatedValues,
    };
};
