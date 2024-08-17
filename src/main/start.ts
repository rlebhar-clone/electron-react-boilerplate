import { BrowserWindow, clipboard } from 'electron';
import { LangChainService } from './services/langchain/langchain.service';
// import { OSService } from './services/os.service';
// import  caretAddon  from "./build/Release/caret"
// import carret from '../../release/app/build';

export async function start(mainWindow: BrowserWindow) {
  // const langchainService = LangChainService.getInstance();
  // const response = await langchainService.requestLLM('hello dude', 'improve');
  // console.log(response);
  // OSService.addTabListener(mainWindow);
  // OSService.exposeNativeFunctionsToRenderer(mainWindow);
  setInterval(async () => {}, 1000);
}
