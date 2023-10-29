import path from "path";
import { existsSync, mkdirSync } from "fs";
import { rm, writeFile } from "fs/promises";

/**
 * Writes a file.
 * @param filePath path to write the file.
 * @param content content to write.
 */
export async function saveFile(filePath: string, content: string) {
  if (!existsSync(filePath)) {
    mkdirSync(path.dirname(filePath), { recursive: true });
  }
  await writeFile(filePath, content, "utf-8");
}

/**
 * Deletes a path (and nested content).
 * @param path path to delete.
 */
export async function deletePath(path: string) {
  if (existsSync(path)) {
    await rm(path, { recursive: true });
  }
}
