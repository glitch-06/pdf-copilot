import { useState } from "react";

import { OptionRow, SegmentedControl, SettingsSection } from "@/components/settings/SettingsControls";

type Style = "simple" | "balanced" | "detailed";
type Language = "en" | "es" | "de";

export function AISettings() {
  const [style, setStyle] = useState<Style>("balanced");
  const [language, setLanguage] = useState<Language>("en");

  return (
    <SettingsSection title="AI" description="Tune how explanations are written.">
      <OptionRow label="Explanation style">
        <SegmentedControl<Style>
          value={style}
          onChange={setStyle}
          options={[
            { value: "simple", label: "Simple" },
            { value: "balanced", label: "Balanced" },
            { value: "detailed", label: "Detailed" },
          ]}
        />
      </OptionRow>
      <OptionRow label="Response language">
        <SegmentedControl<Language>
          value={language}
          onChange={setLanguage}
          options={[
            { value: "en", label: "English" },
            { value: "es", label: "Español" },
            { value: "de", label: "Deutsch" },
          ]}
        />
      </OptionRow>
    </SettingsSection>
  );
}
