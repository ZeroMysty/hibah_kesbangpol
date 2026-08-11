"use client";

import { useState } from "react";
import PageHeader from "./page-header";
import StatusBadge from "./status-badge";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  EyeIcon,
  FilterIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "./icons";

type Proposal = {
  id: number;
  name: string;
  instansi: string;
  kategori: string;
  nominal: number;
  tanggal: string;
  status: string;
};

const proposals: Proposal[] = [
  { id: 1, name: "Revitalisasi Taman Budaya", instansi: "Dinas Kebudayaan Kota", kategori: "Seni Budaya", nominal: 250000000, tanggal: "05 Agu 2026", status: "Disetujui" },
  { id: 2, name: "Penguatan Kapasitas FKUB", instansi: "FKUB Kota", kategori: "Kerukunan", nominal: 85000000, tanggal: "04 Agu 2026", status: "Menunggu" },
  { id: 3, name: "Festival Kerukunan Antar Umat", instansi: "Panitia FKUB", kategori: "Kerukunan", nominal: 120000000, tanggal: "01 Agu 2026", status: "Disetujui" },
  { id: 4, name: "Pelatihan Wawasan Kebangsaan", instansi: "SMPN 4 Kota", kategori: "Pendidikan", nominal: 45000000, tanggal: "29 Jul 2026", status: "Ditolak" },
  { id: 5, name: "Dialog Kebangsaan Mahasiswa", instansi: "Universitas Negeri", kategori: "Pendidikan", nominal: 60000000, tanggal: "27 Jul 2026", status: "Menunggu" },
  { id: 6, name: "Penyuluhan Anti Narkoba", instansi: "BNNK Kota", kategori: "Kesehatan", nominal: 75000000, tanggal: "24 Jul 2026", status: "Disetujui" },
  { id: 7, name: "Pekan Olahraga Pemuda", instansi: "KONI Kota", kategori: "Olahraga", nominal: 180000000, tanggal: "20 Jul 2026", status: "Menunggu" },
  { id: 8, name: "Safari Ramadhan Damai", instansi: "MUI Kota", kategori: "Kerukunan", nominal: 95000000, tanggal: "15 Jul 2026", status: "Disetujui" },
  { id: 9, name: "Pelatihan Kepemimpinan Pemuda", instansi: "Karang Taruna", kategori: "Pemuda", nominal: 50000000, tanggal: "11 Jul 2026", status: "Disetujui" },
  { id: 10, name: "Bantuan Komunitas Tionghoa", instansi: "Paguyuban Tionghoa", kategori: "Kerukunan", nominal: 110000000, tanggal: "08 Jul 2026", status: "Ditolak" },
  { id: 11, name: "Festival Budaya Nusantara", instansi: "Dinas Pariwisata", kategori: "Seni Budaya", nominal: 200000000, tanggal: "03 Jul 2026", status: "Menunggu" },
  { id: 12, name: "Pembinaan Ormas", instansi: "Kesbangpol Kota", kategori: "Pemuda", nominal: 40000000, tanggal: "30 Jun 2026", status: "Disetujui" },
];

const statuses = ["Semua", "Disetujui", "Menunggu", "Ditolak"];
const PAGE_SIZE = 6;

const formatRupiah = (n: number) =>
  "Rp " + n.toLocaleString("id-ID");

export default function HibahTable() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Semua");
  const [page, setPage] = useState(1);

  const filtered = proposals.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.instansi.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "Semua" || p.status === status;
    return matchesQuery && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Hibah"
        description="Kelola seluruh proposal hibah yang diajukan instansi dan organisasi."
        actions={
          <>
            <button className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-zinc-400 hover:bg-zinc-50">
              <DownloadIcon className="h-4 w-4" />
              Export CSV
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-500 hover:shadow-red-500/30 active:scale-[0.98]">
              <PlusIcon className="h-4 w-4" />
              Tambah Proposal
            </button>
          </>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Cari nama hibah atau instansi..."
            aria-label="Cari hibah"
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-4 text-sm outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400">
            <FilterIcon className="h-3.5 w-3.5" />
            Status
          </span>
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
                aria-pressed={status === s}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  status === s
                    ? "bg-red-600 text-white shadow-sm shadow-red-600/30"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3 font-semibold">Nama Hibah</th>
                <th className="px-5 py-3 font-semibold">Instansi</th>
                <th className="px-5 py-3 font-semibold">Kategori</th>
                <th className="px-5 py-3 font-semibold">Nominal</th>
                <th className="px-5 py-3 font-semibold">Tanggal</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-zinc-50 transition-colors last:border-0 hover:bg-zinc-50/70"
                >
                  <td className="px-5 py-4 font-medium">{p.name}</td>
                  <td className="px-5 py-4 text-zinc-500">{p.instansi}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                      {p.kategori}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold tabular-nums">{formatRupiah(p.nominal)}</td>
                  <td className="px-5 py-4 text-zinc-500">{p.tanggal}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={`Lihat ${p.name}`}
                        title="Lihat detail"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
                        aria-label={`Edit ${p.name}`}
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={`Hapus ${p.name}`}
                        title="Hapus"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-zinc-400">
                    Tidak ada proposal yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3">
            <p className="text-xs text-zinc-500">
              Menampilkan {(current - 1) * PAGE_SIZE + 1}–{(current - 1) * PAGE_SIZE + visible.length} dari {filtered.length} proposal
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={current === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
                Sebelumnya
              </button>
              <span className="px-3 text-xs font-semibold text-zinc-700">
                {current} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={current === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Berikutnya
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
