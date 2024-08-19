import { Input } from '@/renderer/components/ui/input';

export function InputLLM(p: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Input
        id="input-llm"
        value={p.value}
        onChange={(e) => p.onChange(e.target.value)}
        placeholder="How can I help ?"
        className="shadow-md placeholder:font-light placeholder:italic h-12 text-md  focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
        autoFocus
      />
    </div>
  );
}
