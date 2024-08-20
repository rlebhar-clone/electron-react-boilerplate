import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  cn,
  logToMain,
  makeInteractiveClassClickable,
} from '@/renderer/libs/utils';
import { LoadingSpinner } from '@/renderer/components/ui/loading-spinner';
import { SearchBar } from '../../components/features/searchbar';

export function Home() {
  const [value, setValue] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(makeInteractiveClassClickable, []);

  useEffect(
    function focusWindowOnVisible() {
      if (isVisible) {
        window.electron.ipcRenderer.sendMessage('request-focus-window');
      }
    },
    [isVisible],
  );
  useEffect(function listenToCmd() {
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
  }, []);

  useEffect(function sendLLMRequest() {
    window.electron.ipcRenderer.on(
      'LangchainService:requestLLM-reply',
      (reply) => {
        setResponse(reply);
        setIsLoading(false);
      },
    );
  }, []);

  const handleSubmit = async (v: string) => {
    if (v !== '') {
      setResponse('');
      window.electron.ipcRenderer.sendMessage('LangchainService:requestLLM', {
        input: v,
        mode: 'question',
      });
      setIsLoading(true);
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
                // window.electron.ipcRenderer.sendMessage('request-close-window');
                setValue('');
                setResponse('');
              }
            }}
          >
            <SearchBar
              value={value}
              onChange={setValue}
              onSubmit={handleSubmit}
            />

            {(isLoading || response) && (
              <div className="mt-4 p-4 rounded-md bg-white bg-opacity-80 animate-in">
                {response}
                {isLoading && <LoadingSpinner />}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
