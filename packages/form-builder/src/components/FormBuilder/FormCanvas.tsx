import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField, FieldType } from '../../types/field.types';
import { GripVertical, Trash2, PlusCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormCanvasProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onRemoveField: (id: string) => void;
}

const SortableFieldItem: React.FC<{
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}> = ({ field, isSelected, onSelect, onRemove }) => {
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
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-white border rounded-xl p-6 transition-all ring-offset-2",
        isSelected 
          ? "border-blue-500 ring-2 ring-blue-500 shadow-lg shadow-blue-500/10" 
          : "border-gray-200 hover:border-gray-300 hover:shadow-md",
        isDragging && "opacity-50 grayscale-[0.5]"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="flex items-start gap-4">
        <div 
          {...attributes} 
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors"
        >
          <GripVertical size={20} />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              {field.type}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <h4 className="text-xl font-medium text-gray-900">
            {field.label || <span className="text-gray-400 italic">Untitled Question</span>}
          </h4>
          
          {field.placeholder && (
            <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
              Placeholder: {field.placeholder}
            </p>
          )}

          {field.required && (
            <div className="inline-flex items-center text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded">
              Required
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const FormCanvas: React.FC<FormCanvasProps> = ({ 
  fields, 
  selectedFieldId, 
  onSelectField,
  onRemoveField
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  });

  return (
    <main className="flex-1 bg-[#F9FAFB] overflow-y-auto min-h-full">
      <div 
        ref={setNodeRef}
        className={cn(
          "max-w-3xl mx-auto py-12 px-8 min-h-full transition-colors",
          isOver && "bg-blue-50/50"
        )}
      >
        {fields.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl p-12 bg-white/50 animate-pulse-slow">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-6">
              <PlusCircle size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Build your form</h3>
            <p className="text-gray-500 text-center max-w-xs">
              Drag and drop field types from the left palette to start building your interactive form.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <SortableContext 
              items={fields.map(f => f.id)} 
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field) => (
                <SortableFieldItem
                  key={field.id}
                  field={field}
                  isSelected={selectedFieldId === field.id}
                  onSelect={() => onSelectField(field.id)}
                  onRemove={() => onRemoveField(field.id)}
                />
              ))}
            </SortableContext>
            
            {/* Minimal Drop Indicator when dragging over */}
            {isOver && (
              <div className="h-24 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 animate-pulse mt-4" />
            )}
          </div>
        )}
      </div>
    </main>
  );
};
