import { OptionRow, SegmentedControl, SettingsSection } from "@/components/settings/SettingsControls";
import { useTheme, type ThemeMode } from "@/hooks/useTheme";

export function AppearanceSettings() {
  const { mode, setMode } = useTheme();

  return (
    <SettingsSection title="Appearance" description="Choose how PDF Copilot looks while you read.">
      <OptionRow label="Theme">
        <SegmentedControl<ThemeMode>
          value={mode}
          onChange={setMode}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "System" },
          ]}
        />
      </OptionRow>
    </SettingsSection>
  );
}
