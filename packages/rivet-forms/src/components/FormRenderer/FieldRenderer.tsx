import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FieldType } from '../../types/field.types';
import {
    TextField,
    EmailField,
    NumberField,
    TextareaField,
    SelectField,
    CheckboxField,
    RadioField,
    DateField,
    FileUploadField
} from '../fields';

interface FieldRendererProps {
    field: FormField;
    disabled?: boolean;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, disabled }) => {
    const { watch, setValue, formState: { errors } } = useFormContext();
    const value = watch(field.id);
    const error = errors[field.id]?.message as string;

    const commonProps = {
        field,
        value,
        onChange: (val: any) => setValue(field.id, val, { shouldValidate: true }),
        error,
        disabled: disabled || field.disabled,
    };

    const renderComponent = () => {
        switch (field.type) {
            case FieldType.TEXT:
                return <TextField {...(commonProps as any)} />;
            case FieldType.EMAIL:
                return <EmailField {...(commonProps as any)} />;
            case FieldType.NUMBER:
                return <NumberField {...(commonProps as any)} />;
            case FieldType.TEXTAREA:
                return <TextareaField {...(commonProps as any)} />;
            case FieldType.SELECT:
                return <SelectField {...(commonProps as any)} />;
            case FieldType.CHECKBOX:
                return <CheckboxField {...(commonProps as any)} />;
            case FieldType.RADIO:
                return <RadioField {...(commonProps as any)} />;
            case FieldType.DATE:
                return <DateField {...(commonProps as any)} />;
            case FieldType.FILE:
                return <FileUploadField {...(commonProps as any)} />;
            case FieldType.PHONE:
            case FieldType.URL:
            case FieldType.SIGNATURE:
            case FieldType.RATING:
                return (
                    <div className="p-4 border border-dashed border-gray-300 rounded bg-gray-50 text-gray-600">
                        {field.type.charAt(0).toUpperCase() + field.type.slice(1)} field implementation coming soon...
                    </div>
                );
            default:
                const _exhaustiveCheck: never = field;
                return (
                    <div className="p-4 border border-dashed border-red-300 rounded bg-red-50 text-red-600">
                        Unknown field type: {(field as any).type}
                    </div>
                );
        }
    };

    return (
        <div className="rivet-form-field animate-field">
            <label className="rivet-label">
                {field.label}
                {field.required && <span className="text-red-500 ml-1 font-bold">*</span>}
            </label>
            
            <div className="mt-1">
                {renderComponent()}
            </div>
            
            {field.helpText && (
                <p className="rivet-help-text">{field.helpText}</p>
            )}
            
            {error && (
                <p className="rivet-error-text">{error}</p>
            )}
        </div>
    );
};
