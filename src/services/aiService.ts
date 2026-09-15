import type {
  AIExplanation,
  QuickActionId,
  Selection,
} from "@/types/copilot";

const BACKEND_URL =
  "http://127.0.0.1:8000";

const delay = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms),
  );

let failNext = false;

export function scheduleFailure(
  value = true,
) {
  failNext = value;
}

function guard() {
  if (failNext) {
    failNext = false;

    throw new Error(
      "PDF Copilot couldn't analyze this selection.",
    );
  }
}

function createExplanation(
  text: string,
  title = "AI Explanation",
): AIExplanation {
  return {
    id: `gemini-${Date.now()}`,
    title,
    blocks: [
      {
        type: "paragraph",
        text,
      },
    ],
  };
}

async function callBackend(
  endpoint: string,
  body: Record<string, unknown>,
): Promise<string> {
  try {
    const response = await fetch(
      `${BACKEND_URL}${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `Backend error (${response.status})`,
      );
    }

    if (!data.response) {
      throw new Error(
        "Gemini returned an empty response.",
      );
    }

    return data.response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "Unable to connect to the PDF Copilot backend.",
    );
  }
}

export const aiService = {
  async explainSelection(
    selection: Selection,
    action: QuickActionId = "explain",
  ): Promise<AIExplanation> {
    await delay(300);

    guard();

    let instruction =
      "Explain the selected content clearly.";

    switch (action) {
      case "simplify":
        instruction =
          "Explain the selected content in very simple language, as if teaching a beginner.";
        break;

      case "example":
        instruction =
          "Explain the selected content and give a practical, easy-to-understand example.";
        break;

      case "deeper":
        instruction =
          "Give a deeper technical explanation of the selected content. Include important details and intuition.";
        break;

      case "summarize":
        instruction =
          "Summarize the selected content into the most important points.";
        break;

      case "flashcards":
        instruction =
          "Turn the selected content into useful study flashcards with questions and answers.";
        break;

      default:
        instruction =
          "Explain the selected content clearly and help the reader understand the key idea.";
        break;
    }

    const response =
      await callBackend(
        "/explain",
        {
          content:
            selection.content,

          kind:
            selection.kind,

          page:
            selection.page,

          instruction,
        },
      );

    return createExplanation(
      response,
      "AI Explanation",
    );
  },

  async chat(
    question: string,
    selection?: Selection | null,
    documentId?: string | null,
  ): Promise<string> {
    await delay(200);

    guard();

    return await callBackend(
      "/chat",
      {
        question,

        selected_content:
          selection?.content ?? null,

        content_type:
          selection?.kind ?? null,

        page:
          selection?.page ?? null,

        document_id:
          documentId ?? null,
      },
    );
  },

  async analyzeImage(
    selection: Selection,
  ): Promise<AIExplanation> {
    await delay(300);

    guard();

    const response =
      await callBackend(
        "/analyze-image",
        {
          content:
            selection.content,

          kind:
            selection.kind,

          page:
            selection.page,
        },
      );

    return createExplanation(
      response,
      "AI Analysis",
    );
  },

  async summarizeDocument(
    documentId: string,
  ): Promise<AIExplanation> {
    await delay(300);

    guard();

    const response =
      await callBackend(
        "/summarize",
        {
          document_id:
            documentId,
        },
      );

    return createExplanation(
      response,
      "Document Summary",
    );
  },
};