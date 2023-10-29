/**
 * The type of content.
 */
export enum ContentType {
  /**
   * The content is a category, which contains posts or other categories.
   */
  CATEGORY = "category",
  /**
   * The content is a post, which contains the markdown content and related files.
   */
  POST = "post",
}

/**
 * The language of the content.
 */
export enum Language {
  /**
   * The content is Portuguese from Brazil.
   */
  PT_BR = "pt_BR",
}

/**
 * The local image type.
 */
export interface LocalImage {
  /**
   * The relative path of the content from first content node.
   */
  path: string;
  /**
   * The name of the image.
   */
  name: string;
}

/**
 * Shared interface for categories and posts.
 */
export interface Content {
  /**
   * The raw content.
   * @note from markdown file.
   */
  raw: string;
  /**
   * The name of the content.
   * @note from markdown file.
   */
  name: string;
  /**
   * The date of the content creation.
   * @note from meta file.
   */
  created_at: string;
  /**
   * The type of the content.
   * @note from meta file.
   */
  type: ContentType;
  /**
   * The language of the content.
   * @note from meta file.
   */
  language: Language;
  /**
   * The slug of the content.
   * @note from content folder name.
   * @note used as ID, so it needs to be unique.
   */
  slug: string;
  /**
   * The relative path of the content from first content node.
   */
  path: string;
  /**
   * The images of the content.
   */
  images: LocalImage[];
}

export interface Category extends Content {
  type: ContentType.CATEGORY;
  /**
   * List of subcategories.
   */
  subcategories: Category[];
  /**
   * List of posts.
   */
  posts: Post[];
  /**
   * The category path of the parent.
   */
  parentCategoryPath: string | null;
}

export interface Post extends Content {
  type: ContentType.POST;
  /**
   * The category path of the post.
   */
  categoryPath: string;
}