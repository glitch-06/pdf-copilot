import { Link } from "@tanstack/react-router";
import { Library, Moon, MoreHorizontal, Search, Settings, Sun } from "lucide-react";

import { Dropdown, DropdownItem } from "@/components/shared/Dropdown";
import { IconButton } from "@/components/shared/IconButton";
import { useTheme } from "@/hooks/useTheme";

export function AppHeader({ documentName }: { documentName?: string }) {
  const { mode, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-paper/70 px-5 py-2.5 backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-2.5">
        <Link to="/" className="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-md">
          <span className="grid size-6 place-items-center rounded-[6px] bg-accent text-accent-foreground">
            <span className="font-mono text-[11px] font-medium">P</span>
          </span>
          <span className="text-[13px] font-semibold tracking-tight">PDF Copilot</span>
        </Link>
        {documentName && (
          <>
            <span className="mx-1.5 h-4 w-px bg-line" />
            <span className="truncate text-[13px] text-muted">{documentName}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-1 text-muted">
        <IconButton label="Search document">
          <Search className="size-3.5" />
        </IconButton>
        <IconButton label={mode === "dark" ? "Switch to light" : "Switch to dark"} onClick={toggle}>
          {mode === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
        </IconButton>
        <Link
          to="/library"
          className="grid size-7 place-items-center rounded-md text-muted transition-colors hover:bg-ink/5 hover:text-ink"
          aria-label="Library"
        >
          <Library className="size-3.5" />
        </Link>
        <Link
          to="/settings"
          className="grid size-7 place-items-center rounded-md text-muted transition-colors hover:bg-ink/5 hover:text-ink"
          aria-label="Settings"
        >
          <Settings className="size-3.5" />
        </Link>
        <Dropdown
          trigger={({ toggle: open }) => (
            <IconButton label="More" onClick={open}>
              <MoreHorizontal className="size-3.5" />
            </IconButton>
          )}
        >
          <DropdownItem>Document info</DropdownItem>
          <DropdownItem>Export conversation</DropdownItem>
          <DropdownItem>Keyboard shortcuts</DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
