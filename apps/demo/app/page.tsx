"use client";

import { useState } from "react";
import { FormBuilder, FormRenderer, Form } from "rivet-forms";

export default function Home() {
  const [form, setForm] = useState<Form>({
    title: "Project Feedback",
    fields: [
      {
        id: "1",
        type: "text",
        label: "What is your name?",
        required: true,
      },
      {
        id: "2",
        type: "email",
        label: "What is your email?",
        required: true,
      },
    ],
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
