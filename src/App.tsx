import { useState, useCallback, useMemo } from "react";
import { UploadZone, FontFileInfo } from "./components/UploadZone";
import { GlyphGrid } from "./components/GlyphGrid";
import { PreviewPanel } from "./components/PreviewPanel";
import { Toolbar } from "./components/Toolbar";
import { StatsPanel } from "./components/StatsPanel";
import {
  parseFont,
  subsetFont,
  getCategories,
  filterGlyphs,
  initWasm,
  downloadFile,
} from "./lib/font-engine";
import type { ParsedFont } from "./lib/font-engine";
import { formatBytes } from "./lib/utils";
import { Scissors, Loader2 } from "lucide-react";
import { GitHubIcon } from "./components/GitHubIcon";


type AppState = "upload" | "loading" | "loaded" | "processing" | "error";

export default function App() {
  const [state, setState] = useState<AppState>("upload");
  const [parsedFont, setParsedFont] = useState<ParsedFont | null>(null);
  const [fontFile, setFontFile] = useState<File | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showEmojis, setShowEmojis] = useState(true);
  const [subsetSize, setSubsetSize] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [wasmReady, setWasmReady] = useState(false);
  const [fontFaceName] = useState(() => `fonttrim-preview-${Date.now()}`);

  // Initialize WASM on mount
  useMemo(() => {
    initWasm()
      .then(() => setWasmReady(true))
      .catch((e) => console.error("Failed to init WASM:", e));
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setState("loading");
    setErrorMsg("");
    try {
      const parsed = await parseFont(file);
      setParsedFont(parsed);
      setFontFile(file);
      // Select all glyphs by default
      const allIds = new Set(parsed.glyphs.map((g) => g.id));
      setSelectedIds(allIds);
      setSubsetSize(null);
      setState("loaded");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Failed to parse font");
      setState("error");
    }
  }, []);

  const filteredGlyphs = useMemo(() => {
    if (!parsedFont) return [];
    return filterGlyphs(parsedFont.glyphs, searchQuery, categoryFilter, showEmojis);
  }, [parsedFont, searchQuery, categoryFilter, showEmojis]);

  const categories = useMemo(() => {
    if (!parsedFont) return new Map<string, number>();
    return getCategories(parsedFont.glyphs);
  }, [parsedFont]);

  const handleToggle = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback((ids: number[]) => {
    if (ids.length === 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(ids));
    }
  }, []);

  const handleApplyPreset = useCallback((keepIds: number[]) => {
    setSelectedIds(new Set(keepIds));
  }, []);

  const handleRemovePreset = useCallback((removeIds: number[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of removeIds) next.delete(id);
      return next;
    });
  }, []);

  const handleInvert = useCallback(() => {
    if (!parsedFont) return;
    const allIds = parsedFont.glyphs.map((g) => g.id);
    setSelectedIds((prev) => {
      const next = new Set<number>();
      for (const id of allIds) {
        if (!prev.has(id)) next.add(id);
      }
      return next;
    });
  }, [parsedFont]);

  const handleDownload = useCallback(async () => {
    if (!parsedFont || selectedIds.size === 0) return;
    setState("processing");
    try {
      const keepCodePoints = parsedFont.glyphs
        .filter((g) => selectedIds.has(g.id))
        .map((g) => g.codePoint);
      const result = await subsetFont(parsedFont.originalData, keepCodePoints);
      const baseName = fontFile?.name.replace(/\.[^.]+$/, "") || "font";
      downloadFile(result, `${baseName}-trimmed.ttf`);
      setSubsetSize(result.byteLength);
      setState("loaded");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Subsetting failed");
      setState("error");
    }
  }, [parsedFont, selectedIds, fontFile]);

  const keepCount = selectedIds.size;
  const totalCount = parsedFont?.glyphs.length ?? 0;

  // Upload state
  if (state === "upload") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent-bg border border-accent/20 flex items-center justify-center">
                <Scissors className="w-6 h-6 text-accent" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">FontTrim</h1>
            <p className="text-foreground-muted mt-2 text-lg">
              Trim unwanted glyphs from font files for leaner web loading
            </p>
          </div>
          <UploadZone onFile={handleFile} />
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-foreground-dim">
            <span>Client-side only</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Fonts never leave your browser</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Powered by HarfBuzz WASM</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <a
              href="https://github.com/zeon256/font-trim"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-accent transition-colors"
            >
              <GitHubIcon className="w-3 h-3" />
              Star on GitHub
            </a>
        </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <p className="text-foreground-muted">Parsing font...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (state === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card max-w-md text-center animate-fade-in">
          <p className="text-danger font-medium mb-2">Error</p>
          <p className="text-foreground-muted text-sm mb-4">{errorMsg}</p>
          <button
            onClick={() => {
              setState("upload");
              setErrorMsg("");
            }}
            className="btn btn-primary"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Loaded state
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-bg border border-accent/20 flex items-center justify-center">
            <Scissors className="w-4 h-4 text-accent" />
          </div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">FontTrim</h1>
          {parsedFont && fontFile && (
            <div className="hidden sm:block">
              <FontFileInfo file={fontFile} onReplace={handleFile} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/zeon256/font-trim"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground-muted hover:text-accent transition-colors"
            aria-label="Star on GitHub"
          >
            <GitHubIcon className="w-5 h-5" />
          </a>
          {parsedFont && (
            <div className="flex items-center gap-3 text-sm text-foreground-muted">
              <span className="font-mono">{parsedFont.metadata.familyName}</span>
              <span className="text-foreground-dim">|</span>
              <span className="font-mono">{formatBytes(parsedFont.originalSize)}</span>
              <span className="text-foreground-dim">|</span>
              <span>{parsedFont.glyphs.length} glyphs</span>
            </div>
          )}
          {!wasmReady && (
            <span className="text-xs text-foreground-dim flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Loading WASM...
            </span>
          )}
        </div>
      </header>

      {/* Main content */}
      {parsedFont && (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Toolbar */}
          <aside className="w-56 flex-shrink-0 border-r border-border p-4 overflow-y-auto bg-surface/30">
            <Toolbar
              glyphs={parsedFont.glyphs}
              selectedIds={selectedIds}
              onApplyPreset={handleApplyPreset}
              onRemovePreset={handleRemovePreset}
              onInvert={handleInvert}
              showEmojis={showEmojis}
              onToggleEmojis={() => setShowEmojis(!showEmojis)}
            />
          </aside>

          {/* Main area */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Glyph grid */}
            <div className="flex-1 p-4 overflow-hidden flex flex-col">
              <GlyphGrid
                glyphs={filteredGlyphs}
                selectedIds={selectedIds}
                onToggle={handleToggle}
                onSelectAll={handleSelectAll}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                categories={categories}
              />
            </div>

            {/* Bottom panels */}
            <div className="border-t border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-4 border-r border-border">
                  <PreviewPanel
                    fontFamily={fontFaceName}
                    fontData={parsedFont.originalData.buffer as ArrayBuffer}
                  />
                </div>
                <div className="p-4">
                  <StatsPanel
                    originalSize={parsedFont.originalSize}
                    subsetSize={subsetSize}
                    originalCount={totalCount}
                    keepCount={keepCount}
                    isProcessing={state === "processing"}
                    onDownload={handleDownload}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
