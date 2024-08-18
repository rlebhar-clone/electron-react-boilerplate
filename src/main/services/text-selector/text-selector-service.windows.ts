import { TextSelector } from './text-selector.abtract';
// import carretManager from '../../../../release/app/build/Release/caret';

export class TextSelectorServiceWindows extends TextSelector {
  // eslint-disable-next-line no-use-before-define
  private static instance: TextSelectorServiceWindows;

  addCarretTextListener() {
    setInterval(async () => {
      try {
        // const highlightedText = carretManager.getHighlightedTextPosition();
        // if (highlightedText.isHighlighted) {
        //     console.log('carret:', {
        //     x: highlightedText.x,
        //     y: highlightedText.y,
        //     width: highlightedText.width,
        //     height: highlightedText.height,
        //     text: highlightedText.text,
        //   });
        // }
        console.log('carret on windows');
      } catch (error) {
        console.error('Error getting highlighted text:', error);
      }
    }, 1000);
  }
}
