import { readdir } from "fs/promises";
import { join } from "path";

export const SKIP_DIRS = ["node_modules", ".git", "dist", "build", "__pycache__"];

interface TraversalResult<T> {
  path: string;
  depth: number;
  entry: T;
}

export async function traverseDirectories<T>(
  baseDir: string,
  maxDepth: number,
  processor: (entries: import("fs").Dirent[], dir: string, depth: number) => Promise<T[]>,
): Promise<TraversalResult<T>[]> {
  const results: TraversalResult<T>[] = [];

  async function traverse(dir: string, depth: number): Promise<void> {
    if (depth > maxDepth) return;

    try {
      const entries = await readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory() && !SKIP_DIRS.includes(entry.name)) {
          const fullPath = join(dir, entry.name);
          const processed = await processor(entries, fullPath, depth);

          for (const item of processed) {
            results.push({ path: fullPath, depth, entry: item });
          }

          await traverse(fullPath, depth + 1);
        }
      }
    } catch {}
  }

  await traverse(baseDir, 0);
  return results;
}

export function shouldSkipDirectory(name: string): boolean {
  return SKIP_DIRS.includes(name);
}
