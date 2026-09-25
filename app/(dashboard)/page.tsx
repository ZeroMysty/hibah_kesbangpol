"use client";

import { useState } from "react";
import Link from "next/link";
import { useMode, bidangInfo, BidangId } from "@/context/mode-context";
import { useHibah } from "@/context/hibah-context";
import {
  ArchiveIcon,
  BuildingIcon,
  ChartIcon,
  ChevronRightIcon,
  DocumentIcon,
  EyeIcon,
  FolderIcon,
  MoneyIcon,
  PlusIcon,
  TrendUpIcon,
} from "@/components/icons";
import { LokasiArsipBadge } from "@/components/status-badge";
import { formatRupiah, formatShortRupiah, BIDANG_HEX } from "@/lib/utils";

export default function DashboardPage() {
  const { mode, bidangId, getUrl } = useMode();
  const { proposals, arsipList } = useHibah();
  const [filterBidangChartState, setFilterBidangChart] = useState<BidangId | "Semua">("Semua");
  // Mode Kaban view-only: grafik selalu menampilkan semua bidang (filter tidak dapat diubah)
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Mode Bidang Filter
  const bidangProposals = proposals.filter((p) => p.bidangId === bidangId);
  const bidangArsip = arsipList.filter((a) => a.bidangId === bidangId);
  const displayedProposals = mode === "bidang" ? bidangProposals : proposals;
  const displayedArsip = mode === "bidang" ? bidangArsip : arsipList;
  const displayedYearProposals = selectedYear
    ? displayedProposals.filter((p) => (p.tahun || p.tanggal?.slice(0, 4)) === selectedYear)
    : displayedProposals;

  const totalNominal = displayedProposals.reduce((acc, p) => acc + (p.nominal || 0), 0);
  const totalDokumen = displayedProposals.length;
  const uniqueInstansi = new Set([...displayedProposals.map((p) => p.instansi), ...displayedArsip.map((a) => a.instansi)]).size;
  const activeLemariCount = new Set([...displayedProposals.map((p) => p.lemariArsip), ...displayedArsip.map((a) => a.lemariArsip)]).size;

  const adminStats = [
    {
      label: "Total Dokumen Hibah",
      value: String(totalDokumen),
      delta: totalDokumen > 0 ? `${totalDokumen} berkas` : "0 berkas",
      up: true,
      icon: DocumentIcon,
      accent: "bg-red-500",
      iconBg: "bg-red-50 text-red-600",
    },
    {
      label: "Dana Diajukan",
      value: formatRupiah(totalNominal),
      delta: totalNominal > 0 ? "Total Nilai Usulan" : "Rp 0",
      up: true,
      icon: MoneyIcon,
      accent: "bg-emerald-500",
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Lemari Terpakai",
      value: `${activeLemariCount} Lemari`,
      delta: activeLemariCount > 0 ? `${activeLemariCount} aktif` : "0 aktif",
      up: true,
      icon: ArchiveIcon,
      accent: "bg-blue-500",
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      label: "Instansi / Lembaga",
      value: String(uniqueInstansi),
      delta: uniqueInstansi > 0 ? `${uniqueInstansi} lembaga` : "0 lembaga",
      up: true,
      icon: BuildingIcon,
      accent: "bg-rose-500",
      iconBg: "bg-rose-50 text-rose-600",
    },
  ];


  return (
    <div className="space-y-6">
      {/* Top Banner Mode Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-6 text-white shadow-xl shadow-red-600/15">
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            {mode === "admin"
              ? "Sistem Pengarsipan Hibah Daerah"
              : mode === "kaban"
              ? "Monitoring Arsip Hibah Daerah — Kepala Badan"
              : `Pengarsipan Hibah Bidang ${bidangId}`}
          </h1>
          <p className="text-xs sm:text-sm text-red-100 max-w-2xl leading-relaxed">
            {mode === "admin"
              ? "Kelola dokumen dan arsip hibah daerah secara terstruktur dan terintegrasi."
              : mode === "kaban"
              ? "Mode pemantauan: seluruh data hibah dan arsip dapat dilihat dan diunduh, tanpa hak ubah."
              : `${bidangInfo[bidangId].fullName}. Kelola dan arsipkan berkas hibah.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <Link
            href={getUrl("Dokumen")}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-red-700 shadow-md transition hover:bg-red-50 active:scale-95"
          >
            <DocumentIcon className="h-4 w-4 text-red-600" />
            <span>Daftar Dokumen</span>
          </Link>
          <Link
            href={getUrl("Lemari")}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
          >
            <ArchiveIcon className="h-4 w-4" />
            <span>Denah Lemari Arsip</span>
          </Link>
        </div>
      </div>

      {/* Overview */}
      <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {adminStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-500">
                      {stat.label}
                    </span>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <p className="text-2xl font-bold tracking-tight text-zinc-900">
                      {stat.value}
                    </p>
                    <span className="text-xs font-semibold text-zinc-500">
                      {stat.delta}
                    </span>
                  </div>
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 ${stat.accent}`}
                  />
                </div>
              );
            })}
          </div>

          {/* â”€â”€ Grafik Batang Per Tahun (Full Width, Mulai dari Kiri) â”€â”€â”€ */}
          {(() => {
            const filterBidangChart = mode === "kaban" ? ("Semua" as BidangId | "Semua") : filterBidangChartState;
            const allItems = [
              ...displayedProposals.map((p) => ({
                tahun: p.tahun || p.tanggal?.slice(0, 4) || "",
                bidangId: p.bidangId,
                nominal: p.nominal || 0,
              })),
            ].filter((d) => d.tahun);

            const bidangChart = mode === "bidang" ? bidangId : filterBidangChart;
            const filtered =
              bidangChart === "Semua"
                ? allItems
                : allItems.filter((d) => d.bidangId === bidangChart);

            // Tampilkan 8 tahun terakhir (misal: 2019 s/d 2026), plus tahun lain jika ada di data
            const currentYear = new Date().getFullYear();
            const defaultYears = Array.from({ length: 8 }, (_, i) => String(currentYear - 7 + i));
            const allYearsSet = new Set([...defaultYears, ...allItems.map((d) => d.tahun)]);
            const sortedYears = Array.from(allYearsSet).filter(Boolean).sort();

            const bars = sortedYears.map((tahun) => {
              const items = filtered.filter((d) => d.tahun === tahun);
              return {
                tahun,
                jumlah: items.length,
                nominal: items.reduce((sum, d) => sum + d.nominal, 0),
              };
            });

            const maxJ = Math.max(...bars.map((b) => b.jumlah), 1);
            const barColor =
              bidangChart === "Semua" ? "#e11d48" : BIDANG_HEX[bidangChart];

            return (
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm w-full">
                {/* Header + Filter Buttons */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 shadow-xs">
                      <ChartIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-zinc-900">Rekapitulasi Dokumen Per Tahun</h2>
                      <p className="text-xs text-zinc-500">
                        {bidangChart === "Semua"
                          ? "Semua bidang â€” 1 batang per tahun"
                          : `Bidang ${bidangChart} (${bidangInfo[bidangChart].shortName})`}
                      </p>
                    </div>
                  </div>

                  {/* Filter Buttons — disembunyikan untuk mode kaban (view-only) */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {mode === "admin" && (["Semua", 1, 2, 3, 4] as (BidangId | "Semua")[]).map((b) => (
                      <button
                        key={String(b)}
                        type="button"
                        onClick={() => setFilterBidangChart(b)}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                          filterBidangChart === b
                            ? b === "Semua"
                              ? "bg-red-600 text-white shadow-sm shadow-red-600/20"
                              : "text-white shadow-sm"
                            : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                        }`}
                        style={
                          filterBidangChart === b && b !== "Semua"
                            ? { backgroundColor: BIDANG_HEX[b as BidangId] }
                            : {}
                        }
                      >
                        {b === "Semua" ? "Semua" : `Bidang ${b}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full-width chart container with lines stretching 100% */}
                <div className="relative w-full pt-6 pb-2">
                  {/* Grid Lines across full 100% width */}
                  <div className="relative h-48 w-full">
                    {/* Top line (max) */}
                    <div className="absolute inset-x-0 top-0 border-b border-dashed border-zinc-200 flex items-center justify-between pointer-events-none">
                      <span className="text-[10px] font-semibold text-zinc-400 pl-1 -mt-3.5">{maxJ}</span>
                    </div>
                    {/* Mid line */}
                    <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-zinc-100 flex items-center justify-between pointer-events-none">
                      <span className="text-[10px] font-semibold text-zinc-400 pl-1 -mt-3.5">{Math.round(maxJ / 2)}</span>
                    </div>
                    {/* Baseline */}
                    <div className="absolute inset-x-0 bottom-0 border-b border-zinc-300 flex items-center justify-between pointer-events-none">
                      <span className="text-[10px] font-semibold text-zinc-400 pl-1 -mt-3.5">0</span>
                    </div>

                    <div className="absolute inset-0 pl-10 pr-4 flex items-end justify-between gap-2 sm:gap-4">
                      {bars.map((d) => {
                        const heightPercent = maxJ > 0 ? (d.jumlah / maxJ) * 100 : 0;
                        return (
                          <button
                            key={d.tahun}
                            type="button"
                            onClick={() => setSelectedYear(d.tahun)}
                            className="group relative flex-1 flex flex-col items-center justify-end h-full cursor-pointer min-w-0"
                          >
                            {/* Hover tooltip */}
                            <div className="pointer-events-none absolute -top-14 z-20 hidden group-hover:flex flex-col items-center rounded-xl bg-red-700 px-3 py-1.5 text-center text-white shadow-xl shadow-red-700/20">
                              <span className="text-[11px] font-bold whitespace-nowrap">Tahun {d.tahun}</span>
                              <span className="text-[10px] text-red-100 whitespace-nowrap">{d.jumlah} Berkas Hibah</span>
                              <span className="text-[9px] text-red-200 whitespace-nowrap">{formatRupiah(d.nominal)}</span>
                              <div className="absolute -bottom-1 h-2 w-2 rotate-45 bg-red-700" />
                            </div>

                            {/* Jumlah di atas batang */}
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
                              className="w-full max-w-[48px] sm:max-w-[64px] rounded-t-xl transition-all duration-300 group-hover:opacity-90 shadow-2xs"
                              style={{
                                height: d.jumlah > 0 ? `${Math.max(heightPercent, 8)}%` : "3px",
                                backgroundColor: d.jumlah > 0 ? barColor : "#e4e4e7",
                              }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Label Tahun & Nominal tepat di bawah batang */}
                  <div className="pl-10 pr-4 flex items-start justify-between gap-2 sm:gap-4 pt-3">
                    {bars.map((d) => (
                      <div key={d.tahun} className="flex-1 text-center min-w-0">
                        <p className="text-xs font-bold text-zinc-800 truncate">{d.tahun}</p>
                        <p className="text-[10px] text-zinc-400 font-medium truncate" title={formatRupiah(d.nominal)}>
                          {d.nominal > 0 ? formatShortRupiah(d.nominal) : "Rp 0"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <FolderIcon className="h-5 w-5 text-red-500" />
            <h2 className="text-base font-semibold">
              {selectedYear ? `Dokumen Tahun ${selectedYear}` : "Dokumen Terarsip Terbaru"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {selectedYear && (
              <button
                type="button"
                onClick={() => setSelectedYear(null)}
                className="text-xs font-semibold text-zinc-500 hover:text-red-600"
              >
                Tampilkan semua
              </button>
            )}
            <Link
              href={getUrl("Dokumen")}
              className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-500"
            >
              Lihat semua dokumen
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/70 text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3 font-semibold">Nama Dokumen Hibah</th>
                <th className="px-5 py-3 font-semibold">Instansi / Pemohon</th>
                <th className="px-5 py-3 font-semibold whitespace-nowrap">Tujuan Bidang</th>
                <th className="px-5 py-3 font-semibold whitespace-nowrap">Nominal</th>
                <th className="px-5 py-3 font-semibold whitespace-nowrap">Lokasi Fisik Arsip</th>
                <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {displayedYearProposals.slice(0, 8).map((p) => (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-zinc-50/70"
                >
                  <td className="px-5 py-4 font-medium">
                    <p className="text-zinc-900 font-semibold">{p.name}</p>
                    {p.catatan && (
                      <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1 italic">
                        {p.catatan}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-zinc-600 text-xs">{p.instansi}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white whitespace-nowrap shrink-0 ${
                        bidangInfo[p.bidangId].color
                      }`}
                    >
                      Bidang {p.bidangId}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold tabular-nums text-zinc-900 whitespace-nowrap">
                    {formatRupiah(p.nominal)}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <LokasiArsipBadge
                      lemari={p.lemariArsip}
                      rak={p.rakArsip || "Rak 01"}
                      nomor={p.nomorArsip || "No. 01"}
                      compact={true}
                    />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-left">
                    <div className="flex items-center justify-start gap-1.5">
                      <Link
                        href={getUrl("Dokumen")}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm whitespace-nowrap shrink-0"
                        title="Lihat Detail Dokumen"
                      >
                        <EyeIcon className="h-3.5 w-3.5" />
                        <span>Detail</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {displayedYearProposals.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-xs text-zinc-400">
                    Belum ada data usulan hibah terdaftar. Silakan tambahkan usulan baru melalui halaman Kelola Lemari Arsip.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


