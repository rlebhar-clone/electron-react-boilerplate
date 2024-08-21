import { ChangeEvent, FormEvent } from 'react';
import { PlaceholdersAndVanishInput } from '../ui/placeholders-and-vanish-input';

const placeholders = ['Ask any question and press enter !'];
export function SearchBar(p: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    p.onChange(e.target.value);
  };
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    p.onSubmit(p.value);
  };
  return (
    <div>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
        inputProps={{
          autoFocus: true,
        }}
      />
    </div>
  );
}
