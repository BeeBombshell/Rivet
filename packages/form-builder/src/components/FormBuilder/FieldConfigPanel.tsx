import React from 'react';
import { FormField, FieldType, FieldOption } from '../../types/field.types';
import { 
  X, 
  Settings, 
  Trash2, 
  Plus, 
  Eye, 
  Database,
  Calculator,
  Zap
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FieldConfigPanelProps {
  field: FormField | null;
  onUpdateField: (field: FormField) => void;
  onClose: () => void;
}

export const FieldConfigPanel: React.FC<FieldConfigPanelProps> = ({ 
  field, 
  onUpdateField, 
  onClose 
}) => {
  if (!field) return (
    <aside className="w-80 border-l border-gray-100 bg-white p-6 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
        <Settings size={24} />
      </div>
      <p className="text-sm text-gray-500">Select a field to configure its properties</p>
    </aside>
  );

  const updateProperty = (key: keyof FormField | string, value: any) => {
    onUpdateField({ ...field, [key]: value } as FormField);
  };

  const handleOptionChange = (index: number, label: string) => {
    if ('options' in field) {
      const newOptions = [...field.options];
      newOptions[index] = { ...newOptions[index], label, value: label.toLowerCase().replace(/\s+/g, '_') };
      updateProperty('options', newOptions);
    }
  };

  const addOption = () => {
    if ('options' in field) {
      const newOptions = [...field.options, { label: 'New Option', value: 'new_option' }];
      updateProperty('options', newOptions);
    }
  };

  const removeOption = (index: number) => {
    if ('options' in field) {
      const newOptions = field.options.filter((_, i) => i !== index);
      updateProperty('options', newOptions);
    }
  };

  return (
    <aside className="w-80 border-l border-gray-100 bg-white flex flex-col h-full shadow-2xl">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Settings size={18} />
           </div>
           <h2 className="font-semibold text-gray-900">Configure Field</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Basic Settings */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Eye size={14} /> Appearance
          </h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Field Label</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              value={field.label}
              onChange={(e) => updateProperty('label', e.target.value)}
              placeholder="Enter question text..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Placeholder</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              value={field.placeholder || ''}
              onChange={(e) => updateProperty('placeholder', e.target.value)}
              placeholder="Helper text for users..."
            />
          </div>

          <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={field.required}
              onChange={(e) => updateProperty('required', e.target.checked)}
            />
            <span className="text-sm font-medium text-gray-700">Required Field</span>
          </label>
        </section>

        <div className="h-px bg-gray-100" />

        {/* Field Specific Settings */}
        {(field.type === FieldType.SELECT || field.type === FieldType.RADIO || field.type === FieldType.CHECKBOX) && (
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Database size={14} /> Options
            </h3>
            <div className="space-y-2">
              {'options' in field && field.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                    value={option.label}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  <button 
                    onClick={() => removeOption(index)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button 
                onClick={addOption}
                className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:border-blue-300 hover:text-blue-500 transition-all mt-2"
              >
                <Plus size={16} /> Add Option
              </button>
            </div>
          </section>
        )}

        {/* Logic & Advanced */}
        <section className="space-y-4">
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} /> Interactions
            </h3>
            <div className="grid grid-cols-1 gap-2">
               <button className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-left group">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Zap size={16} />
                  </div>
                  <div>
                    <div className="font-bold">Conditional Logic</div>
                    <div className="text-[10px] text-gray-400 font-normal">Show/hide based on answers</div>
                  </div>
               </button>

               <button className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-left group">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Calculator size={16} />
                  </div>
                  <div>
                    <div className="font-bold">Calculations</div>
                    <div className="text-[10px] text-gray-400 font-normal">Real-time math formulas</div>
                  </div>
               </button>
            </div>
        </section>
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100">
         <button 
          onClick={onClose}
          className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-black transition-all shadow-lg shadow-gray-200"
         >
           Save Changes
         </button>
      </div>
    </aside>
  );
};
