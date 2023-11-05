import { CONTENT_MARKDOWN_FILENAME } from "../constants";
import { Category, Post } from "../types";

/**
 * Creates the children list template.
 * @param parent parent content.
 * @param children children content.
 * @returns the children list template.
 */
export function useChildrenListTemplate(
  parent: Post | Category,
  children: (Post | Category)[]
) {
  const parentPath = parent.path.replace(CONTENT_MARKDOWN_FILENAME, "");

  return `
---

### Sementes Plantadas

${children
  .map((child) => {
    const childPath = child.path.replace(parentPath, "");
    return `- [${child.name}](${childPath})`;
  })
  .join("\n\n")}
    `.trim();
}

/**
 * Creates the nested children list template.
 * @param parent parent content.
 * @param children children content.
 * @returns the nested children list template.
 */
export function useNestedChildrenLastUpdatedListTemplate(
  parent: Post | Category,
  children: (Post | Category)[]
) {
  const parentPath = parent.path.replace(CONTENT_MARKDOWN_FILENAME, "");

  return `
---

### Últimas Sementes Cultivadas:

${children
  .map((child) => {
    const childPath = child.path.replace(parentPath, "");
    return `- [${child.name}](${childPath})`;
  })
  .join("\n\n")}
    `.trim();
}
