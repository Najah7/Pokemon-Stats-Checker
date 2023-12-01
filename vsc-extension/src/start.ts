import * as vscode from "vscode";

export let startTime: number;

export type QuestionType = {
  script: string;
  trueAnswer: string;
};

// TODO: どうにかする
const QUIESTIONS = [
  {
    script: "低辺2m、高さ3mの3角形の面積は?",
    trueAnswer: "3",
  },
];

export function start() {
  startTime = Date.now();
  const question = QUIESTIONS[0];
  return { question };
}
