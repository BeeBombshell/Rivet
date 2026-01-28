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
    );
};
