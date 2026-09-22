import { SearchIcon } from "./icons";

type SearchInputProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
};

/**
 * SearchInput - Input pencarian standar dengan ikon search.
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
  placeholder = "Cari...",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3.5 text-xs outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
      />
    </div>
  );
}
