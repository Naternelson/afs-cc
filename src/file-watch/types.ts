// types.ts
export interface ParsedFileResult {
  parsedData: Record<string, any>[];
  fileNameFields: Record<string, string>;
  filePath: string;
  fileType: string;
}

export interface FileWatchConfigType {
  type: string;
  path: string;
  delimiter: string;
  fileNameDelimiter: string;
  fields: { name: string }[];
  fileNameFields: { name: string }[];
}
