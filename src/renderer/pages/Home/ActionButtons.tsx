import { useState } from 'react';
import { Globe, LucideProps, Rocket, SpellCheck } from 'lucide-react';
import { cn } from 'src/libs/utils';
const BUTTON_CLASSNAME =
  ' cursor-pointer size-10 flex items-center justify-center  bg-white  rounded-full hover:bg-gray-50 hover:text-orange-300 gap-2';
const ACTIVE_CLASSNAME = 'bg-orange-300 ring-2 ring-white hover:bg-orange-200';
const ACTIVE_ICON_CLASSNAME = 'text-white';

import _ from 'lodash';
import { LLMMode } from 'src/main/services/langchain/langchain.service.type';
export function ActionButtons(p: {
  activeMode: LLMMode;
  setActiveMode: (mode: LLMMode) => void;
}) {
  const [activeMode, setActiveMode] = useState<LLMMode>('improve');

  const renderButton = (
    mode: LLMMode,
    IconDefinition: React.ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
    >,
    hoverText: string,
  ) => (
    <div
      onClick={() => {
        setActiveMode(mode);
      }}
      className={cn(BUTTON_CLASSNAME, mode === activeMode && ACTIVE_CLASSNAME)}
    >
      <IconDefinition
        size={18}
        className={cn(mode === activeMode && ACTIVE_ICON_CLASSNAME)}
      />
    </div>
  );

  return (
    <div className="w-96 flex justify-around pb-2 text-gray-500 text-sm">
      {renderButton('language', Globe, 'Translate to any language')}
      {renderButton('spelling', SpellCheck, 'Fix spelling errors')}
      {renderButton('improve', Rocket, 'Make your text more professional')}
    </div>
  );
}
