import { useState } from "react";
import type { GlyphInfo } from "../lib/font-engine";
import { getPresetFilters } from "../lib/font-engine";
import { Filter, SmilePlus, Languages, Calculator } from "lucide-react";

interface ToolbarProps {
  glyphs: GlyphInfo[];
  selectedIds: Set<number>;
  onApplyPreset: (keepIds: number[]) => void;
  onRemovePreset: (removeIds: number[]) => void;
  onInvert: () => void;
  showEmojis: boolean;
  onToggleEmojis: () => void;
}

const keepPresets = [
  { key: "ascii", label: "Keep ASCII", icon: Filter, filter: "ascii" },
  { key: "latin1", label: "Keep Latin-1", icon: Filter, filter: "latin1" },
];

const removePresets = [
  { key: "noEmojis", label: "Remove Emojis", icon: SmilePlus, filter: "noEmojis" },
  { key: "noCJK", label: "Remove CJK", icon: Languages, filter: "noCJK" },
  { key: "noMath", label: "Remove Math/Symbols", icon: Calculator, filter: "noMath" },
];

export function Toolbar({
  glyphs,
  selectedIds,
  onApplyPreset,
  onRemovePreset,
  onInvert,
  showEmojis,
  onToggleEmojis,
}: ToolbarProps) {
  const filters = getPresetFilters();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-foreground-muted">Quick Actions</h3>

      {/* Keep presets */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-foreground-dim uppercase tracking-wider font-medium">
          Keep only
        </p>
        {keepPresets.map((preset) => {
          const Icon = preset.icon;
          const matching = glyphs.filter(filters[preset.filter as keyof typeof filters]);
          return (
            <button
              key={preset.key}
              onClick={() => onApplyPreset(matching.map((g) => g.id))}
              className="btn btn-secondary btn-sm justify-start"
            >
              <Icon className="w-3.5 h-3.5" />
              {preset.label}
              <span className="ml-auto text-xs text-foreground-dim font-mono">
                {matching.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Remove presets */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-foreground-dim uppercase tracking-wider font-medium">Remove</p>
        {removePresets.map((preset) => {
          const Icon = preset.icon;
          const remove = glyphs.filter(filters[preset.filter as keyof typeof filters]);
          return (
            <button
              key={preset.key}
              onClick={() => onRemovePreset(remove.map((g) => g.id))}
              className="btn btn-secondary btn-sm justify-start"
            >
              <Icon className="w-3.5 h-3.5" />
              {preset.label}
              <span className="ml-auto text-xs text-foreground-dim font-mono">{remove.length}</span>
            </button>
          );
        })}
      </div>

      {/* Toggle + Invert */}
      <div className="border-t border-border pt-3 flex flex-col gap-1.5">
        <button onClick={onToggleEmojis} className="btn btn-ghost btn-sm justify-start">
          <SmilePlus className="w-3.5 h-3.5" />
          {showEmojis ? "Hide emojis in grid" : "Show emojis in grid"}
        </button>
        <button onClick={onInvert} className="btn btn-ghost btn-sm justify-start">
          Invert selection
        </button>
      </div>

      {/* Detect from text */}
      <DetectFromText glyphs={glyphs} onApplyPreset={onApplyPreset} />
    </div>
  );
}

function DetectFromText({
  glyphs,
  onApplyPreset,
}: {
  glyphs: GlyphInfo[];
  onApplyPreset: (ids: number[]) => void;
}) {
  const [text, setText] = useState("");
  const [expanded, setExpanded] = useState(false);

  const detectGlyphs = () => {
    const keepIds = new Set<number>();
    for (const char of text) {
      const cp = char.codePointAt(0);
      if (cp !== undefined) {
        const glyph = glyphs.find((g) => g.codePoint === cp);
        if (glyph) keepIds.add(glyph.id);
      }
    }
    onApplyPreset(Array.from(keepIds));
    setText("");
    setExpanded(false);
  };

  return (
    <div className="border-t border-border pt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="btn btn-ghost btn-sm w-full justify-start"
      >
        <Filter className="w-3.5 h-3.5" />
        Keep only used glyphs...
      </button>
      {expanded && (
        <div className="mt-2 flex flex-col gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text that uses this font..."
            className="w-full h-20 px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none resize-none focus:border-accent-dim"
          />
          <button onClick={detectGlyphs} disabled={!text.trim()} className="btn btn-primary btn-sm">
            Keep glyphs for this text
          </button>
        </div>
      )}
    </div>
  );
}
