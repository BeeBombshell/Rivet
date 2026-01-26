"use server";

import { db } from "@/lib/db";
import { documents, type Document, type NewDocument } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createDocument(data: Partial<NewDocument>) {
  try {
    const [document] = await db
      .insert(documents)
      .values({
        title: data.title || "Untitled",
        content: data.content || "",
        userId: data.userId,
      })
      .returning();

    revalidatePath("/");
    return { success: true, data: document };
  } catch (error) {
    console.error("Error creating document:", error);
    return { success: false, error: "Failed to create document" };
  }
}

export async function updateDocument(
  id: string,
  data: Partial<Pick<Document, "title" | "content">>
) {
  try {
    const [document] = await db
      .update(documents)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, id))
      .returning();

    revalidatePath("/");
    revalidatePath(`/d/${id}`);
    return { success: true, data: document };
  } catch (error) {
    console.error("Error updating document:", error);
    return { success: false, error: "Failed to update document" };
  }
}

export async function getDocument(id: string) {
  try {
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    return { success: true, data: document };
  } catch (error) {
    console.error("Error fetching document:", error);
    return { success: false, error: "Failed to fetch document" };
  }
}

export async function listDocuments(userId?: string) {
  try {
    const query = db.select().from(documents).orderBy(desc(documents.updatedAt));

    const allDocuments = userId
      ? await query.where(eq(documents.userId, userId))
      : await query;

    return { success: true, data: allDocuments };
  } catch (error) {
    console.error("Error listing documents:", error);
    return { success: false, error: "Failed to list documents" };
  }
}

export async function deleteDocument(id: string) {
  try {
    await db.delete(documents).where(eq(documents.id, id));

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { success: false, error: "Failed to delete document" };
  }
}
