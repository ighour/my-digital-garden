import { Category, ContentType, Post } from "../types";

/**
 * Validates the content tree.
 * @param content content to validate.
 * @param slugs set of slugs to validate.
 */
export function validateContentTree(content: Category | Post, slugs: Set<string> = new Set()): void {
  // Check if slug is duplicated
  if (slugs.has(content.slug)) {
    throw new Error(`validateContentTree | Duplicated slug ${content.slug} for path ${content.path}`);
  }
  slugs.add(content.slug);

  if (content.type === ContentType.CATEGORY) {
    content.subcategories.forEach(subcategory => validateContentTree(subcategory, slugs));
    content.posts.forEach(post => validateContentTree(post, slugs));
  }
}