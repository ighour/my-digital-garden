import path from "path";
import {
  getContentsRootPath,
  getRawFileContent,
  getToolsDistPath,
  listDirectories,
  listImages,
  saveFile,
} from "./utils/files";
import { CONTENT_MARKDOWN_FILENAME } from "../../constants";
import { extractPropertiesFromMetaFile } from "./utils/parse";
import { Category, ContentType, LocalImage, Post } from "../../types";
import { mapToCategoryContent, mapToPostContent } from "./utils/mappers";

const CONTENT_ROOT_PATH = getContentsRootPath();
const TOOLS_DIST_PATH = getToolsDistPath();

/**
 * Recursively discovers all content from a path.
 * @param currentPath current path to discover.
 * @param parentPath parent path of current path.
 * @returns A promise with typed post or category.
 */
async function recursivelyDiscoverContent(
  currentPath: string,
  parentPath: string | null = null
): Promise<Post | Category> {
  const contentFilePath = path.join(currentPath, CONTENT_MARKDOWN_FILENAME);

  const [rawContent, metaProperties] = await Promise.all([
    getRawFileContent(contentFilePath),
    extractPropertiesFromMetaFile(currentPath),
  ]);

  const imageNames = await listImages(currentPath);
  const images: LocalImage[] = imageNames.map((imageName) => ({
    name: imageName,
    path: path.relative(CONTENT_ROOT_PATH, path.join(currentPath, imageName)),
  }));

  const contentType = metaProperties.type;

  // It reached a final node for the recursion
  if (contentType === ContentType.POST) {
    if (parentPath === null) {
      throw new Error(
        `recursivelyDiscoverContent | Missing parent path for post ${contentFilePath}`
      );
    }
    const post = mapToPostContent(
      rawContent,
      metaProperties,
      contentFilePath,
      images,
      parentPath
    );
    return post;
  }

  // It is a category node, so it should recursively discover its children
  const childrenNames = await listDirectories(currentPath);
  const childrenPromise = childrenNames.map((child) =>
    recursivelyDiscoverContent(path.join(currentPath, child), currentPath)
  );
  const children = await Promise.all(childrenPromise);
  const subcategories = children.filter(
    (child): child is Category => child.type === "category"
  );
  const posts = children.filter(
    (child): child is Post => child.type === "post"
  );

  const category = mapToCategoryContent(
    rawContent,
    metaProperties,
    contentFilePath,
    images,
    subcategories,
    posts,
    parentPath
  );

  return category;
}

async function main() {
  console.log("Discover - Start...");
  const contentTree = await recursivelyDiscoverContent(CONTENT_ROOT_PATH);
  const jsonTree = JSON.stringify(contentTree, null, 2);
  console.log("Discover - Saving local json file...");
  await saveFile(path.join(TOOLS_DIST_PATH, "discovered.json"), jsonTree);
  console.log("Discover - Done!");
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
