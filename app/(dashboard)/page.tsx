"use client";

import Link from "next/link";
import { useState } from "react";
import { useMode, bidangInfo, BidangId } from "@/context/mode-context";
import {
  ArchiveIcon,
  BuildingIcon,
  ChartIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  DocumentIcon,
  DownloadIcon,
  EyeIcon,
  FileCheckIcon,
  FolderIcon,
  MoneyIcon,
  PlusIcon,
  TrendDownIcon,
  TrendUpIcon,
} from "@/components/icons";
import CurrentDate from "@/components/current-date";
import StatusBadge, { RetentionBadge, LokasiArsipBadge } from "@/components/status-badge";

// ---------- Mock Data ----------

const adminStats = [
  {
    label: "Total Dokumen Hibah",
    value: "1.248",
    delta: "+12,5%",
    up: true,
    icon: DocumentIcon,
    accent: "bg-red-500",
    iconBg: "bg-red-50 text-red-600",
  },
  {
    label: "Dana Tersalurkan",
    value: "Rp 4,2 M",
    delta: "+8,2%",
    up: true,
    icon: MoneyIcon,
    accent: "bg-emerald-500",
    iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Lemari Arsip Aktif",
    value: "5 Lemari",
    delta: "100% Terisi",
    up: true,
    icon: ArchiveIcon,
    accent: "bg-blue-500",
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    label: "Instansi Penerima",
    value: "86",
    delta: "+2,3%",
    up: true,
    icon: BuildingIcon,
    accent: "bg-rose-500",
    iconBg: "bg-rose-50 text-rose-600",
  },
];

const monthlyData = [
  { month: "Jan", value: 420 },
  { month: "Feb", value: 380 },
  { month: "Mar", value: 510 },
  { month: "Apr", value: 460 },
  { month: "Mei", value: 620 },
  { month: "Jun", value: 540 },
  { month: "Jul", value: 720 },
];

const donutSegments = [
  { label: "Lemari Arsip 01", value: 30, color: "#3b82f6" },
  { label: "Lemari Arsip 02", value: 25, color: "#e11d48" },
  { label: "Lemari Arsip 03", value: 25, color: "#f59e0b" },
  { label: "Lemari Arsip 04", value: 15, color: "#9333ea" },
  { label: "Lemari Khusus", value: 5, color: "#0d9488" },
];

interface ProposalData {
  id: number;
  name: string;
  instansi: string;
  bidangId: BidangId;
  nominal: string;
  tanggal: string;
  tahun: string;
  lemariArsip: string;
  rakArsip?: string;
  nomorArsip?: string;
  catatanBidang?: string;
}

