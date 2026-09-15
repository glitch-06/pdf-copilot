import { SettingsSection } from "@/components/settings/SettingsControls";

export function PrivacySettings() {
  return (
    <SettingsSection title="Privacy">
      <p className="text-[13px] leading-relaxed text-muted">
        Your documents are processed according to your selected AI provider and privacy settings.
      </p>
    </SettingsSection>
  );
}
