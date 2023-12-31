// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {
	Range,
	Position,
	CompletionItem,
	CompletionItemKind,
	SnippetString,
} from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "test" is now active!');

	let provider = vscode.languages.registerCompletionItemProvider(
		{
			scheme: 'file',
		},
		{
			provideCompletionItems(doc, pos) {
				// TODO: 这个正则表达式能匹配 w12, w12p, w12.5p，w.5p，但不能匹配 w12.5 和 w.5
				// 把 浮点数的点换成 #，就全部都能匹配了
				const targetRegExpr = /\s+(-?w|h)(\d+|#\d+|\d+#\d+)(p|r)?$/i;

				let lineUntilPos = doc.getText(new Range(new Position(pos.line, 0), pos));
				let match = lineUntilPos.match(targetRegExpr);

				if (match) {
					const snippetCompletion = new CompletionItem(
						match[0], // IntelliSense 列表中显示的文本
						CompletionItemKind.Snippet, // 代码补全后光标所在的位置
					);

					const completeClassName = (match: RegExpMatchArray) => {
						const cssAttr = match[1];
						const num = match[2].replaceAll('#', '.');
						const unit = match[3] || 'p';

						const fullUnit = unit === 'r' ? 'rem' : 'px';

						return `${cssAttr}-[${num}${fullUnit}]`;
					};

					// TODO: w12.4p 会自动补完成 w12w-[12.4px]，w.7p 会自动补完成 ww-[.7px]
					// 猜测和小数点有关，也和前面正则表达式的匹配有关，. 换成 # 就没问题了
					snippetCompletion.insertText = new SnippetString(completeClassName(match)); // 代码补全后的文本

					return [snippetCompletion];
				}

				return null;
			},
		},
	);

	context.subscriptions.push(provider);
}

// This method is called when your extension is deactivated
export function deactivate() { }
