import { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';

import {
  ArrowRightToLine,
  Copy,
  Globe,
  Rocket,
  SpellCheck,
  Wand2,
} from 'lucide-react';
import { CarretData } from '../../../types/carret-type';
import { LLMMode } from '../../../main/services/langchain/langchain.service.type';
import { ActionButtons } from './ActionButtons';

const RELATIVE_ORIGIN_FROM_INPUT = {
  x: 400,
  y: 50,
};
let intervalId: NodeJS.Timeout;
const dotClassName = 'size-1 bg-gray-600 rounded-full animate-bounce';

export function Home(p: {}) {
  const [currentMode, setCurrentMode] = useState<LLMMode>('improve');
  const [carretData, setCarretData] = useState<CarretData>({
    height: 20,
    width: 0,
    x: 200,
    y: 200,
    text: 'helo man',
  });
  const [suggestion, setSuggestion] = useState<string | null>('Hello sir.');
  const suggestionRef = useRef<string>('Hello sir.');
  const lastTabPressTimeRef = useRef(0);

  const dotLoadingAnimation = (
    <div className="flex items-center space-x-1">
      {[0, 150, 300].map((delay) => (
        <div
          key={delay}
          className={dotClassName}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );

  const tabBox = (
    <div className="absolute z-20 -bottom-[1.7rem] flex w-full justify-center items-center 0">
      <div className="relative w-32 min-h-[20px]">
        <div className="absolute top-3 -inset-x-[0.02rem] -inset-y-[0.02rem] rounded-b-md bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 opacity-85 blur-[5px]" />
        <div className="relative z-20 flex px-2 py-1 gap-1 items-center text-slate-700 bg-white group-hover:bg-gray-50 rounded-b-[0.25rem] text-sm">
          <div className="flex items-center justify-center gap-1">
            Insert with
            <kbd className="kbd flex gap-1 justify-center items-center">
              tab <ArrowRightToLine size={12} />
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );

  const handleCopyToClipboard = useCallback(() => {
    console.log('copy-to-clipboard front', suggestion);
    window.electron.ipcRenderer.sendMessage('copy-to-clipboard', suggestion);
  }, [suggestion]);

  const aiSuggestionBox = (
    <div className="relative text-slate-700 animate-popIn group cursor-pointer">
      <div className="absolute z-10 w-96 -inset-0 min-h-[30px] rounded-lg bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 opacity-75 blur" />
      <div
        className="z-10 relative gap-2 items-center flex w-96 py-1 px-2 min-h-[30px] rounded-[0.40rem] bg-white hover:bg-gray-50"
        onClick={handleCopyToClipboard}
      >
        {!suggestion ? (
          <div className="w-8">
            <Wand2 className="text-gray-500" />
          </div>
        ) : (
          <div className="w-6">
            <Copy className="text-gray-500" size={16} />
          </div>
        )}

        {!suggestion && dotLoadingAnimation}
        {suggestion && suggestion !== '' && (
          <div className="flex gap-2 items-center">{suggestion}</div>
        )}
      </div>
      {suggestion && suggestion !== '' && tabBox}
    </div>
  );

  return (
    <div
      className=" absolute"
      style={{
        // left: `${carretData.x - RELATIVE_ORIGIN_FROM_INPUT.x}px`,
        // top: `${carretData.y - RELATIVE_ORIGIN_FROM_INPUT.y}px`,
        left: 200,
        top: 200,
      }}
    >
      <ActionButtons activeMode={currentMode} setActiveMode={setCurrentMode} />
      {aiSuggestionBox}
    </div>
  );
  // <div className="p-8 h-full text-md">
  //   <AutocompleteTextbox
  //     debounceTime={0}
  //     className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-100"
  //     getSuggestion={AIService.getInstance().getAutoCompletedSentence}
  //   />
  // </div>
}
