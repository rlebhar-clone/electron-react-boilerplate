import { ipcMain, clipboard, BrowserWindow } from 'electron';

export class RendererEventListenersService {
  private mainWindow: BrowserWindow | null = null;

  constructor(mainWindow: BrowserWindow | null) {
    this.mainWindow = mainWindow;
  }

  // eslint-disable-next-line no-use-before-define
  private static instance: RendererEventListenersService | null = null;

  public static getInstance(
    mainWindow: BrowserWindow | null,
  ): RendererEventListenersService {
    if (!RendererEventListenersService.instance) {
      RendererEventListenersService.instance =
        new RendererEventListenersService(mainWindow);
    }
    return RendererEventListenersService.instance;
  }

  public addRendererEventListeners() {
    ipcMain.on('copy-to-clipboard', (event, text) => {
      clipboard.writeText(text);
    });
  }
}
