import React from 'react';
import { CheckboxFieldConfig, FieldOption } from '../../types/field.types';
import { FieldProps } from './FieldProps';

export const CheckboxField: React.FC<FieldProps<CheckboxFieldConfig>> = ({
    field,
    value = [],
    onChange,
    error,
    disabled
}) => {
    const handleChange = (optionValue: string, checked: boolean) => {
        const newValue = Array.isArray(value) ? [...value] : [];
        if (checked) {
            newValue.push(optionValue);
        } else {
            const index = newValue.indexOf(optionValue);
            if (index > -1) newValue.splice(index, 1);
        }
        onChange(newValue);
    };

    return (
        <div className="rivet-form-field">
            <label className="rivet-label">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2 mt-2">
                {field.options.map((option: FieldOption) => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors"
                            value={option.value}
                            checked={Array.isArray(value) && value.includes(option.value)}
                            onChange={(e) => handleChange(option.value, e.target.checked)}
                            disabled={disabled || field.disabled}
                        />
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{option.label}</span>
                    </label>
                ))}
            </div>
            {field.helpText && <p className="text-xs text-gray-500 mt-2">{field.helpText}</p>}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};
