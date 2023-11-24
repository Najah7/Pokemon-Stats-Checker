import * as vscode from 'vscode';

export function get() {
    // グラフURLを取得
    const graphUrl = "https://your-s3-graph.png";
    vscode.window.showInformationMessage(graphUrl);
}