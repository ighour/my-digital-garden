import path from "path";
import {
  getContentsRootPath,
  getRawFileContent,
  getToolsDistPath,
  listDirectories,
  listImages,
  saveFile,
} from "./utils/files";
import { CONTENT_MARKDOWN_FILENAME } from "../../constants";
import { extractPropertiesFromMetaFile } from "./utils/parse";
import { Category, Content, ContentType, LocalImage, Post } from "../../types";

const CONTENT_ROOT_PATH = getContentsRootPath();
const TOOLS_DIST_PATH = getToolsDistPath();

function craftPostContent(
  rawContent: string,
  metaProperties: Pick<Content, "created_at" | "language">,
  contentFilePath: string,
  images: LocalImage[],
  parentPath: string
): Post {
  const post: Post = {
    raw: rawContent,
    name: "TODO",
    created_at: metaProperties.created_at,
    type: ContentType.POST,
    language: metaProperties.language,
    slug: "TODO",
    path: path.relative(CONTENT_ROOT_PATH, contentFilePath),
    images,
    categoryPath: path.relative(CONTENT_ROOT_PATH, parentPath),
  };
  return post;
}

function craftCategoryContent(
  rawContent: string,
  metaProperties: Pick<Content, "created_at" | "language">,
  currentPath: string,
  images: LocalImage[],
  subcategories: Category[],
  posts: Post[],
  parentPath: string | null
): Category {
  const category: Category = {
    raw: rawContent,
    name: "TODO",
    created_at: metaProperties.created_at,
    type: ContentType.CATEGORY,
    language: metaProperties.language,
    slug: "TODO",
    path: path.relative(CONTENT_ROOT_PATH, currentPath),
    images,
    subcategories,
    posts,
    parentCategoryPath: parentPath ? path.relative(CONTENT_ROOT_PATH, parentPath) : null,
  };
  return category;
}

async function recursivelyDiscoverContent(
  currentPath: string,
  parentPath: string | null = null
) {
  const contentFilePath = path.join(currentPath, CONTENT_MARKDOWN_FILENAME);

  const [rawContent, metaProperties] = await Promise.all([
    getRawFileContent(contentFilePath),
    extractPropertiesFromMetaFile(currentPath),
  ]);

  const imageNames = await listImages(currentPath);
  const images: LocalImage[] = imageNames.map((imageName) => ({
    name: imageName,
    path: path.relative(CONTENT_ROOT_PATH, path.join(currentPath, imageName)),
  }));

  const contentType = metaProperties.type;

  // It reached a final node for the recursion
  if (contentType === ContentType.POST) {
    if (parentPath === null) {
      throw new Error(
        `recursivelyDiscoverContent | Missing parent path for post ${contentFilePath}`
      );
    }
    const post = craftPostContent(
      rawContent,
      metaProperties,
      contentFilePath,
      images,
      parentPath
    );
    return post;
  }

  // It is a category node, so it should recursively discover its children
  const childrenNames = await listDirectories(currentPath);
  const childrenPromise = childrenNames.map((child) =>
    recursivelyDiscoverContent(path.join(currentPath, child), currentPath)
  );
  const children = await Promise.all(childrenPromise);
  const subcategories = children.filter(
    (child): child is Category => child.type === "category"
  );
  const posts = children.filter(
    (child): child is Post => child.type === "post"
  );

  const category = craftCategoryContent(
    rawContent,
    metaProperties,
    contentFilePath,
    images,
    subcategories,
    posts,
    parentPath
  );

  return category;
}

async function main() {
  console.log("Discover - Start...");
  const contentTree = await recursivelyDiscoverContent(CONTENT_ROOT_PATH);
  const jsonTree = JSON.stringify(contentTree, null, 2);
  console.log("Discover - Saving local json file...");
  await saveFile(path.join(TOOLS_DIST_PATH, "discovered.json"), jsonTree);
  console.log("Discover - Done!");
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
