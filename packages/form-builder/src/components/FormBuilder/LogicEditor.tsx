import React, { useState } from 'react';
import { FormField } from '../../types/field.types';
import { LogicRule, ConditionOperator, LogicAction } from '../../types/logic.types';
import { Plus, Trash2, Zap, X } from 'lucide-react';

interface LogicEditorProps {
    field: FormField;
    rules: LogicRule[];
    allFields: FormField[];
    onAddRule: (rule: LogicRule) => void;
    onRemoveRule: (ruleId: string) => void;
    onUpdateRule: (ruleId: string, updates: Partial<LogicRule>) => void;
    onClose: () => void;
}

export const LogicEditor: React.FC<LogicEditorProps> = ({
    field,
    rules,
    allFields,
    onAddRule,
    onRemoveRule,
    onUpdateRule,
    onClose
}) => {
    // Filter rules that target this field
    const fieldRules = rules.filter(r => r.targetFieldIds.includes(field.id));

    const handleAddRule = () => {
        const newRule: LogicRule = {
            id: Math.random().toString(36).substr(2, 9),
            name: `Rule for ${field.label}`,
            conditions: [
                {
                    fieldId: allFields[0]?.id || '',
                    operator: ConditionOperator.EQUALS,
                    value: ''
                }
            ],
            conditionType: 'all',
            action: LogicAction.SHOW,
            targetFieldIds: [field.id]
        };
        onAddRule(newRule);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Conditional Logic</h2>
                            <p className="text-xs text-gray-500">Determine when "{field.label}" should be shown or hidden.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {fieldRules.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-[24px] border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 mb-4">No logic rules applied to this field yet.</p>
                            <button 
                                onClick={handleAddRule}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg"
                            >
                                <Plus size={18} /> Add Your First Rule
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {fieldRules.map((rule, idx) => (
                                <div key={rule.id} className="p-6 bg-white border border-gray-100 rounded-[24px] shadow-sm relative group">
                                    <button 
                                        onClick={() => onRemoveRule(rule.id)}
                                        className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Action</span>
                                        <select 
                                            className="bg-orange-50 text-orange-700 border-none rounded-lg text-sm font-bold px-3 py-1 focus:ring-0"
                                            value={rule.action}
                                            disabled
                                        >
                                            <option value={LogicAction.SHOW}>SHOW</option>
                                            <option value={LogicAction.HIDE}>HIDE</option>
                                        </select>
                                        <span className="text-sm font-medium text-gray-600">this field when:</span>
                                    </div>

                                    <div className="space-y-4">
                                        {rule.conditions.map((condition, cIdx) => (
                                            <div key={cIdx} className="flex gap-3 items-center">
                                                <select 
                                                    className="flex-1 bg-gray-50 border-gray-200 rounded-xl text-sm p-3 focus:ring-blue-500 transition-all"
                                                    value={condition.fieldId}
                                                    onChange={(e) => {
                                                        const newConditions = [...rule.conditions];
                                                        newConditions[cIdx] = { ...newConditions[cIdx], fieldId: e.target.value };
                                                        onUpdateRule(rule.id, { conditions: newConditions });
                                                    }}
                                                >
                                                    {allFields.filter(f => f.id !== field.id).map(f => (
                                                        <option key={f.id} value={f.id}>{f.label}</option>
                                                    ))}
                                                </select>
                                                
                                                <select 
                                                    className="bg-gray-50 border-gray-200 rounded-xl text-sm p-3 focus:ring-blue-500 transition-all font-bold"
                                                    value={condition.operator}
                                                    onChange={(e) => {
                                                        const newConditions = [...rule.conditions];
                                                        newConditions[cIdx] = { ...newConditions[cIdx], operator: e.target.value as ConditionOperator };
                                                        onUpdateRule(rule.id, { conditions: newConditions });
                                                    }}
                                                >
                                                    {Object.values(ConditionOperator).map(op => (
                                                        <option key={op} value={op}>{op}</option>
                                                    ))}
                                                </select>

                                                <input 
                                                    type="text"
                                                    placeholder="Value"
                                                    className="flex-1 bg-gray-50 border-gray-200 rounded-xl text-sm p-3 focus:ring-blue-500 transition-all"
                                                    value={condition.value}
                                                    onChange={(e) => {
                                                        const newConditions = [...rule.conditions];
                                                        newConditions[cIdx] = { ...newConditions[cIdx], value: e.target.value };
                                                        onUpdateRule(rule.id, { conditions: newConditions });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <button 
                                onClick={handleAddRule}
                                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-[24px] text-sm font-bold text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-all"
                            >
                                <Plus size={18} /> Add Another Rule
                            </button>
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
