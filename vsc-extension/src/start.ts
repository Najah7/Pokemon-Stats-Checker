import * as vscode from "vscode";

export let startTime: number;
export const trueAnswer = "3";

// TODO: どうにかする
const QUIESTIONS = [
  {
    script: "低辺2m、高さ3mの3角形の面積は?",
    trueAnswer: "3",
  },
];

export function start() {
  vscode.window.showInformationMessage(`低辺2m、高さ3mの3角形の面積は?`);
  startTime = Date.now();
  const question = QUIESTIONS[0];
  return { question };
}
