import * as vscode from 'vscode';


export let userName: string;

export function auth() {
    vscode.authentication
    .getSession("github", ["user:name"], {
      createIfNone: true,
    })
    .then((res) => {
      userName = res.account.label;
      vscode.window.showInformationMessage(
        `Hello, ${userName}!`
      );
    });
}