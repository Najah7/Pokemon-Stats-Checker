import * as vscode from "vscode";

export enum LANGUAGES {
  python = ".py",
  javascript = ".js",
  typescript = ".ts",
  c = ".c",
  cpp = ".cpp",
  java = ".java",
  go = ".go",
  rust = ".rs",
  php = ".php",
  ruby = ".rb",
  swift = ".swift",
  kotlin = ".kt",
  dart = ".dart",
  csharp = ".cs",
  scala = ".scala",
  perl = ".pl",
  haskell = ".hs",
  clojure = ".clj",
  elixir = ".ex",
  lua = ".lua",
  julia = ".jl",
  r = ".r",
}

export const languageList: string[] = Object.entries(LANGUAGES).map(
  ([language, _]) => language
);

export const isLanguage = (
  maybeLanguage: string
): maybeLanguage is keyof typeof LANGUAGES => {
  return Object.keys(LANGUAGES).includes(maybeLanguage);
};

export const openNote = async (language: LANGUAGES) => {
  const folder = vscode.workspace.workspaceFolders;
  if (folder === undefined) {
    vscode.window.showErrorMessage("フォルダを開いてから実行してください");
    return;
  }
  const path = folder[0].uri;
  const fileName = `問題を解くコードを書いてください${language}`;
  const fileUri = vscode.Uri.joinPath(path, fileName);
  const content = "";
  const blog: Uint8Array = Buffer.from(content);

  await vscode.workspace.fs.writeFile(fileUri, blog);
  vscode.window.showTextDocument(fileUri);
};
