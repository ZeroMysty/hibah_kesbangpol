"use client";

import { useState, useMemo } from "react";
import { useMode, bidangInfo, BidangId } from "@/context/mode-context";
import { useHibah } from "@/context/hibah-context";
import { useReview } from "@/context/review-context";
import {
  ArchiveIcon,
  BuildingIcon,
  DocumentIcon,
  FolderIcon,
  MoneyIcon,
} from "@/components/icons";
import type { StatCardProps } from "@/components/stat-card";
import { formatRupiah, formatShortRupiah } from "@/lib/utils";
import {
  DashboardBanner,
  DashboardAlerts,
  DashboardStats,
  BidangDistribution,
  AnnualRecapChart,
  RecentProposalsTable,
} from "@/components/dashboard";

export default function DashboardPage() {
  const { mode, bidangId, getUrl } = useMode();
  const { proposals, arsipList } = useHibah();
  const { totalPendingCount, myReturned } = useReview();

  // Filter & Search states
  const [filterBidangChartState, setFilterBidangChart] = useState<BidangId | "Semua">("Semua");
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

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

  // Perhitungan Data & Metrik
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
    ].filter((val): val is string => Boolean(val && val.trim() !== ""));
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

  // Stat Cards Data
  const statsList: StatCardProps[] = [
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
      <DashboardBanner
        mode={mode}
        bidangId={bidangId}
        currentYear={currentYear}
        getUrl={getUrl}
      />

      {/* ─── Action Alert Banners ─── */}
      <DashboardAlerts
        mode={mode}
        totalPendingCount={totalPendingCount}
        returnedCount={returnedCount}
        retensiCount={retensiCount}
        selectedYear={selectedYear}
        selectedYearCount={displayedYearProposals.length}
        selectedYearNominal={selectedYearNominal}
        onClearYear={() => setSelectedYear(null)}
        getUrl={getUrl}
      />

      {/* ─── Executive Stats Grid ─── */}
      <DashboardStats stats={statsList} />

      {/* ─── Distribusi per Bidang Teknis (Admin & Kaban View) ─── */}
      {mode !== "bidang" && (
        <BidangDistribution
          breakdown={bidangBreakdown}
          totalNominal={totalNominal}
          selectedBidang={filterBidangChartState}
          onToggleBidang={(id) =>
            setFilterBidangChart((prev) => (prev === id ? "Semua" : id))
          }
        />
      )}

      {/* ─── Grafik Batang Rekapitulasi Tahunan (Interactive) ─── */}
      <AnnualRecapChart
        displayedProposals={displayedProposals}
        mode={mode}
        bidangId={bidangId}
        currentYear={currentYear}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        filterBidangChartState={filterBidangChartState}
        onFilterBidangChartChange={setFilterBidangChart}
      />

      {/* ─── Tabel Dokumen Usulan Hibah Terbaru ─── */}
      <RecentProposalsTable
        proposals={displayedYearProposals}
        selectedYear={selectedYear}
        onClearYear={() => setSelectedYear(null)}
        getUrl={getUrl}
      />
    </div>
  );
}
