import { useState } from "react";

import { NetworkDiagram } from "@/components/pdf/NetworkDiagram";
import { PageThumbnails } from "@/components/pdf/PageThumbnails";
import { PDFPage } from "@/components/pdf/PDFPage";
import { PDFSelection } from "@/components/pdf/PDFSelection";
import { PDFToolbar } from "@/components/pdf/PDFToolbar";
import { SelectionToolbar } from "@/components/pdf/SelectionToolbar";
import {
  currentDocument,
  diagramSelection,
  equationSelection,
  gradientDescentSelection,
  handwritingSelection,
} from "@/lib/mock-data";
import type { QuickActionId, Selection } from "@/types/copilot";

interface PDFViewerProps {
  selection: Selection | null;
  onSelect: (selection: Selection) => void;
  onAction: (action: QuickActionId) => void;
}

export function PDFViewer({ selection, onSelect, onAction }: PDFViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(4);

  const isActive = (id: string) => selection?.id === id;

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <PDFToolbar
        zoom={zoom}
        page={page}
        pageCount={currentDocument.pages}
        onZoom={(delta) => setZoom((value) => Math.min(160, Math.max(60, value + delta)))}
        onFitWidth={() => setZoom(100)}
        onPage={(delta) =>
          setPage((value) => Math.min(currentDocument.pages, Math.max(1, value + delta)))
        }
      />
      <div className="flex min-h-0 flex-1">
        <PageThumbnails pages={[2, 3, 4, 5, 6, 7]} current={page} onSelect={setPage} />
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <PDFPage pageNumber={4} zoom={zoom}>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Chapter 03 · Optimization
            </p>
            <h1 className="mt-3 text-[26px] font-semibold tracking-tight">
              {currentDocument.title}
            </h1>
            <p className="mt-4 text-[13.5px] leading-relaxed text-document-ink/80">
              Machine learning is a branch of computer science concerned with building systems that
              improve automatically through experience. In supervised learning we are given labelled
              examples and asked to find a function that maps inputs to outputs.
            </p>

            <h2 className="mt-7 text-[15px] font-semibold tracking-tight">Supervised Learning</h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-document-ink/80">
              A supervised model is trained on pairs of inputs and known outputs. Performance is
              judged on examples it has never seen, which is why capacity control matters as much as
              raw accuracy on the training set.
            </p>

            <h2 className="mt-7 text-[15px] font-semibold tracking-tight">Loss Functions</h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-document-ink/80">
              A loss function measures how far a model&apos;s predictions deviate from the true
              values. We write this as <span className="font-mono text-[12px]">J(θ)</span>, a smooth
              surface over the parameter space.
            </p>

            <PDFSelection
              as="div"
              label="Select equation: gradient of the loss"
              active={isActive(equationSelection.id)}
              onSelect={() => onSelect(equationSelection)}
              className="mt-6 rounded-lg border border-line bg-paper/60 px-5 py-4 text-center font-mono text-[14px]"
            >
              ∇J(θ) = ∂J / ∂θ
            </PDFSelection>

            <h2 className="mt-7 text-[15px] font-semibold tracking-tight">Gradient Descent</h2>
            <div className="relative pb-12">
              <p className="mt-3 text-[13.5px] leading-relaxed">
                <PDFSelection
                  label="Select paragraph about gradient descent"
                  active={isActive(gradientDescentSelection.id)}
                  onSelect={() => onSelect(gradientDescentSelection)}
                  className="px-0.5"
                >
                  {gradientDescentSelection.content}
                </PDFSelection>
              </p>
              {isActive(gradientDescentSelection.id) && (
                <SelectionToolbar
                  onAction={onAction}
                  className="absolute -right-1 top-full mt-1 hidden sm:flex"
                />
              )}
            </div>

            <h2 className="mt-7 text-[15px] font-semibold tracking-tight">Model Optimization</h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-document-ink/80">
              The learning rate controls the size of each step. Too small and training crawls; too
              large and the parameters oscillate around the minimum without settling. Schedules and
              momentum are common remedies.
            </p>
          </PDFPage>

          <PDFPage pageNumber={5} zoom={zoom}>
            <h2 className="text-[15px] font-semibold tracking-tight">Worked Example</h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-document-ink/80">
              The margin note below was written by hand during the lecture and scanned with the rest
              of the chapter.
            </p>

            <PDFSelection
              as="div"
              label="Select handwritten margin note"
              active={isActive(handwritingSelection.id)}
              onSelect={() => onSelect(handwritingSelection)}
              className="mt-5 rounded-lg border border-dashed border-line px-5 py-6 text-center"
            >
              <span
                className="text-[22px] text-document-ink/70"
                style={{ fontFamily: "'Segoe Script','Bradley Hand',cursive", fontStyle: "italic" }}
              >
                x² + 5x + 6 = 0
              </span>
            </PDFSelection>

            <h2 className="mt-7 text-[15px] font-semibold tracking-tight">Architecture</h2>
            <PDFSelection
              as="div"
              label="Select figure 3"
              active={isActive(diagramSelection.id)}
              onSelect={() => onSelect(diagramSelection)}
              className="mt-4 rounded-lg border border-line px-4 py-4"
            >
              <NetworkDiagram className="mx-auto h-36 w-full max-w-[320px] text-document-ink/70" />
              <p className="mt-2 text-center text-[11px] text-muted">
                {diagramSelection.label}
              </p>
            </PDFSelection>

            <p className="mt-6 text-[13.5px] leading-relaxed text-document-ink/80">
              Each connection stores a weight. Training adjusts every weight simultaneously using the
              gradient of the loss with respect to that weight.
            </p>
          </PDFPage>
        </div>
      </div>
    </div>
  );
}
