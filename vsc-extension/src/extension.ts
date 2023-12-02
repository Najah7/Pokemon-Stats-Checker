import * as vscode from "vscode";
import * as diff from "diff";
import { button } from "./button";
import { startTime } from "./start";
import { auth } from "./auth";
import { SidebarProvider } from "./SidebarProvider";

// 変数定義
export let previousText: string = "";
export let typeCount: number = 0;
export let typoCount: number = 0;
export let specialAttackCount: number = 0;
export let specialDiffenceCount: number = 0;
export let currentTextLength: number = 0;

export function activate(context: vscode.ExtensionContext) {
  // デバッグ
  console.log("activate");

  // Githubでログイン
  auth();

  // ステータスバーにボタンを表示
  context.subscriptions.push(button);
  button.show();

  // SidebarProviderの登録
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "base-stats-checker-sidebar",
      sidebarProvider
    )
  );

  // メトリクス取得のためのエディター状態取得処理
  vscode.window.onDidChangeTextEditorSelection((event) => {
    // 問題を開始している場合
    if (!isNaN(startTime)) {
      const { textEditor } = event;

      // 現在のテキスト
      const currentText: string = textEditor.document.getText();
      currentTextLength = currentText.length;

      // 変更前後の差分
      const differences = diff.diffChars(previousText, currentText);

      // 差分情報をマッピングしてキーストローク回数と削除回数のカウント
      differences.map((part) => {
        // 入力の場合
        if (part.added) {
          if (part.value.length === 1) {
            // 文字数が1の場合の処理
            typeCount++;
            console.log("A", part.value);
          } else {
            // 文字数が1より大きい場合の処理
            specialAttackCount++;
            console.log("C", part.value);
          }
        }
        // 削除の場合
        if (part.removed) {
          if (part.value.length === 1) {
            // 文字数が1の場合の処理
            typoCount++;
            console.log("B", part.value);
          } else {
            // 文字数が1より大きい場合の処理
            specialDiffenceCount++;
            console.log("D", part.value);
          }
        }
      });

      // 変更をアップデート
      previousText = currentText;
    }
  });
}
