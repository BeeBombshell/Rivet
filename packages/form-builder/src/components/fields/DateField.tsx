import React from 'react';
import { DateFieldConfig } from '../../types/field.types';
import { FieldProps } from './FieldProps';

export const DateField: React.FC<FieldProps<DateFieldConfig>> = ({
    field,
    value,
    onChange,
    error,
    disabled
}) => {
    return (
        <input
            type="date"
            className="rivet-input tally-style-input"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || field.disabled}
            required={field.required}
        />
    );
};
