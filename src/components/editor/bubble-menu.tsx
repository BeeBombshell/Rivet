"use client";

import { Editor } from "@tiptap/react";
import { Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3, List, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorBubbleMenuProps {
  editor: Editor;
}

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const items = [
    {
      name: "bold",
      icon: Bold,
      command: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      label: "Bold",
    },
    {
      name: "italic",
      icon: Italic,
      command: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      label: "Italic",
    },
    {
      name: "strike",
      icon: Strikethrough,
      command: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
      label: "Strike",
    },
    {
      name: "code",
      icon: Code,
      command: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
      label: "Code",
    },
  ];

  const blockItems = [
    {
      name: "h1",
      icon: Heading1,
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
      label: "H1",
    },
    {
      name: "h2",
      icon: Heading2,
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
      label: "H2",
    },
    {
      name: "h3",
      icon: Heading3,
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
      label: "H3",
    },
    {
      name: "bulletList",
      icon: List,
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      label: "Bullet List",
    },
    {
      name: "orderedList",
      icon: ListOrdered,
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      label: "Numbered List",
    },
  ];

  return (
    <div className="sticky top-0 z-10 mb-4 flex flex-wrap gap-1 rounded-lg border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex gap-1 border-r border-zinc-200 pr-2 dark:border-zinc-700">
        {items.map((item) => (
          <button
            key={item.name}
            onClick={item.command}
            className={cn(
              "rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors",
              item.isActive && "bg-zinc-200 dark:bg-zinc-600"
            )}
            type="button"
            title={item.label}
          >
            <item.icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <div className="flex gap-1">
        {blockItems.map((item) => (
          <button
            key={item.name}
            onClick={item.command}
            className={cn(
              "rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors",
              item.isActive && "bg-zinc-200 dark:bg-zinc-600"
            )}
            type="button"
            title={item.label}
          >
            <item.icon className="h-4 w-4" />
          </button>
        ))}
      </div>
    </div>
  );
}
