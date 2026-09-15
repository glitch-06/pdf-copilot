import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { AppHeader } from "@/components/layout/AppHeader";
import { DocumentCard } from "@/components/library/DocumentCard";
import { EmptyState } from "@/components/library/EmptyState";
import { UploadArea } from "@/components/library/UploadArea";
import { Button, buttonVariants } from "@/components/shared/Button";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { recentDocuments } from "@/lib/mock-data";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — PDF Copilot" },
      {
        name: "description",
        content: "Your recent PDFs, reading progress, and uploads in PDF Copilot.",
      },
      { property: "og:title", content: "Library — PDF Copilot" },
      {
        property: "og:description",
        content: "Continue learning with your documents — recent PDFs and reading progress.",
      },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const [showEmpty, setShowEmpty] = useState(false);
  const documents = showEmpty ? [] : recentDocuments;

  return (
    <div className="min-h-screen bg-paper">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-[22px] font-semibold tracking-tight">Good evening 👋</h1>
        <p className="mt-1.5 text-[13.5px] text-muted">Continue learning with your documents.</p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Link to="/" className={buttonVariants({ variant: "primary", size: "lg" })}>
            Open PDF
          </Link>
          <Button variant="outline" size="lg">
            Upload PDF
          </Button>
          <Button variant="ghost" size="lg" onClick={() => setShowEmpty((value) => !value)}>
            {showEmpty ? "Show documents" : "Preview empty state"}
          </Button>
        </div>

        <div className="mt-10">
          <SectionLabel>Recent</SectionLabel>
          {documents.length === 0 ? (
            <div className="mt-3">
              <EmptyState />
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {documents.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <UploadArea />
        </div>
      </main>
    </div>
  );
}
