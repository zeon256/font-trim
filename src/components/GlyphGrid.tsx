import { useState, useCallback } from "react";
import type { GlyphInfo } from "../lib/font-engine";
import { Search, Grid3X3, List } from "lucide-react";

type ViewMode = "grid" | "list";

interface GlyphGridProps {
  glyphs: GlyphInfo[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  onSelectAll: (ids: number[]) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categoryFilter: string | null;
  onCategoryChange: (cat: string | null) => void;
  categories: Map<string, number>;
}

export function GlyphGrid({
  glyphs,
  selectedIds,
  onToggle,
  onSelectAll,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories,
}: GlyphGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const stored = localStorage.getItem("fonttrim-view");
    return stored === "list" ? "list" : "grid";
  });

  const handleViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("fonttrim-view", mode);
  }, []);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-dim" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by character, name, or hex code..."
            className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm outline-none focus:border-accent-dim transition-colors"
          />
        </div>
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => handleViewMode("grid")}
            className={`p-2 transition-colors ${viewMode === "grid" ? "bg-surface-active text-accent" : "text-foreground-dim hover:text-foreground hover:bg-surface-hover"}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleViewMode("list")}
            className={`p-2 transition-colors ${viewMode === "list" ? "bg-surface-active text-accent" : "text-foreground-dim hover:text-foreground hover:bg-surface-hover"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0 scrollbar-thin">
        <button
          onClick={() => onCategoryChange(null)}
          className={`badge whitespace-nowrap cursor-pointer transition-all ${
            categoryFilter === null ? "badge-accent" : "badge-muted hover:bg-surface-active"
          }`}
        >
          All ({glyphs.length})
        </button>
        {Array.from(categories.entries())
          .slice(0, 20)
          .map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat === categoryFilter ? null : cat)}
              className={`badge whitespace-nowrap cursor-pointer transition-all ${
                categoryFilter === cat ? "badge-accent" : "badge-muted hover:bg-surface-active"
              }`}
            >
              {cat} ({count})
            </button>
          ))}
      </div>

      {/* Selection controls */}
      <div className="flex items-center gap-2 text-sm text-foreground-muted flex-shrink-0">
        <button
          onClick={() => onSelectAll(glyphs.map((g) => g.id))}
          className="text-accent hover:text-accent-hover transition-colors"
        >
          Select all
        </button>
        <span className="text-foreground-dim">|</span>
        <button
          onClick={() => onSelectAll([])}
          className="text-accent hover:text-accent-hover transition-colors"
        >
          Deselect all
        </button>
        <span className="ml-auto text-foreground-dim font-mono">
          {selectedIds.size} of {glyphs.length} glyphs
        </span>
      </div>

      {/* Glyph display */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {viewMode === "grid" ? (
          <GlyphGridView glyphs={glyphs} selectedIds={selectedIds} onToggle={onToggle} />
        ) : (
          <GlyphListView glyphs={glyphs} selectedIds={selectedIds} onToggle={onToggle} />
        )}
      </div>
    </div>
  );
}

function GlyphGridView({
  glyphs,
  selectedIds,
  onToggle,
}: {
  glyphs: GlyphInfo[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
}) {
  if (glyphs.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-foreground-dim">
        No glyphs match your filter
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-1.5">
      {glyphs.map((glyph) => {
        const selected = selectedIds.has(glyph.id);
        return (
          <button
            key={glyph.id}
            onClick={() => onToggle(glyph.id)}
            className={`group relative aspect-square rounded-md flex items-center justify-center text-lg transition-all duration-150 ${
              selected
                ? "bg-accent-bg border-2 border-accent text-accent"
                : "bg-surface-hover border-2 border-transparent hover:border-border text-foreground"
            }`}
            title={`${glyph.char} (U+${glyph.codePoint.toString(16).toUpperCase().padStart(4, "0")})\n${glyph.name}\n${glyph.category}`}
          >
            <span className={glyph.isEmoji ? "text-base" : "text-xl"}>
              {glyph.char === " " ? "\u00B7" : glyph.char || "\u00A0"}
            </span>
            {selected && (
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-accent text-[8px] text-background flex items-center justify-center font-bold">
                ✓
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function GlyphListView({
  glyphs,
  selectedIds,
  onToggle,
}: {
  glyphs: GlyphInfo[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
}) {
  if (glyphs.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-foreground-dim">
        No glyphs match your filter
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {glyphs.map((glyph) => {
        const selected = selectedIds.has(glyph.id);
        return (
          <button
            key={glyph.id}
            onClick={() => onToggle(glyph.id)}
            className={`flex items-center gap-3 px-3 py-1.5 rounded-md transition-all text-left ${
              selected
                ? "bg-accent-bg border border-accent/20"
                : "bg-transparent hover:bg-surface-hover border border-transparent"
            }`}
          >
            <span className={`w-8 text-center text-lg ${glyph.isEmoji ? "text-base" : ""}`}>
              {glyph.char === " " ? "\u00B7" : glyph.char || "\u00A0"}
            </span>
            <span
              className={`font-mono text-xs w-16 ${selected ? "text-accent" : "text-foreground-dim"}`}
            >
              U+{glyph.codePoint.toString(16).toUpperCase().padStart(4, "0")}
            </span>
            <span
              className={`text-xs truncate flex-1 ${selected ? "text-foreground" : "text-foreground-muted"}`}
            >
              {glyph.name || "(unnamed)"}
            </span>
            <span className="text-xs text-foreground-dim">{glyph.category}</span>
          </button>
        );
      })}
    </div>
  );
}
