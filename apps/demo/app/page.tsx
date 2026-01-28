"use client";

import { useState } from "react";
import { FormBuilder, FormRenderer, FormSchema, FieldType } from "rivet-forms";

export default function Home() {
  const [form, setForm] = useState<FormSchema>({
    id: "demo-form",
    title: "Comprehensive Field Demo",
    description: "This form showcases all the new field components created for Rivet Forms.",
    fields: [
      {
        id: "text-1",
        type: FieldType.TEXT,
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
      },
      {
        id: "email-1",
        type: FieldType.EMAIL,
        label: "Email Address",
        placeholder: "you@example.com",
        required: true,
      },
      {
        id: "number-1",
        type: FieldType.NUMBER,
        label: "Age",
        placeholder: "How old are you?",
        validation: { min: 0, max: 120 }
      },
      {
        id: "textarea-1",
        type: FieldType.TEXTAREA,
        label: "Bio",
        placeholder: "Tell us about yourself...",
        helpText: "Keep it brief and interesting."
      },
      {
        id: "select-1",
        type: FieldType.SELECT,
        label: "Country",
        placeholder: "Select your country",
        options: [
            { label: "United States", value: "us" },
            { label: "India", value: "in" },
            { label: "United Kingdom", value: "uk" }
        ],
        required: true
      },
      {
        id: "checkbox-1",
        type: FieldType.CHECKBOX,
        label: "Interests",
        options: [
            { label: "Art", value: "art" },
            { label: "Science", value: "science" },
            { label: "Technology", value: "tech" }
        ]
      },
      {
        id: "radio-1",
        type: FieldType.RADIO,
        label: "Experience Level",
        options: [
            { label: "Beginner", value: "beg" },
            { label: "Intermediate", value: "int" },
            { label: "Expert", value: "exp" }
        ]
      },
      {
        id: "date-1",
        type: FieldType.DATE,
        label: "Birth Date",
        required: true
      },
      {
        id: "file-1",
        type: FieldType.FILE,
        label: "Profile Picture",
        helpText: "Upload a square image for best results."
      }
    ],
    logicRules: [],
    calculations: []
  });

  const [mode, setMode] = useState<"builder" | "preview">("builder");

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
          <div className="max-w-2xl mx-auto p-12 bg-white shadow-xl rounded-2xl border border-gray-100">
            <FormRenderer
              form={form}
              onSubmit={(data) => {
                alert(JSON.stringify(data, null, 2));
              }}
            />
          </div>
        )}
      </div>

      <div className="fixed bottom-4 left-4 text-xs text-gray-400 font-mono">
        <pre>{JSON.stringify(form, null, 2)}</pre>
      </div>
    </main>
  );
}
