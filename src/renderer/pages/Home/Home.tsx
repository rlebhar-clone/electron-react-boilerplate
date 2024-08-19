import { useEffect, useState } from 'react';
import { InputLLM } from '../../components/features/InputLLM';

export function Home() {
  const [value, setValue] = useState<string>('');
  const handleGlobalShortcut = (e: { data: { shortcut: string } }) => {
    console.log('global-shortcut', e);
  };
  useEffect(() => {
    window.electron.ipcRenderer.on('global-shortcut', handleGlobalShortcut);
  }, []);

  return (
    <div id="container" className="w-[500px] p-1">
      <InputLLM value={value} onChange={setValue} />
    </div>
  );
}
