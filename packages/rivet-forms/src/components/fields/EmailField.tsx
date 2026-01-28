import React from 'react';
import { EmailFieldConfig } from '../../types/field.types';
import { FieldProps } from './FieldProps';

export const EmailField: React.FC<FieldProps<EmailFieldConfig>> = ({
    field,
    value,
    onChange,
    error,
    disabled
}) => {
    return (
        <input
            type="email"
            className="rivet-input tally-style-input"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || field.disabled}
            required={field.required}
        />
    );
};
