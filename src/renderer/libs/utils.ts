import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function logToMain(data: any) {
  window.electron.ipcRenderer.sendMessage('log', JSON.stringify(data));
}
