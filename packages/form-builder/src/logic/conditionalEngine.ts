import { Condition, ConditionOperator, LogicRule, LogicAction } from '../types/logic.types';
import { FormSchema } from '../types/form.types';

export const evaluateCondition = (condition: Condition, formValues: Record<string, any>): boolean => {
    const { fieldId, operator, value: conditionValue } = condition;
    const fieldValue = formValues[fieldId];

    switch (operator) {
        case ConditionOperator.EQUALS:
            return fieldValue === conditionValue;
        case ConditionOperator.NOT_EQUALS:
            return fieldValue !== conditionValue;
        case ConditionOperator.CONTAINS:
            if (Array.isArray(fieldValue)) {
                return fieldValue.includes(conditionValue);
            }
            if (typeof fieldValue === 'string') {
                return fieldValue.includes(conditionValue as string);
            }
            return false;
        case ConditionOperator.NOT_CONTAINS:
            if (Array.isArray(fieldValue)) {
                return !fieldValue.includes(conditionValue);
            }
            if (typeof fieldValue === 'string') {
                return !fieldValue.includes(conditionValue as string);
            }
            return true;
        case ConditionOperator.GREATER_THAN:
            return Number(fieldValue) > Number(conditionValue);
        case ConditionOperator.LESS_THAN:
            return Number(fieldValue) < Number(conditionValue);
        case ConditionOperator.GREATER_THAN_OR_EQUAL:
            return Number(fieldValue) >= Number(conditionValue);
        case ConditionOperator.LESS_THAN_OR_EQUAL:
            return Number(fieldValue) <= Number(conditionValue);
        case ConditionOperator.IS_EMPTY:
            return fieldValue === undefined || fieldValue === null || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0);
        case ConditionOperator.IS_NOT_EMPTY:
            return fieldValue !== undefined && fieldValue !== null && fieldValue !== '' && (!Array.isArray(fieldValue) || fieldValue.length > 0);
        case ConditionOperator.STARTS_WITH:
            return typeof fieldValue === 'string' && fieldValue.startsWith(conditionValue as string);
        case ConditionOperator.ENDS_WITH:
            return typeof fieldValue === 'string' && fieldValue.endsWith(conditionValue as string);
        case ConditionOperator.BETWEEN:
            if (Array.isArray(conditionValue) && conditionValue.length === 2) {
                const val = Number(fieldValue);
                return val >= Number(conditionValue[0]) && val <= Number(conditionValue[1]);
            }
            return false;
        default:
            return false;
    }
};

export const evaluateRule = (rule: LogicRule, formValues: Record<string, any>): boolean => {
    const { conditions, conditionType } = rule;

    if (conditions.length === 0) return true;

    if (conditionType === 'all') {
        return conditions.every(condition => evaluateCondition(condition, formValues));
    } else {
        return conditions.some(condition => evaluateCondition(condition, formValues));
    }
};

/**
 * Returns a set of field IDs that should be hidden based on logic rules.
 */
export const getVisibleFields = (schema: FormSchema, formValues: Record<string, any>): Set<string> => {
    const hiddenFields = new Set<string>();

    // Default visibility follows the schema (hidden property)
    schema.fields.forEach(field => {
        if (field.hidden) {
            hiddenFields.add(field.id);
        }
    });

    schema.logicRules.forEach(rule => {
        const isTriggered = evaluateRule(rule, formValues);

        rule.targetFieldIds.forEach(targetId => {
            if (rule.action === LogicAction.SHOW) {
                if (isTriggered) {
                    hiddenFields.delete(targetId);
                } else if (!schema.fields.find(f => f.id === targetId)?.hidden) {
                    // If rule says SHOW but it's not triggered, and it's NOT hidden by default, hide it?
                    // Usually logic like "SHOW IF X" implies HIDE IF NOT X.
                    hiddenFields.add(targetId);
                }
            } else if (rule.action === LogicAction.HIDE) {
                if (isTriggered) {
                    hiddenFields.add(targetId);
                } else {
                    hiddenFields.delete(targetId);
                }
            }
        });
    });

    // Return the set of IDs that remain visible
    const visibleIds = new Set(schema.fields.map(f => f.id));
    hiddenFields.forEach(id => visibleIds.delete(id));

    return visibleIds;
};
