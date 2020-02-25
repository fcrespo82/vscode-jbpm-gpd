// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "jbpm-gdp" is now active!');

	let currentPanel: vscode.WebviewPanel | undefined = undefined;

	context.subscriptions.push(
		vscode.commands.registerCommand('extension.create', () => {
			if (currentPanel) {
				currentPanel.reveal(vscode.ViewColumn.One);
			} else {
				currentPanel = vscode.window.createWebviewPanel("br.com.crespo.gdp.jbpm", "GDP", vscode.ViewColumn.One, {
					// Enable scripts in the webview
					enableScripts: true,
					retainContextWhenHidden: true
				});
				currentPanel.webview.html = getWebviewContent();
				currentPanel.onDidDispose(
					() => {
						currentPanel = undefined;
					},
					undefined,
					context.subscriptions
				);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('extension.draw', () => {
			if (!currentPanel) {
				return;
			}

			// Send a message to our webview.
			// You can send any JSON serializable data.
			currentPanel.webview.postMessage({ command: 'box', height: 20, width: 20, x: 100, y: 100, color: "blue" });
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('extension.erase', () => {
			if (!currentPanel) {
				return;
			}

			// Send a message to our webview.
			// You can send any JSON serializable data.
			currentPanel.webview.postMessage({ command: 'clear' });
		})
	);

}

function getWebviewContent() {
	return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Cat Coding</title>
  </head>
  <body>
	  <canvas width="800" height="600" id="canvas"></canvas>
  </body>
  <script> 
var canvas = document.getElementById('canvas'); 


window.addEventListener('message', event => {

	const message = event.data; // The JSON data our extension sent

	switch (message.command) {
		case 'box':
			var c = canvas.getContext('2d'); 
			c.fillStyle = message.color; 
			c.fillRect(message.x,message.y,message.height,message.width); 			
			break;
		case 'clear':
			var c = canvas.getContext('2d');
			c.clearRect(0, 0, canvas.width, canvas.height);
			break;
	}
});

</script> 
  </html>`;
}


// this method is called when your extension is deactivated
export function deactivate() { }
