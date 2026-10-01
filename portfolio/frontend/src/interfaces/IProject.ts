export interface ILanguageShare {
  name: string;
  percent: number;
}

export interface IProject {
  name: string;
  url: string;
  description: string;
  languages: string[];
  languageShares: ILanguageShare[];
  fileCount: number;
  previewFile: string;
  codePreview: string;
}
