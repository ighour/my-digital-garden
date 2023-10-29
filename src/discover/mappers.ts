import path from "path";
import { Category, Content, ContentType, LocalImage, Post } from "../types";
import { CONTENT_MARKDOWN_FILENAME } from "../constants";
import { getDataPath } from "../utils";

const DATA_PATH = getDataPath();

/**
 * Maps to a typed post content.
 * @param markdownProperties markdown properties of post.
 * @param metaProperties meta properties of post.
 * @param currentPath relative path of post folder from content root path.
 * @param images list of images of post.
 * @param parentPath relative path of parent category from content root path.
 * @returns A typed post content.
 */
export function mapToPostContent(
  markdownProperties: Pick<Content, "raw" | "name" | "slug">,
  metaProperties: Pick<Content, "created_at" | "language">,
  currentPath: string,
  images: LocalImage[],
  parentPath: string
): Post {
  const markdownFilePath = path.join(currentPath, CONTENT_MARKDOWN_FILENAME);
  const post: Post = {
    raw: markdownProperties.raw,
    name: markdownProperties.name,
    created_at: metaProperties.created_at,
    type: ContentType.POST,
    language: metaProperties.language,
    slug: markdownProperties.slug,
    path: path.relative(DATA_PATH, markdownFilePath),
    images,
    categoryPath: path.relative(DATA_PATH, parentPath),
  };
  return post;
}

/**
 * Maps to a typed category content.
 * @param markdownProperties markdown properties of category.
 * @param metaProperties meta properties of category.
 * @param currentPath relative path of category from content root path.
 * @param images list of images of category.
 * @param subcategories list of subcategories of category.
 * @param posts list of posts of category.
 * @param parentPath relative path of parent category from content root path.
 * @returns A typed category content.
 */
export function mapToCategoryContent(
  markdownProperties: Pick<Content, "raw" | "name" | "slug">,
  metaProperties: Pick<Content, "created_at" | "language">,
  currentPath: string,
  images: LocalImage[],
  subcategories: Category[],
  posts: Post[],
  parentPath: string | null
): Category {
  const markdownFilePath = path.join(currentPath, CONTENT_MARKDOWN_FILENAME);
  const category: Category = {
    raw: markdownProperties.raw,
    name: markdownProperties.name,
    created_at: metaProperties.created_at,
    type: ContentType.CATEGORY,
    language: metaProperties.language,
    slug: markdownProperties.slug,
    path: path.relative(DATA_PATH, markdownFilePath),
    images,
    subcategories,
    posts,
    parentCategoryPath: parentPath
      ? path.relative(DATA_PATH, parentPath)
      : null,
  };
  return category;
}

/**
 * Maps to a typed local image.
 * @param imageName image file name.
 * @param currentPath current path of image.
 * @returns A typed local image.
 */
export function mapToLocalImage(
  imageName: string,
  currentPath: string
): LocalImage {
  return {
    name: imageName,
    path: path.relative(DATA_PATH, path.join(currentPath, imageName)),
  };
}