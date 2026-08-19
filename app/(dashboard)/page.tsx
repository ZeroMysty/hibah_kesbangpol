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
  FileCheckIcon,
  FolderIcon,
  MoneyIcon,
  PlusIcon,
  TrendDownIcon,
  TrendUpIcon,
} from "@/components/icons";
import CurrentDate from "@/components/current-date";
import StatusBadge from "@/components/status-badge";

// ---------- Mock Data ----------

const adminStats = [
  {
    label: "Total Proposal",
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
    label: "Menunggu Verifikasi",
    value: "37",
    delta: "-4,1%",
    up: false,
    icon: ClockIcon,
    accent: "bg-amber-500",
    iconBg: "bg-amber-50 text-amber-600",
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
  { label: "Selesai", value: 75, color: "#dc2626" },
  { label: "Menunggu", value: 25, color: "#f59e0b" },
];

interface ProposalData {
  id: number;
  name: string;
  instansi: string;
  bidangId: BidangId;
  nominal: string;
  tanggal: string;
  status: string;
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
    status: "Selesai",
    catatanBidang: "Dokumen NPHD lengkap dan diverifikasi Bidang 1",
  },
  {
    id: 102,
    name: "Kemah Wawasan Kebangsaan & Bela Negara Pramuka",
    instansi: "Kwartir Cabang Gerakan Pramuka",
    bidangId: 1,
    nominal: "Rp 85.000.000",
    tanggal: "08 Agu 2026",
    status: "Menunggu",
    catatanBidang: "Menunggu verifikasi lapangan tim evaluasi Bidang 1",
  },
  {
    id: 103,
    name: "Sosialisasi & Pemantapan Nilai Pancasila Pelajar",
    instansi: "SMPN 4 Kota",
    bidangId: 1,
    nominal: "Rp 45.000.000",
    tanggal: "29 Jul 2026",
    status: "Menunggu",
    catatanBidang: "Persyaratan berkas sedang dalam proses verifikasi administrasi",
  },
  {
    id: 104,
    name: "Dialog Kebangsaan Mahasiswa & Generasi Muda",
    instansi: "Universitas Negeri",
    bidangId: 1,
    nominal: "Rp 60.000.000",
    tanggal: "27 Jul 2026",
    status: "Menunggu",
    catatanBidang: "Verifikasi berkas administrasi dan RAB Bidang 1",
  },

  // Bidang 2
  {
    id: 201,
    name: "Revitalisasi Sanggar Budaya & Karang Taruna Kota",
    instansi: "Dinas Kebudayaan & Karang Taruna",
    bidangId: 2,
    nominal: "Rp 250.000.000",
    tanggal: "05 Agu 2026",
    status: "Selesai",
    catatanBidang: "Dokumen NPHD lengkap dan diverifikasi Bidang 2",
  },
  {
    id: 202,
    name: "Pemberdayaan Karang Taruna Berbasis Kelurahan",
    instansi: "Pengurus Karang Taruna Kota",
    bidangId: 2,
    nominal: "Rp 95.000.000",
    tanggal: "03 Agu 2026",
    status: "Menunggu",
    catatanBidang: "Menunggu kelengkapan SK Kepengurusan terbaru",
  },
  {
    id: 203,
    name: "Pekan Olahraga Pemuda & Pelajar Antar Kecamatan",
    instansi: "KONI / KNPI Kota",
    bidangId: 2,
    nominal: "Rp 180.000.000",
    tanggal: "20 Jul 2026",
    status: "Menunggu",
    catatanBidang: "Dalam proses evaluasi proposal teknis Bidang 2",
  },
  {
    id: 204,
    name: "Festival Kebudayaan & Seni Tradisional Pasundan",
    instansi: "Paguyuban Pasundan",
    bidangId: 2,
    nominal: "Rp 200.000.000",
    tanggal: "03 Jul 2026",
    status: "Selesai",
    catatanBidang: "LPJ dan NPHD telah disahkan",
  },

  // Bidang 3
  {
    id: 301,
    name: "Penguatan Kapasitas Kerukunan Umat Beragama (FKUB)",
    instansi: "FKUB Kota",
    bidangId: 3,
    nominal: "Rp 85.000.000",
    tanggal: "04 Agu 2026",
    status: "Menunggu",
    catatanBidang: "Menunggu verifikasi lapangan tim evaluasi Bidang 3",
  },
  {
    id: 302,
    name: "Festival Kerukunan Lintas Agama & Dialog Toleransi",
    instansi: "Panitia Bersama FKUB",
    bidangId: 3,
    nominal: "Rp 120.000.000",
    tanggal: "01 Agu 2026",
    status: "Selesai",
    catatanBidang: "LPJ 2025 telah terverifikasi di Arsip Bidang 3",
  },
  {
    id: 303,
    name: "Safari Dakwah & Pembinaan Rohani Kemasyarakatan",
    instansi: "MUI Kota",
    bidangId: 3,
    nominal: "Rp 95.000.000",
    tanggal: "15 Jul 2026",
    status: "Selesai",
    catatanBidang: "Telah diverifikasi dan disahkan Kepala Bakesbangpol",
  },
  {
    id: 304,
    name: "Bantuan Sarana Forum Komunikasi Antar Gereja",
    instansi: "Badan Musyawarah Antar Gereja (BAMAG)",
    bidangId: 3,
    nominal: "Rp 110.000.000",
    tanggal: "08 Jul 2026",
    status: "Menunggu",
    catatanBidang: "Evaluasi administrasi kelayakan penerima hibah",
  },

  // Bidang 4
  {
    id: 401,
    name: "Pelatihan Deteksi Dini & Early Warning System (FKDM)",
    instansi: "Forum Kewaspadaan Dini Masyarakat",
    bidangId: 4,
    nominal: "Rp 95.000.000",
    tanggal: "07 Agu 2026",
    status: "Selesai",
    catatanBidang: "NPHD telah ditandatangani secara elektronik",
  },
  {
    id: 402,
    name: "Penyuluhan Pencegahan Narkoba & Ketahanan Wilayah",
    instansi: "BNNK / Relawan Wasnas",
    bidangId: 4,
    nominal: "Rp 75.000.000",
    tanggal: "24 Jul 2026",
    status: "Selesai",
    catatanBidang: "Dokumen laporan kegiatan lengkap",
  },
  {
    id: 403,
    name: "Sosialisasi Pencegahan Ekstremisme & Radikalisme",
    instansi: "Komunitas Kewaspadaan Generasi",
    bidangId: 4,
    nominal: "Rp 65.000.000",
    tanggal: "19 Jul 2026",
    status: "Menunggu",
    catatanBidang: "Menunggu berkas rekomendasi teknis",
  },
  {
    id: 404,
    name: "Simulasi Mediasi & Penanganan Potensi Konflik Sosial",
    instansi: "Lembaga Advokasi Damai",
    bidangId: 4,
    nominal: "Rp 80.000.000",
    tanggal: "05 Jul 2026",
    status: "Selesai",
    catatanBidang: "Verifikasi teknis selesai",
  },
];

