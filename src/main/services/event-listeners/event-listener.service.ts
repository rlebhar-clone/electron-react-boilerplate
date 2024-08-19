import { BrowserWindow, globalShortcut, ipcMain } from 'electron';

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
  }

  private addRendererLogListener() {
    ipcMain.on('log', (event, args) => {
      console.log('Log render : ', args);
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
          this.mainWindow.show();
        }
      }
    });
  }
}
