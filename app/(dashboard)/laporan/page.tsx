"use client";

import { useState } from "react";
import StatusBadge from "../../../components/status-badge";
import { useMode } from "../../../context/mode-context";
import {
  ChartIcon,
  CheckIcon,
  ClockIcon,
  DocumentIcon,
  DownloadIcon,
  EyeIcon,
  MoneyIcon,
  PlusIcon,
  PrinterIcon,
  TrendUpIcon,
  UploadIcon,
  XIcon,
} from "../../../components/icons";

const summary = [
  {
    label: "Total Realisasi",
    value: "Rp 4,2 M",
    sub: "dari 1.248 proposal",
    icon: MoneyIcon,
    iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Target Tahunan",
    value: "Rp 6,5 M",
    sub: "anggaran hibah 2026",
    icon: ChartIcon,
    iconBg: "bg-red-50 text-red-600",
  },
  {
    label: "Persentase Capaian",
    value: "64,6%",
    sub: "+8,2% dari bulan lalu",
    icon: TrendUpIcon,
    iconBg: "bg-rose-50 text-rose-600",
  },
  {
    label: "Laporan Tersedia",
    value: "12",
    sub: "laporan bulan & tahunan",
    icon: DocumentIcon,
    iconBg: "bg-amber-50 text-amber-600",
  },
];

interface ReportItem {
  id: string;
  name: string;
  periode: string;
  size: string;
  status: "Final" | "Verifikasi" | "Draft";
  type: "PDF" | "XLSX" | "DOCX";
  nomorSurat: string;
  tanggalDisahkan: string;
  penandatangan: string;
  ringkasan: string;
  bidangDetails: { bidang: string; totalHibah: string; realisasi: string; persentase: string }[];
  fileName?: string;
  fileDataUrl?: string;
}

