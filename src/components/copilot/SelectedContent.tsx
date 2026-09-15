import { useState } from "react";

import { NetworkDiagram } from "@/components/pdf/NetworkDiagram";
import { SectionLabel } from "@/components/shared/SectionLabel";
import type { Selection } from "@/types/copilot";

const kindLabel: Record<Selection["kind"], string> = {
  text: "Selected text",
  equation: "Selected equation",
  handwriting: "Handwritten content detected",
  image: "Selected figure",
};

export function SelectedContent({ selection }: { selection: Selection }) {
  const [transcription, setTranscription] = useState(selection.content);

  if (selection.kind === "handwriting") {
    return (
      <div className="rise rounded-lg border-l-2 border-accent bg-accent-soft px-4 py-3">
        <SectionLabel>{kindLabel.handwriting}</SectionLabel>
        <div className="mt-2 rounded-md border border-line bg-document px-4 py-5 text-center">
          <span
            className="text-[20px] text-document-ink/70"
            style={{ fontFamily: "'Segoe Script','Bradley Hand',cursive", fontStyle: "italic" }}
          >
            {selection.content}
          </span>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <SectionLabel>Detected content</SectionLabel>
          <span className="font-mono text-[10px] text-accent">
            {Math.round((selection.confidence ?? 0) * 100)}% confidence
          </span>
        </div>
        <p className="mt-1 font-mono text-[13px] text-ink">{transcription}</p>
        <label className="mt-3 block">
          <SectionLabel>Correct transcription</SectionLabel>
          <input
            value={transcription}
            onChange={(event) => setTranscription(event.target.value)}
            className="mt-1 w-full rounded-md border border-line bg-surface px-2.5 py-1.5 font-mono text-[12.5px] text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          />
        </label>
      </div>
    );
  }

  if (selection.kind === "image") {
    return (
      <div className="rise rounded-lg border-l-2 border-accent bg-accent-soft px-4 py-3">
        <SectionLabel>{kindLabel.image}</SectionLabel>
        <div className="mt-2 rounded-md border border-line bg-document px-3 py-3">
          <NetworkDiagram className="mx-auto h-28 w-full max-w-[240px] text-document-ink/70" />
        </div>
        <p className="mt-2 text-[12.5px] font-medium text-ink">{selection.label}</p>
      </div>
    );
  }

  if (selection.kind === "equation") {
    return (
      <div className="rise rounded-lg border-l-2 border-accent bg-accent-soft px-4 py-3">
        <SectionLabel>{kindLabel.equation}</SectionLabel>
        <p className="mt-2 text-center font-mono text-[16px] text-ink">{selection.content}</p>
      </div>
    );
  }

  return (
    <div className="rise rounded-lg border-l-2 border-accent bg-accent-soft px-4 py-3">
      <SectionLabel>{kindLabel.text}</SectionLabel>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink/85">“{selection.content}”</p>
    </div>
  );
}
