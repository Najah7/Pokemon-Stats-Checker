import * as vscode from "vscode";

export async function auth() {
  const githubSession = await vscode.authentication.getSession(
    "github",
    ["user:name"],
    {
      createIfNone: true,
    }
  );
  return githubSession.account.label;
}
