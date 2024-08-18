import os from 'os';
import { ExposableToRenderer } from '../../utils/expose-renderer.decorator';
import { TextSelectorServiceMac } from './text-selector-service.mac';
import { TextSelectorServiceWindows } from './text-selector-service.windows';
import { TextSelector } from './text-selector.abtract';

@ExposableToRenderer()
export class TextSelectorService implements TextSelector {
  addCarretTextListener(): void {
    if (os.platform() === 'darwin') {
      new TextSelectorServiceMac().addCarretTextListener();
    } else {
      new TextSelectorServiceWindows().addCarretTextListener();
    }
  }
}
