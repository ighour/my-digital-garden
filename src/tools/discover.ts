import path from "path";
import discover from "../discover";
import { deletePath, getOutputPath, saveFile } from "../utils";

const OUTPUT_PATH = getOutputPath();
const OUTPUT_FILE_PATH = path.join(OUTPUT_PATH, "data.json");

async function main() {
  console.log("Discover - Start...");
  await deletePath(OUTPUT_FILE_PATH);
  const contentTree = await discover();
  const jsonTree = JSON.stringify(contentTree, null, 2);
  console.log("Discover - Saving local json file in output folder...");
  await saveFile(OUTPUT_FILE_PATH, jsonTree);
  console.log("Discover - Done!");
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
