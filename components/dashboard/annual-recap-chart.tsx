"use client";

import { useState, useMemo } from "react";
import SectionCard from "@/components/section-card";
import FilterPill from "@/components/filter-pill";
import { ChartIcon } from "@/components/icons";
import { formatRupiah, formatShortRupiah, BIDANG_HEX } from "@/lib/utils";
import { bidangInfo, BidangId, Mode } from "@/context/mode-context";
import type { ProposalItem } from "@/context/hibah-context";

type AnnualRecapChartProps = {
  displayedProposals: ProposalItem[];
  mode: Mode;
  bidangId: BidangId;
  currentYear: number;
  selectedYear: string | null;
  onSelectYear: (year: string | null) => void;
  filterBidangChartState: BidangId | "Semua";
  onFilterBidangChartChange: (bidang: BidangId | "Semua") => void;
};

/**
 * AnnualRecapChart - Grafik batang interaktif rekapitulasi usulan & nominal anggaran per tahun.
 * Memungkinkan filter klik tahun, toggle metrik (Jumlah Berkas / Nominal Rp), dan filter per bidang.
 */
export default function AnnualRecapChart({
  displayedProposals,
  mode,
  bidangId,
  currentYear,
  selectedYear,
  onSelectYear,
  filterBidangChartState,
  onFilterBidangChartChange,
}: AnnualRecapChartProps) {
  const [chartMetric, setChartMetric] = useState<"jumlah" | "nominal">("jumlah");

  const filterBidangChart =
    mode === "kaban" ? ("Semua" as BidangId | "Semua") : filterBidangChartState;

  const allItems = useMemo(
    () =>
      displayedProposals
        .map((p) => ({
          tahun: p.tahun || p.tanggal?.slice(0, 4) || "",
          bidangId: p.bidangId,
          nominal: p.nominal || 0,
        }))
        .filter((d) => Boolean(d.tahun)),
    [displayedProposals]
  );

  const bidangChart = mode === "bidang" ? bidangId : filterBidangChart;
  const filtered = useMemo(
    () =>
      bidangChart === "Semua"
        ? allItems
        : allItems.filter((d) => d.bidangId === bidangChart),
    [allItems, bidangChart]
  );

  // 8 tahun terakhir
  const sortedYears = useMemo(() => {
    const defaultYears = Array.from({ length: 8 }, (_, i) => String(currentYear - 7 + i));
    const allYearsSet = new Set([...defaultYears, ...allItems.map((d) => d.tahun)]);
    return Array.from(allYearsSet).filter(Boolean).sort();
  }, [currentYear, allItems]);

  const bars = useMemo(() => {
    return sortedYears.map((tahun) => {
      const items = filtered.filter((d) => d.tahun === tahun);
      return {
        tahun,
        jumlah: items.length,
        nominal: items.reduce((sum, d) => sum + d.nominal, 0),
      };
    });
  }, [sortedYears, filtered]);

  const maxJ = Math.max(...bars.map((b) => b.jumlah), 1);
  const maxN = Math.max(...bars.map((b) => b.nominal), 1000000);
  const barColor = bidangChart === "Semua" ? "#e11d48" : BIDANG_HEX[bidangChart];

  return (
    <SectionCard className="w-full">
      {/* Header + Toggles */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 shadow-xs shrink-0">
            <ChartIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-zinc-900">Rekapitulasi Dokumen & Anggaran Per Tahun</h2>
              {selectedYear && (
                <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                  Aktif: {selectedYear}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500">
              {bidangChart === "Semua"
                ? "Menampilkan seluruh bidang — Klik batang untuk memfilter tabel dokumen"
                : `Bidang ${bidangChart} (${bidangInfo[bidangChart].shortName}) — Klik batang untuk filter`}
            </p>
          </div>
        </div>

        {/* Toggles: Bidang filter & Metric toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric toggle (Jumlah vs Nominal) */}
          <div className="flex rounded-xl border border-zinc-200 p-0.5 bg-zinc-50">
            <button
              type="button"
              onClick={() => setChartMetric("jumlah")}
              className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                chartMetric === "jumlah"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Jumlah Berkas
            </button>
            <button
              type="button"
              onClick={() => setChartMetric("nominal")}
              className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                chartMetric === "nominal"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Nominal (Rp)
            </button>
          </div>

          {/* Filter Bidang Buttons (Admin only) */}
          {mode === "admin" && (
            <div className="flex flex-wrap items-center gap-1">
              {(["Semua", 1, 2, 3, 4] as (BidangId | "Semua")[]).map((b) => (
                <FilterPill
                  key={String(b)}
                  label={b === "Semua" ? "Semua" : `B.${b}`}
                  active={filterBidangChartState === b}
                  onClick={() => onFilterBidangChartChange(b)}
                  color={b !== "Semua" ? BIDANG_HEX[b as BidangId] : undefined}
                  className="px-2.5 py-1 text-xs cursor-pointer shadow-xs"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative w-full pt-6 pb-2">
        <div className="relative h-48 w-full">
          {/* Top Reference Line */}
          <div className="absolute inset-x-0 top-0 border-b border-dashed border-zinc-200 flex items-center justify-between pointer-events-none">
            <span className="text-[10px] font-semibold text-zinc-400 pl-1 -mt-3.5">
              {chartMetric === "jumlah" ? maxJ : formatShortRupiah(maxN)}
            </span>
          </div>
          {/* Mid Reference Line */}
          <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-zinc-100 flex items-center justify-between pointer-events-none">
            <span className="text-[10px] font-semibold text-zinc-400 pl-1 -mt-3.5">
              {chartMetric === "jumlah" ? Math.round(maxJ / 2) : formatShortRupiah(Math.round(maxN / 2))}
            </span>
          </div>
          {/* Baseline */}
          <div className="absolute inset-x-0 bottom-0 border-b border-zinc-300 flex items-center justify-between pointer-events-none">
            <span className="text-[10px] font-semibold text-zinc-400 pl-1 -mt-3.5">0</span>
          </div>

          {/* Bars */}
          <div className="absolute inset-0 pl-14 pr-4 flex items-end justify-between gap-2 sm:gap-4">
            {bars.map((d) => {
              const isSelected = selectedYear === d.tahun;
              const heightPercent =
                chartMetric === "jumlah"
                  ? maxJ > 0
                    ? (d.jumlah / maxJ) * 100
                    : 0
                  : maxN > 0
                  ? (d.nominal / maxN) * 100
                  : 0;

              const hasValue = chartMetric === "jumlah" ? d.jumlah > 0 : d.nominal > 0;

              return (
                <button
                  key={d.tahun}
                  type="button"
                  onClick={() => onSelectYear(selectedYear === d.tahun ? null : d.tahun)}
                  className={`group relative flex-1 flex flex-col items-center justify-end h-full cursor-pointer min-w-0 transition-transform ${
                    isSelected ? "scale-102" : ""
                  }`}
                  title={`Tahun ${d.tahun}: ${d.jumlah} Berkas (${formatRupiah(d.nominal)})`}
                >
                  {/* Hover Tooltip */}
                  <div className="pointer-events-none absolute -top-16 z-20 hidden group-hover:flex flex-col items-center rounded-xl bg-zinc-900 px-3 py-1.5 text-center text-white shadow-xl">
                    <span className="text-[11px] font-bold whitespace-nowrap">Tahun {d.tahun}</span>
                    <span className="text-[10px] text-zinc-300 whitespace-nowrap">{d.jumlah} Berkas Usulan</span>
                    <span className="text-[9px] text-emerald-400 font-semibold whitespace-nowrap">
                      {formatRupiah(d.nominal)}
                    </span>
                    <div className="absolute -bottom-1 h-2 w-2 rotate-45 bg-zinc-900" />
                  </div>

                  {/* Nilai di atas batang */}
                  <span
                    className={`mb-1.5 text-xs font-black transition-transform group-hover:scale-110 truncate ${
                      hasValue ? "" : "text-zinc-300"
                    } ${isSelected ? "text-red-700 underline font-black" : ""}`}
                    style={{ color: hasValue && !isSelected ? barColor : undefined }}
                  >
                    {chartMetric === "jumlah" ? d.jumlah : d.nominal > 0 ? formatShortRupiah(d.nominal) : "0"}
                  </span>

                  {/* Visual Bar */}
                  <div
                    className={`w-full max-w-[48px] sm:max-w-[64px] rounded-t-xl transition-all duration-300 group-hover:opacity-90 ${
                      isSelected
                        ? "ring-3 ring-red-500 ring-offset-2 shadow-md"
                        : "shadow-2xs"
                    }`}
                    style={{
                      height: hasValue ? `${Math.max(heightPercent, 8)}%` : "3px",
                      backgroundColor: hasValue ? (isSelected ? "#b91c1c" : barColor) : "#e4e4e7",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Label Tahun & Ringkasan di Bawah Batang */}
        <div className="pl-14 pr-4 flex items-start justify-between gap-2 sm:gap-4 pt-3">
          {bars.map((d) => {
            const isSelected = selectedYear === d.tahun;
            return (
              <div
                key={d.tahun}
                onClick={() => onSelectYear(selectedYear === d.tahun ? null : d.tahun)}
                className={`flex-1 text-center min-w-0 cursor-pointer rounded-lg p-1 transition ${
                  isSelected ? "bg-red-50 text-red-700 font-bold" : "hover:bg-zinc-50"
                }`}
              >
                <p className={`text-xs ${isSelected ? "font-black text-red-700" : "font-bold text-zinc-800"} truncate`}>
                  {d.tahun}
                </p>
                <p className="text-[10px] text-zinc-400 font-medium truncate" title={formatRupiah(d.nominal)}>
                  {d.nominal > 0 ? formatShortRupiah(d.nominal) : "Rp 0"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}
