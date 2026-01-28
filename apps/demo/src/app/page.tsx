"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FormBuilder, FormSchema } from "@rivet/form-builder";
import "@rivet/form-builder/styles.css";
import { examples, ExampleKey } from "../examples";
import { Download, Upload, Eye, FileJson } from "lucide-react";

export default function Home() {
  const [form, setForm] = useState<FormSchema>(examples.basic);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("rivet-form-schema");
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved schema", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("rivet-form-schema", JSON.stringify(form));
    }
  }, [form, isMounted]);

  if (!isMounted) return null;

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(form, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `form-schema-${form.id || 'export'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setForm(json);
      } catch (err) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const handleShare = () => {
    const json = JSON.stringify(form);
    const encoded = btoa(json);
    const url = `${window.location.origin}/preview?schema=${encoded}`;
    navigator.clipboard.writeText(url);
    alert("Shareable link copied to clipboard! (Encoded schema in URL)");
  };

  const loadExample = (key: ExampleKey) => {
    setForm({ ...examples[key] });
  };

  return (
    <main className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileJson className="w-5 h-5 text-white" />
          </div>
          <div>
            <input 
              className="font-bold text-gray-900 leading-tight border-none focus:ring-0 p-0 bg-transparent w-48 text-sm"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Form Title..."
            />
            <p className="text-[10px] text-gray-400 font-medium">Auto-saving to cloud...</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-lg mr-4">
            {(Object.keys(examples) as ExampleKey[]).map((key) => (
              <button
                key={key}
                onClick={() => loadExample(key)}
                className="px-3 py-1 text-xs font-medium rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-600"
              >
                {key.charAt(0) + key.slice(1)}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-all">
            <Upload className="w-4 h-4" />
            Import
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            <FileJson className="w-4 h-4" />
            Share
          </button>

          <Link
            href="/preview"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all ml-2"
          >
            <Eye className="w-4 h-4" />
            Preview Form
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Builder Area */}
        <div className="flex-1 overflow-hidden border-r">
          <FormBuilder initialData={form} onChange={setForm} />
        </div>

        {/* Live Preview Console */}
        <aside className="w-96 bg-[#0f172a] text-emerald-400 p-6 flex flex-col shrink-0 overflow-hidden">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Schema Preview
            </h2>
            <button 
              onClick={() => navigator.clipboard.writeText(JSON.stringify(form, null, 2))}
              className="text-[10px] bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded"
            >
              Copy JSON
            </button>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            <pre className="font-mono text-[11px] leading-relaxed">
              {JSON.stringify(form, null, 2)}
            </pre>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </main>
  );
}
