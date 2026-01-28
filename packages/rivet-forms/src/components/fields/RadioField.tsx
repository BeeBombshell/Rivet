import React from 'react';
import { RadioFieldConfig, FieldOption } from '../../types/field.types';
import { FieldProps } from './FieldProps';

export const RadioField: React.FC<FieldProps<RadioFieldConfig>> = ({
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
            <div className="space-y-2 mt-2">
                {field.options.map((option: FieldOption) => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                        <input
                            type="radio"
                            name={field.id}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 transition-colors"
                            value={option.value}
                            checked={value === option.value}
                            onChange={(e) => onChange(e.target.value)}
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
