"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Editor, Range } from "@tiptap/core";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Text,
  CheckSquare,
} from "lucide-react";

interface CommandItemProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface SlashCommandListProps {
  items: CommandItemProps[];
  command: (item: CommandItemProps) => void;
  editor: Editor;
  range: Range;
}

export const SlashCommandList = forwardRef<
  { onKeyDown: (event: KeyboardEvent) => boolean },
  SlashCommandListProps
>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItemProps[] = [
    {
      title: "Text",
      description: "Just start typing with plain text.",
      icon: Text,
    },
    {
      title: "Heading 1",
      description: "Big section heading.",
      icon: Heading1,
    },
    {
      title: "Heading 2",
      description: "Medium section heading.",
      icon: Heading2,
    },
    {
      title: "Heading 3",
      description: "Small section heading.",
      icon: Heading3,
    },
    {
      title: "Bullet List",
      description: "Create a simple bullet list.",
      icon: List,
    },
    {
      title: "Numbered List",
      description: "Create a list with numbering.",
      icon: ListOrdered,
    },
    {
      title: "To-do List",
      description: "Track tasks with a to-do list.",
      icon: CheckSquare,
    },
  ];

  const selectItem = (index: number) => {
    const item = commands[index];

    if (item) {
      props.editor
        .chain()
        .focus()
        .deleteRange(props.range)
        .run();

      switch (item.title) {
        case "Text":
          props.editor.chain().focus().setParagraph().run();
          break;
        case "Heading 1":
          props.editor.chain().focus().setHeading({ level: 1 }).run();
          break;
        case "Heading 2":
          props.editor.chain().focus().setHeading({ level: 2 }).run();
          break;
        case "Heading 3":
          props.editor.chain().focus().setHeading({ level: 3 }).run();
          break;
        case "Bullet List":
          props.editor.chain().focus().toggleBulletList().run();
          break;
        case "Numbered List":
          props.editor.chain().focus().toggleOrderedList().run();
          break;
        case "To-do List":
          props.editor.chain().focus().toggleTaskList().run();
          break;
      }
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + commands.length - 1) % commands.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % commands.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, []);

  useImperativeHandle(ref, () => ({
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="z-50 w-72 rounded-lg border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
      {commands.map((item, index) => (
        <button
          key={index}
          onClick={() => selectItem(index)}
          className={`flex w-full items-start gap-3 rounded-md p-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
            index === selectedIndex
              ? "bg-zinc-100 dark:bg-zinc-700"
              : ""
          }`}
          type="button"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
            <item.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {item.title}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {item.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
});

SlashCommandList.displayName = "SlashCommandList";
