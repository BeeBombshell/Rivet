import { FormField } from '../../types/field.types';

export interface FieldProps<T extends FormField = FormField> {
    field: T;
    value: any;
    onChange: (value: any) => void;
    error?: string;
    disabled?: boolean;
}
