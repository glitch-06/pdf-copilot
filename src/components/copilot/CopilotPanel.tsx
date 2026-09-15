import {
  useEffect,
  useRef,
  useState,
} from "react";

import { AIResponse } from "@/components/copilot/AIResponse";
import {
  ChatInput,
  type ChatInputHandle,
} from "@/components/copilot/ChatInput";
import { ChatMessage } from "@/components/copilot/ChatMessage";
import {
  CopilotHeader,
  type CopilotMode,
} from "@/components/copilot/CopilotHeader";
import { DocumentChat } from "@/components/copilot/DocumentChat";
import { ErrorState } from "@/components/copilot/ErrorState";
import { LoadingState } from "@/components/copilot/LoadingState";
import { QuickActions } from "@/components/copilot/QuickActions";
import { SelectedContent } from "@/components/copilot/SelectedContent";
import { SectionLabel } from "@/components/shared/SectionLabel";

import {
  loadingMessage,
  type useCopilot,
} from "@/hooks/useCopilot";

type Copilot =
  ReturnType<typeof useCopilot>;

interface CopilotPanelProps {
  copilot: Copilot;
  focusInput?: boolean;
  documentName?: string;
  pageCount?: number;
}

export function CopilotPanel({
  copilot,
  focusInput = false,
  documentName,
  pageCount,
}: CopilotPanelProps) {
  const [mode, setMode] =
    useState<CopilotMode>(
      "selection",
    );

  const chatInputRef =
    useRef<ChatInputHandle>(null);

  const {
    selection,
    explanation,
    status,
    error,
    action,
    messages,
    documentMessages,
    applyAction,
    retry,
    ask,
  } = copilot;

  const busy =
    status === "loading";

  useEffect(() => {
    if (!focusInput) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        chatInputRef.current?.focus();
      }, 50);

    return () => {
      window.clearTimeout(timer);
    };
  }, [focusInput]);

  return (
    <aside className="flex min-h-0 w-full shrink-0 flex-col overflow-hidden border-line bg-surface/50 backdrop-blur-xl lg:w-[384px] lg:border-l">
      <CopilotHeader
        mode={mode}
        onModeChange={setMode}
        subtitle={
          mode === "document"
            ? "Chat with document"
            : "Understanding your selection"
        }
      />

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {mode === "document" ? (
          <DocumentChat
            messages={
              documentMessages
            }
            onAsk={(question) =>
              void ask(
                question,
                "document",
              )
            }
            disabled={busy}
            documentName={
              documentName
            }
            pageCount={
              pageCount
            }
          />
        ) : (
          <>
            {selection && (
              <SelectedContent
                key={selection.id}
                selection={
                  selection
                }
              />
            )}

            <QuickActions
              active={action}
              onAction={
                applyAction
              }
              disabled={busy}
            />

            {status === "loading" && (
              <LoadingState
                message={loadingMessage(
                  selection,
                  false,
                )}
              />
            )}

            {status === "error" && (
              <ErrorState
                message={
                  error ??
                  "PDF Copilot couldn't analyze this selection."
                }
                onRetry={retry}
                onCopy={() =>
                  void navigator.clipboard?.writeText(
                    selection?.content ??
                      "",
                  )
                }
              />
            )}

            {status === "ready" &&
              explanation && (
                <AIResponse
                  explanation={
                    explanation
                  }
                />
              )}

            {messages.length > 0 && (
              <div className="space-y-4 border-t border-line pt-5">
                <SectionLabel>
                  Follow-up
                </SectionLabel>

                {messages.map(
                  (message) => (
                    <ChatMessage
                      key={
                        message.id
                      }
                      message={
                        message
                      }
                    />
                  ),
                )}
              </div>
            )}
          </>
        )}
      </div>

      <ChatInput
        ref={chatInputRef}
        disabled={busy}
        placeholder={
          mode === "document"
            ? "Ask anything about this document…"
            : "Ask anything about this section…"
        }
        onSend={(value) =>
          void ask(
            value,
            mode === "document"
              ? "document"
              : "selection",
          )
        }
      />
    </aside>
  );
}