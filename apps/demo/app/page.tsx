"use client";

import { useState } from "react";
import { FormBuilder, FormRenderer, FormSchema, FieldType, LogicAction, ConditionOperator } from "rivet-forms";

export default function Home() {
  const [form, setForm] = useState<FormSchema>({
    id: "demo-form",
    title: "Project Request Form",
    description: "Fill out the details for your new project. This demo showcases conditional logic and calculated fields.",
    fields: [
      {
        id: "owner-name",
        type: FieldType.TEXT,
        label: "Project Owner",
        placeholder: "Enter owner name",
        required: true,
      },
      {
        id: "project-type",
        type: FieldType.SELECT,
        label: "Project Type",
        placeholder: "Select type",
        options: [
            { label: "Software Development", value: "software" },
            { label: "Marketing Campaign", value: "marketing" },
            { label: "Other", value: "other" }
        ],
        required: true
      },
      {
        id: "other-type",
        type: FieldType.TEXT,
        label: "Please specify other type",
        placeholder: "What kind of project?",
        required: true,
        hidden: true // Hidden by default, shown via logic
      },
      {
        id: "budget-section",
        type: FieldType.TEXT,
        label: "Budgeting Details",
        defaultValue: "Calculate your estimated budget below.",
        disabled: true,
        required: false
      },
      {
        id: "hourly-rate",
        type: FieldType.NUMBER,
        label: "Hourly Rate ($)",
        defaultValue: 50,
        required: true
      },
      {
        id: "estimated-hours",
        type: FieldType.NUMBER,
        label: "Estimated Hours",
        defaultValue: 40,
        required: true
      },
      {
        id: "total-budget",
        type: FieldType.NUMBER,
        label: "Total Estimated Budget ($)",
        helpText: "Automatically calculated from rate and hours.",
        disabled: true,
        defaultValue: 2000,
        required: false
      },
      {
        id: "terms",
        type: FieldType.CHECKBOX,
        label: "Agreement",
        options: [
            { label: "I agree to the terms and conditions", value: "agreed" }
        ],
        required: true
      }
    ],
    logicRules: [
      {
        id: "rule-show-other",
        name: "Show Other Type",
        conditions: [
          {
            fieldId: "project-type",
            operator: ConditionOperator.EQUALS,
            value: "other"
          }
        ],
        conditionType: 'all',
        action: LogicAction.SHOW,
        targetFieldIds: ["other-type"]
      }
    ],
    calculations: [
      {
        id: "calc-total",
        formula: "{{hourly-rate}} * {{estimated-hours}}",
        targetFieldId: "total-budget",
        sourceFieldIds: ["hourly-rate", "estimated-hours"]
      }
    ]
  });

  const [mode, setMode] = useState<"builder" | "preview">("preview");

  return (
    <main className="min-h-screen bg-gray-50/30">
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white p-2 rounded-full shadow-lg border border-gray-100">
        <button
          onClick={() => setMode("builder")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            mode === "builder" ? "bg-black text-white" : "hover:bg-gray-100"
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => setMode("preview")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            mode === "preview" ? "bg-black text-white" : "hover:bg-gray-100"
          }`}
        >
          Preview
        </button>
      </div>

      <div className="py-20">
        {mode === "builder" ? (
          <FormBuilder initialData={form} onChange={setForm} />
        ) : (
          <div className="max-w-3xl mx-auto p-12 bg-white shadow-2xl rounded-[32px] border border-gray-100">
            <FormRenderer
              form={form}
              onSubmit={(data) => {
                console.log("Form Submitted:", data);
                alert("Form submitted! Check console for details.");
              }}
            />
          </div>
        )}
      </div>

      <div className="fixed bottom-4 left-4 text-xs text-gray-400 font-mono bg-white/80 p-4 rounded-lg border border-gray-100 max-h-[300px] overflow-auto max-w-[400px]">
        <h3 className="font-bold mb-2 uppercase text-[10px] text-gray-400">Current Schema</h3>
        <pre>{JSON.stringify(form, null, 2)}</pre>
      </div>
    </main>
  );
}
