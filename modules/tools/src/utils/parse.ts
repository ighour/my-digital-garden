import { getRawFileContent, listImages } from "./files";
import { Content, ContentType, Language } from "../../../types";
import path from "path";
import {
  CONTENT_MARKDOWN_FILENAME,
  CONTENT_META_FILENAME,
} from "../../../constants";

/**
 * Get the content type as enum.
 * @param type The content type as string.
 * @returns The content type as enum.
 */
function getContentType(type: string): ContentType {
  if (type === "post") {
    return ContentType.POST;
  } else if (type === "category") {
    return ContentType.CATEGORY;
  } else {
    throw new Error(`getContentType | Invalid content type ${type}`);
  }
}

/**
 * Get the language as enum.
 * @param language The language as string.
 * @returns The language as enum.
 */
function getLanguage(language: string): Language {
  if (language === "pt_BR") {
    return Language.PT_BR;
  } else {
    throw new Error(`getLanguage | Invalid language ${language}`);
  }
}

/**
 * Parses a yaml file into a key-value object.
 * @param filePath The path of the yaml file.
 * @returns A promise with the key-value object.
 */
async function parseYamlFile(
  filePath: string
): Promise<{ [key: string]: string }> {
  const fileContents = await getRawFileContent(filePath);
  const data: { [key: string]: string } = fileContents
    .split("\n")
    .reduce((acc, line) => {
      const [key, value] = line.split(":");
      const trimmedKey = key?.trim();
      const trimmedValue = value?.trim();

      if (trimmedKey.length === 0 || trimmedValue.length === 0) {
        throw new Error(
          `parseYamlFile | Invalid yaml line ${line} from file ${filePath}`
        );
      }

      if (trimmedKey in acc) {
        throw new Error(
          `parseYamlFile | Duplicated yaml key line ${line} from file ${filePath}`
        );
      }

      return {
        ...acc,
        [trimmedKey]: trimmedValue,
      };
    }, {});
  return data;
}

/**
 * Extracts the properties from a meta file.
 * @param currentPath The path of the meta file.
 * @returns A promise with the properties.
 */
export async function extractPropertiesFromMetaFile(
  currentPath: string
): Promise<Pick<Content, "created_at" | "type" | "language">> {
  const contentMetaPath = path.join(currentPath, CONTENT_META_FILENAME);
  const parsedMeta = await parseYamlFile(contentMetaPath);

  const properties = {
    created_at: parsedMeta.created_at,
    type: getContentType(parsedMeta.type),
    language: getLanguage(parsedMeta.language),
  };

  return properties;
}

/**
 * Extracts the markdown content from a markdown file.
 * @param currentPath The path of the markdown file.
 * @returns A promise with the markdown content.
 */
async function extractMarkdownContent(
  currentPath: string
): Promise<Content["raw"]> {
  const markdownFilePath = path.join(currentPath, CONTENT_MARKDOWN_FILENAME);
  const raw = getRawFileContent(markdownFilePath);
  return raw;
}

export async function extractPropertiesFromMarkdownFile(
  currentPath: string
): Promise<Pick<Content, "raw" | "name" | "slug">> {
  const markdownRaw = await extractMarkdownContent(currentPath);
  console.log(markdownRaw);

  return {
    raw: markdownRaw,
    name: "TODO",
    slug: "TODO",
  };
}

/**
 * Extracts the images filenames from a directory.
 * @param currentPath The path of the directory.
 * @returns A promise with the images filenames.
 */
export async function extractImages(currentPath: string): Promise<string[]> {
  const imageNames = await listImages(currentPath);
  return imageNames;
}
