import { BrowserWindow, clipboard } from 'electron';
import { LangChainService } from './services/langchain/langchain.service';
// import { OSService } from './services/os.service';

export async function start(mainWindow: BrowserWindow) {
  // const langchainService = LangChainService.getInstance();
  // const response = await langchainService.requestLLM('hello dude', 'improve');
  // console.log(response);
  // OSService.addTabListener(mainWindow);
  // OSService.exposeNativeFunctionsToRenderer(mainWindow);
  setInterval(async () => {}, 1000);
}
