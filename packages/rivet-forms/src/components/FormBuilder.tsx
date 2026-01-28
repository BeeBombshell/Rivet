import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Form, FormField } from '../schemas';
import { SortableField } from './SortableField';

export interface FormBuilderProps {
  initialData?: Form;
  onChange?: (data: Form) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ initialData, onChange }) => {
  const [form, setForm] = useState<Form>(initialData || { title: '', fields: [] });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = form.fields.findIndex((f) => f.id === active.id);
      const newIndex = form.fields.findIndex((f) => f.id === over.id);
      const newFields = arrayMove(form.fields, oldIndex, newIndex);
      const newForm = { ...form, fields: newFields };
      setForm(newForm);
      onChange?.(newForm);
    }
  };

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: '',
      required: false,
    };
    const newForm = { ...form, fields: [...form.fields, newField] };
    setForm(newForm);
    onChange?.(newForm);
  };

  const updateField = (updatedField: FormField) => {
    const newFields = form.fields.map(f => f.id === updatedField.id ? updatedField : f);
    const newForm = { ...form, fields: newFields };
    setForm(newForm);
    onChange?.(newForm);
  };

  const removeField = (id: string) => {
    const newFields = form.fields.filter(f => f.id !== id);
    const newForm = { ...form, fields: newFields };
    setForm(newForm);
    onChange?.(newForm);
  };

  return (
    <div className="max-w-2xl mx-auto p-12 bg-white min-h-screen">
      <textarea
        className="text-5xl font-bold w-full border-none focus:ring-0 mb-8 bg-transparent transition-all resize-none overflow-hidden h-auto"
        value={form.title}
        onChange={(e) => {
            const newForm = { ...form, title: e.target.value };
            setForm(newForm);
            onChange?.(newForm);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        }}
        placeholder="Form Title"
        rows={1}
      />
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={form.fields.map(f => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {form.fields.map((field) => (
              <SortableField 
                key={field.id} 
                field={field} 
                onUpdate={updateField}
                onRemove={() => removeField(field.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-12 border-t border-gray-50 pt-8">
          <div className="flex gap-4">
               <button 
                onClick={() => addField('text')}
                className="text-gray-400 hover:text-gray-600 font-medium transition-colors p-2 rounded hover:bg-gray-50"
              >
                  + Text
              </button>
              <button 
                onClick={() => addField('email')}
                className="text-gray-400 hover:text-gray-600 font-medium transition-colors p-2 rounded hover:bg-gray-50"
              >
                  + Email
              </button>
               <button 
                onClick={() => addField('textarea')}
                className="text-gray-400 hover:text-gray-600 font-medium transition-colors p-2 rounded hover:bg-gray-50"
              >
                  + Long Text
              </button>
          </div>
      </div>
    </div>
  );
};
