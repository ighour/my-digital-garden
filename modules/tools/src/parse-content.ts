import { PathLike, read } from "fs";
import { readdir } from "fs/promises";
import path, { extname } from "path";

const CONTENT_ROOT_PATH = path.join(__dirname, "../../../content");
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".svg"];

async function listDirectories(path: PathLike) {
  return (await readdir(path, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

async function listImages(path: PathLike) {
  return (await readdir(path, { withFileTypes: true }))
    .filter(
      (dirent) =>
        dirent.isFile() && IMAGE_EXTENSIONS.includes(extname(dirent.name))
    )
    .map((dirent) => dirent.name);
}

async function main() {
  const categoriesNames = await listDirectories(CONTENT_ROOT_PATH);
  const postsPromise = categoriesNames.flatMap(async (categoryName) => {
    const postsNames = await listDirectories(
      path.join(CONTENT_ROOT_PATH, categoryName)
    );
    const categoryPostsPromise = postsNames.map(async (postName) => {
      const postPath = path.join(CONTENT_ROOT_PATH, categoryName, postName);
      const imageNames = await listImages(postPath);
      // @TODO - parse post content, metadata and images
      // @TODO - split this function into smaller ones
      return {
        category: categoryName,
        path: path.relative(CONTENT_ROOT_PATH, postPath),
        slug: postName,
        images: imageNames,
      };
    });
    return await Promise.all(categoryPostsPromise);
  });
  const posts = (await Promise.all(postsPromise)).flat();
  console.log(posts);
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
