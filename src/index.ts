import path from "path";
import { deletePath, saveFile } from "./utils";
import SSG from "./ssg";
import { CONTENT_MARKDOWN_FILENAME, HTML_INDEX_FILENAME } from "./constants";
import discover from "./discover";
import config from "./config";

async function main() {
  console.log("SSG - Start...");
  await deletePath(config.paths.website);
  const data = await discover();
  const websiteTree = await SSG(data);
  for (const [pagePath, HTML] of Object.entries(websiteTree)) {
    const htmlPath = pagePath.replace(
      CONTENT_MARKDOWN_FILENAME,
      HTML_INDEX_FILENAME
    );
    console.log(`SSG - ${htmlPath}`);
    const fullPath = path.join(config.paths.website, htmlPath);
    await saveFile(fullPath, HTML);
  }
  console.log("SSG - Done!");
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
