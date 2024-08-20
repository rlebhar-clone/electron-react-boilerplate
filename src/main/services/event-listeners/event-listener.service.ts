import { BrowserWindow, globalShortcut, ipcMain } from 'electron';
import { LangChainService } from '../langchain/langchain.service';
import { LLMMode } from '../langchain/langchain.service.type';

export class EventListenersService {
  private mainWindow: BrowserWindow | null = null;

  constructor(mainWindow: BrowserWindow | null) {
    this.mainWindow = mainWindow;
  }

  // eslint-disable-next-line no-use-before-define
  private static instance: EventListenersService | null = null;

  public static getInstance(
    mainWindow: BrowserWindow | null,
  ): EventListenersService {
    if (!EventListenersService.instance) {
      EventListenersService.instance = new EventListenersService(mainWindow);
    }
    return EventListenersService.instance;
  }

  public addMainEventListeners() {
    this.addCmdShiftPListener();
    this.addRendererLogListener();
    this.addRendererListenerRequestCloseWindow();
    this.addLangchainRequestListener();
  }

  private addLangchainRequestListener() {
    ipcMain.on(
      'LangchainService:requestLLM',
      async (event, { input, mode }: { input: string; mode: LLMMode }) => {
        console.log('receive eventn LangchainService:requestLLM');
        const response = await LangChainService.getInstance().requestLLM(
          input,
          mode,
        );
        console.log('response', response);
        event.sender.send('LangchainService:requestLLM-reply', response);
      },
    );
  }

  private addRendererLogListener() {
    ipcMain.on('log', (event, args) => {
      console.log('Log renderer : ', args);
    });
  }

  private addRendererListenerRequestCloseWindow() {
    ipcMain.on('request-close-window', () => {
      console.log('hide window');
      this.mainWindow?.hide();
    });
  }

  private addCmdShiftPListener() {
    let lastCallTime = 0;
    const debounceTime = 350; // Prevent spam

    globalShortcut.register('CommandOrControl+Shift+P', () => {
      const currentTime = Date.now();
      if (currentTime - lastCallTime >= debounceTime) {
        lastCallTime = currentTime;

        this.mainWindow?.webContents.send('global-shortcut', {
          data: { shortcut: 'CommandOrControl+Shift+P' },
        });
        if (this.mainWindow?.isVisible() === false) {
          console.log('open window');
          this.mainWindow.show();
        }
      }
    });
  }
}
