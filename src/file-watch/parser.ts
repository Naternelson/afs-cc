// parser.ts
import { promises as fs } from "fs";
import pathLib from "path";
import { FileWatchConfigType, ParsedFileResult } from "./types";

export async function parseDatFile(
  filePath: string,
  config: FileWatchConfigType
): Promise<ParsedFileResult | null> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const parsedData = lines.map((line) => {
      const fields = line.split(config.delimiter);
      const data: Record<string, any> = {};
      config.fields.forEach((field, index) => {
        if (fields[index] !== undefined) {
          data[field.name] = fields[index];
        }
      });
      return data;
    });

    const fileName = pathLib.basename(filePath);
    const fileNameParts = pathLib
      .parse(fileName)
      .name.split(config.fileNameDelimiter);
    const fileNameFields: Record<string, string> = {};
    config.fileNameFields.forEach((field, index) => {
      if (fileNameParts[index] !== undefined) {
        fileNameFields[field.name] = fileNameParts[index];
      }
    });

    return {
      parsedData,
      fileNameFields,
      filePath,
      fileType: pathLib.extname(filePath),
    };
  } catch (error) {
    console.error(`Failed to parse ${filePath}:`, error);
    return null;
  }
}
