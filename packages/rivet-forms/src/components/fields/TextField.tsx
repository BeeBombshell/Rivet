import React from 'react';
import { TextFieldConfig } from '../../types/field.types';
import { FieldProps } from './FieldProps';

export const TextField: React.FC<FieldProps<TextFieldConfig>> = ({
    field,
    value,
    onChange,
    error,
    disabled
}) => {
    return (
        <input
            type="text"
            className="rivet-input tally-style-input"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || field.disabled}
            required={field.required}
        />
    );
};
