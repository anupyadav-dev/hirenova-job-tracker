// ─── Ambient module declarations for packages without @types ─────────────────
// Add one block per untyped package rather than reaching for `any`.

declare module "streamifier" {
  import type { Readable } from "stream";

  /**
   * Creates a Readable stream from a Buffer or string.
   * Used to pipe in-memory data (e.g. a multer buffer) into a write stream.
   */
  function createReadStream(
    buffer: Buffer | string | ArrayBuffer,
  ): Readable;

  export = { createReadStream };
}
