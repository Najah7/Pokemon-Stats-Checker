import * as vscode from 'vscode';
import * as diff from 'diff';
import { button } from './button';
import { f } from './function';
import { start, startTime, trueAnswer } from './start';
import { post } from './post';
import { getUrl, getPokemon } from './get';
import { auth, userName } from './auth';

export function activate(context: vscode.ExtensionContext) {
	// デバッグ
	console.log('activate');

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

	// >pentagon:start （問題を表示)
	let disposable = vscode.commands.registerCommand('pentagon.start', () => {
		start();
	});

	// >pentagon:post （問題の提出)
	disposable = vscode.commands.registerCommand('pentagon.post', async () => {
		const answer = await vscode.window.showInputBox({
			title: '答えを半角で入力（面積が3の場合: 3）'
		});

		// 正解の場合
		if (answer === trueAnswer && !isNaN(startTime)) {
			// 経過時間を計算
			const elapsedTime = (Date.now() - startTime) / 1000; // ミリ秒から秒に変換

			// H: HP(冗長さ、文字数)
			const h: number = f(300 - currentTextLength);

			// A: こうげき（タイピング率=キータイプ回数/経過時間)
			const typingRate = typeCount / elapsedTime * 100;
			const a: number = f(typingRate);

			// B: ぼうぎょ(タイポ率=1文字削除回数/経過時間)
			const typoRate = typoCount / elapsedTime * 100;
			const b: number = f(110 - typoRate);

			// C: とくこう(ペースト、インラインサジェスト)
			const specialAttackRate = specialAttackCount / elapsedTime * 100;
			const c: number = f(specialAttackRate * 10);

			// D: とくぼう(選択範囲削除)
			const specialDiffenceRate = specialDiffenceCount / elapsedTime * 100;
			const d: number = f(100 - specialDiffenceRate);

			// S: すばやさ(完成までの時間)
			const s: number = f(160 - elapsedTime);

			// 種族値特徴の近いポケモンを探索
			getPokemon(h, a, b, c, d, s);

			// 種族値の計算
			const baseStats: number = h + a + b + c + d + s;

			// メッセージとして出力
			vscode.window.showInformationMessage(`H${h} A${a} B${b} C${c} D${d} S${s}`);
			vscode.window.showInformationMessage(`あなたの種族値は${baseStats}!`);

			// メトリクスをPOST
			post(h, a, b, c, d, s);

		// 不正解の場合
		} else if (answer !== trueAnswer) {
			vscode.window.showInformationMessage(`答えが違います`);

		// startTimeがNaNの場合
		} else if (isNaN(startTime)) {
			vscode.window.showInformationMessage(`pentagon:startコマンドで問題を開始してください`);
		}
	});

	// メトリクス取得のためのエディター状態取得処理
	vscode.window.onDidChangeTextEditorSelection(event => {
		// 問題を開始している場合
		if (!isNaN(startTime)) {
			const { textEditor } = event;

			// 現在のテキスト
			const currentText: string = textEditor.document.getText();
			currentTextLength = currentText.length;

			// 変更前後の差分
			const differences = diff.diffChars(previousText, currentText);

			// 差分情報をマッピングしてキーストローク回数と削除回数のカウント
			differences.map(part => {
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

	// >pentagon:get （グラフURLの取得)
	disposable = vscode.commands.registerCommand('pentagon.get', () => {
		getUrl();
	});

	// コマンド実行時にdisposableの処理を行う
	context.subscriptions.push(disposable);
}