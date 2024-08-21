import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  cn,
  logToMain,
  logToMain,
  makeInteractiveClassClickable,
} from '@/renderer/libs/utils';
import { LoadingSpinner } from '@/renderer/components/ui/loading-spinner';
import { LangChainService } from '@/main/services/langchain/langchain.service';
import { SearchBar } from '../../components/features/searchbar';

export function Home() {
  const [value, setValue] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const stopAndResetAll = () => {
    logToMain('stopAndResetAll()...');
    LangChainService.getInstance().abortAllRequests();
    setIsVisible(false);
    setResponse('');
    setValue('');
    setIsLoading(false);
  };

  useEffect(makeInteractiveClassClickable, []);

  useEffect(
    function focusMainWindowOnVisible() {
      if (isVisible) {
        window.electron.ipcRenderer.sendMessage('request-focus-window');
      } else {
        stopAndResetAll();
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
      stopAndResetAll();
    });
  }, []);

  // useEffect(function sendLLMRequest() {
  //   window.electron.ipcRenderer.on(
  //     'LangchainService:requestLLM-reply',
  //     (reply) => {
  //       setResponse(reply);
  //       setIsLoading(false);
  //     },
  //   );
  // }, []);

  const handleSubmit = async (submitedText: string) => {
    if (submitedText !== '') {
      setResponse('');
      setIsLoading(true);
      const responseLLM = await LangChainService.getInstance().requestLLM(
        submitedText,
        'question',
      );
      if (responseLLM) {
        setResponse(responseLLM);
      }

      setIsLoading(false);
    }
  };

  return (
    <div
      id="container"
      className={cn('w-full h-full flex', isVisible && 'bg-white/20')}
    >
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
                setValue('');
                setResponse('');
              }
            }}
          >
            <div className="interactive w-96">
              <SearchBar
                value={value}
                onChange={setValue}
                onSubmit={handleSubmit}
              />

              {(isLoading || response) && (
                <div className="mt-4 p-4 rounded-md bg-white animate-in">
                  {response}
                  {isLoading && <LoadingSpinner />}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
