import { getDocument } from "@/app/actions";
import { DocumentEditor } from "@/components/document-editor";
import { notFound } from "next/navigation";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getDocument(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <DocumentEditor document={result.data} />;
}
