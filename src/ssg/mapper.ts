import { CONTENT_MARKDOWN_FILENAME } from "../constants";

/**
 * Prepare local markdown links for HTML.
 * @param markdown markdown string.
 * @returns markdown string with local links prepared for HTML.
 */
function prepareMarkdownLocalLinksForHTML(markdown: string): string {
  return markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, link) => {
    const isLocalLink = !link.startsWith("http");
    if (isLocalLink) {
      const linkInHTML = link.replace(CONTENT_MARKDOWN_FILENAME, "");
      return `[${text}](${linkInHTML})`;
    }
    return match;
  });
}

/**
 * Prepare markdown for HTML.
 * @param markdown markdown string. 
 * @returns markdown string content prepared for HTML.
 */
export function prepareMarkdownForHTML(markdown: string): string {
  const markdownWithHTMLLinks = prepareMarkdownLocalLinksForHTML(markdown);

  return markdownWithHTMLLinks;
}