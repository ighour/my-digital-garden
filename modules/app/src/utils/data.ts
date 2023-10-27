import discover from "../../../tools/src/discover";
import { Category, Post } from "../../../types";

let contentMemo: Category | null = null;

/**
 * Gets all categories.
 * @returns A promise with all categories.
 */
export async function getCategories(): Promise<Category[]> {
  if (!contentMemo) {
    contentMemo = await discover();
  }
  return contentMemo.subcategories;
}

/**
 * Gets category.
 * @returns A promise with a category.
 */
export async function getCategory(categorySlug: string): Promise<Category | undefined> {
  if (!contentMemo) {
    contentMemo = await discover();
  }
  const category = contentMemo.subcategories.find(
    (c) => c.slug === categorySlug
  );
  return category;
}

/**
 * Gets all posts from a category.
 * @param categorySlug category slug.
 * @returns A promise with all posts from a category.
 */
export async function getCategoryPosts(categorySlug: string): Promise<Post[]> {
  if (!contentMemo) {
    contentMemo = await discover();
  }
  const category = await getCategory(categorySlug);
  return category?.posts ?? [];
}
