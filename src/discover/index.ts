import path from "path";
import { listDirectories } from "./files";
import {
  extractImages,
  extractPropertiesFromMarkdownFile,
  extractPropertiesFromMetaFile,
} from "./parse";
import { Category, ContentType, Post } from "../types";
import {
  mapToCategoryContent,
  mapToLocalImage,
  mapToPostContent,
} from "./mappers";
import { saveFile } from "../utils";
import config from "../config";

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
    console.log(`Discover - ${post.path} (${post.name})`)
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
  console.log(`Discover - ${category.path} (${category.name})`)

  return category;
}

/**
 * Discovers all content from data.
 * @returns A promise with the content tree.
 */
export default async function discover(): Promise<Category> {
  console.log("Discover - Start...");
  const contentTree = await recursivelyDiscoverContent(config.paths.data);
  if (config.debug === true) {
    const jsonTree = JSON.stringify(contentTree, null, 2);
    console.log("Discover - Saving local json file in output folder...");
    await saveFile(path.join(config.paths.output, "data.json"), jsonTree);
  }
  console.log("Discover - Done!");
  return contentTree as Category;
}
