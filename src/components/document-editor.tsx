"use client";

import { useState, useEffect, useCallback } from "react";
import { Editor } from "./editor/editor";
import { updateDocument } from "@/app/actions";
import { Document } from "@/lib/schema";
import { debounce } from "@/lib/debounce";

interface DocumentEditorProps {
  document: Document;
}

export function DocumentEditor({ document }: DocumentEditorProps) {
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveDocument = useCallback(
    async (newTitle: string, newContent: string) => {
      setIsSaving(true);
      try {
        await updateDocument(document.id, {
          title: newTitle,
          content: newContent,
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to save document:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [document.id]
  );

  const debouncedSave = useCallback(
    debounce((newTitle: string, newContent: string) => {
      saveDocument(newTitle, newContent);
    }, 1000),
    [saveDocument]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedSave(newTitle, content);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    debouncedSave(title, newContent);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="w-full border-none bg-transparent text-4xl font-bold outline-none focus:ring-0"
          placeholder="Untitled"
        />
        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
          {isSaving ? (
            <span>Saving...</span>
          ) : lastSaved ? (
            <span>Saved {lastSaved.toLocaleTimeString()}</span>
          ) : null}
        </div>
      </div>
      <Editor initialContent={content} onChange={handleContentChange} />
    </div>
  );
}
