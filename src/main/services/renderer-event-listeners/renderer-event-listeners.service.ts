import { BrowserWindow, globalShortcut } from 'electron';

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
    this.addOpenSearchBarCmdListener();
  }

  public removeRendererEventListeners() {
    globalShortcut.unregister('CommandOrControl+Shift+P');
  }

  private addOpenSearchBarCmdListener() {
    globalShortcut.register('CommandOrControl+Shift+P', () => {
      this.mainWindow?.webContents.send('global-shortcut', {
        data: { shortcut: 'CommandOrControl+Shift+P' },
      });
      if (this.mainWindow?.isVisible()) {
        this.mainWindow?.hide();
      } else {
        this.mainWindow?.show();
      }
    });
  }

  // private enableMouseListenerOnRenderer() {
  //   setInterval(async () => {
  //     const point = screen.getCursorScreenPoint();

  //     // capture 1x1 image of mouse position.
  //     const image = await this.mainWindow?.webContents.capturePage({
  //       x: point.x,
  //       y: point.y,
  //       width: 1,
  //       height: 1,
  //     });

  //     const buffer = image?.getBitmap() || [];

  //     const ignore = buffer[3] === 0;
  //     // set ignore mouse events by alpha.
  //     this.mainWindow?.setIgnoreMouseEvents(ignore);
  //   }, 300);
  // }
}
