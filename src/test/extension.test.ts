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
	const relativeFolderPath = '../../src/test';
	const testFileName = 'test.vue';
	const testFileUri = vscode.Uri.file(path.join(__dirname, relativeFolderPath, testFileName));

	let editor: vscode.TextEditor | undefined;
	let targetLine: vscode.TextLine | undefined;
	
	// test if testFileUri exists
	test('testFileUri exists', async () => {
		const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(path.join(__dirname, relativeFolderPath)));
		const file = files.find(f => f[0] === testFileName);
		assert.ok(file, `${testFileName} not found under ${relativeFolderPath} folder`);
	});

	test('can open test file', async () => {
		await vscode.workspace.openTextDocument(testFileUri);
		// focus on editor
		await vscode.window.showTextDocument(testFileUri);

		editor = vscode.window.activeTextEditor;
		assert.ok(editor, 'No active editor');
	});

	test('test case file has 2 lines', async () => {
		targetLine = editor!.document.lineAt(1);
		assert.ok(targetLine, 'No line at position 1');
	});
	
	test('test case file includes specific string', async () => {
		const text = targetLine!.text;
		assert.ok(text, 'No text in line 1');
		assert.strictEqual(text, '  <div class="w-full h-full "></div>', 'Text in line 1 not match');
	});
	
	test('completions with document filters', async function () {
		// go to line 1, column 28 and input test string
		const line = 1;
		const position = new vscode.Position(line, 28);
		editor!.selection = new vscode.Selection(position, position);
		const inputText = 'w12p';
		await vscode.commands.executeCommand('type', { text: inputText });

		// get text from line column 0 to the end of above input text
		const lineUntilPos = editor!.document.getText(new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line, position.character + inputText.length)));

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

		const result = await vscode.commands.executeCommand<vscode.CompletionList>('vscode.executeCompletionItemProvider', testFileUri, new vscode.Position(1, 0));
		r1.dispose();
		assert.ok(ran, 'Provider has not been invoked');
		assert.ok(result!.items.some(i => i.label === completedClassName), `CompletionItem ${completedClassName} not found`);
	});
});
