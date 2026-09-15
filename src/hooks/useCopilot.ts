import {
  useCallback,
  useState,
} from "react";

import { aiService } from "@/services/aiService";

import type {
  AIExplanation,
  ChatMessage,
  QuickActionId,
  Selection,
} from "@/types/copilot";

export type CopilotStatus =
  | "idle"
  | "loading"
  | "ready"
  | "error";

export function loadingMessage(
  selection: Selection | null,
  documentMode: boolean,
) {
  if (documentMode) {
    return "Understanding your document…";
  }

  switch (selection?.kind) {
    case "handwriting":
      return "Reading handwritten content…";

    case "image":
      return "Reading the diagram…";

    case "equation":
      return "Reading the equation…";

    default:
      return "Analyzing selection…";
  }
}

export function useCopilot(
  documentId?: string | null,
) {
  const [selection, setSelection] =
    useState<Selection | null>(null);

  const [explanation, setExplanation] =
    useState<AIExplanation | null>(null);

  const [status, setStatus] =
    useState<CopilotStatus>("idle");

  const [error, setError] =
    useState<string | null>(null);

  const [action, setAction] =
    useState<QuickActionId>("explain");

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [documentMessages, setDocumentMessages] =
    useState<ChatMessage[]>([]);

  const run = useCallback(
    async (
      target: Selection,
      nextAction: QuickActionId,
    ) => {
      setAction(nextAction);
      setStatus("loading");
      setError(null);

      try {
        let result: AIExplanation;

        if (
          target.kind === "image" ||
          target.kind === "handwriting"
        ) {
          result =
            await aiService.analyzeImage(
              target,
            );
        } else {
          result =
            await aiService.explainSelection(
              target,
              nextAction,
            );
        }

        setExplanation(result);
        setStatus("ready");
      } catch (caught) {
        const message =
          caught instanceof Error
            ? caught.message
            : "Something went wrong.";

        console.error(
          "PDF Copilot analysis error:",
          caught,
        );

        setError(message);
        setStatus("error");
      }
    },
    [],
  );

  const select = useCallback(
    (next: Selection) => {
      setSelection(next);
      setMessages([]);
      setExplanation(null);
      setError(null);

      void run(
        next,
        "explain",
      );
    },
    [run],
  );

  const applyAction = useCallback(
    (next: QuickActionId) => {
      if (!selection) {
        return;
      }

      void run(
        selection,
        next,
      );
    },
    [run, selection],
  );

  const retry = useCallback(() => {
    if (!selection) {
      return;
    }

    void run(
      selection,
      action,
    );
  }, [
    action,
    run,
    selection,
  ]);

  const ask = useCallback(
    async (
      question: string,
      scope:
        | "selection"
        | "document",
    ) => {
      const setList =
        scope === "document"
          ? setDocumentMessages
          : setMessages;

      const userId =
        crypto.randomUUID();

      const replyId =
        crypto.randomUUID();

      setList((current) => [
        ...current,
        {
          id: userId,
          role: "user",
          text: question,
        },
        {
          id: replyId,
          role: "assistant",
          text: "",
          pending: true,
        },
      ]);

      try {
        const answer =
          await aiService.chat(
            question,
            scope === "selection"
              ? selection
              : null,
            documentId,
          );

        setList((current) =>
          current.map(
            (message) =>
              message.id === replyId
                ? {
                    ...message,
                    text: answer,
                    pending: false,
                  }
                : message,
          ),
        );
      } catch (caught) {
        console.error(
          "Gemini chat error:",
          caught,
        );

        const errorMessage =
          caught instanceof Error
            ? caught.message
            : "PDF Copilot couldn't answer that. Try again.";

        setList((current) =>
          current.map(
            (message) =>
              message.id === replyId
                ? {
                    ...message,
                    text: errorMessage,
                    pending: false,
                  }
                : message,
          ),
        );
      }
    },
    [
      documentId,
      selection,
    ],
  );

  return {
    selection,
    explanation,
    status,
    error,
    action,
    messages,
    documentMessages,
    select,
    applyAction,
    retry,
    ask,
  };
}