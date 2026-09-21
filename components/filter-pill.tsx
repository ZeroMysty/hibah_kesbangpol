type FilterPillProps = {
  label: string;
  active: boolean;
  onClick: () => void;
  /** Warna hex opsional - dipakai untuk filter bidang */
  color?: string;
};

/**
 * FilterPill - Tombol toggle filter/tab standar.
 *
 * @example
 * // Filter biasa
 * <FilterPill label="Semua" active={filter === "Semua"} onClick={() => setFilter("Semua")} />
 *
 * // Filter bidang dengan warna kustom
 * <FilterPill label="Bidang 1" active={filterBidang === 1} onClick={() => setFilterBidang(1)} color="#3b82f6" />
 */
export default function FilterPill({ label, active, onClick, color }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={active && color ? { backgroundColor: color } : {}}
      className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
        active && !color
          ? "bg-red-600 text-white shadow-md shadow-red-600/25"
          : active && color
          ? "text-white shadow-md"
          : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
      }`}
    >
      {label}
    </button>
  );
}
