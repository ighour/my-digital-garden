import { CONTENT_MARKDOWN_FILENAME } from "../constants";
import {
  Category,
  ContentType,
  Post,
  PreviousPath,
  WebsiteMap,
} from "../types";
import { prepareMarkdownForHTML } from "./mapper";
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
  const preparedMarkdown = prepareMarkdownForHTML(page.raw);

  const HTML = getHTML({
    attributes: {
      title: page.name,
    },
    markdown: preparedMarkdown,
    previousPaths,
  });

  websiteMap[page.path] = {
    html: HTML,
    localImagesPaths: page.images.map((image) => image.path),
  };

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
