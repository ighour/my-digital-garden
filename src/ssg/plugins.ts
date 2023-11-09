import { Category, ContentType, Post } from "../types";
import {
  useChildrenListTemplate,
  useNestedChildrenLastUpdatedListTemplate,
} from "./markdown-templates";

/**
 * Add nested children list based on last updated at at the end of the markdown.
 * @note it goes down for all children.
 * @param markdown current markdown.
 * @param content current content.
 * @returns the markdown with the children list at the end.
 */
function addNestedChildrenLastUpdatedListAtEndOfMarkdown(
  markdown: string,
  content: Post | Category
) {
  const childrenToShowCount = content.config.show_last_updated_children_list;

  if (content.type !== ContentType.CATEGORY) {
    return markdown;
  }
  if (childrenToShowCount === 0) {
    return markdown;
  }

  const lastUpdatedNestedChildren = content.children.getAllSortedBy({
    sortBy: "lastUpdatedAt",
    orderBy: "desc",
    includeNestedChildren: true,
    limit: childrenToShowCount,
  });

  const markdownPlugin = useNestedChildrenLastUpdatedListTemplate(
    content,
    lastUpdatedNestedChildren
  );

  return `${markdown}\n\n${markdownPlugin}`;
}

/**
 * Add the children list at the end of the markdown.
 * @note it goes down just for 1st level children.
 * @note list sorted by name.
 * @param markdown current markdown.
 * @param content current content.
 * @returns the markdown with the children list at the end.
 */
function addChildrenListAtEndOfMarkdown(
  markdown: string,
  content: Post | Category
) {
  if (content.type !== ContentType.CATEGORY) {
    return markdown;
  }
  if (!content.config.show_children_list) {
    return markdown;
  }

  const children = content.children.getAllSortedBy({
    sortBy: "name",
    orderBy: "asc",
    includeNestedChildren: false,
  });

  const markdownPlugin = useChildrenListTemplate(content, children);

  return `${markdown}\n\n${markdownPlugin}`;
}

/**
 * Mutates the markdown with the plugins.
 * @param content current content.
 * @returns the mutated markdown.
 */
export function mutateMarkdownWithPlugins(content: Post | Category) {
  const mutations = [
    addNestedChildrenLastUpdatedListAtEndOfMarkdown,
    addChildrenListAtEndOfMarkdown,
  ];
  return mutations.reduce(
    (currentMarkdown, mutation) => mutation(currentMarkdown, content),
    content.raw
  );
}
