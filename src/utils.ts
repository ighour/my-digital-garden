import path from "path";
import {
  OUTPUT_FOLDER_NAME,
  DATA_FOLDER_NAME,
  WEBSITE_FOLDER_NAME,
} from "./constants";
import { existsSync, mkdirSync } from "fs";
import { rm, writeFile } from "fs/promises";

/**
 * Gets the data path.
 * @returns The data path.
 */
export function getDataPath() {
  return path.join(__dirname, "../", DATA_FOLDER_NAME);
}

/**
 * Gets output path.
 * @returns The output path.
 */
export function getOutputPath() {
  return path.join(__dirname, "../", OUTPUT_FOLDER_NAME);
}

/**
 * Gets website path.
 * @returns The website path.
 */
export function getWebsitePath() {
  return path.join(__dirname, "../", OUTPUT_FOLDER_NAME, WEBSITE_FOLDER_NAME);
}

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
