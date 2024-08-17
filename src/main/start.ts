import { BrowserWindow, clipboard } from 'electron';
import { LangChainService } from './services/langchain/langchain.service';
// import { OSService } from './services/os.service';
import path from 'path';
import { app } from 'electron';

import carretManager from '../../release/app/build/Release/caret';

export async function start(mainWindow: BrowserWindow) {
  // const langchainService = LangChainService.getInstance();
  // const response = await langchainService.requestLLM('hello dude', 'improve');
  // console.log(response);
  // OSService.addTabListener(mainWindow);
  // OSService.exposeNativeFunctionsToRenderer(mainWindow);
  setInterval(async () => {
    try {
      const highlightedText = carretManager.getHighlightedTextPosition();
      if (highlightedText.isHighlighted) {
        console.log('Highlighted text:', highlightedText.text);
        console.log('Position:', {
          x: highlightedText.x,
          y: highlightedText.y,
          width: highlightedText.width,
          height: highlightedText.height,
        });
      } else {
        console.log('No text highlighted');
      }
    } catch (error) {
      console.error('Error getting highlighted text:', error);
    }
  }, 1000);
}
