import path from "path";
import { OUTPUT_FOLDER_NAME, DATA_FOLDER_NAME } from "./constants";

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
