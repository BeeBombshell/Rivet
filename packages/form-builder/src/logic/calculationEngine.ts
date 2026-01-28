import { Calculation } from '../types/logic.types';

/**
 * Parses a formula string to extract field references.
 * Supports {fieldId} and @fieldId formats.
 */
export const parseFormula = (formula: string): string[] => {
    const fieldRefs = new Set<string>();

    // Match {fieldId}
    const curlyMatches = formula.matchAll(/\{([^}]+)\}/g);
    for (const match of curlyMatches) {
        fieldRefs.add(match[1]);
    }

    // Match @fieldId (avoiding matching email-like patterns if possible, 
    // but here we assume @fieldId is a distinct token)
    const atMatches = formula.matchAll(/@([a-zA-Z0-9_-]+)/g);
    for (const match of atMatches) {
        fieldRefs.add(match[1]);
    }

    return Array.from(fieldRefs);
};

/**
 * Basic functions implementation
 */
const functions: Record<string, (...args: number[]) => number> = {
    SUM: (...args) => args.reduce((a, b) => a + b, 0),
    AVG: (...args) => args.length === 0 ? 0 : args.reduce((a, b) => a + b, 0) / args.length,
    MIN: (...args) => Math.min(...args),
    MAX: (...args) => Math.max(...args),
};

/**
 * Evaluates a formula string given form values.
 * Returns the calculated numeric result or null if evaluation fails.
 */
export const evaluateFormula = (formula: string, formValues: Record<string, any>): number | null => {
    try {
        let evaluatedFormula = formula;

        // 1. Replace field references with actual values
        const fieldIds = parseFormula(formula);
        fieldIds.forEach(id => {
            const val = formValues[id];
            // If value is missing or not a number, default to 0 for calculations?
            // Or should we return null if a required field is missing?
            // Let's go with 0 for now but maybe make it configurable later.
            const numericVal = (val !== undefined && val !== null && !isNaN(Number(val))) ? Number(val) : 0;

            // Replace {id} or @id
            const curlyRegex = new RegExp(`\\{${id}\\}`, 'g');
            const atRegex = new RegExp(`@${id}`, 'g');

            evaluatedFormula = evaluatedFormula.replace(curlyRegex, numericVal.toString());
            evaluatedFormula = evaluatedFormula.replace(atRegex, numericVal.toString());
        });

        // 2. Handle functions (SUM, AVG, MIN, MAX)
        // This is a simple implementation that looks for FUNC(1, 2, 3)
        // It doesn't handle nested functions yet, but covers the basic requirements.
        Object.keys(functions).forEach(funcName => {
            const funcRegex = new RegExp(`${funcName}\\(([^)]+)\\)`, 'gi');
            evaluatedFormula = evaluatedFormula.replace(funcRegex, (_, argsStr) => {
                const args = argsStr.split(',').map((s: string) => Number(s.trim()));
                return functions[funcName](...args).toString();
            });
        });

        // 3. Safe evaluation of the numeric expression
        // We use a restricted character set to ensure safety before using Function constructor
        // Allowed characters: numbers, operators (+, -, *, /, %, .), parentheses, and spaces.
        if (!/^[0-9+\-*/%().\s]+$/.test(evaluatedFormula)) {
            console.warn('Invalid characters in evaluated formula:', evaluatedFormula);
            return null;
        }

        // Use Function instead of eval for a slightly safer (but still powerful) evaluation
        // eslint-disable-next-line no-new-func
        const result = new Function(`return (${evaluatedFormula})`)();

        return typeof result === 'number' && !isNaN(result) ? result : null;
    } catch (error) {
        console.error('Error evaluating formula:', formula, error);
        return null;
    }
};

/**
 * Processes all calculations in a form schema and returns the updated values.
 */
export const getCalculatedValues = (
    calculations: Calculation[],
    formValues: Record<string, any>
): Record<string, any> => {
    const calculatedValues: Record<string, any> = {};
    const currentValues = { ...formValues };

    calculations.forEach(calc => {
        const result = evaluateFormula(calc.formula, currentValues);
        if (result !== null) {
            calculatedValues[calc.targetFieldId] = result;
            currentValues[calc.targetFieldId] = result;
        }
    });

    return calculatedValues;
};
