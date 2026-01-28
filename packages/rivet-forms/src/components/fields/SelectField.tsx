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
        <div className="rivet-form-field">
            <label className="rivet-label">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
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
            {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};
