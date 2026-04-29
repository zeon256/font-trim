import { useState, useEffect } from "react";

interface PreviewPanelProps {
  fontFamily: string;
  fontData: ArrayBuffer | null;
}

export function PreviewPanel({ fontFamily, fontData }: PreviewPanelProps) {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog");
  const [fontSize, setFontSize] = useState(32);

  useEffect(() => {
    if (!fontData) return;

    const face = new FontFace(fontFamily, fontData);
    let cancelled = false;

    face
      .load()
      .then((loadedFace) => {
        if (cancelled) return;
        document.fonts.add(loadedFace);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      document.fonts.delete(face);
    };
  }, [fontFamily, fontData]);

  const effectiveFamily = fontData ? `"${fontFamily}", sans-serif` : "sans-serif";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground-muted">Preview</h3>
        <div className="flex items-center gap-2">
          <label className="text-xs text-foreground-dim">Size</label>
          <input
            type="range"
            min={12}
            max={120}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-24 accent-accent"
          />
          <span className="text-xs font-mono text-foreground-dim w-8">{fontSize}px</span>
        </div>
      </div>
      <div
        className="min-h-[120px] p-4 rounded-lg bg-surface border border-border flex items-center overflow-auto"
        style={{ fontFamily: effectiveFamily, fontSize: `${fontSize}px`, lineHeight: 1.4 }}
      >
        {text || "Type something to preview..."}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type text to preview with this font..."
        className="w-full h-20 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground outline-none resize-y focus:border-accent-dim transition-colors"
      />
    </div>
  );
}
