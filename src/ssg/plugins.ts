import { Category, ContentType, Post } from "../types";
import { useChildrenListTemplate } from "./markdown-templates";

/**
 * Add the children list at the end of the markdown.
 * @param markdown current markdown.
 * @param content current content.
 * @returns the markdown with the children list at the end.
 */
function addChildrenListAtEndOfMarkdown(markdown: string, content: Post | Category) {
    const children = content.type === ContentType.CATEGORY ? [...content.subcategories, ...content.posts] : [];
    if (children.length > 0 && content.config.show_children_list) {
        const childrenList = useChildrenListTemplate(content, children);
        console.log(`${markdown}\n\n${childrenList}`);
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
    const mutations = [addChildrenListAtEndOfMarkdown];
    return mutations.reduce((currentMarkdown, mutation) => mutation(currentMarkdown, content), content.raw);
}