import { Input } from '@/renderer/components/ui/input';
import { cn, logToMain } from '@/renderer/libs/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { PlaceholdersAndVanishInput } from '../ui/placeholders-and-vanish-input';

const placeholders = ['Ask any question !'];
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
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitted');
  };
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
          {/* <Input
            id="input-llm"
            value={p.value}
            onChange={(e) => p.onChange(e.target.value)}
            placeholder="How can I help ?"
            className={cn(
              'shadow-md placeholder:font-light placeholder:italic text-md  focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0',
            )}
            autoFocus
          /> */}
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
            inputProps={{
              autoFocus: true,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
