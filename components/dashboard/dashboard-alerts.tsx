import Link from "next/link";
import AlertBanner from "@/components/alert-banner";
import { ClockIcon, AlertIcon, ChevronRightIcon, XIcon } from "@/components/icons";
import { formatRupiah } from "@/lib/utils";
import type { Mode } from "@/context/mode-context";

type DashboardAlertsProps = {
  mode: Mode;
  totalPendingCount: number;
  returnedCount: number;
  retensiCount: number;
  selectedYear: string | null;
  selectedYearCount: number;
  selectedYearNominal: number;
  onClearYear: () => void;
  getUrl: (tab: string) => string;
};

/**
 * DashboardAlerts - Mengelola dan menampilkan semua banner peringatan di dashboard
 * menggunakan komponen terpadu AlertBanner.
 */
export default function DashboardAlerts({
  mode,
  totalPendingCount,
  returnedCount,
  retensiCount,
  selectedYear,
  selectedYearCount,
  selectedYearNominal,
  onClearYear,
  getUrl,
}: DashboardAlertsProps) {
  return (
    <div className="space-y-3">
      {/* 1. Admin Verification Queue Alert */}
      {mode === "admin" && totalPendingCount > 0 && (
        <AlertBanner
          variant="amber"
          icon={<ClockIcon className="h-5 w-5" />}
          title={`Antrian Verifikasi: ${totalPendingCount} Dokumen Menunggu Persetujuan`}
          description="Ada usulan hibah baru dari Bidang yang perlu ditinjau sebelum diarsipkan ke lemari fisik."
          action={
            <Link
              href={getUrl("Dokumen")}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 transition"
            >
              <span>Tinjau Berkas</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          }
        />
      )}

      {/* 2. Bidang Returned Document Alert */}
      {mode === "bidang" && returnedCount > 0 && (
        <AlertBanner
          variant="rose"
          icon={<AlertIcon className="h-5 w-5" />}
          title={`Perhatian: ${returnedCount} Dokumen Usulan Dikembalikan oleh Admin`}
          description="Terdapat catatan perbaikan atau kelengkapan berkas yang perlu disesuaikan sebelum disetujui."
          action={
            <Link
              href={getUrl("Dokumen")}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition"
            >
              <span>Perbaiki Berkas</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          }
        />
      )}

      {/* 3. Jadwal Retensi Arsip (JRA) Notice */}
      {retensiCount > 0 && (
        <AlertBanner
          variant="blue"
          size="sm"
          icon={<span className="font-bold text-xs">i</span>}
          description={
            <span>
              <strong className="font-semibold text-blue-900">Jadwal Retensi Arsip (JRA):</strong> Terdapat{" "}
              <span className="font-bold text-blue-700 underline">{retensiCount} berkas</span> yang telah
              mencapai usia retensi aktif (&ge; 5 tahun) dan memenuhi syarat penilaian arsip inaktif.
            </span>
          }
          action={
            <Link
              href={getUrl("Arsip")}
              className="shrink-0 font-bold text-xs text-blue-700 hover:text-blue-900 hover:underline"
            >
              Buka Arsip &rarr;
            </Link>
          }
        />
      )}

      {/* 4. Active Year Filter Indicator */}
      {selectedYear && (
        <AlertBanner
          variant="zinc"
          size="sm"
          icon={<span className="inline-block h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />}
          description={
            <span>
              Menampilkan data untuk: <strong className="font-bold text-zinc-900">Tahun {selectedYear}</strong>{" "}
              ({selectedYearCount} usulan hibah, {formatRupiah(selectedYearNominal)})
            </span>
          }
          action={
            <button
              type="button"
              onClick={onClearYear}
              className="inline-flex items-center gap-1 font-bold text-xs text-red-600 hover:text-red-800 hover:underline cursor-pointer"
            >
              <XIcon className="h-3.5 w-3.5" />
              <span>Hapus Filter Tahun</span>
            </button>
          }
        />
      )}
    </div>
  );
}
