import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField, FieldType } from '../types/field.types';
import { GripVertical, X } from 'lucide-react';

interface SortableFieldProps {
  field: FormField;
  onUpdate?: (field: FormField) => void;
  onRemove?: () => void;
}

export const SortableField: React.FC<SortableFieldProps> = ({ field, onUpdate, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div
        {...attributes}
        {...listeners}
        className="mt-2 cursor-grab active:cursor-grabbing text-gray-300 group-hover:text-gray-400"
      >
        <GripVertical size={20} />
      </div>

      <div className="flex-1">
        <input
          className="w-full text-lg border-none focus:ring-0 bg-transparent placeholder-gray-300"
          value={field.label}
          onChange={(e) => onUpdate?.({ ...field, label: e.target.value })}
          placeholder="Ask a question..."
        />
        {field.type === FieldType.TEXT && (
          <div className="mt-1 border-b border-gray-100 py-2 text-gray-400 text-sm">
            {field.placeholder || 'Type your answer here...'}
          </div>
        )}
      </div>

      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
      >
        <X size={18} />
      </button>
    </div>
  );
};
