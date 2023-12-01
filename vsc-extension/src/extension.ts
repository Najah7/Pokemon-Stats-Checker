import * as vscode from "vscode";
import * as diff from "diff";
import { button } from "./button";
import { f } from "./function";
import { start, startTime } from "./start";
import { post } from "./post";
import { getUrl, getPokemon } from "./get";
import { auth } from "./auth";
import { SidebarProvider } from "./SidebarProvider";

export type StatsType = {
  h: number;
  a: number;
  b: number;
  c: number;
  d: number;
  s: number;
};

export function activate(context: vscode.ExtensionContext) {
  // デバッグ
  console.log("activate");

  // Githubでログイン
  auth();

  // 変数定義
  var previousText: string = "";
  var typeCount: number = 0;
  var typoCount: number = 0;
  var specialAttackCount: number = 0;
  var specialDiffenceCount: number = 0;
  var currentTextLength: number = 0;

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

  // >base-stats-checker:start （問題を表示)
  let disposable = vscode.commands.registerCommand(
    "base-stats-checker.start",
    () => {
      const { question } = start();
      return question;
    }
  );

  // >base-stats-checker:post （問題の提出)
  disposable = vscode.commands.registerCommand(
    "base-stats-checker.post",
    async (isAnswerCorrect: string) => {
      // Constants for calculations
      const baseHp: number = 300;
      const baseDefense: number = 110;
      const baseSpecialDefense: number = 100;
      const baseSpeed: number = 155;
      const specialAttackCoefficients: number = 10;
      const specialDiffenceCoefficients: number = 2;

      // 正解の場合
      if (isAnswerCorrect && !isNaN(startTime)) {
        // 経過時間を計算
        const elapsedTime = (Date.now() - startTime) / 1000; // ミリ秒から秒に変換

        // H: HP(冗長さ、文字数)
        const h: number = f(baseHp - currentTextLength);

        // A: こうげき（タイピング率=キータイプ回数/経過時間)
        const typingRate = (typeCount / elapsedTime) * 100;
        const a: number = f(typingRate);

        // B: ぼうぎょ(タイポ率=1文字削除回数/経過時間)
        const typoRate = (typoCount / elapsedTime) * 100;
        const b: number = f(baseDefense - typoRate);

        // C: とくこう(ペースト、インラインサジェスト)
        const specialAttackRate = (specialAttackCount / elapsedTime) * 100;
        const specialAttack = specialAttackRate * specialAttackCoefficients;
        const c: number = f(specialAttack);

        // D: とくぼう(選択範囲削除)
        const specialDiffenceRate = (specialDiffenceCount / elapsedTime) * 100;
        const specialDiffence =
          specialDiffenceCoefficients * specialDiffenceRate;
        const d: number = f(baseSpecialDefense - specialDiffence);

        // S: すばやさ(完成までの時間)
        const s: number = f(baseSpeed - elapsedTime);

        // 種族値特徴の近いポケモンを探索
        getPokemon(h, a, b, c, d, s);

        // メトリクスをPOST
        post(h, a, b, c, d, s);

        // 種族値を返す
        return { h, a, b, c, d, s };

        // 不正解の場合
      } else if (!isAnswerCorrect && !isNaN(startTime)) {
        vscode.window.showInformationMessage(`答えが違います`);

        // startTimeがNaNの場合
      } else if (isNaN(startTime)) {
        vscode.window.showInformationMessage(
          `base-stats-checker:startコマンドで問題を開始してください`
        );
      }
    }
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

  // >base-stats-checker:get （グラフURLの取得)
  disposable = vscode.commands.registerCommand("base-stats-checker.get", () => {
    getUrl();
  });

  // コマンド実行時にdisposableの処理を行う
  context.subscriptions.push(disposable);
}
