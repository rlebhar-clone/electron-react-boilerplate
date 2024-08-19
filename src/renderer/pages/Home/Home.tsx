import { useState } from 'react';
import { InputLLM } from '../../components/features/InputLLM';

export function Home() {
  const [value, setValue] = useState<string>('');

  return (
    <div id="container" className="w-[500px] p-1">
      <InputLLM value={value} onChange={setValue} />
    </div>
  );
}
