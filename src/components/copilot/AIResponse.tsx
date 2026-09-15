import { SectionLabel } from "@/components/shared/SectionLabel";

import type { AIExplanation, ResponseBlock } from "@/types/copilot";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";

function MarkdownRenderer({ text }: { text: string }) {
  return (
    <div className="text-[13.5px] leading-relaxed text-ink/90">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h2 className="mt-5 text-[15px] font-semibold text-ink">
              {children}
            </h2>
          ),

          h2: ({ children }) => (
            <h3 className="mt-5 text-[14px] font-semibold text-ink">
              {children}
            </h3>
          ),

          h3: ({ children }) => (
            <h4 className="mt-4 text-[13.5px] font-semibold text-ink">
              {children}
            </h4>
          ),

          p: ({ children }) => (
            <p className="mt-2 leading-relaxed">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="mt-2 ml-5 list-disc space-y-1.5">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mt-2 ml-5 list-decimal space-y-1.5">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="pl-1 leading-relaxed">
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
            <blockquote className="mt-3 border-l-2 border-line pl-3 italic text-muted">
              {children}
            </blockquote>
          ),

          hr: () => (
            <hr className="my-4 border-line" />
          ),

          code: ({ children, className }) => {
            const inline = !className;

            if (inline) {
              return (
                <code className="rounded bg-paper px-1.5 py-0.5 font-mono text-[11px] text-ink">
                  {children}
                </code>
              );
            }

            return (
              <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-paper/70 px-3.5 py-3 font-mono text-[11.5px] leading-relaxed text-ink/85">
                <code className={className}>
                  {children}
                </code>
              </pre>
            );
          },

          table: ({ children }) => (
            <div className="mt-3 overflow-x-auto rounded-lg border border-line">
              <table className="w-full text-left text-[12px]">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-paper/70">
              {children}
            </thead>
          ),

          th: ({ children }) => (
            <th className="px-3 py-1.5 font-medium text-muted">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border-t border-line px-3 py-1.5 text-ink/85">
              {children}
            </td>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

function Block({ block }: { block: ResponseBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h3 className="mt-5 text-[13px] font-semibold tracking-tight text-ink">
          {block.text}
        </h3>
      );

    case "paragraph":
      return (
        <MarkdownRenderer text={block.text} />
      );

    case "bullets":
      return (
        <ul className="mt-2 space-y-1.5">
          {block.items?.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-[13px] leading-relaxed text-ink/85"
            >
              <span className="mt-[7px] size-1 shrink-0 rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "numbered":
      return (
        <ol className="mt-2 space-y-1.5">
          {block.items?.map((item, index) => (
            <li
              key={item}
              className="flex gap-2.5 text-[13px] leading-relaxed text-ink/85"
            >
              <span className="font-mono text-[11px] leading-5 text-accent tabular-nums">
                {index + 1}
              </span>

              <span>{item}</span>
            </li>
          ))}
        </ol>
      );

    case "quote":
      return (
        <blockquote className="mt-3 border-l-2 border-line pl-3 text-[13px] leading-relaxed text-muted italic">
          {block.text}
        </blockquote>
      );

    case "code":
      return (
        <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-paper/70 px-3.5 py-3 font-mono text-[11.5px] leading-relaxed text-ink/85">
          <code>{block.text}</code>
        </pre>
      );

    case "equation":
      return (
        <div className="mt-3 overflow-x-auto rounded-lg border border-line bg-paper/60 px-4 py-3 text-center text-ink">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {`$$${block.text}$$`}
          </ReactMarkdown>
        </div>
      );

    case "callout":
      return (
        <div className="mt-3 rounded-lg border-l-2 border-accent bg-accent-soft px-3.5 py-2.5">
          {block.label && (
            <SectionLabel tone="accent">
              {block.label}
            </SectionLabel>
          )}

          <p className="mt-1 text-[13px] leading-relaxed font-medium text-ink">
            {block.text}
          </p>
        </div>
      );

    case "table":
      return (
        <div className="mt-3 overflow-hidden rounded-lg border border-line">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-paper/70">
              <tr>
                {block.head?.map((cell) => (
                  <th
                    key={cell}
                    className="px-3 py-1.5 font-medium text-muted"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {block.rows?.map((row) => (
                <tr
                  key={row.join()}
                  className="border-t border-line"
                >
                  {row.map((cell) => (
                    <td
                      key={cell}
                      className="px-3 py-1.5 text-ink/85"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}

export function AIResponse({
  explanation,
}: {
  explanation: AIExplanation;
}) {
  return (
    <article className="rise">
      <SectionLabel tone="accent">
        {explanation.title}
      </SectionLabel>

      {explanation.blocks.map((block, index) => (
        <Block
          key={`${block.type}-${index}`}
          block={block}
        />
      ))}

      {explanation.variables && (
        <div className="mt-5">
          <SectionLabel>
            Variables
          </SectionLabel>

          <dl className="mt-2 divide-y divide-line overflow-hidden rounded-lg border border-line">
            {explanation.variables.map((variable) => (
              <div
                key={variable.symbol}
                className="flex gap-3 px-3 py-2"
              >
                <dt className="w-16 shrink-0 font-mono text-[13px] text-accent">
                  {variable.symbol}
                </dt>

                <dd className="text-[12.5px] leading-relaxed text-ink/85">
                  {variable.meaning}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </article>
  );
}