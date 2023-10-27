import path from "path";
import { getContentsRootPath, listDirectories } from "./utils/files";
import {
  extractImages,
  extractPropertiesFromMarkdownFile,
  extractPropertiesFromMetaFile,
} from "./utils/parse";
import { Category, ContentType, Post } from "../../types";
import {
  mapToCategoryContent,
  mapToLocalImage,
  mapToPostContent,
} from "./utils/mappers";

const CONTENT_ROOT_PATH = getContentsRootPath();

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
  const [markdownProperties, metaProperties, imagesNames] = await Promise.all([
    extractPropertiesFromMarkdownFile(currentPath),
    extractPropertiesFromMetaFile(currentPath),
    extractImages(currentPath),
  ]);

  const images = imagesNames.map((imageName) =>
    mapToLocalImage(imageName, currentPath)
  );

  // It reached a final node for the recursion
  if (metaProperties.type === ContentType.POST) {
    if (parentPath === null) {
      throw new Error(
        `recursivelyDiscoverContent | Missing parent path for post ${path}`
      );
    }
    const post = mapToPostContent(
      markdownProperties,
      metaProperties,
      currentPath,
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
    markdownProperties,
    metaProperties,
    currentPath,
    images,
    subcategories,
    posts,
    parentPath
  );

  return category;
}

/**
 * Discovers all content from CONTENT_ROOT_PATH.
 * @returns A promise with the content tree.
 */
export default async function discover() {
  const contentTree = await recursivelyDiscoverContent(CONTENT_ROOT_PATH);
  return contentTree;
}
