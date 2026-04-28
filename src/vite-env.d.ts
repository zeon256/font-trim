/// <reference types="vite/client" />

declare module "*.css" {
  const content: string;
  export default content;
}

declare module "hb-subset-wasm" {
  export function init(
    source: WebAssembly.Module | ArrayBuffer | Response | Promise<Response>,
  ): Promise<void>;
  export function subset(
    fontData: Uint8Array,
    options: {
      text?: string;
      unicodes?: number[];
      glyphIds?: number[];
      retainGids?: boolean;
      noHinting?: boolean;
      dropTables?: string[];
      passthroughTables?: string[];
      layoutFeatures?: "*" | string[];
      variationAxes?: Record<string, number | { min?: number; max?: number; default?: number }>;
    },
  ): Promise<Uint8Array>;
}

declare module "hb-subset-wasm/hb-subset.wasm" {
  const src: string;
  export default src;
}
