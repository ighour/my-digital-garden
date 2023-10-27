import path from "path";
import {
  Category,
  Content,
  ContentType,
  LocalImage,
  Post,
} from "../../../types";
import { getContentsRootPath } from "./files";

const CONTENT_ROOT_PATH = getContentsRootPath();

/**
 * Maps to a typed post content.
 * @param rawContent markdown content of post.
 * @param metaProperties meta properties of post.
 * @param contentFilePath relative path of post from content root path.
 * @param images list of images of post.
 * @param parentPath relative path of parent category from content root path.
 * @returns A typed post content.
 */
export function mapToPostContent(
  rawContent: string,
  metaProperties: Pick<Content, "created_at" | "language">,
  contentFilePath: string,
  images: LocalImage[],
  parentPath: string
): Post {
  const post: Post = {
    raw: rawContent,
    name: "TODO",
    created_at: metaProperties.created_at,
    type: ContentType.POST,
    language: metaProperties.language,
    slug: "TODO",
    path: path.relative(CONTENT_ROOT_PATH, contentFilePath),
    images,
    categoryPath: path.relative(CONTENT_ROOT_PATH, parentPath),
  };
  return post;
}

/**
 * Maps to a typed category content.
 * @param rawContent markdown content of category.
 * @param metaProperties meta properties of category.
 * @param currentPath relative path of category from content root path.
 * @param images list of images of category.
 * @param subcategories list of subcategories of category.
 * @param posts list of posts of category.
 * @param parentPath relative path of parent category from content root path.
 * @returns A typed category content.
 */
export function mapToCategoryContent(
  rawContent: string,
  metaProperties: Pick<Content, "created_at" | "language">,
  currentPath: string,
  images: LocalImage[],
  subcategories: Category[],
  posts: Post[],
  parentPath: string | null
): Category {
  const category: Category = {
    raw: rawContent,
    name: "TODO",
    created_at: metaProperties.created_at,
    type: ContentType.CATEGORY,
    language: metaProperties.language,
    slug: "TODO",
    path: path.relative(CONTENT_ROOT_PATH, currentPath),
    images,
    subcategories,
    posts,
    parentCategoryPath: parentPath
      ? path.relative(CONTENT_ROOT_PATH, parentPath)
      : null,
  };
  return category;
}
