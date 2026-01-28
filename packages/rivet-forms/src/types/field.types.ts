export enum FieldType {
    TEXT = 'text',
    EMAIL = 'email',
    NUMBER = 'number',
    SELECT = 'select',
    RADIO = 'radio',
    CHECKBOX = 'checkbox',
    TEXTAREA = 'textarea',
    DATE = 'date',
    PHONE = 'phone',
    URL = 'url',
    FILE = 'file',
    SIGNATURE = 'signature',
    RATING = 'rating',
}

export interface FieldOption {
    label: string;
    value: string;
}

export interface FieldValidation {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
}

export interface BaseField {
    id: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    required: boolean;
    validation?: FieldValidation;
    defaultValue?: any;
    helpText?: string;
    hidden?: boolean;
    disabled?: boolean;
}

export interface TextField extends BaseField {
    type: FieldType.TEXT;
}

export interface EmailField extends BaseField {
    type: FieldType.EMAIL;
}

export interface NumberField extends BaseField {
    type: FieldType.NUMBER;
}

export interface SelectField extends BaseField {
    type: FieldType.SELECT;
    options: FieldOption[];
}

export interface RadioField extends BaseField {
    type: FieldType.RADIO;
    options: FieldOption[];
}

export interface CheckboxField extends BaseField {
    type: FieldType.CHECKBOX;
    options: FieldOption[];
}

export interface TextAreaField extends BaseField {
    type: FieldType.TEXTAREA;
}

export type FormField =
    | TextField
    | EmailField
    | NumberField
    | SelectField
    | RadioField
    | CheckboxField
    | TextAreaField;
