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
  const children =
    content.type === ContentType.CATEGORY
      ? [...content.subcategories, ...content.posts]
      : [];
  const childrenToShowCount = content.config.show_last_updated_children_list;
  if (children.length > 0 && childrenToShowCount > 0) {
    const allChildren = children.reduce((acc, child) => {
      const nestedChildren =
        child.type === ContentType.CATEGORY
          ? [...child.subcategories, ...child.posts]
          : [];
      return [...acc, ...nestedChildren];
    }, children);

    const childrenSortedByLastUpdatedAt = [...allChildren].sort(
      (a, b) =>
        new Date(b.last_updated_at).getTime() -
        new Date(a.last_updated_at).getTime()
    );

    const lastChildren = childrenSortedByLastUpdatedAt.slice(
      0,
      childrenToShowCount
    );

    const childrenList = useNestedChildrenLastUpdatedListTemplate(
      content,
      lastChildren
    );
    return `${markdown}\n\n${childrenList}`;
  }
  return markdown;
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
  const children =
    content.type === ContentType.CATEGORY
      ? [...content.subcategories, ...content.posts]
      : [];
  if (children.length > 0 && content.config.show_children_list) {
    const childrenSortedByName = [...children].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const childrenList = useChildrenListTemplate(content, childrenSortedByName);
    return `${markdown}\n\n${childrenList}`;
  }
  return markdown;
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
