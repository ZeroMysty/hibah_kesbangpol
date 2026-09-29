import { SearchIcon, XIcon } from "./icons";

type SearchInputProps = {
  value: string;
  onChange: (val: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
};

/**
 * SearchInput - Input pencarian standar dengan ikon search dan tombol clear.
 *
 * @example
 * <SearchInput
 *   value={query}
 *   onChange={setQuery}
 *   placeholder="Cari nama dokumen..."
 * />
 */
export default function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Cari...",
  className = "",
  inputClassName = "",
}: SearchInputProps) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-9 w-full rounded-xl border border-zinc-200 bg-white pl-8 pr-8 text-xs outline-none transition placeholder:text-zinc-400 focus:border-red-400 focus:ring-4 focus:ring-red-500/10 ${inputClassName}`}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer p-0.5"
          title="Hapus pencarian"
        >
          <XIcon className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
