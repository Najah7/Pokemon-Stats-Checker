import * as vscode from 'vscode';

export let startTime: number;

export function start() {
    vscode.window.showInformationMessage(`低辺2m、高さ3mの3角形の面積は?`);
    startTime = Date.now();
}