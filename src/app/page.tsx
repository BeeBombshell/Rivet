import { listDocuments } from "./actions";
import { DocumentList } from "@/components/document-list";

export default async function Home() {
  const result = await listDocuments();
  const documents = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            Documents
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Create and manage your documents
          </p>
        </div>
        <DocumentList documents={documents} />
      </div>
    </div>
  );
}
