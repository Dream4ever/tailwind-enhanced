import * as assert from 'assert';
import path from 'path';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import {
	matchRegexp,
	completeClassName,
} from '../extension';

suite('Extension Test Suite', () => {
	// TODO: split this test into multiple single purpose tests
	test('completions with document filters', async function () {
		// list files under specific folder
		const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(path.join(__dirname, '../../src/test')));

		// check if file test.vue exists
		const file = files.find(f => f[0] === 'test.vue');
		assert.ok(file, 'test.vue not found under /src/test folder');

		// open file test.vue under path ../../src/test relative to this test file
		const uri = vscode.Uri.file(path.join(__dirname, '../../src/test/test.vue'));
		await vscode.workspace.openTextDocument(uri);
		// focus on editor
		await vscode.window.showTextDocument(uri);

		// get text in line 1
		const editor = vscode.window.activeTextEditor;
		assert.ok(editor, 'No active editor');
		const targetLine = editor!.document.lineAt(1);
		assert.ok(targetLine, 'No line at position 1');
		const text = targetLine.text;
		assert.ok(text, 'No text in line 1');
		assert.strictEqual(text, '  <div class="w-full h-full "></div>', 'Text in line 1 not match');

		// go to line 1, column 28 and input test string
		const line = 1;
		const position = new vscode.Position(line, 28);
		editor.selection = new vscode.Selection(position, position);
		const inputText = 'w12p';
		await vscode.commands.executeCommand('type', { text: inputText });

		// get text from line column 0 to the end of above input text
		const lineUntilPos = editor.document.getText(new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line, position.character + inputText.length)));

		let ran = false;
		const documentSelector = {
			scheme: 'file',
		};
		const completedClassName = completeClassName(lineUntilPos.match(matchRegexp)!);
		const r1 = vscode.languages.registerCompletionItemProvider(documentSelector, {
			provideCompletionItems: (_document: vscode.TextDocument, _position: vscode.Position, _token: vscode.CancellationToken): vscode.CompletionItem[] => {
				const proposal = new vscode.CompletionItem(completedClassName);
				proposal.kind = vscode.CompletionItemKind.Property;
				ran = true;
				return [proposal];
			}
		});

		const result = await vscode.commands.executeCommand<vscode.CompletionList>('vscode.executeCompletionItemProvider', uri, new vscode.Position(1, 0));
		r1.dispose();
		assert.ok(ran, 'Provider has not been invoked');
		assert.ok(result!.items.some(i => i.label === completedClassName), `CompletionItem ${completedClassName} not found`);

		// sleep 20 seconds
		await new Promise(resolve => setTimeout(resolve, 2000));
	});
});
