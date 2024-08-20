import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { logToMain } from '@/renderer/libs/utils';
import { LoadingSpinner } from '@/renderer/components/ui/loading-spinner';
import { SearchBar } from '../../components/features/searchbar';

export function Home() {
  const [value, setValue] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.on('global-shortcut', (e) => {
      if (e.data.shortcut === 'CommandOrControl+Shift+P') {
        setIsVisible((prev) => {
          return !prev;
        });
      }
    });
  }, []);
  useEffect(() => {
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
    <div id="container" className="w-[500px]  h-96 p-1">
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
              logToMain(definition);
              if (definition.opacity === 0) {
                window.electron.ipcRenderer.sendMessage('request-close-window');
                setValue('');
                setResponse('');
              }
            }}
          >
            <SearchBar
              isLoading={isLoading}
              value={value}
              onChange={setValue}
              onSubmit={handleSubmit}
            />
            {(isLoading || response) && (
              <div className="mt-4 p-4  rounded-md bg-white animate-in">
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
