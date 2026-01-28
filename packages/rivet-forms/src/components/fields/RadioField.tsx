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
        <div className="rivet-radio-group">
            {field.options.map((option: FieldOption) => {
                const isSelected = value === option.value;
                return (
                    <label 
                        key={option.value} 
                        className={`rivet-option-card ${isSelected ? 'selected' : ''}`}
                    >
                        <input
                            type="radio"
                            name={field.id}
                            className="w-5 h-5 text-black border-gray-300 focus:ring-black transition-all"
                            value={option.value}
                            checked={isSelected}
                            onChange={(e) => onChange(e.target.value)}
                            disabled={disabled || field.disabled}
                        />
                        <span className="text-lg font-medium text-gray-900">{option.label}</span>
                    </label>
                );
            })}
        </div>
    );
};
