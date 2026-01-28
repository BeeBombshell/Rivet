export enum ConditionOperator {
    EQUALS = 'equals',
    NOT_EQUALS = 'notEquals',
    CONTAINS = 'contains',
    NOT_CONTAINS = 'notContains',
    GREATER_THAN = 'greaterThan',
    LESS_THAN = 'lessThan',
    GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
    LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
    BETWEEN = 'between',
    IS_EMPTY = 'isEmpty',
    IS_NOT_EMPTY = 'isNotEmpty',
    STARTS_WITH = 'startsWith',
    ENDS_WITH = 'endsWith',
}

export interface Condition {
    fieldId: string;
    operator: ConditionOperator;
    value: any;
}

export enum LogicAction {
    SHOW = 'show',
    HIDE = 'hide',
    ENABLE = 'enable',
    DISABLE = 'disable',
    JUMP_TO = 'jumpTo',
}

export interface LogicRule {
    id: string;
    name?: string;
    conditions: Condition[];
    conditionType: 'all' | 'any';
    action: LogicAction;
    targetFieldIds: string[];
}

export interface Calculation {
    id: string;
    formula: string;
    targetFieldId: string;
    sourceFieldIds: string[];
}
