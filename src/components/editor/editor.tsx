"use client";

import { EditorContent, useEditor, EditorEvents } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEffect } from "react";
import { EditorBubbleMenu } from "./bubble-menu";
import { EditorSlashCommand } from "./slash-command";

interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}

export function Editor({ initialContent = "", onChange, editable = true }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      EditorSlashCommand,
    ],
    content: initialContent,
    editable,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none max-w-none",
      },
    },
    onUpdate: ({ editor }: EditorEvents["update"]) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative w-full">
      <EditorBubbleMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
