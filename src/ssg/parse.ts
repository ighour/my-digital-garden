import { CONTENT_MARKDOWN_FILENAME } from "../constants";

/**
 * Parses the markdown links to HTML links.
 * @param markdown the markdown to parse.
 * @returns the markdown with HTML links.
 */
function parseMarkdownLinks(markdown: string): string {
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
 * Parses the markdown to HTML.
 * @param markdown the markdown to parse.
 * @returns the markdown with HTML.
 */
export function parseMarkdown(markdown: string): string {
  const markdownWithHTMLLinks = parseMarkdownLinks(markdown);

  return markdownWithHTMLLinks;
}

/**
 * Parses the HTML body links to open in a new tab.
 * @param body the HTML body to parse.
 * @returns the HTML body with links to open in a new tab.
 */
function parseHTMLBodyLinks(body: string): string {
  return body.replace(/<a[^>]*>/g, (match) => {
    if (match.includes('href="http') || match.includes('href="https')) {
      return match.replace("<a ", '<a target="_blank" rel="noopener" ');
    }
    return match;
  });
}

/**
 * Parses the HTML images.
 * @param body the HTML body to parse.
 * @returns the HTML body with images.
 */
function parseHTMLImages(body: string): string {
  return body.replace(/<p><img/g, '<p class="_image"><img');
}

/**
 * Parses the HTML body.
 * @param body the HTML body to parse.
 * @returns the HTML body.
 */
export function parseHTMLBody(body: string): string {
  const bodyWithLinks = parseHTMLBodyLinks(body);
  const bodyWithImages = parseHTMLImages(bodyWithLinks);

  return bodyWithImages;
}
