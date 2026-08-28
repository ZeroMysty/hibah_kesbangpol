import React from "react";

const statusStyles: Record<string, string> = {
  // Lemari Arsip styles
  "Lemari Arsip 01": "bg-blue-50 text-blue-700 ring-blue-600/20",
  "Lemari Arsip 02": "bg-rose-50 text-rose-700 ring-rose-600/20",
  "Lemari Arsip 03": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Lemari Arsip 04": "bg-purple-50 text-purple-700 ring-purple-600/20",
  "Lemari Arsip Khusus": "bg-teal-50 text-teal-700 ring-teal-600/20",

  // Generic / System status styles
  Selesai: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Menunggu: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Aktif: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Nonaktif: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
  Verifikasi: "bg-sky-50 text-sky-700 ring-sky-600/20",
  Final: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Draft: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
};

export default function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset whitespace-nowrap shrink-0 ${
        statusStyles[status] ?? statusStyles.Nonaktif
      }`}
    >
      <span>{status}</span>
    </span>
  );
}

export function RetentionBadge({ isOlder }: { isOlder: boolean }) {
  if (isOlder) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-100/80 px-2 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-inset ring-amber-600/20 whitespace-nowrap shrink-0">
        <span>&gt; 5 Thn (Retensi)</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 whitespace-nowrap shrink-0">
      <span>Aktif (&le; 5 Thn)</span>
    </span>
  );
}
