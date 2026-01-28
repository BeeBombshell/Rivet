import React from 'react';
import { TextAreaFieldConfig } from '../../types/field.types';
import { FieldProps } from './FieldProps';

export const TextareaField: React.FC<FieldProps<TextAreaFieldConfig>> = ({
    field,
    value,
    onChange,
    error,
    disabled
}) => {
    return (
        <textarea
            className="rivet-input tally-style-input min-h-[100px] resize-y"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || field.disabled}
            required={field.required}
        />
    );
};