const allProposals: ProposalData[] = [
  // Bidang 1
  {
    id: 101,
    name: "Pendidikan & Pelatihan Intensif Paskibraka Kota 2026",
    instansi: "Paskibraka Kota (PPI)",
    bidangId: 1,
    nominal: "Rp 150.000.000",
    tanggal: "10 Agu 2026",
    tahun: "2026",
    lemariArsip: "Lemari Arsip 01",
    rakArsip: "Rak 01",
    nomorArsip: "No. 01",
    catatanBidang: "Dokumen NPHD lengkap dan terarsip di Lemari 01",
  },
  {
    id: 102,
    name: "Kemah Wawasan Kebangsaan & Bela Negara Pramuka",
    instansi: "Kwartir Cabang Gerakan Pramuka",
    bidangId: 1,
    nominal: "Rp 85.000.000",
    tanggal: "08 Agu 2026",
    tahun: "2026",
    lemariArsip: "Lemari Arsip 01",
    rakArsip: "Rak 01",
    nomorArsip: "No. 02",
    catatanBidang: "Berkas tersimpan di Lemari Arsip 01 Bidang 1",
  },
  {
    id: 103,
    name: "Sosialisasi & Pemantapan Nilai Pancasila Pelajar",
    instansi: "SMPN 4 Kota",
    bidangId: 1,
    nominal: "Rp 45.000.000",
    tanggal: "29 Jul 2026",
    tahun: "2026",
    lemariArsip: "Lemari Arsip 01",
    rakArsip: "Rak 02",
    nomorArsip: "No. 03",
    catatanBidang: "Tersimpan di Lemari Arsip 01",
  },

  // Bidang 2
  {
    id: 201,
    name: "Revitalisasi Sanggar Budaya & Karang Taruna Kota",
    instansi: "Dinas Kebudayaan & Karang Taruna",
    bidangId: 2,
    nominal: "Rp 250.000.000",
    tanggal: "05 Agu 2026",
    tahun: "2026",
    lemariArsip: "Lemari Arsip 02",
    rakArsip: "Rak 01",
    nomorArsip: "No. 01",
    catatanBidang: "Dokumen NPHD lengkap di Lemari Arsip 02",
  },
  {
    id: 202,
    name: "Pemberdayaan Karang Taruna Berbasis Kelurahan",
    instansi: "Pengurus Karang Taruna Kota",
    bidangId: 2,
    nominal: "Rp 95.000.000",
    tanggal: "03 Agu 2026",
    tahun: "2026",
    lemariArsip: "Lemari Arsip 02",
    rakArsip: "Rak 01",
    nomorArsip: "No. 02",
    catatanBidang: "Tersimpan di Lemari Arsip 02",
  },

  // Bidang 3
  {
    id: 301,
    name: "Penguatan Kapasitas Kerukunan Umat Beragama (FKUB)",
    instansi: "FKUB Kota",
    bidangId: 3,
    nominal: "Rp 85.000.000",
    tanggal: "04 Agu 2026",
    tahun: "2026",
    lemariArsip: "Lemari Arsip 03",
    rakArsip: "Rak 01",
    nomorArsip: "No. 01",
    catatanBidang: "Tersimpan di Lemari Arsip 03",
  },
  {
    id: 302,
    name: "Festival Kerukunan Lintas Agama & Dialog Toleransi",
    instansi: "Panitia Bersama FKUB",
    bidangId: 3,
    nominal: "Rp 120.000.000",
    tanggal: "01 Agu 2026",
    tahun: "2026",
    lemariArsip: "Lemari Arsip 03",
    rakArsip: "Rak 01",
    nomorArsip: "No. 02",
    catatanBidang: "NPHD tersimpan di Lemari Arsip 03",
  },

  // Bidang 4
  {
    id: 401,
    name: "Pelatihan Deteksi Dini & Early Warning System (FKDM)",
    instansi: "Forum Kewaspadaan Dini Masyarakat",
    bidangId: 4,
    nominal: "Rp 95.000.000",
    tanggal: "07 Agu 2026",
    tahun: "2026",
    lemariArsip: "Lemari Arsip 04",
    rakArsip: "Rak 01",
    nomorArsip: "No. 01",
    catatanBidang: "Tersimpan di Lemari Arsip 04",
  },
];

export default function DashboardPage() {
  const { mode, bidangId, getUrl } = useMode();

  // Mode Bidang Filter
  const bidangProposals = allProposals.filter((p) => p.bidangId === bidangId);

  const maxValue = Math.max(...monthlyData.map((d) => d.value));
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
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        stat.up ? "text-emerald-600" : "text-zinc-500"
                      }`}
                    >
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

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">
                    Volume Dokumen Terarsip (Bulanan)
                  </h2>
                  <p className="text-sm text-zinc-500">Tahun Anggaran 2026</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <TrendUpIcon className="h-4 w-4" />
                  <span>+18.4%</span>
                </div>
              </div>
              <div className="flex h-56 items-end gap-3 sm:gap-5">
                {monthlyData.map((d) => (
                  <div
                    key={d.month}
                    className="group flex h-full flex-1 flex-col items-center gap-2"
                  >
                    <span className="text-[11px] font-semibold text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100">
                      {d.value}
                    </span>
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-red-600 to-rose-400 transition-all duration-300 group-hover:from-red-500 group-hover:to-rose-300"
                        style={{ height: `${(d.value / maxValue) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-zinc-500">
                      {d.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut Chart: Lemari Arsip Distribution */}
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
                  <p className="text-2xl font-bold">1.248</p>
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
                      {seg.value}%
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
              <tr className="border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3 font-semibold">Nama Dokumen Hibah</th>
                <th className="px-5 py-3 font-semibold">Instansi / Pemohon</th>
                <th className="px-5 py-3 font-semibold whitespace-nowrap">Tujuan Bidang</th>
                <th className="px-5 py-3 font-semibold whitespace-nowrap">Nominal</th>
                <th className="px-5 py-3 font-semibold whitespace-nowrap">Lokasi Fisik Arsip</th>
                <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(mode === "bidang" ? bidangProposals : allProposals).map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-zinc-50 transition-colors last:border-0 hover:bg-zinc-50/70"
                >
                  <td className="px-5 py-4 font-medium">
                    <p className="text-zinc-900 font-semibold">{p.name}</p>
                    {p.catatanBidang && (
                      <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1 italic">
                        {p.catatanBidang}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-zinc-600">{p.instansi}</td>
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
                    {p.nominal}
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
