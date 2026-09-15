import {
  useEffect,
  useRef,
  useState,
} from "react";

import pdfjsLib from "@/lib/pdfjs";

import { PDFTextLayer } from "./PDFTextLayer";
import { SelectionToolbar } from "./SelectionToolbar";

import type { QuickActionId } from "@/types/copilot";

interface PDFDocumentViewerProps {
  file: string | File;

  onTextSelect?: (
    text: string,
    page: number,
  ) => void;

  onAction?: (
    action: QuickActionId | "ask",
  ) => void;
}

interface PDFPageViewProps {
  page: any;
  pageNumber: number;
  scale: number;

  onTextSelect?: (
    text: string,
    page: number,
  ) => void;

  onAction?: (
    action: QuickActionId | "ask",
  ) => void;
}

interface SelectionPosition {
  top: number;
  left: number;
}

function PDFPageView({
  page,
  pageNumber,
  scale,
  onTextSelect,
  onAction,
}: PDFPageViewProps) {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const containerRef =
    useRef<HTMLDivElement>(null);

  const [viewport, setViewport] =
    useState<any>(null);

  const [
    selectionPosition,
    setSelectionPosition,
  ] = useState<SelectionPosition | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    async function renderPage() {
      try {
        const currentViewport =
          page.getViewport({
            scale,
          });

        if (cancelled) {
          return;
        }

        setViewport(currentViewport);

        const canvas =
          canvasRef.current;

        if (!canvas) {
          return;
        }

        const context =
          canvas.getContext("2d");

        if (!context) {
          return;
        }

        canvas.width =
          currentViewport.width;

        canvas.height =
          currentViewport.height;

        canvas.style.width =
          `${currentViewport.width}px`;

        canvas.style.height =
          `${currentViewport.height}px`;

        await page
          .render({
            canvasContext: context,
            viewport: currentViewport,
          })
          .promise;
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to render PDF page:",
            error,
          );
        }
      }
    }

    void renderPage();

    return () => {
      cancelled = true;
    };
  }, [page, scale]);

  useEffect(() => {
    const handleMouseDown = (
      event: MouseEvent,
    ) => {
      const container =
        containerRef.current;

      if (!container) {
        return;
      }

      const target =
        event.target as Node | null;

      if (
        target &&
        !container.contains(target)
      ) {
        setSelectionPosition(null);
      }
    };

    const handleMouseUp = () => {
      const selection =
        window.getSelection();

      if (
        !selection ||
        selection.isCollapsed
      ) {
        return;
      }

      const container =
        containerRef.current;

      if (!container) {
        return;
      }

      const anchorNode =
        selection.anchorNode;

      const focusNode =
        selection.focusNode;

      if (
        !anchorNode ||
        !focusNode
      ) {
        return;
      }

      if (
        !container.contains(anchorNode) ||
        !container.contains(focusNode)
      ) {
        return;
      }

      const selectedText =
        selection.toString().trim();

      if (!selectedText) {
        return;
      }

      const range =
        selection.getRangeAt(0);

      const rect =
        range.getBoundingClientRect();

      const pageRect =
        container.getBoundingClientRect();

      const toolbarWidth = 300;
      const toolbarHeight = 42;

      let left =
        rect.left -
        pageRect.left +
        rect.width / 2 -
        toolbarWidth / 2;

      let top =
        rect.top -
        pageRect.top -
        toolbarHeight -
        10;

      left = Math.max(
        8,
        Math.min(
          left,
          pageRect.width -
            toolbarWidth -
            8,
        ),
      );

      if (top < 8) {
        top =
          rect.bottom -
          pageRect.top +
          10;
      }

      setSelectionPosition({
        top,
        left,
      });
    };

    document.addEventListener(
      "mousedown",
      handleMouseDown,
    );

    document.addEventListener(
      "mouseup",
      handleMouseUp,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleMouseDown,
      );

      document.removeEventListener(
        "mouseup",
        handleMouseUp,
      );
    };
  }, []);

  const handleAction = (
    action: QuickActionId | "ask",
  ) => {
    onAction?.(action);

    setSelectionPosition(null);
  };

  return (
    <div className="mb-8 flex justify-center">
      <div
        ref={containerRef}
        className="relative"
        style={{
          width:
            viewport?.width ?? "auto",
          height:
            viewport?.height ?? "auto",
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0"
        />

        {viewport && (
          <PDFTextLayer
            page={page}
            viewport={viewport}
            onTextSelect={(text) => {
              onTextSelect?.(
                text,
                pageNumber,
              );
            }}
          />
        )}

        {selectionPosition && (
          <div
            className="absolute z-30"
            style={{
              top:
                selectionPosition.top,
              left:
                selectionPosition.left,
            }}
          >
            <SelectionToolbar
              onAction={handleAction}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function PDFDocumentViewer({
  file,
  onTextSelect,
  onAction,
}: PDFDocumentViewerProps) {
  const [pages, setPages] =
    useState<any[]>([]);

  const [pageNumber, setPageNumber] =
    useState(1);

  const [scale] =
    useState(1.5);

  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      try {
        const loadingTask =
          typeof file === "string"
            ? pdfjsLib.getDocument(file)
            : pdfjsLib.getDocument({
                data:
                  await file.arrayBuffer(),
              });

        const pdf =
          await loadingTask.promise;

        if (cancelled) {
          return;
        }

        const loadedPages = [];

        for (
          let i = 1;
          i <= pdf.numPages;
          i++
        ) {
          const page =
            await pdf.getPage(i);

          if (cancelled) {
            return;
          }

          loadedPages.push(page);
        }

        if (cancelled) {
          return;
        }

        setPages(loadedPages);
        setPageNumber(1);
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load PDF:",
            error,
          );
        }
      }
    }

    void loadPdf();

    return () => {
      cancelled = true;
    };
  }, [file]);

  const handlePrevious = () => {
    setPageNumber(
      (current) =>
        Math.max(
          1,
          current - 1,
        ),
    );
  };

  const handleNext = () => {
    setPageNumber(
      (current) =>
        Math.min(
          pages.length,
          current + 1,
        ),
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-center gap-3 border-b border-line bg-surface/60 p-2">
        <button
          type="button"
          disabled={pageNumber <= 1}
          onClick={handlePrevious}
          className="rounded-md border border-line px-3 py-1 text-[12px] transition-colors hover:bg-paper disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-[12px] text-muted">
          {pages.length === 0
            ? "Loading..."
            : `${pageNumber} / ${pages.length}`}
        </span>

        <button
          type="button"
          disabled={
            pages.length === 0 ||
            pageNumber >= pages.length
          }
          onClick={handleNext}
          className="rounded-md border border-line px-3 py-1 text-[12px] transition-colors hover:bg-paper disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {pages.map(
          (page, index) => {
            const currentPageNumber =
              index + 1;

            return (
              <div
                id={`pdf-page-${currentPageNumber}`}
                key={currentPageNumber}
              >
                <PDFPageView
                  page={page}
                  pageNumber={
                    currentPageNumber
                  }
                  scale={scale}
                  onTextSelect={
                    onTextSelect
                  }
                  onAction={onAction}
                />

                <p className="mb-6 text-center font-mono text-[10px] text-muted">
                  {currentPageNumber}
                </p>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}