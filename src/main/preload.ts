// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'global-shortcut'
  | 'log'
  | 'request-close-window'
  | 'request-open-window'
  | 'LangchainService:requestLLM'
  | 'LangchainService:requestLLM-reply'
  | 'set-ignore-mouse-events'
  | 'request-focus-window'
  | 'on-main-window-blur'
  | 'copy-text-to-clipboard-request';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: any[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: any[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: any[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: any[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
