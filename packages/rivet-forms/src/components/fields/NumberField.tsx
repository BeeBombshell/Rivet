import React from 'react';
import { NumberFieldConfig } from '../../types/field.types';
import { FieldProps } from './FieldProps';

export const NumberField: React.FC<FieldProps<NumberFieldConfig>> = ({
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
                type="number"
                className="rivet-input tally-style-input"
                placeholder={field.placeholder}
                value={value === undefined || value === null ? '' : value}
                onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                disabled={disabled || field.disabled}
                required={field.required}
                min={field.validation?.min}
                max={field.validation?.max}
            />
            {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};
