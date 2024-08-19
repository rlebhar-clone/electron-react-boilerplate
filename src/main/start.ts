// import { BrowserWindow, clipboard, app } from 'electron';
// import { LangChainService } from './services/langchain/langchain.service';
import { BrowserWindow } from 'electron';
import { RendererEventListenersService } from './services/renderer-event-listeners/renderer-event-listeners.service';
// import { OSService } from './services/os.service';

export async function start(mainWindow: BrowserWindow) {
  console.log('START');
  const rendererEventListenersService = new RendererEventListenersService(
    mainWindow,
  );
  rendererEventListenersService.addRendererEventListeners();
}