export default function DashboardPage() {
  const { mode, bidangId, currentUser, getUrl } = useMode();

  const maxValue = Math.max(...monthlyData.map((d) => d.value));
  const circumference = 2 * Math.PI * 52;

  // Filter proposals for current Bidang
  const bidangProposals = allProposals.filter((p) => p.bidangId === bidangId);

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Beranda
          </h1>
          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700 uppercase">
            Mode {mode}
          </span>
        </div>
        <CurrentDate />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={getUrl("Laporan")}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50"
        >
          <DownloadIcon className="h-4 w-4" />
          Unduh Laporan Daerah
        </Link>
        <Link
          href={getUrl("Hibah")}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-500"
        >
          <PlusIcon className="h-4 w-4" />
          Tambah Proposal
        </Link>
      </div>
    </div>

      {/* ==================== MODE 1 & 2: ADMIN & BIDANG VIEW ==================== */}
      {(mode === "admin" || mode === "bidang") && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {adminStats.map((stat) => {
              const Icon = stat.icon;
              const DeltaIcon = stat.up ? TrendUpIcon : TrendDownIcon;
              return (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className={`absolute inset-x-0 top-0 h-0.5 ${stat.accent} opacity-80`} />
                  <div className="flex items-start justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        stat.up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      <DeltaIcon className="h-3 w-3" />
                      {stat.delta}
                    </span>
                  </div>
                  <p className="mt-4 text-2xl font-bold tracking-tight">{stat.value}</p>
                  <p className="mt-0.5 text-sm text-zinc-500">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">Dana Tersalurkan Keseluruhan</h2>
                  <p className="text-sm text-zinc-500">Realisasi per bulan (dalam juta rupiah)</p>
                </div>
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                  Tahun 2026
                </span>
              </div>
              <div className="flex h-56 items-end gap-3 sm:gap-5">
                {monthlyData.map((d) => (
                  <div key={d.month} className="group flex h-full flex-1 flex-col items-center gap-2">
                    <span className="text-[11px] font-semibold text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100">
                      {d.value}
                    </span>
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-red-600 to-rose-400 transition-all duration-300 group-hover:from-red-500 group-hover:to-rose-300"
                        style={{ height: `${(d.value / maxValue) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-zinc-500">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold">Status Proposal Daerah</h2>
              <p className="text-sm text-zinc-500">Distribusi seluruh instansi</p>
              <div className="relative mx-auto mt-6 h-44 w-44">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" strokeWidth="14" className="stroke-zinc-100" />
                  {donutSegments.map((seg, i) => {
                    const dash = (seg.value / 100) * circumference;
                    const prevOffset = donutSegments
                      .slice(0, i)
                      .reduce((acc, s) => acc + (s.value / 100) * circumference, 0);
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
                  <p className="text-xs text-zinc-500">Total Proposal</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {donutSegments.map((seg) => (
                  <li key={seg.label} className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                    <span className="flex-1 text-sm text-zinc-600">{seg.label}</span>
                    <span className="text-sm font-semibold">{seg.value}%</span>
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
              Proposal Terbaru
            </h2>
          </div>
          <Link
            href={getUrl("Hibah")}
            className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-500"
          >
            Lihat semua
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3 font-semibold">Nama Hibah</th>
                <th className="px-5 py-3 font-semibold">Instansi / Pemohon</th>
                <th className="px-5 py-3 font-semibold">Tujuan Bidang</th>
                <th className="px-5 py-3 font-semibold">Nominal</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Aksi</th>
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
                        Catatan: {p.catatanBidang}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-zinc-600">{p.instansi}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${
                        bidangInfo[p.bidangId].color
                      }`}
                    >
                      Bidang {p.bidangId}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold tabular-nums text-zinc-900">{p.nominal}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      {mode === "bidang" && (
                        <button
                          onClick={() => alert(`Memproses Verifikasi Teknis Bidang ${p.bidangId} untuk: ${p.name}`)}
                          className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-500"
                        >
                          Verifikasi
                        </button>
                      )}
                      {mode === "admin" && (
                        <button
                          onClick={() => alert(`Detail persetujuan admin untuk: ${p.name}`)}
                          className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                        >
                          Detail
                        </button>
                      )}
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
