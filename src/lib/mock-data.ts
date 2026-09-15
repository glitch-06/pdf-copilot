import type { DocumentSummary, Selection } from "@/types/copilot";

export const currentDocument = {
  id: "ml-lecture-notes",
  name: "Machine Learning — Lecture Notes.pdf",
  title: "Introduction to Machine Learning",
  pages: 42,
  sections: 8,
  status: "Ready" as const,
};

export const recentDocuments: DocumentSummary[] = [
  {
    id: "ml-lecture-notes",
    name: "Introduction to Machine Learning",
    pages: 42,
    sections: 8,
    lastOpened: "Last opened 8 minutes ago",
    progress: 0.34,
  },
  {
    id: "deep-learning",
    name: "Deep Learning Fundamentals",
    pages: 86,
    sections: 12,
    lastOpened: "Last opened yesterday",
    progress: 0.62,
  },
  {
    id: "statistics",
    name: "Statistics Notes",
    pages: 31,
    sections: 6,
    lastOpened: "Last opened 3 days ago",
    progress: 0.12,
  },
];

export const gradientDescentSelection: Selection = {
  id: "sel-gradient-descent",
  kind: "text",
  content:
    "Gradient descent is an iterative optimization algorithm used to minimize a differentiable loss function by moving the parameters in the direction of the negative gradient.",
  page: 4,
};

export const equationSelection: Selection = {
  id: "sel-equation",
  kind: "equation",
  content: "∇J(θ) = ∂J / ∂θ",
  page: 4,
};

export const handwritingSelection: Selection = {
  id: "sel-handwriting",
  kind: "handwriting",
  content: "x² + 5x + 6 = 0",
  page: 5,
  confidence: 0.94,
};

export const diagramSelection: Selection = {
  id: "sel-diagram",
  kind: "image",
  content: "Feed-forward network with one hidden layer",
  label: "Figure 3 — Neural Network Architecture",
  page: 5,
};

export const suggestedDocumentQuestions = [
  "What is the main idea?",
  "Summarize this document",
  "What should I study?",
  "Explain the hardest concepts",
  "Create a quiz",
];
