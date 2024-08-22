import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  cn,
  logToMain,
  makeInteractiveClassClickable,
} from '@/renderer/libs/utils';
import { LangChainService } from '@/main/services/langchain/langchain.service';
import { Response } from '@/renderer/components/features/response';
import { SearchBar } from '../../components/features/searchbar';

export function Home() {
  const [value, setValue] = useState<string>('');
  const [streamedResponse, setStreamedResponse] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const stopAndResetAll = () => {
    logToMain('stopAndResetAll()...');
    LangChainService.getInstance().abortAllRequests();
    setIsVisible(false);
    setStreamedResponse('');
    setValue('');
  };

  useEffect(makeInteractiveClassClickable, []);

  useEffect(
    function focusMainWindowOnVisible() {
      if (isVisible) {
        window.electron.ipcRenderer.sendMessage('request-focus-window');
      }
    },
    [isVisible],
  );

  useEffect(function addOpenCloseListener() {
    window.electron.ipcRenderer.on('global-shortcut', (e) => {
      if (e.data.shortcut === 'CommandOrControl+Shift+P') {
        setIsVisible((prev) => {
          return !prev;
        });
      }
    });
    window.electron.ipcRenderer.on('global-shortcut', (e) => {
      if (e.data.shortcut === 'Escape') {
        setIsVisible(false);
      }
    });
    window.electron.ipcRenderer.on('on-main-window-blur', () => {
      logToMain('BLUR');
    });
  }, []);

  const handleSubmit = useCallback(async (submittedText: string) => {
    if (submittedText !== '') {
      setStreamedResponse('');

      try {
        const stream = LangChainService.getInstance().requestLLM(
          submittedText,
          'question',
        );

        for await (const chunk of stream) {
          if (chunk) {
            setStreamedResponse((prev) => prev + chunk);
          }
        }
      } catch (error) {
        console.error('Error in streaming:', error);
      }
    }
  }, []);

  return (
    <div id="container" className={cn('w-full h-full', isVisible && '')}>
      <div className="flex justify-center mt-10">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: 0.15,
              }}
              onAnimationComplete={(definition: {
                opacity: number;
                y: number;
              }) => {
                if (definition.opacity === 0) {
                  stopAndResetAll();
                }
              }}
            >
              <div id="ai-container" className="interactive w-96">
                <SearchBar
                  value={value}
                  onChange={setValue}
                  onSubmit={handleSubmit}
                />

                {streamedResponse && (
                  <Response streamedResponse={streamedResponse} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
