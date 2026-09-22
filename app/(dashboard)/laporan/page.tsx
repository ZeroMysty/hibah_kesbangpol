"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useMode, bidangInfo, BidangId } from "@/context/mode-context";
import { useHibah } from "@/context/hibah-context";
import { useNotifications, type AppNotification } from "@/context/notification-context";
import { useReview, ReviewItem } from "@/context/review-context";
import {
  FolderIcon,
  ArchiveIcon,
  BuildingIcon,
  CheckIcon,
  ChartIcon,
  CheckCircleIcon,
  XIcon,
  ClockIcon,
  AlertIcon,
} from "@/components/icons";
import { formatRupiah, formatShortRupiah, formatRelativeTime, BIDANG_HEX } from "@/lib/utils";
import FilterPill from "@/components/filter-pill";

// ── Notification feed helpers ─────────────────────────────────────────────────
const typeIcon: Record<AppNotification["type"], (props: { className?: string }) => React.ReactNode> = {
  hibah: FolderIcon,
  arsip: ArchiveIcon,
  lembaga: BuildingIcon,
  dokumen_masuk: FolderIcon,
};
const typeColor: Record<AppNotification["type"], string> = {
  hibah: "bg-red-50 text-red-600",
  arsip: "bg-sky-50 text-sky-600",
  lembaga: "bg-emerald-50 text-emerald-600",
  dokumen_masuk: "bg-amber-50 text-amber-600",
};
const typeLabel: Record<AppNotification["type"], string> = {
  hibah: "Usulan Hibah Baru",
  arsip: "Arsip Baru",
  lembaga: "Lembaga Baru",
  dokumen_masuk: "Dokumen Masuk untuk Review",
};

