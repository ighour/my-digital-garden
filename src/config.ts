import path from "path";
import { DATA_FOLDER_NAME, OUTPUT_FOLDER_NAME, WEBSITE_FOLDER_NAME } from "./constants";

/**
 * Checks if debug mode is enabled.
 * @returns true if debug mode is enabled.
 */
function isDebugMode(): boolean {
  const debugMode = process.argv.some((arg) => arg === "--debug");
  return debugMode;
}

/**
 * Gets the data path.
 * @returns The data path.
 */
function getDataPath(): string {
  return path.join(__dirname, "../", DATA_FOLDER_NAME);
}

/**
 * Gets output path.
 * @returns The output path.
 */
function getOutputPath(): string {
  return path.join(__dirname, "../", OUTPUT_FOLDER_NAME);
}

/**
 * Gets website path.
 * @returns The website path.
 */
function getWebsitePath(): string {
  return path.join(getOutputPath(), WEBSITE_FOLDER_NAME);
}

const config = {
  debug: isDebugMode(),
  paths: {
    data: getDataPath(),
    output: getOutputPath(),
    website: getWebsitePath(),
  }
};

export default config;
