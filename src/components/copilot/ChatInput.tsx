import {
  ArrowUp,
  Mic,
  Paperclip,
} from "lucide-react";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { IconButton } from "@/components/shared/IconButton";

export interface ChatInputHandle {
  focus: () => void;
}

interface ChatInputProps {
  onSend: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput =
  forwardRef<
    ChatInputHandle,
    ChatInputProps
  >(
    (
      {
        onSend,
        disabled,
        placeholder = "Ask anything about this section…",
      },
      ref,
    ) => {
      const [value, setValue] =
        useState("");

      const inputRef =
        useRef<HTMLInputElement>(null);

      useImperativeHandle(
        ref,
        () => ({
          focus: () => {
            inputRef.current?.focus();
          },
        }),
        [],
      );

      const submit = () => {
        const trimmed =
          value.trim();

        if (
          !trimmed ||
          disabled
        ) {
          return;
        }

        onSend(trimmed);
        setValue("");
      };

      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="sticky bottom-0 border-t border-line bg-surface/80 p-4 backdrop-blur-md"
        >
          <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-2.5 py-1.5">
            <IconButton
              label="Attach image"
              size="sm"
              type="button"
            >
              <Paperclip className="size-3.5" />
            </IconButton>

            <input
              ref={inputRef}
              value={value}
              onChange={(event) =>
                setValue(
                  event.target.value,
                )
              }
              placeholder={placeholder}
              aria-label={placeholder}
              className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-muted/70"
            />

            <IconButton
              label="Voice input"
              size="sm"
              type="button"
            >
              <Mic className="size-3.5" />
            </IconButton>

            <button
              type="submit"
              aria-label="Send message"
              disabled={
                disabled ||
                !value.trim()
              }
              className="grid size-6 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground transition hover:brightness-105 disabled:opacity-40"
            >
              <ArrowUp className="size-3.5" />
            </button>
          </div>
        </form>
      );
    },
  );

ChatInput.displayName =
  "ChatInput";