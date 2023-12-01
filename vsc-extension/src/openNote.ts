import * as vscode from "vscode";

export const openNote = async () => {
  const folder = vscode.workspace.workspaceFolders;
  if (folder === undefined) {
    vscode.window.showErrorMessage("フォルダを開いてから実行してください");
    return;
  }
  const path = folder[0].uri;
  const fileName = "memo.txt";
  const fileUri = vscode.Uri.joinPath(path, fileName);
  const content = "# 問題を解くコードを記入してください";
  const blog: Uint8Array = Buffer.from(content);

  await vscode.workspace.fs.writeFile(fileUri, blog);
  vscode.window.showTextDocument(fileUri);
};
