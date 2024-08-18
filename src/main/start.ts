// import { BrowserWindow, clipboard, app } from 'electron';
// import { LangChainService } from './services/langchain/langchain.service';
import { BrowserWindow } from 'electron';
import { TextSelectorService } from './services/text-selector/text-selector.service';
import { RendererEventListenersService } from './services/renderer-event-listeners/renderer-event-listeners.service';
// import { OSService } from './services/os.service';

export async function start(mainWindow: BrowserWindow) {
  const rendererEventListenersService = new RendererEventListenersService(
    mainWindow,
  );
  rendererEventListenersService.addRendererEventListeners();
  const textSelectorService = new TextSelectorService();
  textSelectorService.addCarretTextListener();
  // const langchainService = LangChainService.getInstance();
  // const response = await langchainService.requestLLM('hello dude', 'improve');
  // console.log(response);
  // OSService.addTabListener(mainWindow);
  // OSService.exposeNativeFunctionsToRenderer(mainWindow);
}
