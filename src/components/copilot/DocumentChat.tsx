import { Button } from "@/components/shared/Button";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { ChatMessage } from "@/components/copilot/ChatMessage";

import {
  suggestedDocumentQuestions,
} from "@/lib/mock-data";

import type {
  ChatMessage as ChatMessageType,
} from "@/types/copilot";

interface DocumentChatProps {
  messages: ChatMessageType[];

  onAsk: (
    question: string,
  ) => void;

  disabled?: boolean;

  documentName?: string;

  pageCount?: number;
}

export function DocumentChat({
  messages,
  onAsk,
  disabled,
  documentName,
  pageCount,
}: DocumentChatProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-line bg-surface/70 px-4 py-3">
        <p className="text-[13px] font-medium text-ink">
          {documentName ??
            "Uploaded PDF"}
        </p>

        <dl className="mt-2 flex gap-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          <div>
            <dt className="inline">
              Pages{" "}
            </dt>

            <dd className="inline text-ink">
              {pageCount ??
                "—"}
            </dd>
          </div>

          <div>
            <dt className="inline">
              Status{" "}
            </dt>

            <dd className="inline text-accent">
              Ready
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <SectionLabel>
          Suggested
        </SectionLabel>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestedDocumentQuestions.map(
            (question) => (
              <Button
                key={question}
                size="sm"
                shape="pill"
                variant="outline"
                disabled={disabled}
                onClick={() =>
                  onAsk(question)
                }
              >
                {question}
              </Button>
            ),
          )}
        </div>
      </div>

      <div className="space-y-4 border-t border-line pt-5">
        <SectionLabel>
          Conversation
        </SectionLabel>

        {messages.length === 0 && (
          <p className="text-[12.5px] leading-relaxed text-muted">
            Ask anything about the
            whole document — structure,
            arguments, or what to study
            next.
          </p>
        )}

        {messages.map(
          (message) => (
            <ChatMessage
              key={message.id}
              message={message}
            />
          ),
        )}
      </div>
    </div>
  );
}