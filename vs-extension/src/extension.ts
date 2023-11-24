import * as vscode from 'vscode';
import * as diff from 'diff';
import * as request from 'request';
import { button } from './button';
import { sigmoidFunction } from './normalization';
import { start } from './start';
import { post } from './post';
import { get } from './get';

export function activate(context: vscode.ExtensionContext) {
	// デバッグ
	console.log('activate');

	// 変数定義
	var previousText: string = '';
	var keyStroke: number = 0;
	var backspace: number = 0;
	const startTime = Date.now();

	// ステータスバーにボタンを表示
	context.subscriptions.push(button);
	button.show();

	// お題を表示
	let disposable = vscode.commands.registerCommand('pentagon.start', () => {
		start();
	});

	disposable = vscode.commands.registerCommand('pentagon.post', async () => {
		const answer = await vscode.window.showInputBox({
			title: '答えを半角で入力（面積が3の場合: 3）'
		});

		if (answer === '3') {
			// 正解の場合、経過時間を計算
			const elapsedTime = (Date.now() - startTime) / 1000; // ミリ秒から秒に変換

			// H: HP(冗長さ、文字数)
			const H: number = 100;

			// A: こうげき（キーストローク率=キーストローク回数/経過時間)
			const keystrokeRate = keyStroke / elapsedTime * 100;
			const A: number = Math.floor(keystrokeRate);

			// B: ぼうぎょ(バックスペース率=バックスペース回数/経過時間)
			const backspaceRate = backspace / elapsedTime * 100;
			const B: number = Math.floor(backspaceRate);

			// C: とくこう(copilote活用率)
			const copiloteRate = 100;
			const C: number = Math.floor(copiloteRate);

			// D: とくぼう(copiloteの後にバックスペースを使用したかどうか)
			const D: number = 100;

			// S: すばやさ(完成までの時間)
			const S: number = Math.floor(sigmoidFunction(elapsedTime));

			// 種族値の計算
			const tribeValue: number = H + A + B + C + D + S;

			// メッセージとして出力
			vscode.window.showInformationMessage(`H${H} A${A} B${B} C${C} D${D} S${S}`);
			vscode.window.showInformationMessage(`あなたの種族値は${tribeValue}!`);

			// POST
			post(H, A, B, C, D, S);
		} else {
			// 不正解の場合
			vscode.window.showInformationMessage(`答えが違います`);
		}
	});

	// 変更情報の取得
	vscode.window.onDidChangeTextEditorSelection(event => {
		const { textEditor, selections } = event;

		// 現在のテキスト
		const currentText: string = textEditor.document.getText();

		// 変更前後の差分
		const differences = diff.diffChars(previousText, currentText);

		// 差分情報をマッピングしてキーストローク回数と削除回数のカウント
		const diffValue = differences.map(part => {
			// 入力の場合
			if (part.added) {
				keyStroke += 1;
			}
			// 削除の場合
			if (part.removed) {
				backspace += 1;
			}
		});
		const diffInfo = {
			keystroke: keyStroke,
			backspace: backspace,
		};

		// デバッグ
		console.log('DiffInfo:', diffInfo);

		// 変更を反映
		previousText = currentText;
	});

	// グラフURLを取得
	disposable = vscode.commands.registerCommand('pentagon.get', () => {
		get();
	});

	// コマンド実行時にdisposableの処理を行う
	context.subscriptions.push(disposable);

}