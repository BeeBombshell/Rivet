"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FormRenderer, FormSchema } from "@rivet/form-builder";
import "@rivet/form-builder/styles.css";
import { ChevronLeft, CheckCircle2, Layout, Send } from "lucide-react";

export default function PreviewPage() {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // 1. Check URL for shared schema
    const params = new URLSearchParams(window.location.search);
    const schemaParam = params.get("schema");
    if (schemaParam) {
      try {
        const decoded = JSON.parse(atob(schemaParam));
        setSchema(decoded);
        return;
      } catch (e) {
        console.error("Failed to decode schema from URL", e);
      }
    }

    // 2. Fallback to localStorage
    const saved = localStorage.getItem("rivet-form-schema");
    if (saved) {
      try {
        setSchema(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved schema", e);
      }
    }
  }, []);

  if (!isMounted) return null;

  const handleSubmit = (data: any) => {
    console.log("Form Submitted:", data);
    setSubmittedData(data);
  };

  if (!schema) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Schema Found</h2>
            <p className="text-gray-500 mb-6">Create a form in the editor before previewing.</p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Editor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-all group"
          >
            <div className="p-1.5 rounded-lg bg-white border border-gray-200 group-hover:border-gray-300 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
            Back to Editor
          </Link>

          <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold ring-1 ring-blue-200">
            <Layout className="w-3.5 h-3.5" />
            LIVE PREVIEW MODE
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Renderer */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[32px] shadow-2xl shadow-blue-900/5 p-8 md:p-12 border border-gray-100 ring-1 ring-black/5">


              <FormRenderer 
                form={schema} 
                onSubmit={handleSubmit}
              />
            </div>
          </div>

          {/* Submission Result */}
          <div className="lg:col-span-5">
            <div className="sticky top-12">
              <div className="bg-[#0f172a] rounded-[32px] overflow-hidden shadow-2xl">
                <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Send className="w-4 h-4 text-emerald-400" />
                    Console
                  </h3>
                  {submittedData && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      RECEIVED
                    </span>
                  )}
                </div>
                
                <div className="p-8">
                  {submittedData ? (
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                        <div>
                          <h4 className="text-white font-bold text-sm">Form Submitted Successfully!</h4>
                          <p className="text-gray-400 text-xs mt-1">Check the JSON below for the captured payload.</p>
                        </div>
                      </div>

                      <div className="bg-black/40 rounded-2xl p-6 overflow-auto max-h-[400px] border border-white/5">
                        <pre className="text-emerald-400 font-mono text-xs leading-relaxed">
                          {JSON.stringify(submittedData, null, 2)}
                        </pre>
                      </div>

                      <button 
                        onClick={() => setSubmittedData(null)}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition-all border border-white/10"
                      >
                        Clear Result
                      </button>
                    </div>
                  ) : (
                    <div className="py-20 text-center space-y-4">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-white/10">
                        <Send className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Waiting for submission...</p>
                        <p className="text-gray-500 text-xs mt-2 leading-relaxed">Fill out the form and click submit to <br/> see the result in real-time.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips Section */}
              <div className="mt-8 p-6 bg-blue-600 rounded-[32px] text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
                <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                  Pro Tip 💡
                </h4>
                <p className="text-blue-100 text-xs leading-relaxed">
                  Try the "Order Form" example in the editor to see complex calculations updating the submission values automatically!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
