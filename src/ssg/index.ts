import { Category, ContentType, Post, WebsiteTree } from "../types";
import discover from "../discover";
import { getHTML } from "./template";

/**
 * Recursively creates the website tree.
 * @note it mutates the websiteTree object.
 * @param websiteTree current website tree.
 * @param page current page to add to the website tree.
 * @returns the website tree.
 */
async function recursivelyCreateWebsiteTree(
  websiteTree: WebsiteTree,
  page: Category | Post
): Promise<WebsiteTree> {
  const HTML = getHTML({
    attributes: {
      createdAt: page.created_at,
      title: page.name,
    },
    body: JSON.stringify(page.raw, null, 2), // @TODO: Convert Markdown to HTML and handle links.
  });

  websiteTree[page.path] = HTML;

  if (page.type === ContentType.CATEGORY) {
    // First, recursively create categories pages.
    if (page.subcategories.length > 0) {
      await Promise.all(
        page.subcategories.map((subcategory) =>
          recursivelyCreateWebsiteTree(websiteTree, subcategory)
        )
      );
    }

    // Then recursively create posts pages.
    if (page.posts.length > 0) {
      await Promise.all(
        page.posts.map((post) =>
          recursivelyCreateWebsiteTree(websiteTree, post)
        )
      );
    }
  }

  return websiteTree;
}

/**
 * Generates a simple static website from discovered content.
 */
export default async function SSG(): Promise<WebsiteTree> {
  const data = await discover();
  const websiteTree = await recursivelyCreateWebsiteTree({}, data);
  return websiteTree;
}
