import * as vscode from 'vscode';

// ステータスバーにボタンを表示
export const button = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right, 0
);
button.command = 'pentagon.post';
button.text = 'Post (pentagon)';
