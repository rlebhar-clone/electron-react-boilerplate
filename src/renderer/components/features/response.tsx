import { Copy } from 'lucide-react';
import { Button } from '../ui/button';

export function Response(p: { streamedResponse: string }) {
  return (
    <div className="mt-4 p-4 rounded-md bg-white animate-in flex justify-between items-start">
      <div className="">{p.streamedResponse}</div>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="cursor-pointer ml-2 p-2 rounded-full hover:bg-gray-200"
        onClick={() => {
          window.electron.ipcRenderer.sendMessage(
            'copy-text-to-clipboard-request',
            p.streamedResponse,
          );
        }}
      >
        <Copy size={16} />
      </Button>
    </div>
  );
}