const initialReports: ReportItem[] = [
  {
    id: "rep-1",
    name: "Laporan Realisasi Dana Hibah Daerah Kota",
    periode: "Juli 2026",
    size: "1,2 MB",
    status: "Final",
    type: "PDF",
    nomorSurat: "900.1.1/Lap-07/Bakesbangpol/2026",
    tanggalDisahkan: "05 Agustus 2026",
    penandatangan: "Drs. H. Bambang Sukmana, M.Si (Kepala Badan)",
    ringkasan: "Realisasi pencairan dana hibah semester II mencakup 18 ormas dan lembaga kemasyarakatan pada 4 bidang prioritas daerah.",
    bidangDetails: [
      { bidang: "Bidang 1 (Ideologi & Wasbang)", totalHibah: "Rp 850.000.000", realisasi: "Rp 620.000.000", persentase: "72.9%" },
      { bidang: "Bidang 2 (Politik & Ormas)", totalHibah: "Rp 1.450.000.000", realisasi: "Rp 1.100.000.000", persentase: "75.8%" },
      { bidang: "Bidang 3 (Ketahanan Sosbud & Agama)", totalHibah: "Rp 1.200.000.000", realisasi: "Rp 780.000.000", persentase: "65.0%" },
      { bidang: "Bidang 4 (Kewaspadaan Nasional)", totalHibah: "Rp 700.000.000", realisasi: "Rp 450.000.000", persentase: "64.2%" },
    ],
  },
  {
    id: "rep-2",
    name: "Laporan Kinerja Akuntabilitas Triwulan II (LAKIP)",
    periode: "Apr – Jun 2026",
    size: "860 KB",
    status: "Final",
    type: "PDF",
    nomorSurat: "050/Lap-TW2/Kesbang/2026",
    tanggalDisahkan: "10 Juli 2026",
    penandatangan: "Sekretaris Bakesbangpol Kota",
    ringkasan: "Evaluasi capaian indikator kinerja utama terkait pembinaan ormas, penguatan kerukunan umat beragama, dan deteksi dini kerawanan pemilu.",
    bidangDetails: [
      { bidang: "Bidang 1 (Ideologi & Wasbang)", totalHibah: "Rp 600.000.000", realisasi: "Rp 550.000.000", persentase: "91.6%" },
      { bidang: "Bidang 2 (Politik & Ormas)", totalHibah: "Rp 980.000.000", realisasi: "Rp 890.000.000", persentase: "90.8%" },
      { bidang: "Bidang 3 (Ketahanan Sosbud & Agama)", totalHibah: "Rp 850.000.000", realisasi: "Rp 720.000.000", persentase: "84.7%" },
      { bidang: "Bidang 4 (Kewaspadaan Nasional)", totalHibah: "Rp 500.000.000", realisasi: "Rp 420.000.000", persentase: "84.0%" },
    ],
  },
  {
    id: "rep-3",
    name: "Ringkasan Anggaran & Buku Kas Hibah Bulanan",
    periode: "Juni 2026",
    size: "540 KB",
    status: "Final",
    type: "XLSX",
    nomorSurat: "900/BKU-06/Bendahara/2026",
    tanggalDisahkan: "02 Juli 2026",
    penandatangan: "Bendahara Pengeluaran Pembantu Hibah",
    ringkasan: "Rekapitulasi bukti transfer bank, SP2D, dan verifikasi pajak PPN/PPh pasal 21/23 atas belanja hibah ormas.",
    bidangDetails: [
      { bidang: "Bidang 1 (Ideologi & Wasbang)", totalHibah: "Rp 450.000.000", realisasi: "Rp 450.000.000", persentase: "100%" },
      { bidang: "Bidang 2 (Politik & Ormas)", totalHibah: "Rp 720.000.000", realisasi: "Rp 720.000.000", persentase: "100%" },
      { bidang: "Bidang 3 (Ketahanan Sosbud & Agama)", totalHibah: "Rp 610.000.000", realisasi: "Rp 590.000.000", persentase: "96.7%" },
      { bidang: "Bidang 4 (Kewaspadaan Nasional)", totalHibah: "Rp 380.000.000", realisasi: "Rp 380.000.000", persentase: "100%" },
    ],
  },
  {
    id: "rep-4",
    name: "Draft Laporan Monitoring & Evaluasi Triwulan III",
    periode: "Jul – Sep 2026",
    size: "1,1 MB",
    status: "Verifikasi",
    type: "PDF",
    nomorSurat: "050/Monev-TW3-Draft/2026",
    tanggalDisahkan: "Proses Verifikasi Tim Evaluasi",
    penandatangan: "Tim Verifikasi & Monev Bakesbangpol",
    ringkasan: "Progres pelaksanaan lapangan kegiatan FKUB, Karang Taruna, dan Paskibraka PPI beserta dokumentasi SPJ sementara.",
    bidangDetails: [
      { bidang: "Bidang 1 (Ideologi & Wasbang)", totalHibah: "Rp 900.000.000", realisasi: "Rp 420.000.000", persentase: "46.6%" },
      { bidang: "Bidang 2 (Politik & Ormas)", totalHibah: "Rp 1.600.000.000", realisasi: "Rp 850.000.000", persentase: "53.1%" },
      { bidang: "Bidang 3 (Ketahanan Sosbud & Agama)", totalHibah: "Rp 1.350.000.000", realisasi: "Rp 610.000.000", persentase: "45.1%" },
      { bidang: "Bidang 4 (Kewaspadaan Nasional)", totalHibah: "Rp 800.000.000", realisasi: "Rp 320.000.000", persentase: "40.0%" },
    ],
  },
  {
    id: "rep-5",
    name: "Laporan Pertanggungjawaban Tahunan Bakesbangpol 2025",
    periode: "Tahunan 2025",
    size: "3,4 MB",
    status: "Final",
    type: "PDF",
    nomorSurat: "900.1.1/LPJ-Tahunan/2025/BKP",
    tanggalDisahkan: "15 Januari 2026",
    penandatangan: "Kepala Badan Kesatuan Bangsa dan Politik",
    ringkasan: "Laporan komprehensif pertanggungjawaban hibah tahun anggaran 2025 dengan opini Wajar Tanpa Pengecualian (WTP).",
    bidangDetails: [
      { bidang: "Bidang 1 (Ideologi & Wasbang)", totalHibah: "Rp 2.100.000.000", realisasi: "Rp 2.085.000.000", persentase: "99.2%" },
      { bidang: "Bidang 2 (Politik & Ormas)", totalHibah: "Rp 3.400.000.000", realisasi: "Rp 3.370.000.000", persentase: "99.1%" },
      { bidang: "Bidang 3 (Ketahanan Sosbud & Agama)", totalHibah: "Rp 2.800.000.000", realisasi: "Rp 2.760.000.000", persentase: "98.5%" },
      { bidang: "Bidang 4 (Kewaspadaan Nasional)", totalHibah: "Rp 1.600.000.000", realisasi: "Rp 1.580.000.000", persentase: "98.7%" },
    ],
  },
];

const typeColors: Record<string, string> = {
  PDF: "bg-red-50 text-red-600",
  XLSX: "bg-emerald-50 text-emerald-600",
  DOCX: "bg-sky-50 text-sky-600",
};

