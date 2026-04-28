import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileType } from "lucide-react";

interface UploadZoneProps {
  onFile: (file: File) => void;
}

export function UploadZone({ onFile }: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) onFile(acceptedFiles[0]);
    },
    [onFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "font/*": [".ttf", ".otf", ".woff", ".woff2"] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 ease-out flex flex-col items-center justify-center gap-4 py-16 px-8 text-center ${
        isDragActive
          ? "border-accent bg-accent-bg scale-[1.01]"
          : "border-border hover:border-border-hover hover:bg-surface-hover"
      }`}
    >
      <input {...getInputProps()} />
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragActive ? "bg-accent-bg" : "bg-surface-hover"}`}
      >
        {isDragActive ? (
          <FileType className="w-7 h-7 text-accent" />
        ) : (
          <Upload className="w-7 h-7 text-foreground-dim" />
        )}
      </div>
      <div className="space-y-1">
        <p className="text-lg font-medium text-foreground">
          {isDragActive ? "Drop your font here" : "Upload a font file"}
        </p>
        <p className="text-sm text-foreground-dim">TTF, OTF, WOFF, or WOFF2</p>
      </div>
    </div>
  );
}

export function FontFileInfo({ file, onReplace }: { file: File; onReplace: (file: File) => void }) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => files[0] && onReplace(files[0]),
    accept: { "font/*": [".ttf", ".otf", ".woff", ".woff2"] },
    multiple: false,
    noDrag: true,
  });

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-accent-bg border border-accent/10 flex items-center justify-center">
        <FileType className="w-5 h-5 text-accent" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
        <p className="text-xs text-foreground-dim font-mono">{(file.size / 1024).toFixed(1)} KB</p>
      </div>
      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />
        <span className="text-xs text-foreground-dim hover:text-accent transition-colors">
          Replace
        </span>
      </div>
    </div>
  );
}
