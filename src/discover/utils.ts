import { Category, ContentType, Post } from "../types";

/**
 * Get all nested children of a category.
 * @param firstLevelChildren first level children of a category.
 * @returns all nested children.
 */
function getAllNestedChildren(
  firstLevelChildren: (Category | Post)[]
): (Category | Post)[] {
  const allNestedChildren = firstLevelChildren.reduce((acc, child) => {
    const nestedChildren =
      child.type === ContentType.CATEGORY
        ? [...child.children.subcategories, ...child.children.posts]
        : [];
    return [...acc, ...nestedChildren];
  }, firstLevelChildren);
  return allNestedChildren;
}

/**
 * Get all children sorted by.
 * @param params params to sort.
 * @returns all children sorted by.
 */
export function getAllChildrenSortedBy(params: {
  subcategories: Category[];
  posts: Post[];
  sortBy: "name" | "lastUpdatedAt";
  orderBy: "asc" | "desc";
  includeNestedChildren: boolean;
  /** Limit the number of children. Defaults to all. */
  limit?: number;
}) {
  const {
    subcategories,
    posts,
    sortBy,
    orderBy,
    includeNestedChildren,
    limit,
  } = params;

  const firstLevelChildren = [...subcategories, ...posts];

  const wantedChildren =
    includeNestedChildren === false
      ? firstLevelChildren
      : getAllNestedChildren(firstLevelChildren);

  const sortedChildren = [...wantedChildren].sort((a, b) => {
    const aSortBy = sortBy === "name" ? a.name : a.last_updated_at;
    const bSortBy = sortBy === "name" ? b.name : b.last_updated_at;
    const order = orderBy === "asc" ? 1 : -1;
    return order * aSortBy.localeCompare(bSortBy);
  });

  const limitedChildren = limit
    ? sortedChildren.slice(0, limit)
    : sortedChildren;

  return limitedChildren;
}
