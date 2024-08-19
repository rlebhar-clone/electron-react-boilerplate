import { useEffect, useState } from 'react';
import { logToMain } from '@/renderer/libs/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { InputLLM } from '../../components/features/InputLLM';

export function Home() {
  const [value, setValue] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    window.electron.ipcRenderer.on('global-shortcut', (e) => {
      if (e.data.shortcut === 'CommandOrControl+Shift+P') {
        setIsVisible((prev) => !prev);
        logToMain('toggle');
      }
    });
  }, []);
  return (
    <div id="container" className="w-[500px]  h-24 p-1">
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
              }
            }}
          >
            <InputLLM value={value} onChange={setValue} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
