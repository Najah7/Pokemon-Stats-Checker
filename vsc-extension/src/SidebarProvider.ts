import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import { start } from "./start";
import { calcStats } from "./calcStats";
import { LANGUAGES, isLanguage, languageList } from "./openNote";
import { PostType, postRequest } from "./apiRequests";
import { searchBestPokemon } from "./searchBestPokemon";
import { PokemonType, Stats } from "./types/pokemons";
import { userName } from "./extension";

const mock: PostType = {
  baseStats: {
    hp: 10,
    attack: 10,
    defense: 10,
    specialAttack: 10,
    specialDefense: 10,
    speed: 10,
  },
  userName: "sugiyama",
  pokemonId: 1,
  color: {
    fillColor: "#ff0000",
    lineColor: "#000000",
  },
};

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

    webviewView.webview.postMessage({ type: "setup", value: languageList });

    let trueAnswer: string;
    let language: string;
    let imgUrl: string;
    let bestPokemon: PokemonType;
    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "start": {
          const selectedLanguage = languageList.find((l) => l === data.value);
          if (!selectedLanguage || !isLanguage(selectedLanguage)) {
            vscode.window.showErrorMessage("言語が選択されていません");
            return;
          }
          language = selectedLanguage;
          const { question } = await start(LANGUAGES[selectedLanguage]);
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
            const stats: Stats = calcStats();

            const sum =
              stats.hp +
              stats.attack +
              stats.defense +
              stats.specialAttack +
              stats.specialDefense +
              stats.speed;
            const message = `あなたの種族値は${sum}です\n\nHP:${stats.hp}\n 攻撃:${stats.attack}\n 防御:${stats.defense}\n 特攻:${stats.specialAttack}\n 特防:${stats.specialDefense}\n すばやさ:${stats.speed}`;
            webviewView.webview.postMessage({
              type: "corrected",
              value: message,
            });

            // 種族値特徴の近いポケモンを探索
            const result = searchBestPokemon(stats);
            if (!result) {
              vscode.window.showErrorMessage("ポケモンの検索に失敗しました");
              return;
            } else {
              bestPokemon = result;
              webviewView.webview.postMessage({
                type: "corrected",
                value: message + `\n\nあなたは${bestPokemon.name}です`,
              });
              // メトリクスをPOST
              const res = await postRequest({
                userName,
                // TODO: 修正されるまでは↓で使用する
                // userName: "sugiyama",
                pokemonId: bestPokemon.pokemonId,
                baseStats: stats,
                color: {
                  fillColor: bestPokemon.color.fillColor,
                  lineColor: bestPokemon.color.lineColor,
                },
              });
              if (res) {
                imgUrl = (await res?.data) as string;
                webviewView.webview.postMessage({
                  type: "fetchedImg",
                  value: imgUrl,
                });
                return;
              } else {
                vscode.window.showErrorMessage("グラフの取得に失敗しました");
                return;
              }
            }
          } else {
            webviewView.webview.postMessage({
              type: "uncorrected",
              value: "答えが間違っています",
            });
          }
          break;
        }
        case "copy": {
          const code = '<img src="' + imgUrl + '" width="300px" />';
          vscode.env.clipboard.writeText(code);
          vscode.window.showInformationMessage(`コピーしました \n ${code}`);
          break;
        }
        case "shareX": {
          const url = `https://twitter.com/intent/tweet?text=あなたは「${language}界の${bestPokemon.name}」です%0a%0a&url=https://github.com/najah7/pokemon-stats-checker&hashtags=エンジニア種族値チェッカー,技育キャンプ`;
          vscode.env.openExternal(vscode.Uri.parse(url));
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
        <div class="ui" id="ready">
          <h3>あなたのエンジニア種族値を測ります</h3>
          <p class="desc">準備ができたらstartを押してください</p>
          <label for="language" class="desc">言語を選択してください</label>
          <select id="language">
          </select>
          <button id="start">スタート</button>
        </div>
        <div style="display: none;" class="ui" id="started">
          <h3 id="script"></h3>
          <p class="desc">解答記入欄</p>
          <input type="text" id="answer" />
          <p id="error"></p>
          <button id="submit">回答</button>
        </div>
        <div style="display: none;" class="ui" id="corrected">
          <h2>正解!!</h2>
          <p id="stats"></p>
        </div>
        <div style="display: none;" class="ui" id="fetchedImg">
          <h3>あなたの種族値</h3>
          <img id="img" />
          <button id="copy">GitHubに貼る</button>
          <button id="shareX">Xでシェアする</button>
        </div>
        
        <script>
          const vscode = acquireVsCodeApi();
          
          const languageSelect = document.getElementById("language");
          const startButton = document.getElementById("start");
          const submitButton = document.getElementById("submit");
          const answerInput = document.getElementById("answer");
          const copyButton = document.getElementById("copy");
          const shareXButton = document.getElementById("shareX");

          window.addEventListener("message", (event) => {
            const message = event.data;
            switch (message.type) {
              case "setup": {
                message.value.forEach((language) => {
                  const option = document.createElement("option");
                  option.text = language;
                  option.value = language;
                  languageSelect.appendChild(option);
                });
                break;
              }
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
              case "fetchedImg": {
                document.getElementById("fetchedImg").style.display = "block";
                document.getElementById("img").src = message.value;
                document.getElementById("code").innerText = '<img src="' + message.value + '" width="300px" />';
                break;
              }
            }
          });

          startButton.addEventListener("click", () => {
            vscode.postMessage({
              type: "start",
              value: languageSelect.value,
            });
          });

          submitButton.addEventListener("click", () => {
            const answer = answerInput.value;
            vscode.postMessage({
              type: "answer",
              value: answer,
            });
          });    
          
          copyButton.addEventListener("click", () => {
            vscode.postMessage({
              type: "copy",
            });
          });

          shareXButton.addEventListener("click", () => {
            vscode.postMessage({
              type: "shareX",
            });
          });
        </script>
			</body>
			<script src="${scriptUri}">
      </script>
			</html>`;
  }
}
