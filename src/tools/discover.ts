import path from "path";
import discover from "../discover";
import { saveFile } from "../discover/files";
import { getOutputPath } from "../utils";

const OUTPUT_PATH = getOutputPath();

async function main() {
  console.log("Discover - Start...");
  const contentTree = await discover();
  const jsonTree = JSON.stringify(contentTree, null, 2);
  console.log("Discover - Saving local json file in dist folder...");
  await saveFile(path.join(OUTPUT_PATH, "data.json"), jsonTree);
  console.log("Discover - Done!");
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
