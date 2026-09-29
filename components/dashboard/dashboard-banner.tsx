import Link from "next/link";
import { PlusIcon, DocumentIcon, ArchiveIcon } from "@/components/icons";
import { bidangInfo, BidangId, Mode } from "@/context/mode-context";

type DashboardBannerProps = {
  mode: Mode;
  bidangId: BidangId;
  currentYear: number;
  getUrl: (tab: string) => string;
};

/**
 * DashboardBanner - Banner navigasi atas dengan indikator mode peran dan tombol aksi cepat.
 */
export default function DashboardBanner({
  mode,
  bidangId,
  currentYear,
  getUrl,
}: DashboardBannerProps) {
  return (
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
  );
}
