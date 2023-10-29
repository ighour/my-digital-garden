import { PathLike, existsSync, mkdirSync } from "fs";
import { readFile, readdir, writeFile } from "fs/promises";
import path, { extname } from "path";
import { IMAGE_EXTENSIONS } from "../constants";

/**
 * List all directories names from a path.
 * @param dirPath The path to list the directories.
 * @returns A promise with the directories names.
 */
export async function listDirectories(dirPath: PathLike): Promise<string[]> {
  return (await readdir(dirPath, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

/**
 * List all images filenames from a path.
 * @param dirPath The path to list the images.
 * @returns A promise with the images filenames.
 */
export async function listImages(dirPath: PathLike) {
  return (await readdir(dirPath, { withFileTypes: true }))
    .filter(
      (dirent) =>
        dirent.isFile() && IMAGE_EXTENSIONS.includes(extname(dirent.name))
    )
    .map((dirent) => dirent.name);
}

/**
 * Gets the raw content from a file.
 * @param filePath The path of the file.
 * @returns A promise with the raw content.
 */
export async function getRawFileContent(filePath: PathLike): Promise<string> {
  return readFile(filePath, "utf-8");
}
