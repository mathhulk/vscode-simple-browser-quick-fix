import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const linkPattern = /(https?:\/\/[^\s]+)/g;

  // Register Code Action Provider (Lightbulb to open link)
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { scheme: "file" },
      {
        provideCodeActions(document, range) {
          const lineText = document.lineAt(range.start.line).text;
          const matches = lineText.matchAll(linkPattern);

          let currentMatch: RegExpExecArray | null = null;

          for (const match of matches) {
            const start = lineText.indexOf(match[0]);
            const end = start + match[0].length;

            if (range.start.character >= start && range.end.character <= end) {
              currentMatch = match;
              break;
            }
          }

          if (!currentMatch) return;

          const link = currentMatch[0];

          const action = new vscode.CodeAction(
            "Open in Simple Browser",
            vscode.CodeActionKind.QuickFix
          );

          action.command = {
            command: "simpleBrowser.show",
            title: "Open in Simple Browser",
            arguments: [link],
          };

          return [action];
        },
      }
    )
  );
}
