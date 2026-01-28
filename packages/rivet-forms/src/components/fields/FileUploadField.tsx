import React from 'react';
import { FileFieldConfig } from '../../types/field.types';
import { FieldProps } from './FieldProps';

export const FileUploadField: React.FC<FieldProps<FileFieldConfig>> = ({
    field,
    value,
    onChange,
    error,
    disabled
}) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // For now, we store the File object or a list of files
            // In a real application, you might upload it and store the URL
            onChange(e.target.files);
        } else {
            onChange(null);
        }
    };

    return (
        <div className={`mt-2 p-6 border-2 border-dashed rounded-lg transition-colors ${
            disabled ? 'bg-gray-50 border-gray-200' : 'border-gray-300 hover:border-blue-400 cursor-pointer'
        }`}>
            <input
                type="file"
                className="hidden"
                id={`file-upload-${field.id}`}
                onChange={handleFileChange}
                disabled={disabled || field.disabled}
                required={field.required}
            />
            <label 
                htmlFor={`file-upload-${field.id}`}
                className="flex flex-col items-center justify-center cursor-pointer"
            >
                <span className="text-sm text-gray-600">
                    {value && value.length > 0 ? `${value.length} file(s) selected` : 'Click to upload or drag and drop'}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                </span>
            </label>
        </div>
    );
};
