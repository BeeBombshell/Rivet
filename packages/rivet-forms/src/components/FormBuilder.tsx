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

export interface FormBuilderProps {
  initialData?: FormSchema;
  onChange?: (data: FormSchema) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ initialData, onChange }) => {
  const [form, setForm] = useState<FormSchema>(initialData || { 
    id: Math.random().toString(36).substr(2, 9), 
    title: 'Untitled Form', 
    fields: [], 
    logicRules: [], 
    calculations: [] 
  });
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

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
        required: false,
      } as FormField;

      if ([FieldType.SELECT, FieldType.RADIO, FieldType.CHECKBOX].includes(type)) {
        (newField as any).options = [
          { label: 'Option 1', value: 'option_1' },
          { label: 'Option 2', value: 'option_2' }
        ];
      }

      const newForm = { ...form, fields: [...form.fields, newField] };
      setForm(newForm);
      onChange?.(newForm);
      setSelectedFieldId(newField.id);
      return;
    }

    // Handle reordering
    if (active.id !== over.id) {
      const oldIndex = form.fields.findIndex((f) => f.id === active.id);
      const newIndex = form.fields.findIndex((f) => f.id === over.id);
      
      const newFields = arrayMove(form.fields, oldIndex, newIndex);
      const newForm = { ...form, fields: newFields };
      setForm(newForm);
      onChange?.(newForm);
    }
  };

  const updateField = useCallback((updatedField: FormField) => {
    setForm(prev => {
      const newFields = prev.fields.map(f => f.id === updatedField.id ? updatedField : f);
      const newForm = { ...prev, fields: newFields };
      onChange?.(newForm);
      return newForm;
    });
  }, [onChange]);

  const removeField = useCallback((id: string) => {
    setForm(prev => {
      const newFields = prev.fields.filter(f => f.id !== id);
      const newForm = { ...prev, fields: newFields };
      onChange?.(newForm);
      return newForm;
    });
    if (selectedFieldId === id) setSelectedFieldId(null);
  }, [onChange, selectedFieldId]);

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(form, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `${form.title.toLowerCase().replace(/\s+/g, '_')}_schema.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const importedForm = JSON.parse(event.target.result);
          setForm(importedForm);
          onChange?.(importedForm);
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const selectedField = form.fields.find(f => f.id === selectedFieldId) || null;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Toolbar */}
      <header className="h-16 border-b border-gray-100 px-6 flex items-center justify-between bg-white z-20">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
             <ChevronLeft size={20} />
          </button>
          <div className="h-6 w-px bg-gray-100" />
          <input 
            className="text-lg font-bold text-gray-900 border-none focus:ring-0 p-0 bg-transparent placeholder-gray-300 w-64"
            value={form.title}
            onChange={(e) => {
              const newForm = { ...form, title: e.target.value };
              setForm(newForm);
              onChange?.(newForm);
            }}
            placeholder="Form Title..."
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={importJSON}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
          >
            <Upload size={16} /> Import
          </button>
          <button 
             onClick={exportJSON}
             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
          >
            <Download size={16} /> Export
          </button>
          <div className="h-6 w-px bg-gray-100 mx-2" />
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all">
            <Play size={16} /> Preview
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-all ml-2">
            <Share2 size={16} /> Share
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 overflow-hidden">
          <FieldPalette />
          
          <FormCanvas 
            fields={form.fields}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
            onRemoveField={removeField}
          />
          
          <FieldConfigPanel 
            field={selectedField}
            onUpdateField={updateField}
            onClose={() => setSelectedFieldId(null)}
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
