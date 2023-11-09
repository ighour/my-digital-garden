import MarkdownIt from "markdown-it";
import { CONTENT_MARKDOWN_FILENAME } from "../constants";
import {
  Category,
  ContentType,
  Post,
  PreviousPath,
  WebsiteMap,
} from "../types";
import { parseMarkdown, parseHTMLBody } from "./parse";
import { useHTMLTemplate } from "./html-templates";
import { mutateMarkdownWithPlugins } from "./plugins";

const md = new MarkdownIt();

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
  const markdownWithPlugins = mutateMarkdownWithPlugins(page);
  const parsedMarkdown = parseMarkdown(markdownWithPlugins);
  const rawHTMLBody = md.render(parsedMarkdown);
  const parsedHTMLBody = parseHTMLBody(rawHTMLBody);

  const HTML = useHTMLTemplate({
    attributes: {
      title: page.name,
    },
    body: parsedHTMLBody,
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
    if (page.children.subcategories.length > 0) {
      await Promise.all(
        page.children.subcategories.map((subcategory) =>
          recursivelyCreateWebsiteTree(subcategory, websiteMap, pathsUntilHere)
        )
      );
    }

    // Then recursively create posts pages.
    if (page.children.posts.length > 0) {
      await Promise.all(
        page.children.posts.map((post) =>
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
