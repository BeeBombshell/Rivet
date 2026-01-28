import React, { useState } from 'react';
import { FormField } from '../../types/field.types';
import { Calculation } from '../../types/logic.types';
import { Plus, Trash2, Calculator, X, Info } from 'lucide-react';

interface CalculationEditorProps {
    field: FormField;
    calculations: Calculation[];
    allFields: FormField[];
    onAddCalculation: (calc: Calculation) => void;
    onRemoveCalculation: (calcId: string) => void;
    onUpdateCalculation: (calcId: string, updates: Partial<Calculation>) => void;
    onClose: () => void;
}

export const CalculationEditor: React.FC<CalculationEditorProps> = ({
    field,
    calculations,
    allFields,
    onAddCalculation,
    onRemoveCalculation,
    onUpdateCalculation,
    onClose
}) => {
    // Filter calculations that target this field
    const fieldCalc = calculations.find(c => c.targetFieldId === field.id);

    const handleAddCalculation = () => {
        const newCalc: Calculation = {
            id: Math.random().toString(36).substr(2, 9),
            formula: "",
            targetFieldId: field.id,
            sourceFieldIds: []
        };
        onAddCalculation(newCalc);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
                            <Calculator size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Custom Calculation</h2>
                            <p className="text-xs text-gray-500">Compute values for "{field.label}" automatically.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {!fieldCalc ? (
                        <div className="text-center py-12 bg-gray-50 rounded-[24px] border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 mb-4">No calculation defined for this field.</p>
                            <button 
                                onClick={handleAddCalculation}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg"
                            >
                                <Plus size={18} /> Enable Calculation
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-gray-700">Formula</label>
                                    <button 
                                        onClick={() => onRemoveCalculation(fieldCalc.id)}
                                        className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                                    >
                                        <Trash2 size={14} /> Remove Calculation
                                    </button>
                                </div>
                                <div className="relative">
                                    <textarea 
                                        className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 font-mono text-sm focus:ring-indigo-500 transition-all min-h-[120px]"
                                        placeholder="e.g. {{field_1}} * 1.08"
                                        value={fieldCalc.formula}
                                        onChange={(e) => {
                                            onUpdateCalculation(fieldCalc.id, { formula: e.target.value });
                                        }}
                                    />
                                    <div className="absolute bottom-4 right-4 text-indigo-500">
                                        <Calculator size={18} />
                                    </div>
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-2xl flex gap-3 text-indigo-700">
                                    <Info size={20} className="shrink-0 mt-0.5" />
                                    <div className="text-xs leading-relaxed">
                                        <p className="font-bold mb-1">How to use formulas:</p>
                                        <ul className="list-disc list-inside space-y-1 opacity-80">
                                            <li>Use <code className="bg-white px-1 rounded">{"{{field_id}}"}</code> to reference other fields.</li>
                                            <li>Standard math: <code className="bg-white px-1 rounded">+</code>, <code className="bg-white px-1 rounded">-</code>, <code className="bg-white px-1 rounded">*</code>, <code className="bg-white px-1 rounded">/</code>, <code className="bg-white px-1 rounded">()</code></li>
                                            <li>Example: <code className="bg-white px-1 rounded">{"({{price}} * {{qty}}) * 1.2"}</code></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-700">Available Fields (Ref IDs)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {allFields.filter(f => f.id !== field.id).map(f => (
                                        <button 
                                            key={f.id}
                                            onClick={() => {
                                                const newFormula = fieldCalc.formula + ` {{${f.id}}}`;
                                                onUpdateCalculation(fieldCalc.id, { formula: newFormula });
                                            }}
                                            className="p-3 bg-white border border-gray-100 rounded-xl text-left hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                                        >
                                            <div className="text-[10px] font-bold text-gray-400 group-hover:text-indigo-400 uppercase tracking-tighter transition-colors">ID: {f.id}</div>
                                            <div className="text-xs font-semibold text-gray-700 truncate">{f.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg"
                    >
                        Save & Close
                    </button>
                </div>
            </div>
        </div>
    );
};
