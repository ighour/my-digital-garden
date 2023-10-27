import path from "path";
import discover from "../src/discover";
import { getToolsDistPath, saveFile } from "../src/utils/files";

const TOOLS_DIST_PATH = getToolsDistPath();

async function main() {
  console.log("Discover - Start...");
  const contentTree = await discover();
  const jsonTree = JSON.stringify(contentTree, null, 2);
  console.log("Discover - Saving local json file in dist folder...");
  await saveFile(path.join(TOOLS_DIST_PATH, "discovered.json"), jsonTree);
  console.log("Discover - Done!");
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
