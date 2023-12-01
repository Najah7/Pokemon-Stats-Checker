import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import { QuestionType } from "./start";
import { StatsType } from "./extension";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, "media")],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.postMessage({ type: "setup" });

    let trueAnswer: string;
    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "start": {
          const question: QuestionType = (await vscode.commands.executeCommand(
            "base-stats-checker.start"
          )) as QuestionType;
          trueAnswer = question.trueAnswer;
          webviewView.webview.postMessage({
            type: "start",
            value: question.script,
          });
          break;
        }
        case "answer": {
          if (!data.value) {
            return;
          }
          if (data.value === trueAnswer) {
            const stats: StatsType = (await vscode.commands.executeCommand(
              "base-stats-checker.post",
              true
            )) as StatsType;
            const sum =
              stats.h + stats.a + stats.b + stats.c + stats.d + stats.s;
            const message = `h:${stats.h}, a:${stats.a}, b:${stats.b}, c:${stats.c}, d:${stats.d}, s:${stats.s}\nあなたの種族値は${sum}です`;
            webviewView.webview.postMessage({
              type: "corrected",
              value: message,
            });
          } else {
            webviewView.webview.postMessage({
              type: "uncorrected",
              value: "答えが間違っています",
            });
          }
          break;
        }
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
			</head>
      <body>
        <h1>Base-stats-checker</h1>
        <divx class="ui" id="ready">
          <p>あなたのエンジニア種族値を測ります</p>
          <p>準備ができたらstartを押してください</p>
          <button id="start">start</button>
        </divx>
        <div style="display: none;" class="ui" id="started">
          <p id="script"></p>
          <input type="text" id="answer" />
          <p id="error"></p>
          <button id="submit">回答</button>
        </div>
        <div style="display: none;" class="ui" id="corrected">
          <p>正解!!</p>
          <p id="stats"></p>
        </div>
        <div style="display: none;" class="ui" id="fetchedImg">
          <p>あなたの種族値</p>
          <img id="img" />
        </div>
        
        <script>
          const vscode = acquireVsCodeApi();
          
          window.addEventListener("message", (event) => {
            const message = event.data;
            switch (message.type) {
              case "start": {
                const script = document.getElementById("script");
                script.innerText = "Q:" + message.value;
                document.getElementById("ready").style.display = "none";
                document.getElementById("started").style.display = "block";
                break;
              }
              case "corrected": {
                const stats = document.getElementById("stats");
                stats.innerText = message.value;
                document.getElementById("started").style.display = "none";
                document.getElementById("corrected").style.display = "block";
                break;
              }
              case "uncorrected": {
                document.getElementById("error").innerText = message.value;
                break;
              }
            }
          });

          const startButton = document.getElementById("start");
          startButton.addEventListener("click", () => {
            vscode.postMessage({
              type: "start",
            });
          });

          const submitButton = document.getElementById("submit");
          const answerInput = document.getElementById("answer");
          submitButton.addEventListener("click", () => {
            const answer = answerInput.value;
            vscode.postMessage({
              type: "answer",
              value: answer,
            });
          });    
        </script>
			</body>
			<script src="${scriptUri}">
      </script>
			</html>`;
  }
}
