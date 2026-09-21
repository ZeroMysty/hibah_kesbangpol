"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useMode, bidangInfo, BidangId } from "@/context/mode-context";
import { useHibah } from "@/context/hibah-context";
import { useNotifications, type AppNotification } from "@/context/notification-context";
import {
  LockIcon,
  FolderIcon,
  ArchiveIcon,
  BuildingIcon,
  CheckIcon,
  ChartIcon,
} from "@/components/icons";
import { formatRupiah, formatShortRupiah, formatRelativeTime, BIDANG_HEX } from "@/lib/utils";
import FilterPill from "@/components/filter-pill";

// â”€â”€â”€ Notification feed helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const typeIcon: Record<AppNotification["type"], (props: { className?: string }) => React.ReactNode> = {
  hibah: FolderIcon,
  arsip: ArchiveIcon,
  lembaga: BuildingIcon,
};
const typeColor: Record<AppNotification["type"], string> = {
  hibah: "bg-red-50 text-red-600",
  arsip: "bg-sky-50 text-sky-600",
  lembaga: "bg-emerald-50 text-emerald-600",
};
const typeLabel: Record<AppNotification["type"], string> = {
  hibah: "Usulan Hibah Baru",
  arsip: "Arsip Baru",
  lembaga: "Lembaga Baru",
};


// â”€â”€â”€ Warna per bidang (hex) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€


// â”€â”€â”€ Komponen Bar Chart Full Width (Mulai dari Kiri, 1 Batang per Tahun) â”€â”€â”€â”€
type BarDatum = { tahun: string; jumlah: number; nominal: number };

