import { useState, useCallback } from 'react';
import { FormSchema, BuilderState } from '../types/form.types';
import { FormField } from '../types/field.types';
import { LogicRule, Calculation } from '../types/logic.types';

export const useFormBuilder = (initialSchema: FormSchema) => {
    const [state, setState] = useState<BuilderState>({
        schema: initialSchema,
        selectedFieldId: null,
        isDragging: false,
        history: {
            past: [],
            future: [],
        },
    });

    const updateSchema = useCallback((newSchema: FormSchema, saveToHistory = true) => {
        setState((prev) => {
            const nextHistory = saveToHistory
                ? {
                    past: [...prev.history.past, prev.schema].slice(-20), // Limit history to 20 steps
                    future: [],
                }
                : prev.history;

            return {
                ...prev,
                schema: newSchema,
                history: nextHistory,
            };
        });
    }, []);

    const undo = useCallback(() => {
        setState((prev) => {
            if (prev.history.past.length === 0) return prev;

            const previous = prev.history.past[prev.history.past.length - 1];
            const newPast = prev.history.past.slice(0, prev.history.past.length - 1);

            return {
                ...prev,
                schema: previous,
                history: {
                    past: newPast,
                    future: [prev.schema, ...prev.history.future],
                },
            };
        });
    }, []);

    const redo = useCallback(() => {
        setState((prev) => {
            if (prev.history.future.length === 0) return prev;

            const next = prev.history.future[0];
            const newFuture = prev.history.future.slice(1);

            return {
                ...prev,
                schema: next,
                history: {
                    past: [...prev.history.past, prev.schema],
                    future: newFuture,
                },
            };
        });
    }, []);

    // Field Actions
    const addField = useCallback((field: FormField) => {
        const newSchema = {
            ...state.schema,
            fields: [...state.schema.fields, field],
        };
        updateSchema(newSchema);
    }, [state.schema, updateSchema]);

    const removeField = useCallback((fieldId: string) => {
        const newSchema = {
            ...state.schema,
            fields: state.schema.fields.filter((f) => f.id !== fieldId),
            logicRules: state.schema.logicRules.filter((r) => !r.targetFieldIds.includes(fieldId)),
            calculations: state.schema.calculations.filter((c) => c.targetFieldId !== fieldId),
        };
        updateSchema(newSchema);
        if (state.selectedFieldId === fieldId) {
            setSelectedFieldId(null);
        }
    }, [state.schema, state.selectedFieldId, updateSchema]);

    const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
        const newSchema = {
            ...state.schema,
            fields: state.schema.fields.map((f) =>
                f.id === fieldId ? { ...f, ...updates } as FormField : f
            ),
        };
        updateSchema(newSchema);
    }, [state.schema, updateSchema]);

    const reorderFields = useCallback((startIndex: number, endIndex: number) => {
        const newFields = Array.from(state.schema.fields);
        const [removed] = newFields.splice(startIndex, 1);
        newFields.splice(endIndex, 0, removed);

        const newSchema = {
            ...state.schema,
            fields: newFields,
        };
        updateSchema(newSchema);
    }, [state.schema, updateSchema]);

    // Logic Actions
    const addLogicRule = useCallback((rule: LogicRule) => {
        const newSchema = {
            ...state.schema,
            logicRules: [...state.schema.logicRules, rule],
        };
        updateSchema(newSchema);
    }, [state.schema, updateSchema]);

    const removeLogicRule = useCallback((ruleId: string) => {
        const newSchema = {
            ...state.schema,
            logicRules: state.schema.logicRules.filter((r) => r.id !== ruleId),
        };
        updateSchema(newSchema);
    }, [state.schema, updateSchema]);

    const updateLogicRule = useCallback((ruleId: string, updates: Partial<LogicRule>) => {
        const newSchema = {
            ...state.schema,
            logicRules: state.schema.logicRules.map((r) =>
                r.id === ruleId ? { ...r, ...updates } : r
            ),
        };
        updateSchema(newSchema);
    }, [state.schema, updateSchema]);

    // Calculation Actions
    const addCalculation = useCallback((calculation: Calculation) => {
        const newSchema = {
            ...state.schema,
            calculations: [...state.schema.calculations, calculation],
        };
        updateSchema(newSchema);
    }, [state.schema, updateSchema]);

    const removeCalculation = useCallback((calculationId: string) => {
        const newSchema = {
            ...state.schema,
            calculations: state.schema.calculations.filter((c) => c.id !== calculationId),
        };
        updateSchema(newSchema);
    }, [state.schema, updateSchema]);

    const updateCalculation = useCallback((calcId: string, updates: Partial<Calculation>) => {
        const newSchema = {
            ...state.schema,
            calculations: state.schema.calculations.map((c) =>
                c.id === calcId ? { ...c, ...updates } : c
            ),
        };
        updateSchema(newSchema);
    }, [state.schema, updateSchema]);

    const resetSchema = useCallback((newSchema: FormSchema) => {
        setState((prev) => ({
            ...prev,
            schema: newSchema,
            history: { past: [], future: [] }, // Reset history on major schema change
        }));
    }, []);

    const setSelectedFieldId = useCallback((fieldId: string | null) => {
        setState((prev) => ({ ...prev, selectedFieldId: fieldId }));
    }, []);

    const setIsDragging = useCallback((isDragging: boolean) => {
        setState((prev) => ({ ...prev, isDragging }));
    }, []);

    return {
        schema: state.schema,
        selectedFieldId: state.selectedFieldId,
        isDragging: state.isDragging,
        actions: {
            addField,
            removeField,
            updateField,
            reorderFields,
            addLogicRule,
            removeLogicRule,
            updateLogicRule,
            addCalculation,
            removeCalculation,
            updateCalculation,
            setSelectedFieldId,
            setIsDragging,
            undo,
            redo,
            resetSchema,
            canUndo: state.history.past.length > 0,
            canRedo: state.history.future.length > 0,
        },
    };
};
