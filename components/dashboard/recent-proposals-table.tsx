"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import SearchInput from "@/components/search-input";
import { FolderIcon, ChevronRightIcon, EyeIcon } from "@/components/icons";
import { LokasiArsipBadge } from "@/components/status-badge";
import { formatRupiah } from "@/lib/utils";
import { bidangInfo } from "@/context/mode-context";
import type { ProposalItem } from "@/context/hibah-context";

type RecentProposalsTableProps = {
  proposals: ProposalItem[];
  selectedYear: string | null;
  onClearYear: () => void;
  getUrl: (tab: string) => string;
};

/**
 * RecentProposalsTable - Tabel ringkasan usulan hibah terbaru dengan pencarian cepat,
 * badge lokasi fisik arsip, dan tautan detail berkas.
 */
export default function RecentProposalsTable({
  proposals,
  selectedYear,
  onClearYear,
  getUrl,
}: RecentProposalsTableProps) {
  const [tableSearch, setTableSearch] = useState("");

  const filteredProposals = useMemo(() => {
    if (!tableSearch.trim()) return proposals;
    const q = tableSearch.toLowerCase();
    return proposals.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.instansi.toLowerCase().includes(q) ||
        (p.catatan && p.catatan.toLowerCase().includes(q)) ||
        (p.lemariArsip && p.lemariArsip.toLowerCase().includes(q))
    );
  }, [proposals, tableSearch]);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs">
      {/* Table Header & Quick Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <FolderIcon className="h-5 w-5 text-red-500 shrink-0" />
          <h2 className="text-base font-semibold text-zinc-900">
            {selectedYear ? `Dokumen Usulan Tahun ${selectedYear}` : "Dokumen Usulan Hibah Terbaru"}
          </h2>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">
            {filteredProposals.length} data
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick search input */}
          <SearchInput
            value={tableSearch}
            onChange={setTableSearch}
            placeholder="Cari nama / instansi..."
            className="w-48 sm:w-60"
          />

          {selectedYear && (
            <button
              type="button"
              onClick={onClearYear}
              className="text-xs font-semibold text-zinc-500 hover:text-red-600 cursor-pointer"
            >
              Tampilkan semua tahun
            </button>
          )}

          <Link
            href={getUrl("Dokumen")}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700"
          >
            <span>Lihat semua dokumen</span>
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
            {filteredProposals.slice(0, 8).map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-zinc-50/70">
                <td className="px-5 py-4 font-medium">
                  <p className="text-zinc-900 font-semibold">{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Thn {p.tahun || p.tanggal?.slice(0, 4)}
                    </span>
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

            {filteredProposals.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-xs text-zinc-400">
                  {tableSearch ? (
                    <div className="space-y-1">
                      <p className="font-semibold text-zinc-600">
                        Tidak ada dokumen yang cocok dengan pencarian &quot;{tableSearch}&quot;
                      </p>
                      <button
                        type="button"
                        onClick={() => setTableSearch("")}
                        className="font-bold text-red-600 hover:underline cursor-pointer"
                      >
                        Hapus kata kunci pencarian
                      </button>
                    </div>
                  ) : selectedYear ? (
                    <div className="space-y-1">
                      <p className="font-semibold text-zinc-600">
                        Tidak ada usulan hibah yang terdaftar pada Tahun {selectedYear}
                      </p>
                      <button
                        type="button"
                        onClick={onClearYear}
                        className="font-bold text-red-600 hover:underline cursor-pointer"
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
  );
}
