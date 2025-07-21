// watcher.ts
import chokidar from "chokidar";
import { globby } from "globby";
import { parseDatFile } from "./parser";
import { FileWatchConfigType, ParsedFileResult } from "./types";

export function watchDirectory(
  config: FileWatchConfigType,
  onFileParsed: (result: ParsedFileResult) => void
): () => void {
  const watcher = chokidar.watch(config.path, {
    persistent: true,
    ignoreInitial: true,
    depth: 0,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100,
    },
  });

  const handleFile = async (filePath: string) => {
    const parsed = await parseDatFile(filePath, config);
    if (parsed) {
      onFileParsed(parsed);
    }
  };

  watcher.on("add", handleFile);

  // Parse existing files immediately
  (async () => {
    const normalizedPath = config.path.replace(/\\/g, "/");
    const existingFiles = await globby(normalizedPath);
    for (const file of existingFiles) {
      await handleFile(file);
    }
  })();

  return () => watcher.close();
}
