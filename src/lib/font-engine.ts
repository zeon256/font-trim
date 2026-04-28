import opentype from "opentype.js";
import { init, subset } from "hb-subset-wasm";
import { getUnicodeCategory, isEmoji } from "./utils";

let wasmInitialized = false;

export interface GlyphInfo {
  id: number;
  codePoint: number;
  char: string;
  name: string;
  category: string;
  isEmoji: boolean;
  width: number;
  height: number;
  path?: string;
}

export interface FontMetadata {
  familyName: string;
  subfamilyName: string;
  fullName: string;
  version: string;
  numGlyphs: number;
  unitsPerEm: number;
  ascender: number;
  descender: number;
}

export interface ParsedFont {
  metadata: FontMetadata;
  glyphs: GlyphInfo[];
  originalSize: number;
  originalData: Uint8Array;
  opentypeFont: opentype.Font;
}

export async function initWasm(): Promise<void> {
  if (wasmInitialized) return;
  const response = await fetch(`${import.meta.env.BASE_URL}hb-subset.wasm`);
  await init(response);
  wasmInitialized = true;
}

export async function parseFont(file: File): Promise<ParsedFont> {
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  const font = opentype.parse(arrayBuffer);
  if (!font) {
    throw new Error("Failed to parse font file");
  }

  const metadata: FontMetadata = {
    familyName: font.names.fontFamily?.en || "Unknown",
    subfamilyName: font.names.fontSubfamily?.en || "",
    fullName: font.names.fullName?.en || "",
    version: font.names.version?.en || "",
    numGlyphs: font.numGlyphs,
    unitsPerEm: font.unitsPerEm,
    ascender: font.ascender,
    descender: font.descender,
  };

  const glyphs: GlyphInfo[] = [];
  const seenCodePoints = new Set<number>();

  // Build glyph map from cmap
  const cmap = font.tables.cmap;
  if (cmap) {
    // @ts-ignore opentype.js cmap internal structure
    const glyphIndexMap = cmap.glyphIndexMap;
    if (glyphIndexMap) {
      for (const [codePointStr, glyphId] of Object.entries(glyphIndexMap)) {
        const codePoint = parseInt(codePointStr, 10);
        if (seenCodePoints.has(codePoint)) continue;
        seenCodePoints.add(codePoint);

        const char = String.fromCodePoint(codePoint);
        let name = "";
        try {
          name = font.glyphNames?.glyphIndexToName(glyphId as number) || "";
        } catch {
          name = "";
        }

        let pathStr = "";
        let glyphWidth = 0;
        try {
          const glyph = font.glyphs.get(glyphId as number);
          if (glyph) {
            glyphWidth = glyph.advanceWidth || 0;
            if (glyph.path) {
              pathStr = glyph.path.toPathData(2);
            }
          }
        } catch {
          pathStr = "";
        }

        glyphs.push({
          id: glyphId as number,
          codePoint,
          char,
          name,
          category: getUnicodeCategory(codePoint),
          isEmoji: isEmoji(codePoint),
          width: glyphWidth,
          height: font.unitsPerEm,
          path: pathStr,
        });
      }
    }
  }

  // Sort by codepoint
  glyphs.sort((a, b) => a.codePoint - b.codePoint);

  return {
    metadata,
    glyphs,
    originalSize: data.byteLength,
    originalData: data,
    opentypeFont: font,
  };
}

export async function subsetFont(
  fontData: Uint8Array,
  keepCodePoints: number[],
): Promise<Uint8Array> {
  await initWasm();

  const text = keepCodePoints.map((cp) => String.fromCodePoint(cp)).join("");

  const result = await subset(fontData, {
    text,
    noHinting: false,
  });

  return result;
}

export function getCategories(glyphs: GlyphInfo[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const g of glyphs) {
    map.set(g.category, (map.get(g.category) || 0) + 1);
  }
  return new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
}

export function filterGlyphs(
  glyphs: GlyphInfo[],
  query: string,
  category: string | null,
  showEmojis: boolean,
): GlyphInfo[] {
  let result = glyphs;

  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (g) =>
        g.char.toLowerCase().includes(q) ||
        g.name.toLowerCase().includes(q) ||
        g.codePoint.toString(16).toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q),
    );
  }

  if (category && category !== "all") {
    result = result.filter((g) => g.category === category);
  }

  if (!showEmojis) {
    result = result.filter((g) => !g.isEmoji);
  }

  return result;
}

export function getPresetFilters() {
  return {
    ascii: (g: GlyphInfo) => g.codePoint <= 0x007f,
    latin1: (g: GlyphInfo) => g.codePoint <= 0x00ff,
    latinExtended: (g: GlyphInfo) => g.codePoint <= 0x024f,
    noEmojis: (g: GlyphInfo) => !g.isEmoji,
    noCJK: (g: GlyphInfo) => {
      const cat = g.category;
      return (
        !cat.includes("CJK") &&
        !cat.includes("Hiragana") &&
        !cat.includes("Katakana") &&
        !cat.includes("Hangul") &&
        !cat.includes("Kanbun") &&
        !cat.includes("Bopomofo")
      );
    },
    onlyCJK: (g: GlyphInfo) => {
      const cat = g.category;
      return (
        cat.includes("CJK") ||
        cat.includes("Hiragana") ||
        cat.includes("Katakana") ||
        cat.includes("Hangul") ||
        cat.includes("Kanbun") ||
        cat.includes("Bopomofo")
      );
    },
    noMath: (g: GlyphInfo) => {
      const cat = g.category;
      return !cat.includes("Math") && !cat.includes("Arrows") && !cat.includes("Number Forms");
    },
    basicPunctuation: (g: GlyphInfo) => {
      const cat = g.category;
      return (
        cat === "Basic Latin" ||
        cat === "General Punctuation" ||
        cat === "Currency Symbols" ||
        cat === "Enclosed Alphanumerics"
      );
    },
  };
}

export function detectUsedGlyphs(text: string, glyphs: GlyphInfo[]): Set<number> {
  const used = new Set<number>();
  for (const char of text) {
    const cp = char.codePointAt(0);
    if (cp !== undefined) {
      const glyph = glyphs.find((g) => g.codePoint === cp);
      if (glyph) {
        used.add(glyph.id);
      }
    }
  }
  return used;
}

export function estimateSubsetSize(
  originalSize: number,
  keepCount: number,
  totalCount: number,
): number {
  if (totalCount === 0) return 0;
  // Rough heuristic: tables have fixed overhead, glyphs are proportional
  const overhead = originalSize * 0.3; // tables, metadata
  const glyphRatio = keepCount / totalCount;
  return Math.round(overhead + (originalSize - overhead) * glyphRatio);
}

export function downloadFile(data: Uint8Array, filename: string) {
  const blob = new Blob([data as BlobPart], { type: "font/sfnt" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
