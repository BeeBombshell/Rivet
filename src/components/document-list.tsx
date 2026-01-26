"use client";

import { Document } from "@/lib/schema";
import { createDocument, deleteDocument } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Plus, FileText, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

interface DocumentListProps {
  documents: Document[];
}

export function DocumentList({ documents }: DocumentListProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateDocument = async () => {
    try {
      setIsCreating(true);
      const result = await createDocument({
        title: "Untitled",
        content: "",
      });

      if (result.success && result.data) {
        router.push(`/d/${result.data.id}`);
      } else {
        console.error("Failed to create document:", result.error);
        alert(`Failed to create document: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating document:", error);
      alert("An unexpected error occurred while creating the document");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteDocument = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this document?")) {
      await deleteDocument(id);
      router.refresh();
    }
  };

  return (
    <div>
      <button
        onClick={handleCreateDocument}
        disabled={isCreating}
        className="mb-6 flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {isCreating ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="h-5 w-5" />
            New Document
          </>
        )}
      </button>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500">
            No documents yet. Create your first document to get started.
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => router.push(`/d/${doc.id}`)}
              className="group relative cursor-pointer rounded-lg border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
            >
              <div className="mb-3 flex items-start justify-between">
                <FileText className="h-6 w-6 text-zinc-400" />
                <button
                  onClick={(e) => handleDeleteDocument(doc.id, e)}
                  className="opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {doc.title || "Untitled"}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Updated {new Date(doc.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
