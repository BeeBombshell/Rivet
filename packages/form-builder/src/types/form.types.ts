import { FormField } from './field.types';
import { LogicRule, Calculation } from './logic.types';

export interface FormSchema {
    id: string;
    title: string;
    description?: string;
    fields: FormField[];
    logicRules: LogicRule[];
    calculations: Calculation[];
    settings?: FormSettings;
}

export interface FormSettings {
    submitButtonText?: string;
    successMessage?: string;
    redirectUrl?: string;
    theme?: Record<string, string>;
}

export interface FormSubmission {
    id: string;
    formId: string;
    data: Record<string, any>;
    submittedAt: string;
    metadata?: Record<string, any>;
}

export interface BuilderState {
    schema: FormSchema;
    selectedFieldId: string | null;
    isDragging: boolean;
    history: {
        past: FormSchema[];
        future: FormSchema[];
    };
}
