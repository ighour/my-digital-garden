import path from "path";
import { deletePath, saveFile } from "./utils";
import SSG from "./ssg";
import { CONTENT_MARKDOWN_FILENAME, HTML_INDEX_FILENAME } from "./constants";
import discover from "./discover";
import config from "./config";
import { copyFile } from "fs/promises";

async function main() {
  console.log("SSG - Start...");
  await deletePath(config.paths.website);
  const data = await discover();
  const websiteTree = await SSG(data);
  for (const [pagePath, page] of Object.entries(websiteTree)) {
    // Save the HTML file.
    const htmlPath = pagePath.replace(
      CONTENT_MARKDOWN_FILENAME,
      HTML_INDEX_FILENAME
    );
    console.log(`SSG - ${htmlPath}`);
    const htmlFullPath = path.join(config.paths.website, htmlPath);
    await saveFile(htmlFullPath, page.html);

    // Save image files.
    for (const localImagePath of page.localImagesPaths) {
      const imageSourcePath = path.join(config.paths.data, localImagePath);
      const imageDestinationPath = path.join(
        config.paths.website,
        localImagePath
      );
      await copyFile(imageSourcePath, imageDestinationPath);
    }
  }
  console.log("SSG - Done!");
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
