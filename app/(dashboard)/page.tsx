"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useMode, bidangInfo, BidangId } from "@/context/mode-context";
import { useHibah } from "@/context/hibah-context";
import { useReview } from "@/context/review-context";
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
  SearchIcon,
  XIcon,
  AlertIcon,
  ClockIcon,
  CheckCircleIcon,
  FilterIcon,
} from "@/components/icons";
import { LokasiArsipBadge } from "@/components/status-badge";
import { formatRupiah, formatShortRupiah, BIDANG_HEX } from "@/lib/utils";

export default function DashboardPage() {
  const { mode, bidangId, getUrl } = useMode();
  const { proposals, arsipList, isLoading } = useHibah();
  const { totalPendingCount, myReturned } = useReview();

  // Filter & Search states
  const [filterBidangChartState, setFilterBidangChart] = useState<BidangId | "Semua">("Semua");
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [chartMetric, setChartMetric] = useState<"jumlah" | "nominal">("jumlah");
  const [tableSearch, setTableSearch] = useState("");

  // Mode Bidang Filter
  const bidangProposals = useMemo(
    () => proposals.filter((p) => p.bidangId === bidangId),
    [proposals, bidangId]
  );
  const bidangArsip = useMemo(
    () => arsipList.filter((a) => a.bidangId === bidangId),
    [arsipList, bidangId]
  );

  const displayedProposals = mode === "bidang" ? bidangProposals : proposals;
  const displayedArsip = mode === "bidang" ? bidangArsip : arsipList;

  // Year Filter
  const displayedYearProposals = useMemo(() => {
    if (!selectedYear) return displayedProposals;
    return displayedProposals.filter(
      (p) => (p.tahun || p.tanggal?.slice(0, 4)) === selectedYear
    );
  }, [displayedProposals, selectedYear]);

  // Perhitungan Data & Metrik (dengan filter Boolean agar tidak menghitung undefined/empty)
  const totalNominal = useMemo(
    () => displayedProposals.reduce((acc, p) => acc + (p.nominal || 0), 0),
    [displayedProposals]
  );
  const selectedYearNominal = useMemo(
    () => displayedYearProposals.reduce((acc, p) => acc + (p.nominal || 0), 0),
    [displayedYearProposals]
  );

  const totalDokumen = displayedProposals.length;
  const totalArsip = displayedArsip.length;

  const uniqueInstansi = useMemo(() => {
    const list = [
      ...displayedProposals.map((p) => p.instansi),
      ...displayedArsip.map((a) => a.instansi),
    ]
      .filter((val): val is string => Boolean(val && val.trim() !== ""));
    return new Set(list).size;
  }, [displayedProposals, displayedArsip]);

  const activeLemariCount = useMemo(() => {
    const list = [
      ...displayedProposals.map((p) => p.lemariArsip),
      ...displayedArsip.map((a) => a.lemariArsip),
    ].filter(Boolean);
    return new Set(list).size;
  }, [displayedProposals, displayedArsip]);

  // Retensi JRA: hitung dokumen yang usianya >= 5 tahun
  const currentYear = new Date().getFullYear();
  const retensiCount = useMemo(() => {
    return [...displayedProposals, ...displayedArsip].filter((item) => {
      const year = parseInt(item.tahun || item.tanggal?.slice(0, 4) || "0", 10);
      return year > 1900 && currentYear - year >= 5;
    }).length;
  }, [displayedProposals, displayedArsip, currentYear]);

  // Review status counters
  const returnedCount = mode === "bidang" ? myReturned(bidangId).length : 0;

  // Breakdown per Bidang (Untuk Admin & Kaban)
  const bidangBreakdown = useMemo(() => {
    const bidangs: BidangId[] = [1, 2, 3, 4];
    return bidangs.map((id) => {
      const pList = proposals.filter((p) => p.bidangId === id);
      const aList = arsipList.filter((a) => a.bidangId === id);
      const sumNominal = pList.reduce((acc, p) => acc + (p.nominal || 0), 0);
      const totalItems = pList.length + aList.length;
      const percentNominal = totalNominal > 0 ? (sumNominal / totalNominal) * 100 : 0;
      return {
        id,
        info: bidangInfo[id],
        proposalCount: pList.length,
        arsipCount: aList.length,
        totalItems,
        sumNominal,
        percentNominal,
      };
    });
  }, [proposals, arsipList, totalNominal]);

  // Quick search filter for table
  const filteredTableProposals = useMemo(() => {
    if (!tableSearch.trim()) return displayedYearProposals;
    const q = tableSearch.toLowerCase();
    return displayedYearProposals.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.instansi.toLowerCase().includes(q) ||
        (p.catatan && p.catatan.toLowerCase().includes(q)) ||
        (p.lemariArsip && p.lemariArsip.toLowerCase().includes(q))
    );
  }, [displayedYearProposals, tableSearch]);

  // Stat Cards Data
  const statsList = [
    {
      label: selectedYear ? `Usulan Tahun ${selectedYear}` : "Total Usulan Hibah",
      value: selectedYear ? String(displayedYearProposals.length) : String(totalDokumen),
      delta: selectedYear ? `Dari ${totalDokumen} total berkas` : `${totalDokumen} berkas terdaftar`,
      sub: `${totalArsip} arsip fisik tersimpan`,
      icon: DocumentIcon,
      accent: "bg-red-500",
      iconBg: "bg-red-50 text-red-600",
    },
    {
      label: selectedYear ? `Anggaran (${selectedYear})` : "Total Dana Usulan",
      value: formatRupiah(selectedYear ? selectedYearNominal : totalNominal),
      delta: selectedYear ? `Nilai usulan tahun ${selectedYear}` : "Akumulasi seluruh usulan",
      sub: selectedYear ? formatShortRupiah(selectedYearNominal) : formatShortRupiah(totalNominal),
      icon: MoneyIcon,
      accent: "bg-emerald-500",
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Arsip Fisik (NPHD/LPJ)",
      value: `${totalArsip} Berkas`,
      delta: "Dokumen terarsip permanen",
      sub: "SK, NPHD, Berita Acara & LPJ",
      icon: FolderIcon,
      accent: "bg-amber-500",
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      label: "Lemari Terpakai",
      value: `${activeLemariCount} Lemari`,
      delta: `${activeLemariCount} lemari terisi berkas`,
      sub: "Kapasitas 5 lemari arsip",
      icon: ArchiveIcon,
      accent: "bg-blue-500",
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      label: "Instansi / Lembaga",
      value: String(uniqueInstansi),
      delta: `${uniqueInstansi} pemohon hibah`,
      sub: "Ormas, Yayasan & Lembaga",
      icon: BuildingIcon,
      accent: "bg-purple-500",
      iconBg: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Top Banner Mode Info & Quick Actions ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-6 text-white shadow-xl shadow-red-600/15">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs">
              {mode === "admin" ? "Sistem Utama" : mode === "kaban" ? "Eksekutif" : `Bidang ${bidangId}`}
            </span>
            <span className="text-xs text-red-200">• Tahun Anggaran {currentYear}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            {mode === "admin"
              ? "Sistem Pengarsipan Hibah Daerah"
              : mode === "kaban"
              ? "Monitoring Arsip Hibah Daerah — Kepala Badan"
              : `Pengarsipan Hibah Bidang ${bidangId}`}
          </h1>
          <p className="text-xs sm:text-sm text-red-100 max-w-2xl leading-relaxed">
            {mode === "admin"
              ? "Kelola dokumen, verifikasi usulan, dan kontrol penataan lemari arsip secara terintegrasi."
              : mode === "kaban"
              ? "Mode pemantauan eksekutif: rekapitulasi data usulan, alokasi anggaran, dan ketersediaan lemari arsip."
              : `${bidangInfo[bidangId].fullName}. Kelola dan arsipkan berkas hibah teknis bidang.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          {mode !== "kaban" && (
            <Link
              href={getUrl("Dokumen")}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-red-700 shadow-md transition hover:bg-red-50 active:scale-95"
            >
              <PlusIcon className="h-4 w-4 text-red-600" />
              <span>Usulan Baru</span>
            </Link>
          )}
          <Link
            href={getUrl("Dokumen")}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
          >
            <DocumentIcon className="h-4 w-4" />
            <span>Daftar Dokumen</span>
          </Link>
          <Link
            href={getUrl("Lemari")}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
          >
            <ArchiveIcon className="h-4 w-4" />
            <span>Denah Lemari</span>
          </Link>
        </div>
      </div>

      {/* ─── Action Alert Banners ─── */}
      {/* 1. Admin Verification Queue Alert */}
      {mode === "admin" && totalPendingCount > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <ClockIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                Antrian Verifikasi: {totalPendingCount} Dokumen Menunggu Persetujuan
              </p>
              <p className="text-xs text-amber-700">
                Ada usulan hibah baru dari Bidang yang perlu ditinjau sebelum diarsipkan ke lemari fisik.
              </p>
            </div>
          </div>
          <Link
            href={getUrl("Dokumen")}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 transition"
          >
            <span>Tinjau Berkas</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* 2. Bidang Returned Document Alert */}
      {mode === "bidang" && returnedCount > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <AlertIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-rose-900">
                Perhatian: {returnedCount} Dokumen Usulan Dikembalikan oleh Admin
              </p>
              <p className="text-xs text-rose-700">
                Terdapat catatan perbaikan atau kelengkapan berkas yang perlu disesuaikan sebelum disetujui.
              </p>
            </div>
          </div>
          <Link
            href={getUrl("Dokumen")}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition"
          >
            <span>Perbaiki Berkas</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* 3. Jadwal Retensi Arsip (JRA) Notice */}
      {retensiCount > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 text-blue-800 font-bold">
              i
            </span>
            <p>
              <strong className="font-semibold">Jadwal Retensi Arsip (JRA):</strong> Terdapat{" "}
              <span className="font-bold text-blue-700 underline">{retensiCount} berkas</span> yang telah
              mencapai usia retensi aktif (&ge; 5 tahun) dan memenuhi syarat penilaian arsip inaktif.
            </p>
          </div>
          <Link
            href={getUrl("Arsip")}
            className="shrink-0 font-bold text-blue-700 hover:text-blue-900 hover:underline"
          >
            Buka Arsip &rarr;
          </Link>
        </div>
      )}

      {/* ─── Active Filter Indicator (If Year Selected) ─── */}
      {selectedYear && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-zinc-100 px-4 py-2.5 text-xs text-zinc-700">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
            <span>
              Menampilkan data untuk: <strong className="font-bold text-zinc-900">Tahun {selectedYear}</strong>{" "}
              ({displayedYearProposals.length} usulan hibah, {formatRupiah(selectedYearNominal)})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedYear(null)}
            className="inline-flex items-center gap-1 font-bold text-red-600 hover:text-red-800 hover:underline"
          >
            <XIcon className="h-3.5 w-3.5" />
            <span>Hapus Filter Tahun</span>
          </button>
        </div>
      )}

      {/* ─── Executive Stats Grid ─── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statsList.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 line-clamp-1">{stat.label}</span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold tracking-tight text-zinc-900 truncate" title={stat.value}>
                  {stat.value}
                </p>
                <div className="mt-1 flex flex-col gap-0.5">
                  <span className="text-[11px] font-medium text-zinc-500 truncate">{stat.delta}</span>
                  <span className="text-[10px] text-zinc-400 font-normal truncate">{stat.sub}</span>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.accent}`} />
            </div>
          );
        })}
      </div>

      {/* ─── Distribusi per Bidang Teknis (Admin & Kaban View) ─── */}
      {mode !== "bidang" && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Distribusi Usulan per Bidang Teknis</h2>
              <p className="text-xs text-zinc-500">
                Porsi berkas dan nilai anggaran yang ditangani oleh 4 Bidang Kesbangpol
              </p>
            </div>
            <span className="text-xs font-semibold text-zinc-400">
              Total 4 Bidang: {formatRupiah(totalNominal)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {bidangBreakdown.map((item) => {
              const isSelected = filterBidangChartState === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setFilterBidangChart((prev) => (prev === item.id ? "Semua" : item.id))
                  }
                  className={`text-left rounded-xl border p-4 transition-all ${
                    isSelected
                      ? "border-red-500 bg-red-50/40 ring-2 ring-red-500/20 shadow-sm"
                      : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold text-white ${item.info.color}`}
                    >
                      {item.info.shortName}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400 font-semibold">{item.info.code}</span>
                  </div>
                  <h3 className="mt-2 text-xs font-bold text-zinc-800 line-clamp-1">{item.info.fullName}</h3>
                  <div className="mt-3 flex items-baseline justify-between">
                    <p className="text-base font-bold text-zinc-900">{formatShortRupiah(item.sumNominal)}</p>
                    <span className="text-xs font-semibold text-zinc-500">{item.proposalCount} berkas</span>
                  </div>
                  {/* Progress bar alokasi nominal */}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(item.percentNominal, 4)}%`,
                        backgroundColor: BIDANG_HEX[item.id],
                      }}
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] text-zinc-400 text-right">
                    {item.percentNominal.toFixed(1)}% dari total usulan
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Grafik Batang Rekapitulasi Tahunan (Interactive) ─── */}
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

        // 8 tahun terakhir
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
        const maxN = Math.max(...bars.map((b) => b.nominal), 1000000);
        const barColor =
          bidangChart === "Semua" ? "#e11d48" : BIDANG_HEX[bidangChart];

        return (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs w-full">
            {/* Header + Toggles */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 shadow-xs">
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
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
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
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
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
                      <button
                        key={String(b)}
                        type="button"
                        onClick={() => setFilterBidangChart(b)}
                        className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition-all ${
                          filterBidangChart === b
                            ? b === "Semua"
                              ? "bg-red-600 text-white shadow-xs"
                              : "text-white shadow-xs"
                            : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                        }`}
                        style={
                          filterBidangChart === b && b !== "Semua"
                            ? { backgroundColor: BIDANG_HEX[b as BidangId] }
                            : {}
                        }
                      >
                        {b === "Semua" ? "Semua" : `B.${b}`}
                      </button>
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
                        onClick={() => setSelectedYear((prev) => (prev === d.tahun ? null : d.tahun))}
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
                      onClick={() => setSelectedYear((prev) => (prev === d.tahun ? null : d.tahun))}
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
          </div>
        );
      })()}

      {/* ─── Tabel Dokumen Usulan Hibah Terbaru ─── */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs">
        {/* Table Header & Quick Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <FolderIcon className="h-5 w-5 text-red-500" />
            <h2 className="text-base font-semibold text-zinc-900">
              {selectedYear ? `Dokumen Usulan Tahun ${selectedYear}` : "Dokumen Usulan Hibah Terbaru"}
            </h2>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">
              {filteredTableProposals.length} data
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick search input */}
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Cari nama / instansi..."
                className="w-48 sm:w-60 rounded-xl border border-zinc-200 py-1.5 pl-8 pr-3 text-xs placeholder:text-zinc-400 focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-500/20"
              />
              {tableSearch && (
                <button
                  type="button"
                  onClick={() => setTableSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              )}
            </div>

            {selectedYear && (
              <button
                type="button"
                onClick={() => setSelectedYear(null)}
                className="text-xs font-semibold text-zinc-500 hover:text-red-600"
              >
                Tampilkan semua tahun
              </button>
            )}

            <Link
              href={getUrl("Dokumen")}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700"
            >
              Lihat semua dokumen
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/70 text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3 font-semibold">Nama Dokumen Usulan</th>
                <th className="px-5 py-3 font-semibold">Instansi / Lembaga</th>
                <th className="px-5 py-3 font-semibold whitespace-nowrap">Tujuan Bidang</th>
                <th className="px-5 py-3 font-semibold whitespace-nowrap">Nominal Usulan</th>
                <th className="px-5 py-3 font-semibold whitespace-nowrap">Lokasi Fisik Arsip</th>
                <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredTableProposals.slice(0, 8).map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-zinc-50/70">
                  <td className="px-5 py-4 font-medium">
                    <p className="text-zinc-900 font-semibold">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-zinc-400 font-mono">Thn {p.tahun || p.tanggal?.slice(0, 4)}</span>
                      {p.catatan && (
                        <span className="text-[11px] text-zinc-500 line-clamp-1 italic">
                          • {p.catatan}
                        </span>
                      )}
                    </div>
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
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors shadow-2xs whitespace-nowrap shrink-0"
                        title="Lihat Detail Dokumen"
                      >
                        <EyeIcon className="h-3.5 w-3.5" />
                        <span>Detail</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTableProposals.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-xs text-zinc-400">
                    {tableSearch ? (
                      <div className="space-y-1">
                        <p className="font-semibold text-zinc-600">Tidak ada dokumen yang cocok dengan pencarian &quot;{tableSearch}&quot;</p>
                        <button
                          type="button"
                          onClick={() => setTableSearch("")}
                          className="font-bold text-red-600 hover:underline"
                        >
                          Hapus kata kunci pencarian
                        </button>
                      </div>
                    ) : selectedYear ? (
                      <div className="space-y-1">
                        <p className="font-semibold text-zinc-600">Tidak ada usulan hibah yang terdaftar pada Tahun {selectedYear}</p>
                        <button
                          type="button"
                          onClick={() => setSelectedYear(null)}
                          className="font-bold text-red-600 hover:underline"
                        >
                          Tampilkan semua tahun
                        </button>
                      </div>
                    ) : (
                      "Belum ada data usulan hibah terdaftar. Silakan tambahkan usulan baru melalui menu Daftar Dokumen."
                    )}
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
