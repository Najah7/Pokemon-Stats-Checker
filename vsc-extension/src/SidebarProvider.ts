import * as vscode from "vscode";
import { getNonce } from "./getNonce";

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

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "start": {
          const script = (await vscode.commands.executeCommand(
            "base-stats-checker.start"
          )) as string;
          webviewView.webview.postMessage({ type: "start", value: script });
          break;
        }
        case "answer": {
          if (!data.value) {
            return;
          }
          vscode.commands.executeCommand("base-stats-checker.post", data.value);
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
        <button id="start">start</button>
        <p id="script"></p>
        <input type="text" id="answer" />
        <button id="submit">回答</button>

        <script>
          const vscode = acquireVsCodeApi();

          window.addEventListener("message", (event) => {
            const message = event.data;
            switch (message.type) {
              case "start": {
                const script = document.getElementById("script");
                script.innerText = "Q:" + message.value;
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
