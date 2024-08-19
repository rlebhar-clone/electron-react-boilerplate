import { Input } from '@/renderer/components/ui/input';
import { cn } from '@/renderer/libs/utils';
import { motion } from 'framer-motion';

export function InputLLM(p: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
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
  );
}
