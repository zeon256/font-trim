import { formatBytes, formatPercent } from "../lib/utils";
import { Download, Loader2 } from "lucide-react";
import type { OutputFormat } from "../lib/font-engine";

interface StatsPanelProps {
  originalSize: number;
  subsetSize: number | null;
  originalCount: number;
  keepCount: number;
  isProcessing: boolean;
  onDownload: () => void;
  outputFormat: OutputFormat;
  onOutputFormatChange: (format: OutputFormat) => void;
}

export function StatsPanel({
  originalSize,
  subsetSize,
  originalCount,
  keepCount,
  isProcessing,
  onDownload,
  outputFormat,
  onOutputFormatChange,
}: StatsPanelProps) {
  const removedCount = originalCount - keepCount;
  const estimatedSize = subsetSize ?? null;
  const outputDisabled = isProcessing || keepCount === 0;
  const savingsPercent =
    estimatedSize && originalSize > 0 ? 1 - estimatedSize / originalSize : null;

  return (
    <div className="card flex flex-col gap-4">
      <h3 className="text-sm font-medium text-foreground-muted">Trim Results</h3>

      <div className="grid grid-cols-2 gap-3">
        <StatItem
          label="Original"
          value={formatBytes(originalSize)}
          sub={`${originalCount} glyphs`}
        />
        <StatItem
          label="Trimmed"
          value={estimatedSize ? formatBytes(estimatedSize) : "—"}
          sub={`${keepCount} glyphs`}
          highlight={savingsPercent !== null}
        />
      </div>

      {savingsPercent !== null && (
        <div className="flex items-center gap-2 py-1">
          <div className="flex-1 h-2 bg-surface-hover rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${Math.min(savingsPercent * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs font-mono text-accent whitespace-nowrap">
            {formatPercent(savingsPercent)} smaller
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-danger" />
          <span className="text-foreground-muted">
            Removed: <span className="text-foreground font-mono">{removedCount}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-foreground-muted">
            Kept: <span className="text-foreground font-mono">{keepCount}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <label htmlFor="output-format" className="text-xs font-medium text-foreground-muted">
          Output
        </label>
        <select
          id="output-format"
          value={outputFormat}
          onChange={(event) => onOutputFormatChange(event.target.value as OutputFormat)}
          disabled={outputDisabled}
          className="flex-1 max-w-[180px] rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="sfnt">SFNT (.ttf/.otf)</option>
          <option value="woff2">WOFF2 (.woff2)</option>
        </select>
      </div>

      <button onClick={onDownload} disabled={outputDisabled} className="btn btn-primary w-full">
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download Trimmed Font
          </>
        )}
      </button>
    </div>
  );
}

function StatItem({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-background rounded-lg p-3 border border-border">
      <p className="text-xs text-foreground-dim mb-0.5">{label}</p>
      <p
        className={`text-lg font-semibold font-mono ${highlight ? "text-accent" : "text-foreground"}`}
      >
        {value}
      </p>
      <p className="text-xs text-foreground-dim">{sub}</p>
    </div>
  );
}