// ── Bar Chart ─────────────────────────────────────────────────────────────────
type BarDatum = { tahun: string; jumlah: number; nominal: number };
function BarChart({ data, filterBidang }: { data: BarDatum[]; filterBidang: BidangId | "Semua" }) {
  const barColor = filterBidang === "Semua" ? "#e11d48" : BIDANG_HEX[filterBidang];
  const maxJumlah = Math.max(...data.map((d) => d.jumlah), 1);
  return (
    <div className="relative w-full pt-6 pb-2">
      <div className="relative h-48 w-full">
        <div className="absolute inset-x-0 top-0 border-b border-dashed border-zinc-200 flex items-center pointer-events-none">
          <span className="text-[10px] font-semibold text-zinc-400 pl-1 -mt-3.5">{maxJumlah}</span>
        </div>
        <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-zinc-100 flex items-center pointer-events-none">
          <span className="text-[10px] font-semibold text-zinc-400 pl-1 -mt-3.5">{Math.round(maxJumlah / 2)}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 border-b border-zinc-300 flex items-center pointer-events-none">
          <span className="text-[10px] font-semibold text-zinc-400 pl-1 -mt-3.5">0</span>
        </div>
        <div className="absolute inset-0 pl-10 pr-4 flex items-end justify-between gap-2 sm:gap-4">
          {data.map((d) => {
            const heightPercent = maxJumlah > 0 ? (d.jumlah / maxJumlah) * 100 : 0;
            return (
              <div key={d.tahun} className="group relative flex-1 flex flex-col items-center justify-end h-full cursor-pointer min-w-0">
                <div className="pointer-events-none absolute -top-14 z-20 hidden group-hover:flex flex-col items-center rounded-xl bg-red-700 px-3 py-1.5 text-center text-white shadow-xl shadow-red-700/20">
                  <span className="text-[11px] font-bold whitespace-nowrap">Tahun {d.tahun}</span>
                  <span className="text-[10px] text-red-100 whitespace-nowrap">{d.jumlah} Berkas Hibah</span>
                  <span className="text-[9px] text-red-200 whitespace-nowrap">{formatRupiah(d.nominal)}</span>
                  <div className="absolute -bottom-1 h-2 w-2 rotate-45 bg-red-700" />
                </div>
                <span className={`mb-1.5 text-xs font-black transition-transform group-hover:scale-110 ${d.jumlah > 0 ? "" : "text-zinc-300"}`} style={{ color: d.jumlah > 0 ? barColor : undefined }}>
                  {d.jumlah}
                </span>
                <div className="w-full max-w-[48px] sm:max-w-[64px] rounded-t-xl transition-all duration-300 group-hover:opacity-90 shadow-2xs" style={{ height: d.jumlah > 0 ? `${Math.max(heightPercent, 8)}%` : "3px", backgroundColor: d.jumlah > 0 ? barColor : "#e4e4e7" }} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="pl-10 pr-4 flex items-start justify-between gap-2 sm:gap-4 pt-3">
        {data.map((d) => (
          <div key={d.tahun} className="flex-1 text-center min-w-0">
            <p className="text-xs font-bold text-zinc-800 truncate">{d.tahun}</p>
            <p className="text-[10px] text-zinc-400 font-medium truncate" title={formatRupiah(d.nominal)}>
              {d.nominal > 0 ? formatShortRupiah(d.nominal) : "Rp 0"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── StatusChip untuk Review ───────────────────────────────────────────────────
function ReviewStatusBadge({ status }: { status: ReviewItem["status"] }) {
  if (status === "menunggu")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
        <ClockIcon className="h-3 w-3" /> Menunggu Review
      </span>
    );
  if (status === "dikembalikan")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
        <AlertIcon className="h-3 w-3" /> Perlu Perbaikan
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
      <CheckCircleIcon className="h-3 w-3" /> Disetujui
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal Kembalikan (admin)
// ─────────────────────────────────────────────────────────────────────────────
function ReturnModal({
  item,
  onClose,
  onConfirm,
}: {
  item: ReviewItem;
  onClose: () => void;
  onConfirm: (catatan: string) => void;
}) {
  const [catatan, setCatatan] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-zinc-950/20 overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Kembalikan Dokumen</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Isi catatan perbaikan untuk bidang</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3.5 space-y-1">
            <p className="text-xs font-semibold text-zinc-900">{item.name}</p>
            <p className="text-[11px] text-zinc-500">{item.instansi} · Bidang {item.bidangId}</p>
            <p className="text-[11px] font-semibold text-zinc-700">{formatRupiah(item.nominal)}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Catatan Perbaikan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={4}
              placeholder="Jelaskan apa yang perlu diperbaiki oleh bidang..."
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 resize-none"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-zinc-100 px-5 py-4">
          <button onClick={onClose} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
            Batal
          </button>
          <button
            onClick={() => { if (catatan.trim()) onConfirm(catatan.trim()); }}
            disabled={!catatan.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-red-600/25 transition-all hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Kembalikan Dokumen
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Halaman Utama
// ─────────────────────────────────────────────────────────────────────────────
export default function LaporanPage() {
  const { mode, bidangId, currentUser } = useMode();
  const { proposals, arsipList, addProposal } = useHibah();
  const { notifications, unreadCount, markAllRead, addNotification } = useNotifications();
  const {
    pendingReviews,
    myReturned,
    bidangNotifications,
    bidangUnreadCount,
    markBidangNotifsRead,
    approveReview,
    returnReview,
    resubmitReview,
  } = useReview();

  const [filterBidang, setFilterBidang] = useState<BidangId | "Semua">("Semua");
  const [activeTab, setActiveTab] = useState<"antrian" | "statistik">("antrian");
  const [returnTarget, setReturnTarget] = useState<ReviewItem | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [resubmitTarget, setResubmitTarget] = useState<ReviewItem | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Mark bidang notifs as read when opening page
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (mode === "bidang") markBidangNotifsRead(bidangId);
  }, []);


  const now = Date.now();

  // ── DATA STATISTIK ──────────────────────────────────────────────────────────
  const allItems = [
    ...proposals.map((p) => ({ tahun: p.tahun || p.tanggal?.slice(0, 4) || "—", bidangId: p.bidangId, nominal: p.nominal || 0 })),
    ...arsipList.map((a) => ({ tahun: a.tahun || a.tanggal?.slice(0, 4) || "—", bidangId: a.bidangId, nominal: a.nominal || 0 })),
  ];
  const filtered = useMemo(
    () => filterBidang === "Semua" ? allItems : allItems.filter((d) => d.bidangId === filterBidang),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterBidang, proposals.length, arsipList.length]
  );
  const currentYear = new Date().getFullYear();
  const defaultYears = Array.from({ length: 8 }, (_, i) => String(currentYear - 7 + i));
  const allYearsSet = new Set([...defaultYears, ...allItems.map((d) => d.tahun)]);
  const sortedYears = Array.from(allYearsSet).filter((t) => t && t !== "—").sort();
  const chartData: BarDatum[] = sortedYears.map((tahun) => {
    const items = filtered.filter((d) => d.tahun === tahun);
    return { tahun, jumlah: items.length, nominal: items.reduce((s, d) => s + d.nominal, 0) };
  });
  const totalBerkas = filtered.length;
  const totalNominal = filtered.reduce((s, d) => s + d.nominal, 0);
  const tahunTerbanyak = chartData.reduce((best, d) => (d.jumlah > (best?.jumlah ?? -1) ? d : best), chartData[0]);

  // ── ADMIN: approve handler ─────────────────────────────────────────────────
  const handleApprove = async (item: ReviewItem) => {
    setApprovingId(item.id);
    const approved = approveReview(item.id);
    if (approved) {
      await addProposal({
        name: approved.name,
        instansi: approved.instansi,
        bidangId: approved.bidangId,
        lemariArsip: approved.lemariArsip,
        rakArsip: approved.rakArsip,
        nomorArsip: approved.nomorArsip,
        kategori: approved.kategori,
        nominal: approved.nominal,
        pic: approved.pic,
        noTelp: approved.noTelp,
        catatan: approved.catatan,
        fileName: approved.fileName,
        fileDataUrl: approved.fileDataUrl,
        fileType: approved.fileType,
      } as Parameters<typeof addProposal>[0]);
      addNotification({
        type: "hibah",
        bidangId: approved.bidangId,
        bidangNama: bidangInfo[approved.bidangId].shortName,
        message: `Dokumen disetujui & disimpan: "${approved.name}" dari ${approved.instansi}`,
        reviewId: approved.id,
      });
    }
    setApprovingId(null);
    showToast("Dokumen disetujui dan disimpan ke storage!");
  };

  // ── ADMIN: return handler ──────────────────────────────────────────────────
  const handleReturn = (catatan: string) => {
    if (!returnTarget) return;
    returnReview(returnTarget.id, catatan);
    setReturnTarget(null);
    showToast("Dokumen dikembalikan ke bidang dengan catatan perbaikan.");
  };

  // ── BIDANG: resubmit handler ───────────────────────────────────────────────
  const handleResubmit = (item: ReviewItem) => {
    resubmitReview(item.id);
    addNotification({
      type: "dokumen_masuk",
      bidangId: item.bidangId,
      bidangNama: bidangInfo[item.bidangId].shortName,
      message: `Dokumen disubmit ulang: "${item.name}" dari ${item.instansi}`,
      reviewId: item.id,
    });
    setResubmitTarget(null);
    showToast("Dokumen berhasil disubmit ulang untuk direview admin.");
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Tampilan BIDANG
  // ─────────────────────────────────────────────────────────────────────────
  if (mode === "bidang") {
    const returned = myReturned(bidangId);
    const myNotifs = bidangNotifications(bidangId);

    return (
      <div className="space-y-6">
        {/* Toast */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-zinc-900 px-5 py-3.5 text-xs font-semibold text-white shadow-2xl animate-fade-in">
            <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
            {toastMsg}
          </div>
        )}

        {/* Return Modal konfirmasi resubmit */}
        {resubmitTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                <h3 className="text-sm font-bold text-zinc-900">Konfirmasi Submit Ulang</h3>
                <button onClick={() => setResubmitTarget(null)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 transition-colors">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-zinc-700">Pastikan dokumen sudah diperbaiki sesuai catatan admin sebelum disubmit ulang.</p>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 space-y-1">
                  <p className="text-xs font-semibold text-zinc-900">{resubmitTarget.name}</p>
                  <p className="text-[11px] text-amber-800 font-medium">Catatan Admin:</p>
                  <p className="text-[11px] text-amber-700 italic">"{resubmitTarget.catatanAdmin}"</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-zinc-100 px-5 py-4">
                <button onClick={() => setResubmitTarget(null)} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
                  Batal
                </button>
                <button onClick={() => handleResubmit(resubmitTarget)} className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-red-600/25 transition-all hover:bg-red-500">
                  <CheckIcon className="h-4 w-4" />
                  Submit Ulang
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Laporan Bidang</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {bidangInfo[bidangId].fullName} — status dokumen yang Anda ajukan.
          </p>
        </div>

        {/* Notifikasi bidang */}
        {myNotifs.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertIcon className="h-5 w-5 text-amber-600" />
              <h2 className="text-sm font-bold text-amber-800">
                Notifikasi Perbaikan ({bidangUnreadCount(bidangId) > 0 ? `${bidangUnreadCount(bidangId)} belum dibaca` : "semua dibaca"})
              </h2>
            </div>
            <ul className="space-y-2">
              {myNotifs.slice(0, 5).map((n) => (
                <li key={n.id} className={`rounded-xl border px-4 py-3 text-sm ${n.read ? "border-amber-100 bg-white" : "border-amber-300 bg-amber-100"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-zinc-900">{n.documentName}</span>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />}
                  </div>
                  {n.catatanAdmin && (
                    <p className="mt-1 text-xs text-amber-800 italic">"{n.catatanAdmin}"</p>
                  )}
                  <p className="mt-1 text-[11px] text-zinc-400">{formatRelativeTime(n.createdAt, now)}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Daftar Dikembalikan */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Dokumen Perlu Perbaikan</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Dokumen yang dikembalikan admin dan memerlukan revisi</p>
            </div>
            {returned.length > 0 && (
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">{returned.length} dokumen</span>
            )}
          </div>
          {returned.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <CheckCircleIcon className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-zinc-700">Tidak ada dokumen yang perlu diperbaiki</p>
              <p className="text-xs text-zinc-400 mt-1">Semua dokumen Anda sedang dalam proses review atau sudah disetujui.</p>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {returned.map((item) => (
                <li key={item.id} className="px-5 py-4 hover:bg-zinc-50/70 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-zinc-900">{item.name}</p>
                        <ReviewStatusBadge status={item.status} />
                      </div>
                      <p className="text-xs text-zinc-500">{item.instansi} · {formatRupiah(item.nominal)}</p>
                      {item.catatanAdmin && (
                        <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 mt-2">
                          <p className="text-[11px] font-semibold text-red-700 mb-0.5">Catatan Admin:</p>
                          <p className="text-xs text-red-800 italic">"{item.catatanAdmin}"</p>
                        </div>
                      )}
                      <p className="text-[11px] text-zinc-400">
                        Dikembalikan {item.returnedAt ? formatRelativeTime(item.returnedAt, now) : "—"}
                        {(item.resubmitCount ?? 0) > 0 && ` · Submit ke-${(item.resubmitCount ?? 0) + 1}`}
                      </p>
                    </div>
                    <button
                      onClick={() => setResubmitTarget(item)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-red-600/25 transition-all hover:bg-red-500 active:scale-95 whitespace-nowrap shrink-0"
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                      Perbaiki & Submit Ulang
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Tampilan ADMIN
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-zinc-900 px-5 py-3.5 text-xs font-semibold text-white shadow-2xl animate-fade-in">
          <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
          {toastMsg}
        </div>
      )}

      {/* Modal kembalikan */}
      {returnTarget && (
        <ReturnModal item={returnTarget} onClose={() => setReturnTarget(null)} onConfirm={handleReturn} />
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Laporan & Review</h1>
          <p className="mt-1 text-sm text-zinc-500">Antrian review dokumen dan statistik rekapitulasi hibah.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-zinc-400 hover:bg-zinc-50">
            <CheckIcon className="h-4 w-4" />
            Tandai semua dibaca ({unreadCount})
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 w-fit">
        <button
          onClick={() => setActiveTab("antrian")}
          className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === "antrian"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          <FolderIcon className="h-4 w-4" />
          Antrian Review
          {pendingReviews.length > 0 && (
            <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {pendingReviews.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("statistik")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === "statistik"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          <ChartIcon className="h-4 w-4" />
          Statistik
        </button>
      </div>

      {/* ── Tab Antrian Review ── */}
      {activeTab === "antrian" && (
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Antrian Dokumen Masuk</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Dokumen dari bidang yang menunggu persetujuan admin</p>
            </div>
            {pendingReviews.length > 0 && (
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">{pendingReviews.length} pending</span>
            )}
          </div>

          {pendingReviews.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <CheckCircleIcon className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-zinc-700">Tidak ada dokumen yang menunggu review</p>
              <p className="text-xs text-zinc-400 mt-1">Semua dokumen sudah ditangani. Antrian kosong.</p>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {pendingReviews.map((item) => (
                <li key={item.id} className="px-5 py-5 hover:bg-zinc-50/50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Info Dokumen */}
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-zinc-900">{item.name}</p>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                          style={{ backgroundColor: BIDANG_HEX[item.bidangId] }}
                        >
                          Bidang {item.bidangId}
                        </span>
                        {(item.resubmitCount ?? 0) > 0 && (
                          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                            Revisi ke-{item.resubmitCount}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                        <span><span className="font-medium text-zinc-700">Instansi:</span> {item.instansi}</span>
                        <span><span className="font-medium text-zinc-700">Kategori:</span> {item.kategori}</span>
                        <span><span className="font-medium text-zinc-700">Nominal:</span> {formatRupiah(item.nominal)}</span>
                        <span><span className="font-medium text-zinc-700">Tahun:</span> {item.tahun}</span>
                      </div>
                      {item.pic && (
                        <p className="text-[11px] text-zinc-400">PIC: {item.pic}{item.noTelp ? ` · ${item.noTelp}` : ""}</p>
                      )}
                      {item.fileName && (
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-600">
                          <FolderIcon className="h-3 w-3" />
                          {item.fileName}
                        </div>
                      )}
                      <p className="text-[11px] text-zinc-400">
                        Disubmit {formatRelativeTime(item.submittedAt, now)}
                      </p>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setReturnTarget(item)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 active:scale-95"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                        Kembalikan
                      </button>
                      <button
                        onClick={() => handleApprove(item)}
                        disabled={approvingId === item.id}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-600/25 transition-all hover:bg-emerald-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                        {approvingId === item.id ? "Menyimpan..." : "Setujui"}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ── Tab Statistik ── */}
      {activeTab === "statistik" && (
        <>
          {/* Grafik */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm w-full">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <ChartIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-900">Total Berkas Per Tahun</h2>
                  <p className="text-xs text-zinc-400">
                    {filterBidang === "Semua" ? "Semua bidang — 1 batang per tahun" : `Bidang ${filterBidang} — ${bidangInfo[filterBidang].shortName}`}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(["Semua", 1, 2, 3, 4] as (BidangId | "Semua")[]).map((b) => (
                  <FilterPill
                    key={String(b)}
                    label={b === "Semua" ? "Semua Bidang" : `Bidang ${b}`}
                    active={filterBidang === b}
                    onClick={() => setFilterBidang(b)}
                    color={b !== "Semua" ? BIDANG_HEX[b as BidangId] : undefined}
                  />
                ))}
              </div>
            </div>
            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-100">
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">Total Berkas</p>
                <p className="mt-1 text-2xl font-black text-zinc-900">{totalBerkas}</p>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-100">
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">Total Nominal</p>
                <p className="mt-1 text-lg font-black text-zinc-900 truncate">{formatRupiah(totalNominal)}</p>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-100">
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">Tahun Terbanyak</p>
                <p className="mt-1 text-xl font-black text-zinc-900 leading-tight">
                  {tahunTerbanyak?.jumlah > 0 ? tahunTerbanyak.tahun : "—"}
                </p>
              </div>
            </div>
            {chartData.every((d) => d.jumlah === 0) ? (
              <div className="flex h-48 items-center justify-center text-sm text-zinc-400">Belum ada data berkas untuk ditampilkan.</div>
            ) : (
              <BarChart data={chartData} filterBidang={filterBidang} />
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">Bidang:</span>
              {([1, 2, 3, 4] as BidangId[]).map((b) => {
                const count = filtered.filter((d) => d.bidangId === b).length;
                return (
                  <div key={b} className="flex items-center gap-1.5 text-xs text-zinc-600">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: BIDANG_HEX[b] }} />
                    <span className="font-medium">Bidang {b}</span>
                    <span className="text-zinc-400">({count})</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feed Notifikasi */}
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold">Aktivitas Terbaru</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Notifikasi dari seluruh bidang</p>
              </div>
            </div>
            {notifications.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-zinc-400">
                Belum ada aktivitas. Notifikasi muncul ketika ada bidang yang menambah data baru.
              </div>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {notifications.map((n) => {
                  const Icon = typeIcon[n.type];
                  return (
                    <li key={n.id} className={`flex items-start gap-3.5 px-5 py-4 transition-colors ${n.read ? "" : "bg-red-50/30"}`}>
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${typeColor[n.type]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">{typeLabel[n.type]}</span>
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                            Bidang {n.bidangId} · {n.bidangNama}
                          </span>
                          {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-red-600" />}
                        </div>
                        <p className="mt-1 text-sm text-zinc-800">{n.message}</p>
                        <p className="mt-1 text-xs text-zinc-400">{formatRelativeTime(n.createdAt, now)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
