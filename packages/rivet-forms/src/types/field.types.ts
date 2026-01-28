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

export interface TextFieldConfig extends BaseField {
    type: FieldType.TEXT;
}

export interface EmailFieldConfig extends BaseField {
    type: FieldType.EMAIL;
}

export interface NumberFieldConfig extends BaseField {
    type: FieldType.NUMBER;
}

export interface SelectFieldConfig extends BaseField {
    type: FieldType.SELECT;
    options: FieldOption[];
}

export interface RadioFieldConfig extends BaseField {
    type: FieldType.RADIO;
    options: FieldOption[];
}

export interface CheckboxFieldConfig extends BaseField {
    type: FieldType.CHECKBOX;
    options: FieldOption[];
}

export interface TextAreaFieldConfig extends BaseField {
    type: FieldType.TEXTAREA;
}

export interface DateFieldConfig extends BaseField {
    type: FieldType.DATE;
}

export interface FileFieldConfig extends BaseField {
    type: FieldType.FILE;
}

export interface PhoneFieldConfig extends BaseField {
    type: FieldType.PHONE;
}

export interface UrlFieldConfig extends BaseField {
    type: FieldType.URL;
}

export interface SignatureFieldConfig extends BaseField {
    type: FieldType.SIGNATURE;
}

export interface RatingFieldConfig extends BaseField {
    type: FieldType.RATING;
}

export type FormField =
    | TextFieldConfig
    | EmailFieldConfig
    | NumberFieldConfig
    | SelectFieldConfig
    | RadioFieldConfig
    | CheckboxFieldConfig
    | TextAreaFieldConfig
    | DateFieldConfig
    | FileFieldConfig
    | PhoneFieldConfig
    | UrlFieldConfig
    | SignatureFieldConfig
    | RatingFieldConfig;
