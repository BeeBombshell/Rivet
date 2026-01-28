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
        <div className="rivet-form-field">
            <label className="rivet-label">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type="date"
                className="rivet-input tally-style-input"
                placeholder={field.placeholder}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled || field.disabled}
                required={field.required}
            />
            {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};
