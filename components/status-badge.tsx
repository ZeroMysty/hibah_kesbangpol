const statusStyles: Record<string, string> = {
  Selesai:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Menunggu:
    "bg-amber-50 text-amber-700 ring-amber-600/20",
  Aktif:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Nonaktif:
    "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
  Verifikasi:
    "bg-sky-50 text-sky-700 ring-sky-600/20",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        statusStyles[status] ?? statusStyles.Nonaktif
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
