import { useEffect, useState } from "react";

export interface PDFSelectionData {
  text: string;
  page: number;
  rect: DOMRect | null;
}

export function usePDFSelection() {
  const [selection, setSelection] =
    useState<PDFSelectionData | null>(null);

  useEffect(() => {
    function handleSelection() {
      const nativeSelection = window.getSelection();

      if (!nativeSelection) return;

      const text = nativeSelection.toString().trim();

      if (!text) return;

      const range = nativeSelection.getRangeAt(0);

      const rect = range.getBoundingClientRect();

      const pageElement =
        range.startContainer.parentElement?.closest(
          "[data-pdf-page]"
        );

      const page =
        Number(pageElement?.getAttribute("data-page")) || 1;

      setSelection({
        text,
        page,
        rect,
      });
    }

    document.addEventListener("mouseup", handleSelection);

    return () => {
      document.removeEventListener(
        "mouseup",
        handleSelection
      );
    };
  }, []);

  return selection;
}