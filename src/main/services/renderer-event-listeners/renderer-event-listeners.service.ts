import { ipcMain, clipboard, screen, BrowserWindow } from 'electron';

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
    ipcMain.on('get-carret-text', (event, text) => {});

    this.enableMouseListenerOnRenderer();
  }

  private enableMouseListenerOnRenderer() {
    setInterval(async () => {
      const point = screen.getCursorScreenPoint();
      const [x, y] = this.mainWindow?.getPosition() || [0, 0];
      const [w, h] = this.mainWindow?.getSize() || [0, 0];

      if (point.x > x && point.x < x + w && point.y > y && point.y < y + h) {
        // capture 1x1 image of mouse position.
        const image = await this.mainWindow?.webContents.capturePage({
          x,
          y,
          width: 1,
          height: 1,
        });

        const buffer = image?.getBitmap() || [];

        // set ignore mouse events by alpha.
        this.mainWindow?.setIgnoreMouseEvents(!buffer[3]);
      }
    }, 300);
  }
}
