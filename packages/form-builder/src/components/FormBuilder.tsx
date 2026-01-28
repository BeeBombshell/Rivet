import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { FormSchema } from '../types/form.types';
import { FormField, FieldType } from '../types/field.types';
import { FieldPalette } from './FormBuilder/FieldPalette';
import { FormCanvas } from './FormBuilder/FormCanvas';
import { FieldConfigPanel } from './FormBuilder/FieldConfigPanel';
import { 
  Download, 
  Upload, 
  Play, 
  Save, 
  ChevronLeft,
  Share2
} from 'lucide-react';

import { useFormBuilder } from '../hooks/useFormBuilder';

export interface FormBuilderProps {
  initialData?: FormSchema;
  onChange?: (data: FormSchema) => void;
}

const DEFAULT_FORM: FormSchema = { 
  id: Math.random().toString(36).substr(2, 9), 
  title: 'Untitled Form', 
  fields: [], 
  logicRules: [], 
  calculations: [] 
};

export const FormBuilder: React.FC<FormBuilderProps> = ({ initialData, onChange }) => {
  const { schema, selectedFieldId, actions } = useFormBuilder(initialData || DEFAULT_FORM);

  // Sync with internal state when initialData changes from parent (e.g. example switches)
  // We use a JSON string check to avoid infinite loops if objects are structurally identical
  const prevInitialDataRef = React.useRef<string | null>(null);
  
  React.useEffect(() => {
    const currentDataStr = JSON.stringify(initialData);
    if (initialData && currentDataStr !== prevInitialDataRef.current) {
      actions.resetSchema(initialData);
    }
    prevInitialDataRef.current = currentDataStr;
  }, [initialData, actions.resetSchema]);

  // Notify parent on any schema change
  React.useEffect(() => {
    onChange?.(schema);
  }, [schema, onChange]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handle dropping from palette
    if (active.id.toString().startsWith('palette-')) {
      const type = active.data.current?.type as FieldType;
      const newField: FormField = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        placeholder: `Enter ${type}...`,
        required: false,
      } as FormField;

      if ([FieldType.SELECT, FieldType.RADIO, FieldType.CHECKBOX].includes(type)) {
        (newField as any).options = [
          { label: 'Option 1', value: 'option_1' },
          { label: 'Option 2', value: 'option_2' }
        ];
      }

      actions.addField(newField);
      actions.setSelectedFieldId(newField.id);
      return;
    }

    // Handle reordering
    if (active.id !== over.id) {
      const oldIndex = schema.fields.findIndex((f) => f.id === active.id);
      const newIndex = schema.fields.findIndex((f) => f.id === over.id);
      actions.reorderFields(oldIndex, newIndex);
    }
  };

  const selectedField = schema.fields.find(f => f.id === selectedFieldId) || null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Removed Internal Header - Demo app manages the toolbar */}

      {/* Main Content Area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 overflow-hidden">
          <FieldPalette />
          
          <FormCanvas 
            fields={schema.fields}
            selectedFieldId={selectedFieldId}
            onSelectField={actions.setSelectedFieldId}
            onRemoveField={actions.removeField}
          />
          
          <FieldConfigPanel 
            field={selectedField}
            allFields={schema.fields}
            logicRules={schema.logicRules}
            calculations={schema.calculations}
            onUpdateField={(updatedField) => actions.updateField(updatedField.id, updatedField)}
            onAddLogicRule={actions.addLogicRule}
            onRemoveLogicRule={actions.removeLogicRule}
            onUpdateLogicRule={actions.updateLogicRule}
            onAddCalculation={actions.addCalculation}
            onRemoveCalculation={actions.removeCalculation}
            onUpdateCalculation={actions.updateCalculation}
            onClose={() => actions.setSelectedFieldId(null)}
          />
        </div>

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.5',
              },
            },
          }),
        }}>
          {/* Simple overlay for dragging */}
          <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-2xl opacity-80 cursor-grabbing">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Dragging Field...</span>
          </div>
        </DragOverlay>
      </DndContext>
    </div>
  );
};
