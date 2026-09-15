import { createFileRoute } from "@tanstack/react-router";

import { AppHeader } from "@/components/layout/AppHeader";
import { AISettings } from "@/components/settings/AISettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { BehaviorSettings } from "@/components/settings/BehaviorSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { SettingsSection } from "@/components/settings/SettingsControls";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — PDF Copilot" },
      {
        name: "description",
        content: "Control appearance, explanation style, selection behavior, and privacy.",
      },
      { property: "og:title", content: "Settings — PDF Copilot" },
      {
        property: "og:description",
        content: "Control appearance, explanation style, selection behavior, and privacy.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-[22px] font-semibold tracking-tight">Settings</h1>
        <p className="mt-1.5 text-[13.5px] text-muted">Understand anything in your PDFs.</p>

        <div className="mt-8">
          <SettingsSection title="General" description="PDF Copilot · Version 0.1 (prototype)">
            <p className="text-[13px] leading-relaxed text-muted">
              This build runs on mock data. Backend services connect later without UI changes.
            </p>
          </SettingsSection>
          <AppearanceSettings />
          <AISettings />
          <BehaviorSettings />
          <PrivacySettings />
        </div>
      </main>
    </div>
  );
}