function BarChart({
  data,
  filterBidang,
}: {
  data: BarDatum[];
  filterBidang: BidangId | "Semua";
}) {
  const barColor =
    filterBidang === "Semua" ? "#e11d48" : BIDANG_HEX[filterBidang];

  const maxJumlah = Math.max(...data.map((d) => d.jumlah), 1);

  return (
    <div className="relative w-full pt-6 pb-2">
      {/* Background Grid Lines stretching 100% full width */}
      <div className="relative h-48 w-full">
        <div className="absolute inset-x-0 top-0 border-b border-dashed border-zinc-200 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] font-semibold text-zinc-400 pl-1 -mt-3.5">{maxJumlah}</span>
        </div>
        <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-zinc-100 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] font-semibold text-zinc-400 pl-1 -mt-3.5">{Math.round(maxJumlah / 2)}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 border-b border-zinc-300 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] font-semibold text-zinc-400 pl-1 -mt-3.5">0</span>
        </div>

        {/* Bars starting from the very left edge */}
        <div className="absolute inset-0 pl-10 pr-4 flex items-end justify-start gap-4 sm:gap-7 overflow-x-auto no-scrollbar">
          {data.map((d) => {
            const heightPercent = maxJumlah > 0 ? (d.jumlah / maxJumlah) * 100 : 0;
            return (
              <div
                key={d.tahun}
                className="group relative flex flex-col items-center justify-end h-full w-14 sm:w-16 md:w-20 shrink-0 cursor-pointer"
              >
                {/* Tooltip on hover */}
                <div className="pointer-events-none absolute -top-14 z-20 hidden group-hover:flex flex-col items-center rounded-xl bg-red-700 px-3 py-1.5 text-center text-white shadow-xl shadow-red-700/20">
                  <span className="text-[11px] font-bold whitespace-nowrap">Tahun {d.tahun}</span>
                  <span className="text-[10px] text-red-100 whitespace-nowrap">{d.jumlah} Berkas Hibah</span>
                  <span className="text-[9px] text-red-200 whitespace-nowrap">{formatRupiah(d.nominal)}</span>
                  <div className="absolute -bottom-1 h-2 w-2 rotate-45 bg-red-700" />
                </div>

                {/* Angka di atas batang */}
                <span
                  className={`mb-1.5 text-xs font-black transition-transform group-hover:scale-110 ${
                    d.jumlah > 0 ? "" : "text-zinc-300"
                  }`}
                  style={{ color: d.jumlah > 0 ? barColor : undefined }}
                >
                  {d.jumlah}
                </span>

                {/* Batang */}
                <div
                  className="w-full rounded-t-xl transition-all duration-300 group-hover:opacity-90 shadow-2xs"
                  style={{
                    height: d.jumlah > 0 ? `${Math.max(heightPercent, 8)}%` : "3px",
                    backgroundColor: d.jumlah > 0 ? barColor : "#e4e4e7",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Label Tahun & Nominal tepat di bawah batang, mulai dari kiri */}
      <div className="pl-10 pr-4 flex justify-start gap-4 sm:gap-7 pt-3 overflow-x-auto no-scrollbar">
        {data.map((d) => (
          <div key={d.tahun} className="w-14 sm:w-16 md:w-20 shrink-0 text-center">
            <p className="text-xs font-bold text-zinc-800">{d.tahun}</p>
            <p className="text-[10px] text-zinc-400 font-medium truncate" title={formatRupiah(d.nominal)}>
              {d.nominal > 0 ? formatShortRupiah(d.nominal) : "Rp 0"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// â”€â”€â”€ Halaman Utama â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function LaporanPage() {
  const { mode } = useMode();
  const { proposals, arsipList } = useHibah();
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [filterBidang, setFilterBidang] = useState<BidangId | "Semua">("Semua");

  // Akses terbatas
  if (mode !== "admin") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <LockIcon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-zinc-900">Akses Terbatas</h1>
          <p className="mt-1 max-w-sm text-sm text-zinc-500">
            Halaman Laporan hanya dapat diakses oleh Administrator.
          </p>
        </div>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-500 active:scale-[0.98]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // â”€â”€ Hitung data per periode 5 tahun â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const allItems = [
    ...proposals.map((p) => ({
      tahun: p.tahun || p.tanggal?.slice(0, 4) || "â€”",
      bidangId: p.bidangId,
      nominal: p.nominal || 0,
    })),
    ...arsipList.map((a) => ({
      tahun: a.tahun || a.tanggal?.slice(0, 4) || "â€”",
      bidangId: a.bidangId,
      nominal: a.nominal || 0,
    })),
  ];

  const filtered = useMemo(
    () =>
      filterBidang === "Semua"
        ? allItems
        : allItems.filter((d) => d.bidangId === filterBidang),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterBidang, proposals.length, arsipList.length]
  );

  // â”€â”€ Hitung data per tahun (5 tahun terakhir + data yang ada) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const currentYear = new Date().getFullYear();
  const defaultYears = Array.from({ length: 5 }, (_, i) => String(currentYear - 4 + i));
  const allYearsSet = new Set([...defaultYears, ...allItems.map((d) => d.tahun)]);
  const sortedYears = Array.from(allYearsSet).filter((t) => t && t !== "â€”").sort();

  const chartData: BarDatum[] = sortedYears.map((tahun) => {
    const items = filtered.filter((d) => d.tahun === tahun);
    return {
      tahun,
      jumlah: items.length,
      nominal: items.reduce((s, d) => s + d.nominal, 0),
    };
  });

  // Ringkasan kartu
  const totalBerkas = filtered.length;
  const totalNominal = filtered.reduce((s, d) => s + d.nominal, 0);
  const tahunTerbanyak = chartData.reduce(
    (best, d) => (d.jumlah > (best?.jumlah ?? -1) ? d : best),
    chartData[0]
  );

  const now = Date.now();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Laporan Rekapitulasi</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Grafik dan statistik total berkas hibah per tahun anggaran.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-zinc-400 hover:bg-zinc-50"
          >
            <CheckIcon className="h-4 w-4" />
            Tandai semua dibaca ({unreadCount})
          </button>
        )}
      </div>

      {/* â”€â”€ Grafik Batang â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm w-full">
        {/* Judul + Filter */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <ChartIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">
                Total Berkas Per Tahun
              </h2>
              <p className="text-xs text-zinc-400">
                {filterBidang === "Semua"
                  ? "Semua bidang â€” 1 batang per tahun"
                  : `Bidang ${filterBidang} â€” ${bidangInfo[filterBidang].shortName}`}
              </p>
            </div>
          </div>

          {/* Filter Bidang */}
          <div className="flex flex-wrap items-center gap-2">
            {(["Semua", 1, 2, 3, 4] as (BidangId | "Semua")[]).map((b) => (
              <FilterPill
                key={String(b)}
                label={b === "Semua" ? "Semua Bidang" : `Bidang ${b}`}
                active={filterBidang === b}
                onClick={() => setFilterBidang(b)}
                color={b !== "Semua" ? BIDANG_HEX[b as BidangId] : undefined}
              />
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-100">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">Total Berkas</p>
            <p className="mt-1 text-2xl font-black text-zinc-900">{totalBerkas}</p>
          </div>
          <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-100">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">Total Nominal</p>
            <p className="mt-1 text-lg font-black text-zinc-900 truncate">{formatRupiah(totalNominal)}</p>
          </div>
          <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-100">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">Tahun Terbanyak</p>
            <p className="mt-1 text-xl font-black text-zinc-900 leading-tight">
              {tahunTerbanyak?.jumlah > 0 ? tahunTerbanyak.tahun : "â€”"}
            </p>
          </div>
        </div>

        {/* Bar Chart */}
        {chartData.every((d) => d.jumlah === 0) ? (
          <div className="flex h-48 items-center justify-center text-sm text-zinc-400">
            Belum ada data berkas untuk ditampilkan.
          </div>
        ) : (
          <BarChart data={chartData} filterBidang={filterBidang} />
        )}

        {/* Legenda Bidang */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">Bidang:</span>
          {([1, 2, 3, 4] as BidangId[]).map((b) => {
            const count = filtered.filter((d) => d.bidangId === b).length;
            return (
              <div key={b} className="flex items-center gap-1.5 text-xs text-zinc-600">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: BIDANG_HEX[b] }}
                />
                <span className="font-medium">Bidang {b}</span>
                <span className="text-zinc-400">({count})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* â”€â”€ Feed Notifikasi â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">Aktivitas Terbaru</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Notifikasi dari seluruh bidang</p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-zinc-400">
            Belum ada aktivitas. Notifikasi muncul ketika ada bidang yang menambah data baru.
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {notifications.map((n) => {
              const Icon = typeIcon[n.type];
              return (
                <li
                  key={n.id}
                  className={`flex items-start gap-3.5 px-5 py-4 transition-colors ${
                    n.read ? "" : "bg-red-50/30"
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${typeColor[n.type]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                        {typeLabel[n.type]}
                      </span>
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                        Bidang {n.bidangId} Â· {n.bidangNama}
                      </span>
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-red-600" />}
                    </div>
                    <p className="mt-1 text-sm text-zinc-800">{n.message}</p>
                    <p className="mt-1 text-xs text-zinc-400">{formatRelativeTime(n.createdAt, now)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}



