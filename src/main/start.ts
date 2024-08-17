import { BrowserWindow, clipboard } from 'electron';
import { LangChainService } from './services/langchain/langchain.service';
// import { OSService } from './services/os.service';

export async function start(mainWindow: BrowserWindow) {
  // const langchainService = LangChainService.getInstance();
  // const response = await langchainService.requestLLM('hello dude', 'improve');
  // console.log(response);
  // OSService.addTabListener(mainWindow);
  // OSService.exposeNativeFunctionsToRenderer(mainWindow);
  setInterval(async () => {
    const text = await getSelectedText(mainWindow);
    console.log('selected text', text);
  }, 1000);
}
function getSelectedText(mainWindow: BrowserWindow): Promise<string> {
  return new Promise((resolve) => {
    const originalClipboardContent = clipboard.readText();
    console.log('originalClipboardContent', originalClipboardContent);
    // Clear clipboard and copy selected text
    clipboard.writeText('');
    console.log('copying');
    mainWindow.webContents.copy();

    // Wait a bit for the clipboard to update
    setTimeout(() => {
      const selectedText = clipboard.readText();
      console.log('read new text', selectedText);
      // Restore original clipb oard content
      clipboard.writeText(originalClipboardContent);

      resolve(selectedText);
    }, 100);
  });
}
