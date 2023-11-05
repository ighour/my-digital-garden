import { CONTENT_MARKDOWN_FILENAME } from "../constants";
import { Category, Post } from "../types";

/**
 * Creates the children list template.
 * @note list sorted by name.
 * @param parent parent content.
 * @param children children content.
 * @returns the children list template.
 */
export function useChildrenListTemplate(
  parent: Post | Category,
  children: (Post | Category)[]
) {
  const parentPath = parent.path.replace(CONTENT_MARKDOWN_FILENAME, "");
  const childrenSortedByName = children.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return `
---

### Sementes Plantadas

${childrenSortedByName
  .map((child) => {
    const childPath = child.path.replace(parentPath, "");
    return `- [${child.name}](${childPath})`;
  })
  .join("\n\n")}
    `.trim();
}
