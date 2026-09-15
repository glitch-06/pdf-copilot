import { createFileRoute } from "@tanstack/react-router";
import {
  useRef,
  useState,
} from "react";

import { AppHeader } from "@/components/layout/AppHeader";
import { CopilotPanel } from "@/components/copilot/CopilotPanel";
import { PDFDocumentViewer } from "@/components/pdf/PDFDocumentViewer";
import { Tabs } from "@/components/shared/Tabs";
import { useCopilot } from "@/hooks/useCopilot";
import { currentDocument } from "@/lib/mock-data";

const BACKEND_URL =
  "https://pdf-copilot-api.onrender.com/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "PDF Copilot — Understand anything in your PDFs",
      },
      {
        name: "description",
        content:
          "Highlight any part of a PDF and PDF Copilot explains it: text, equations, diagrams, and handwritten notes.",
      },
      {
        property: "og:title",
        content:
          "PDF Copilot — Understand anything in your PDFs",
      },
      {
        property: "og:description",
        content:
          "An AI reading companion for research papers and lecture notes. Select, understand, ask follow-ups.",
      },
    ],
  }),
  component: Workspace,
});

function Workspace() {
  const [pane, setPane] =
    useState<"document" | "copilot">(
      "copilot",
    );

  const [
    focusChatInput,
    setFocusChatInput,
  ] = useState(false);

  const [pdfFile, setPdfFile] =
    useState<File | null>(null);

  const [
    documentId,
    setDocumentId,
  ] = useState<string | null>(
    null,
  );

  const [
    documentPageCount,
    setDocumentPageCount,
  ] = useState<number | null>(
    null,
  );

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const copilot =
    useCopilot(documentId);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      file.type !==
      "application/pdf"
    ) {
      alert(
        "Please select a PDF file.",
      );

      event.target.value = "";
      return;
    }

    setPdfFile(file);
    setDocumentId(null);
    setDocumentPageCount(null);
    setUploading(true);
    setPane("document");
    setFocusChatInput(false);

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        file,
      );

      const response =
        await fetch(
          `${BACKEND_URL}/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Upload failed (${response.status})`,
        );
      }

      if (!data.document_id) {
        throw new Error(
          "Backend did not return a document ID.",
        );
      }

      setDocumentId(
        data.document_id,
      );

      setDocumentPageCount(
        data.page_count ?? null,
      );

      console.log(
        "PDF uploaded successfully:",
        data,
      );
    } catch (error) {
      console.error(
        "PDF upload failed:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload PDF.",
      );

      setPdfFile(null);
      setDocumentId(null);
      setDocumentPageCount(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSelection = (
    text: string,
    page: number,
  ) => {
    copilot.select({
      id: `text-${Date.now()}`,
      kind: "text",
      content: text,
      page,
    });

    setFocusChatInput(false);

    if (
      typeof window !==
        "undefined" &&
      window.innerWidth < 1024
    ) {
      setPane("copilot");
    }
  };

  const handleAction = (
    action:
      | Parameters<
          typeof copilot.applyAction
        >[0]
      | "ask",
  ) => {
    if (action === "ask") {
      setPane("copilot");
      setFocusChatInput(true);
      return;
    }

    copilot.applyAction(action);
    setFocusChatInput(false);

    if (
      typeof window !==
        "undefined" &&
      window.innerWidth < 1024
    ) {
      setPane("copilot");
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-paper">
      <AppHeader
        documentName={
          pdfFile?.name ??
          currentDocument.name
        }
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={
          handleFileChange
        }
      />

      <div className="flex items-center justify-between border-b border-line bg-surface/60 px-4 py-2">
        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
          disabled={uploading}
          className="rounded-md border border-line bg-surface px-3 py-1.5 text-[12px] font-medium text-ink transition-colors hover:bg-paper disabled:opacity-50"
        >
          {uploading
            ? "Uploading..."
            : "Open PDF"}
        </button>

        <div className="lg:hidden">
          <Tabs
            value={pane}
            onChange={(nextPane) => {
              setPane(nextPane);
              setFocusChatInput(false);
            }}
            items={[
              {
                value: "document",
                label: "Document",
              },
              {
                value: "copilot",
                label: "AI Copilot",
              },
            ]}
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div
          className={
            pane === "document"
              ? "flex min-h-0 min-w-0 flex-1"
              : "hidden min-h-0 min-w-0 flex-1 lg:flex"
          }
        >
          {pdfFile ? (
            <PDFDocumentViewer
              file={pdfFile}
              onTextSelect={
                handleSelection
              }
              onAction={
                handleAction
              }
            />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="px-6 text-center">
                <p className="text-[14px] font-medium text-ink">
                  Open a PDF to get started
                </p>

                <p className="mt-2 text-[12px] text-muted">
                  Select any text in the
                  document and PDF Copilot
                  will explain it.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="mt-4 rounded-md bg-accent px-4 py-2 text-[12px] font-medium text-white"
                >
                  Choose PDF
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className={
            pane === "copilot"
              ? "flex min-h-0 flex-1 lg:flex-none"
              : "hidden min-h-0 lg:flex"
          }
        >
          <CopilotPanel
            copilot={copilot}
            focusInput={
              focusChatInput
            }
            documentName={
              pdfFile?.name
            }
            pageCount={
              documentPageCount ??
              undefined
            }
          />
        </div>
      </div>
    </div>
  );
}