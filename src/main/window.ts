import { app, BrowserWindow /* ,screen */, screen } from 'electron';
import path from 'path';

export function initWindow() {
  // const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    height: screen.getPrimaryDisplay().workAreaSize.height,
    width: screen.getPrimaryDisplay().workAreaSize.width,
    x: 0,
    y: 0,
    // show: false,
    show: true,
    frame: false,
    transparent: true,
    // transparent: false,
    alwaysOnTop: true,
    hasShadow: false,
    visualEffectState: 'inactive',
    webPreferences: {
      devTools: false,
      // devTools: true,
      nodeIntegration: true,
      contextIsolation: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  app.commandLine.appendSwitch('disable-crash-reporter');

  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  // mainWindow.setIgnoreMouseEvents(true);
  global.ignoreMouseEvent = true;
  // mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);

  mainWindow.webContents.on('did-finish-load', async () => {
    try {
      //   const [width, height] = await mainWindow.webContents.executeJavaScript(
      //     `
      //   [document.getElementById("container").offsetWidth, document.getElementById("container").offsetHeight]
      // `,
      //   );
      // mainWindow.setContentSize(width, height);
      // mainWindow.setPosition(
      //   screen.getPrimaryDisplay().workAreaSize.width / 2 - width / 2,
      //   300,
      // );
    } catch (error) {
      console.error(error);
    }
  });

  return mainWindow;
}
