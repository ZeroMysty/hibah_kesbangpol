"use client";

import Link from "next/link";
import { useMode, bidangInfo, BidangId } from "@/context/mode-context";
import { useHibah, LEMARI_OPTIONS } from "@/context/hibah-context";
import {
  ArchiveIcon,
  BuildingIcon,
  ChevronRightIcon,
  DocumentIcon,
  EyeIcon,
  FolderIcon,
  MoneyIcon,
  PlusIcon,
  TrendUpIcon,
} from "@/components/icons";
import { LokasiArsipBadge } from "@/components/status-badge";

const formatRupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

export default function DashboardPage() {
  const { mode, bidangId, getUrl } = useMode();
  const { proposals, arsipList } = useHibah();

  // Mode Bidang Filter
  const bidangProposals = proposals.filter((p) => p.bidangId === bidangId);
  const displayedProposals = mode === "bidang" ? bidangProposals : proposals;

  const totalNominal = proposals.reduce((acc, p) => acc + (p.nominal || 0), 0);
  const totalDokumen = proposals.length + arsipList.length;
  const uniqueInstansi = new Set([...proposals.map((p) => p.instansi), ...arsipList.map((a) => a.instansi)]).size;
  const activeLemariCount = new Set([...proposals.map((p) => p.lemariArsip), ...arsipList.map((a) => a.lemariArsip)]).size;

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

  // Lemari Distribution
  const lemariColors: Record<string, string> = {
    "Lemari Arsip 01": "#3b82f6",
    "Lemari Arsip 02": "#e11d48",
    "Lemari Arsip 03": "#f59e0b",
    "Lemari Arsip 04": "#9333ea",
    "Lemari Arsip Khusus": "#0d9488",
  };

  const donutSegments = LEMARI_OPTIONS.map((opt) => {
    const count = proposals.filter((p) => p.lemariArsip === opt.id).length + arsipList.filter((a) => a.lemariArsip === opt.id).length;
    const percentage = totalDokumen > 0 ? Math.round((count / totalDokumen) * 100) : 0;
    return {
      label: opt.label,
      value: percentage,
      count,
      color: lemariColors[opt.id] || "#71717a",
    };
  });

  const circumference = 2 * Math.PI * 52; // r=52

  return (
    <div className="space-y-6">
      {/* Top Banner Mode Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-6 text-white shadow-xl shadow-red-600/15">
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            {mode === "admin"
              ? "Sistem Pengarsipan Hibah Daerah"
              : `Pengarsipan Hibah Bidang ${bidangId}`}
          </h1>
          <p className="text-xs sm:text-sm text-red-100 max-w-2xl leading-relaxed">
            {mode === "admin"
              ? "Kelola dokumen dan arsip hibah daerah secara terstruktur dan terintegrasi."
              : `${bidangInfo[bidangId].fullName}. Kelola dan arsipkan berkas hibah.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <Link
            href={getUrl("Hibah")}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-red-700 shadow-md transition hover:bg-red-50 active:scale-95"
          >
            <PlusIcon className="h-4 w-4 text-red-600" />
            <span>Kelola Lemari Arsip</span>
          </Link>
          <Link
            href={getUrl("Arsip")}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
          >
            <ArchiveIcon className="h-4 w-4" />
            <span>Semua Berkas Arsip</span>
          </Link>
        </div>
      </div>

      {/* Mode Admin Overview */}
      {mode === "admin" && (
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

          {/* Donut Chart: Lemari Arsip Distribution */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-semibold">Ringkasan Sistem Pengarsipan</h2>
                <p className="text-sm text-zinc-500">Kapasitas dan alur penyimpanan arsip hibah Kesbangpol</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                {([1, 2, 3, 4] as BidangId[]).map((id) => {
                  const count = proposals.filter((p) => p.bidangId === id).length + arsipList.filter((a) => a.bidangId === id).length;
                  return (
                    <div key={id} className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${bidangInfo[id].color}`} />
                        <p className="text-xs font-bold text-zinc-800">Bidang {id}</p>
                      </div>
                      <p className="text-xl font-black text-zinc-900">{count}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Berkas Terarsip</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-100 pt-3">
                <span>Penyimpanan Berkas Fisik: Lemari 01 s/d 04 & Khusus</span>
                <span className="font-semibold text-zinc-700">Tahun Anggaran 2026</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold">Distribusi Lemari Arsip</h2>
              <p className="text-sm text-zinc-500">Klasifikasi tempat penyimpanan</p>
              <div className="relative mx-auto mt-6 h-44 w-44">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    strokeWidth="14"
                    className="stroke-zinc-100"
                  />
                  {donutSegments.map((seg, i) => {
                    const dash = (seg.value / 100) * circumference;
                    const prevOffset = donutSegments
                      .slice(0, i)
                      .reduce(
                        (acc, s) => acc + (s.value / 100) * circumference,
                        0
                      );
                    return (
                      <circle
                        key={seg.label}
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        strokeWidth="14"
                        stroke={seg.color}
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        strokeDashoffset={-prevOffset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold">{totalDokumen}</p>
                  <p className="text-xs text-zinc-500">Total Berkas</p>
                </div>
              </div>
              <ul className="mt-6 space-y-2">
                {donutSegments.map((seg) => (
                  <li
                    key={seg.label}
                    className="flex items-center justify-between text-xs text-zinc-600"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: seg.color }}
                      />
                      <span>{seg.label}</span>
                    </div>
                    <span className="font-semibold text-zinc-900">
                      {seg.count} berkas ({seg.value}%)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <FolderIcon className="h-5 w-5 text-red-500" />
            <h2 className="text-base font-semibold">
              Dokumen Terarsip Terbaru
            </h2>
          </div>
          <Link
            href={getUrl("Hibah")}
            className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-500"
          >
            Lihat semua lemari
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
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
              {displayedProposals.slice(0, 8).map((p) => (
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
                        href={getUrl("Hibah")}
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
              {displayedProposals.length === 0 && (
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
