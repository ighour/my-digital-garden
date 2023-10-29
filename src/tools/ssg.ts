import path from "path";
import { deletePath, getWebsitePath, saveFile } from "../utils";
import SSG from "../ssg";
import { CONTENT_MARKDOWN_FILENAME, HTML_INDEX_FILENAME } from "../constants";

const WEBSITE_PATH = getWebsitePath();

async function main() {
  console.log("SSG - Start...");
  await deletePath(WEBSITE_PATH);
  const websiteTree = await SSG();
  for (const [pagePath, HTML] of Object.entries(websiteTree)) {
    const htmlPath = pagePath.replace(
      CONTENT_MARKDOWN_FILENAME,
      HTML_INDEX_FILENAME
    );
    console.log(`SSG - Saving ${htmlPath}...`);
    const fullPath = path.join(WEBSITE_PATH, htmlPath);
    await saveFile(fullPath, HTML);
  }
  console.log("SSG - Done!");
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
