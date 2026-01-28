import React from 'react';
import { SelectFieldConfig, FieldOption } from '../../types/field.types';
import { FieldProps } from './FieldProps';

export const SelectField: React.FC<FieldProps<SelectFieldConfig>> = ({
    field,
    value,
    onChange,
    error,
    disabled
}) => {
    return (
        <select
            className="rivet-input tally-style-input bg-white cursor-pointer"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || field.disabled}
            required={field.required}
        >
            <option value="" disabled>{field.placeholder || 'Select an option'}</option>
            {field.options.map((option: FieldOption) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};
