import { type ClassValue, clsx } from 'clsx';
import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function logToMain(data: any) {
  window.electron.ipcRenderer.sendMessage('log', JSON.stringify(data));
}

export function makeInteractiveClassClickable() {
  window.electron.ipcRenderer.sendMessage('set-ignore-mouse-events', true, {
    forward: true,
  });
  window.addEventListener('mousemove', () => {
    const interactiveElements = document.querySelectorAll('.interactive');
    interactiveElements.forEach((element) => {
      if (!element.hasAttribute('data-listeners-added')) {
        element.addEventListener('mouseenter', () => {
          window.electron.ipcRenderer.sendMessage(
            'set-ignore-mouse-events',
            false,
          );
        });

        element.addEventListener('mouseleave', () => {
          window.electron.ipcRenderer.sendMessage(
            'set-ignore-mouse-events',
            true,
            { forward: true },
          );
        });

        element.setAttribute('data-listeners-added', 'true');
      }
    });
  });
}
