import { CONTENT_MARKDOWN_FILENAME } from "../constants";
import {
  Category,
  ContentType,
  Post,
  PreviousPath,
  WebsiteMap,
} from "../types";
import { getHTML } from "./template";

/**
 * Recursively creates the website tree.
 * @note it mutates the websiteTree object.
 * @param websiteMap current website map.
 * @param page current page to add to the website tree.
 * @returns the website tree.
 */
async function recursivelyCreateWebsiteTree(
  page: Category | Post,
  websiteMap: WebsiteMap = {},
  previousPaths: PreviousPath[] = []
): Promise<WebsiteMap> {
  const HTML = getHTML({
    attributes: {
      createdAt: page.created_at,
      title: page.name,
    },
    body: JSON.stringify(page.raw, null, 2), // @TODO: Convert Markdown to HTML and handle links.
    previousPaths,
  });

  websiteMap[page.path] = HTML;

  const pathsUntilHere: PreviousPath[] = [
    ...previousPaths,
    {
      path: page.path.replace(CONTENT_MARKDOWN_FILENAME, ""),
      title: page.name,
    },
  ];

  if (page.type === ContentType.CATEGORY) {
    // First, recursively create categories pages.
    if (page.subcategories.length > 0) {
      await Promise.all(
        page.subcategories.map((subcategory) =>
          recursivelyCreateWebsiteTree(subcategory, websiteMap, pathsUntilHere)
        )
      );
    }

    // Then recursively create posts pages.
    if (page.posts.length > 0) {
      await Promise.all(
        page.posts.map((post) =>
          recursivelyCreateWebsiteTree(post, websiteMap, pathsUntilHere)
        )
      );
    }
  }

  return websiteMap;
}

/**
 * Generates a simple static website from discovered content.
 * @param data the data to generate the website.
 * @returns a promise with the website map.
 */
export default async function SSG(data: Category | Post): Promise<WebsiteMap> {
  const websiteMap = await recursivelyCreateWebsiteTree(data);
  return websiteMap;
}
