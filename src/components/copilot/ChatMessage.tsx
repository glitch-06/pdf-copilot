import type { ChatMessage as ChatMessageType } from "@/types/copilot";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";

export function ChatMessage({
  message,
}: {
  message: ChatMessageType;
}) {
  if (message.role === "user") {
    return (
      <p className="text-[12.5px] font-medium text-ink">
        {message.text}
      </p>
    );
  }

  return (
    <div className="mt-1 text-[12.5px] leading-relaxed text-muted">
      {message.pending ? (
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
          Analyzing…
        </span>
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            h1: ({ children }) => (
              <h3 className="mt-3 text-[14px] font-semibold text-ink">
                {children}
              </h3>
            ),

            h2: ({ children }) => (
              <h3 className="mt-3 text-[14px] font-semibold text-ink">
                {children}
              </h3>
            ),

            h3: ({ children }) => (
              <h4 className="mt-3 text-[13px] font-semibold text-ink">
                {children}
              </h4>
            ),

            p: ({ children }) => (
              <p className="mt-2 leading-relaxed">
                {children}
              </p>
            ),

            ul: ({ children }) => (
              <ul className="mt-2 ml-4 list-disc space-y-1">
                {children}
              </ul>
            ),

            ol: ({ children }) => (
              <ol className="mt-2 ml-5 list-decimal space-y-1">
                {children}
              </ol>
            ),

            li: ({ children }) => (
              <li className="pl-1">
                {children}
              </li>
            ),

            strong: ({ children }) => (
              <strong className="font-semibold text-ink">
                {children}
              </strong>
            ),

            em: ({ children }) => (
              <em className="italic">
                {children}
              </em>
            ),

            blockquote: ({ children }) => (
              <blockquote className="mt-2 border-l-2 border-line pl-3 italic text-muted">
                {children}
              </blockquote>
            ),

            code: ({ children, className }) => {
              const isInline = !className;

              if (isInline) {
                return (
                  <code className="rounded bg-paper px-1 py-0.5 font-mono text-[11px]">
                    {children}
                  </code>
                );
              }

              return (
                <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-paper/70 px-3 py-2 font-mono text-[11px] leading-relaxed text-ink/85">
                  <code className={className}>
                    {children}
                  </code>
                </pre>
              );
            },

            hr: () => (
              <hr className="my-3 border-line" />
            ),
          }}
        >
          {message.text}
        </ReactMarkdown>
      )}
    </div>
  );
}