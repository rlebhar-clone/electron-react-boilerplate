import { TextSelector } from './text-selector.abtract';

export class TextSelectorServiceMac extends TextSelector {
  // eslint-disable-next-line no-use-before-define
  private static instance: TextSelectorServiceMac;

  public static getInstance(): TextSelectorServiceMac {
    if (!TextSelectorServiceMac.instance) {
      TextSelectorServiceMac.instance = new TextSelectorServiceMac();
    }
    return TextSelectorServiceMac.instance;
  }

  addCarretTextListener() {
    setInterval(() => {
      console.log('mac carret');
    }, 1000);
  }
}
