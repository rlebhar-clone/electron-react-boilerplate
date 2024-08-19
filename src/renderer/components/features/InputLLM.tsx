import { Input } from '@/renderer/components/ui/input';
import { cn, logToMain } from '@/renderer/libs/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function InputLLM(p: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    window.electron.ipcRenderer.on('global-shortcut', (e) => {
      if (e.data.shortcut === 'CommandOrControl+Shift+P') {
        setIsVisible((prev) => {
          logToMain(`toggle ${!prev}`);
          return !prev;
        });
      }
    });
  }, []);
  return (
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
          onAnimationComplete={(definition: { opacity: number; y: number }) => {
            logToMain(definition);
            if (definition.opacity === 0) {
              window.electron.ipcRenderer.sendMessage('request-close-window');
              p.onChange('');
            }
          }}
        >
          <Input
            id="input-llm"
            value={p.value}
            onChange={(e) => p.onChange(e.target.value)}
            placeholder="How can I help ?"
            className={cn(
              'shadow-md placeholder:font-light placeholder:italic text-md  focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0',
            )}
            autoFocus
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
