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
        <div className="rivet-checkbox-group">
            {field.options.map((option: FieldOption) => {
                const isSelected = Array.isArray(value) && value.includes(option.value);
                return (
                    <label 
                        key={option.value} 
                        className={`rivet-option-card ${isSelected ? 'selected' : ''}`}
                    >
                        <input
                            type="checkbox"
                            className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black transition-all"
                            value={option.value}
                            checked={isSelected}
                            onChange={(e) => handleChange(option.value, e.target.checked)}
                            disabled={disabled || field.disabled}
                        />
                        <span className="text-lg font-medium text-gray-900">{option.label}</span>
                    </label>
                );
            })}
        </div>
    );
};