export default function LaporanPage() {
  const { mode } = useMode();
  const [reportList, setReportList] = useState<ReportItem[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Form state upload laporan
  const [formData, setFormData] = useState({
    name: "",
    periode: "",
    nomorSurat: "",
    status: "Final" as "Final" | "Verifikasi" | "Draft",
    type: "PDF" as "PDF" | "XLSX" | "DOCX",
    penandatangan: "Drs. H. Bambang Sukmana, M.Si (Kepala Badan)",
    ringkasan: "",
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const capaian = 64.6;

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.periode) {
      alert("Mohon lengkapi nama laporan dan periode laporan.");
      return;
    }

    setIsSubmitting(true);

    let fileDataUrl: string | undefined = undefined;
    let fileName = formData.name.replace(/\s+/g, "_") + "." + formData.type.toLowerCase();
    let size = "1.5 MB";

    if (uploadedFile) {
      fileName = uploadedFile.name;
      size = `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`;
      try {
        fileDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(uploadedFile);
        });
      } catch (err) {
        console.error("Gagal membaca berkas laporan:", err);
      }
    }

    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      name: formData.name,
      periode: formData.periode,
      nomorSurat: formData.nomorSurat || `900.1/Lap-${new Date().getMonth() + 1}/Bakesbangpol/${new Date().getFullYear()}`,
      size,
      status: formData.status,
      type: formData.type,
      tanggalDisahkan: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      penandatangan: formData.penandatangan,
      ringkasan: formData.ringkasan || "Laporan resmi pengelolaan dan realisasi hibah Bakesbangpol Kota.",
      bidangDetails: [
        { bidang: "Bidang 1 (Ideologi & Wasbang)", totalHibah: "Rp 500.000.000", realisasi: "Rp 480.000.000", persentase: "96.0%" },
        { bidang: "Bidang 2 (Politik & Ormas)", totalHibah: "Rp 850.000.000", realisasi: "Rp 820.000.000", persentase: "96.4%" },
        { bidang: "Bidang 3 (Ketahanan Sosbud & Agama)", totalHibah: "Rp 700.000.000", realisasi: "Rp 680.000.000", persentase: "97.1%" },
        { bidang: "Bidang 4 (Kewaspadaan Nasional)", totalHibah: "Rp 400.000.000", realisasi: "Rp 390.000.000", persentase: "97.5%" },
      ],
      fileName,
      fileDataUrl,
    };

    setTimeout(() => {
      setReportList((prev) => [newReport, ...prev]);
      setIsSubmitting(false);
      setIsUploadOpen(false);
      // Reset form
      setFormData({
        name: "",
        periode: "",
        nomorSurat: "",
        status: "Final",
        type: "PDF",
        penandatangan: "Drs. H. Bambang Sukmana, M.Si (Kepala Badan)",
        ringkasan: "",
      });
      setUploadedFile(null);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-2xl font-bold tracking-tight">{s.value}</p>
              <p className="mt-0.5 text-sm font-medium text-zinc-900">
                {s.label}
              </p>
              <p className="text-xs text-zinc-500">{s.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Realization progress */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Capaian Realisasi Tahunan</h2>
              <p className="text-sm text-zinc-500">
                Rp 4,2 M dari target Rp 6,5 M pada tahun 2026
              </p>
            </div>
            <span className="text-2xl font-bold text-red-600">
              {capaian}%
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-700"
              style={{ width: `${capaian}%` }}
            />
          </div>

          <div className="mt-8 space-y-5">
            {[
              { label: "Realisasi / Selesai", value: 75.0, color: "bg-red-600" },
              { label: "Menunggu verifikasi", value: 25.0, color: "bg-amber-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-zinc-600">{item.label}</span>
                  <span className="font-semibold">{item.value}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick summary list */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold">Ringkasan Cepat</h2>
          <p className="text-sm text-zinc-500">Status laporan terkini</p>
          <ul className="mt-5 space-y-4">
            {[
              { label: "Laporan final disetujui", value: "9", icon: CheckIcon, color: "text-emerald-500" },
              { label: "Sedang diverifikasi", value: "2", icon: ClockIcon, color: "text-amber-500" },
              { label: "Draft / belum dikirim", value: "1", icon: DocumentIcon, color: "text-zinc-400" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50 ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-zinc-500">Periode berjalan</p>
                  </div>
                  <span className="text-lg font-bold">{item.value}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Report files */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">Arsip & Berkas Laporan Resmi</h2>
            <p className="text-sm text-zinc-500">
              Lihat dokumen langsung di sistem atau unduh berkas laporan
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Tombol Upload Khusus Admin */}
            {mode === "admin" && (
              <button
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.98]"
              >
                <UploadIcon className="h-3.5 w-3.5 text-red-400" />
                <span>Unggah Laporan Baru</span>
              </button>
            )}
            <button
              onClick={() => alert("Mengunduh seluruh bundel berkas laporan resmi...")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/25 transition hover:bg-red-500 active:scale-[0.98]"
            >
              <DownloadIcon className="h-3.5 w-3.5" />
              <span>Unduh Semua</span>
            </button>
          </div>
        </div>
        <ul className="divide-y divide-zinc-50">
          {reportList.map((r) => (
            <li
              key={r.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-zinc-50/70"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <DocumentIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-900">{r.name}</p>
                  <p className="text-xs text-zinc-500">
                    No: <span className="font-mono text-zinc-700">{r.nomorSurat}</span> · {r.periode} · {r.size}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className={`rounded-lg px-2 py-1 text-[11px] font-bold ${typeColors[r.type]}`}>
                  {r.type}
                </span>
                <StatusBadge status={r.status} />

                {/* Tombol Lihat Dokumen */}
                <button
                  onClick={() => setSelectedReport(r)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.98]"
                  title="Lihat isi dokumen laporan"
                >
                  <EyeIcon className="h-3.5 w-3.5" />
                  Lihat Dokumen
                </button>

                {/* Tombol Unduh */}
                <button
                  onClick={() => alert(`Mengunduh berkas: ${r.name} (${r.size})`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Unduh ${r.name}`}
                >
                  <DownloadIcon className="h-3.5 w-3.5" />
                  Unduh
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ==================== MODAL UPLOAD DOKUMEN LAPORAN (ADMIN ONLY) ==================== */}
      {isUploadOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm"
          onClick={() => setIsUploadOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-900 px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
                  <UploadIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    Unggah Dokumen Laporan Baru
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Administrator Kesbangpol · Publikasi Berkas Resmi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleUploadSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Nama / Judul Laporan Resmi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Laporan Realisasi Hibah Triwulan III T.A. 2026"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    Periode Laporan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Juli – September 2026"
                    value={formData.periode}
                    onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    Nomor Surat / Naskah Dinas
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 900.1.1/Lap-08/Bakesbangpol/2026"
                    value={formData.nomorSurat}
                    onChange={(e) => setFormData({ ...formData, nomorSurat: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    Status Dokumen
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-red-500 focus:bg-white"
                  >
                    <option value="Final">Final (Disetujui & TTE)</option>
                    <option value="Verifikasi">Dalam Verifikasi</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    Format Berkas
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-red-500 focus:bg-white"
                  >
                    <option value="PDF">PDF (Dokumen Resmi / TTE)</option>
                    <option value="XLSX">XLSX (Spreadsheet Realisasi)</option>
                    <option value="DOCX">DOCX (Naskah Dinas)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Pejabat Penandatangan / Pengesah
                </label>
                <input
                  type="text"
                  value={formData.penandatangan}
                  onChange={(e) => setFormData({ ...formData, penandatangan: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Ringkasan Eksekutif (Executive Summary)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan ringkasan pokok realisasi belanja dan penyerapan hibah..."
                  value={formData.ringkasan}
                  onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-900 outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              {/* Upload File Box */}
              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Unggah Berkas Fisik / Digital (PDF/DOCX/XLSX)
                </label>
                <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/70 p-5 text-center cursor-pointer transition hover:border-red-400 hover:bg-red-50/20">
                  <UploadIcon className="h-6 w-6 text-zinc-400 mb-1.5" />
                  <span className="text-xs font-semibold text-zinc-700">
                    {uploadedFile ? uploadedFile.name : "Klik atau seret berkas laporan ke sini"}
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">
                    Mendukung PDF, XLSX, DOCX hingga 15MB
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.xlsx,.xls,.docx,.doc"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Form Footer */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-red-600/30 transition hover:bg-red-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Mengunggah..." : "Simpan & Publikasikan Laporan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL PREVIEW DOKUMEN LAPORAN ==================== */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedReport(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-900 px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
                  <DocumentIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {selectedReport.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    {selectedReport.nomorSurat} · {selectedReport.periode}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-700 flex items-center gap-1.5"
                >
                  <PrinterIcon className="h-3.5 w-3.5" />
                  <span>Cetak</span>
                </button>
                <button
                  onClick={() => alert(`Mengunduh berkas resmi ${selectedReport.name}...`)}
                  className="rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500 flex items-center gap-1.5 shadow-md shadow-red-600/30"
                >
                  <DownloadIcon className="h-3.5 w-3.5" />
                  <span>Unduh PDF</span>
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                  aria-label="Tutup"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Document Digital Viewer Body */}
            <div className="flex-1 overflow-y-auto bg-zinc-100/70 p-6">
              {/* Kertas Naskah Dinas Resmi */}
              <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-lg text-zinc-800 font-sans">
                {/* Kop Surat Resmi */}
                <div className="border-b-2 border-zinc-900 pb-4 text-center">
                  <p className="text-xs font-bold tracking-widest text-zinc-600 uppercase">
                    Pemerintah Kota · Badan Kesatuan Bangsa dan Politik
                  </p>
                  <h2 className="text-lg font-black text-zinc-900 uppercase tracking-tight mt-0.5">
                    Laporan Pertanggungjawaban Realisasi Dana Hibah Daerah
                  </h2>
                  <p className="text-xs text-zinc-500 font-medium mt-1">
                    Jalan Wastukancana No. 2, Babakan Ciamis, Sumur Bandung · Telp (022) 4203344
                  </p>
                </div>

                {/* Meta Information Bar */}
                <div className="my-5 grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl bg-zinc-50 p-3.5 border border-zinc-200 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Periode Laporan</span>
                    <span className="font-semibold text-zinc-900">{selectedReport.periode}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Format Berkas</span>
                    <span className="font-semibold text-red-600">{selectedReport.type} ({selectedReport.size})</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Status Berkas</span>
                    <span className="font-semibold text-emerald-600">{selectedReport.status}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Tanggal Sah</span>
                    <span className="font-semibold text-zinc-900">{selectedReport.tanggalDisahkan}</span>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="space-y-4 text-xs leading-relaxed text-zinc-700">
                  <div>
                    <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] mb-1">
                      I. Ringkasan Eksekutif (Executive Summary)
                    </h4>
                    <p className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 text-zinc-700">
                      {selectedReport.ringkasan}
                    </p>
                  </div>

                  {/* Rincian Realisasi per Bidang Table */}
                  <div>
                    <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] mb-2">
                      II. Rekapitulasi Realisasi Penyerapan Anggaran Per Bidang
                    </h4>
                    <div className="overflow-hidden rounded-xl border border-zinc-200 shadow-sm">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-zinc-100 text-zinc-700 font-bold border-b border-zinc-200">
                          <tr>
                            <th className="py-2 px-3">Bidang Evaluator</th>
                            <th className="py-2 px-3">Pagu Alokasi</th>
                            <th className="py-2 px-3">Realisasi (SP2D)</th>
                            <th className="py-2 px-3 text-right">Capaian</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {selectedReport.bidangDetails.map((b, idx) => (
                            <tr key={idx} className="hover:bg-zinc-50/80">
                              <td className="py-2.5 px-3 font-medium text-zinc-900">{b.bidang}</td>
                              <td className="py-2.5 px-3 font-mono">{b.totalHibah}</td>
                              <td className="py-2.5 px-3 font-mono font-semibold text-emerald-700">{b.realisasi}</td>
                              <td className="py-2.5 px-3 text-right font-bold text-red-600">{b.persentase}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Keterangan & Catatan Akuntabilitas */}
                  <div>
                    <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] mb-1">
                      III. Catatan Kepatuhan & Verifikasi SPJ
                    </h4>
                    <p className="text-zinc-600">
                      Seluruh dokumen laporan pertanggungjawaban fisik dan elektronik (NPHD, Berita Acara Verifikasi, Kwitansi Bermaterai, dan Dokumentasi Kegiatan) telah diteliti dan sesuai dengan Permendagri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah.
                    </p>
                  </div>

                  {/* Tanda Tangan Elektronik / Lembar Pengesahan */}
                  <div className="mt-8 pt-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
                        BSrE
                      </div>
                      <div className="text-[11px]">
                        <p className="font-bold text-emerald-900">Tersertifikasi Elektronik (TTE)</p>
                        <p className="text-emerald-700">Balai Sertifikasi Elektronik (BSrE) - BSSN</p>
                      </div>
                    </div>

                    <div className="text-center sm:text-right">
                      <p className="text-[11px] text-zinc-500">Ditetapkan & Disahkan di Bandung,</p>
                      <p className="text-xs font-bold text-zinc-900 mt-1">{selectedReport.penandatangan}</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">NIP. 19740512 199803 1 004</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-zinc-100 bg-white px-6 py-3.5">
              <span className="text-xs text-zinc-400">
                Sistem Informasi Pengarsipan Hibah · Bakesbangpol
              </span>
              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-xl bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-200"
              >
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
