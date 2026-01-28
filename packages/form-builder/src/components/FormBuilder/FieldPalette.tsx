import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  Type, 
  Mail, 
  Hash, 
  ChevronDown, 
  CircleDot, 
  CheckSquare, 
  FileText, 
  Calendar, 
  Phone, 
  Link, 
  FileUp, 
  PenTool, 
  Star 
} from 'lucide-react';
import { FieldType } from '../../types/field.types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FieldPaletteItem {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
}

const FIELD_CATEGORIES = [
  {
    name: 'Text Inputs',
    fields: [
      { type: FieldType.TEXT, label: 'Short Text', icon: <Type size={18} /> },
      { type: FieldType.TEXTAREA, label: 'Long Text', icon: <FileText size={18} /> },
      { type: FieldType.EMAIL, label: 'Email', icon: <Mail size={18} /> },
      { type: FieldType.PHONE, label: 'Phone', icon: <Phone size={18} /> },
      { type: FieldType.URL, label: 'URL', icon: <Link size={18} /> },
      { type: FieldType.NUMBER, label: 'Number', icon: <Hash size={18} /> },
    ]
  },
  {
    name: 'Selections',
    fields: [
      { type: FieldType.SELECT, label: 'Select', icon: <ChevronDown size={18} /> },
      { type: FieldType.RADIO, label: 'Radio', icon: <CircleDot size={18} /> },
      { type: FieldType.CHECKBOX, label: 'Checkbox', icon: <CheckSquare size={18} /> },
      { type: FieldType.RATING, label: 'Rating', icon: <Star size={18} /> },
    ]
  },
  {
    name: 'Advanced',
    fields: [
      { type: FieldType.DATE, label: 'Date', icon: <Calendar size={18} /> },
      { type: FieldType.FILE, label: 'File Upload', icon: <FileUp size={18} /> },
      { type: FieldType.SIGNATURE, label: 'Signature', icon: <PenTool size={18} /> },
    ]
  }
];

const DraggableFieldItem: React.FC<{ item: FieldPaletteItem }> = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${item.type}`,
    data: {
      type: item.type,
      isPaletteItem: true,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-blue-500 hover:shadow-sm transition-all text-sm font-medium text-gray-700",
        isDragging && "opacity-50 cursor-grabbing z-50 shadow-xl border-blue-500"
      )}
    >
      <div className="text-gray-400 group-hover:text-blue-500">
        {item.icon}
      </div>
      {item.label}
    </div>
  );
};

export const FieldPalette: React.FC = () => {
  return (
    <aside className="w-72 border-r border-gray-100 bg-gray-50/50 p-6 overflow-y-auto h-full space-y-8">
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-1">
          Field Palette
        </h2>
        <div className="space-y-6">
          {FIELD_CATEGORIES.map((category) => (
            <div key={category.name} className="space-y-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                {category.name}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {category.fields.map((field) => (
                  <DraggableFieldItem key={field.type} item={field} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
