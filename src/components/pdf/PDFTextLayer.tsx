import { useEffect, useRef } from "react";
import { TextLayer } from "pdfjs-dist";

interface PDFTextLayerProps {
  page: any;
  viewport: any;
  onTextSelect?: (text: string) => void;
}

export function PDFTextLayer({
  page,
  viewport,
  onTextSelect,
}: PDFTextLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    let cancelled = false;

    container.innerHTML = "";

    async function renderTextLayer() {
      try {
        const textContent =
          await page.getTextContent();

        if (cancelled || !container) {
          return;
        }

        /*
         * PDF.js uses this variable when positioning
         * the individual text spans.
         */
        container.style.setProperty(
          "--total-scale-factor",
          String(viewport.scale),
        );

        const textLayer = new TextLayer({
          textContentSource: textContent,
          container,
          viewport,
        });

        await textLayer.render();

        if (cancelled) {
          return;
        }

        /*
         * Make sure every generated span participates
         * in normal browser text selection.
         */
        const spans =
          container.querySelectorAll("span");

        spans.forEach((span) => {
          span.style.userSelect = "text";
          span.style.webkitUserSelect = "text";
        });
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to render PDF text layer:",
            error,
          );
        }
      }
    }

    void renderTextLayer();

    return () => {
      cancelled = true;
      container.innerHTML = "";
    };
  }, [page, viewport]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !onTextSelect) {
      return;
    }

    const handleMouseUp = () => {
      const selection = window.getSelection();

      if (!selection || selection.isCollapsed) {
        return;
      }

      const anchorNode = selection.anchorNode;
      const focusNode = selection.focusNode;

      if (!anchorNode || !focusNode) {
        return;
      }

      /*
       * Ignore selections made outside this PDF page.
       */
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

      /*
       * PDF.js can introduce line breaks and
       * non-breaking spaces while selecting.
       *
       * Normalize them before sending the
       * selection to Gemini.
       */
      const normalizedText = selectedText
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (!normalizedText) {
        return;
      }

      console.log(
        "PDF selection:",
        normalizedText,
      );

      onTextSelect(normalizedText);
    };

    container.addEventListener(
      "mouseup",
      handleMouseUp,
    );

    return () => {
      container.removeEventListener(
        "mouseup",
        handleMouseUp,
      );
    };
  }, [onTextSelect]);

  return (
    <div
      ref={containerRef}
      className="textLayer"
      style={{
        width: `${viewport.width}px`,
        height: `${viewport.height}px`,
      }}
    />
  );
}