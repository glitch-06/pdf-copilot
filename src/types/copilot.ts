export type SelectionKind = "text" | "equation" | "handwriting" | "image";

export interface Selection {
  id: string;
  kind: SelectionKind;
  /** Raw selected text, LaTeX-ish equation, or OCR transcription. */
  content: string;
  page: number;
  /** Caption for image/diagram selections. */
  label?: string;
  /** OCR confidence 0-1, only for handwriting/scanned regions. */
  confidence?: number;
}

export type BlockType =
  | "heading"
  | "paragraph"
  | "bullets"
  | "numbered"
  | "quote"
  | "code"
  | "equation"
  | "table"
  | "callout";

export interface ResponseBlock {
  type: BlockType;
  /** heading / paragraph / quote / code / equation / callout */
  text?: string;
  /** bullets / numbered */
  items?: string[];
  /** code language */
  language?: string;
  /** callout label, e.g. "In simple terms" */
  label?: string;
  /** table */
  head?: string[];
  rows?: string[][];
}

export interface VariableGloss {
  symbol: string;
  meaning: string;
}

export interface AIExplanation {
  id: string;
  title: string;
  blocks: ResponseBlock[];
  variables?: VariableGloss[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  pending?: boolean;
}

export interface DocumentSummary {
  id: string;
  name: string;
  pages: number;
  sections: number;
  lastOpened: string;
  progress: number;
}

export type QuickActionId =
  | "explain"
  | "simplify"
  | "example"
  | "deeper"
  | "summarize"
  | "flashcards";
