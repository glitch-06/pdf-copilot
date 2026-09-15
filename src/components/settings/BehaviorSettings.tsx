import { useState } from "react";

import { CheckboxRow, SettingsSection } from "@/components/settings/SettingsControls";

const defaults = {
  autoExplain: true,
  openOnSelect: true,
  surroundingContext: false,
  rememberConversation: false,
};

export function BehaviorSettings() {
  const [values, setValues] = useState(defaults);
  const set = (key: keyof typeof defaults) => (checked: boolean) =>
    setValues((current) => ({ ...current, [key]: checked }));

  return (
    <SettingsSection title="Behavior" description="What happens when you highlight something.">
      <CheckboxRow
        label="Automatically explain highlighted text"
        checked={values.autoExplain}
        onChange={set("autoExplain")}
      />
      <CheckboxRow
        label="Open Copilot when text is selected"
        checked={values.openOnSelect}
        onChange={set("openOnSelect")}
      />
      <CheckboxRow
        label="Include surrounding context"
        checked={values.surroundingContext}
        onChange={set("surroundingContext")}
      />
      <CheckboxRow
        label="Remember conversation for this document"
        checked={values.rememberConversation}
        onChange={set("rememberConversation")}
      />
    </SettingsSection>
  );
}
