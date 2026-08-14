"use client";

import { useState } from "react";
import StatusBadge from "./status-badge";
import { useMode, bidangInfo, BidangId } from "@/context/mode-context";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentIcon,
  DownloadIcon,
  EyeIcon,
  FileCheckIcon,
  FilterIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  XIcon,
} from "./icons";

type Proposal = {
  id: number;
  name: string;
  instansi: string;
  bidangId: BidangId;
  kategori: string;
  nominal: number;
  tanggal: string;
  status: string;
};

const proposals: Proposal[] = [
  { id: 1, name: "Revitalisasi Taman Budaya", instansi: "Dinas Kebudayaan Kota", bidangId: 2, kategori: "Seni Budaya", nominal: 250000000, tanggal: "05 Agu 2026", status: "Disetujui" },
  { id: 2, name: "Penguatan Kapasitas FKUB", instansi: "FKUB Kota", bidangId: 3, kategori: "Kerukunan", nominal: 85000000, tanggal: "04 Agu 2026", status: "Menunggu" },
  { id: 3, name: "Festival Kerukunan Antar Umat", instansi: "Panitia FKUB", bidangId: 3, kategori: "Kerukunan", nominal: 120000000, tanggal: "01 Agu 2026", status: "Disetujui" },
  { id: 4, name: "Pelatihan Wawasan Kebangsaan", instansi: "SMPN 4 Kota", bidangId: 1, kategori: "Pendidikan", nominal: 45000000, tanggal: "29 Jul 2026", status: "Ditolak" },
  { id: 5, name: "Dialog Kebangsaan Mahasiswa", instansi: "Universitas Negeri", bidangId: 1, kategori: "Pendidikan", nominal: 60000000, tanggal: "27 Jul 2026", status: "Menunggu" },
  { id: 6, name: "Penyuluhan Anti Narkoba & Wasnas", instansi: "BNNK / Komunitas", bidangId: 4, kategori: "Kawasan", nominal: 75000000, tanggal: "24 Jul 2026", status: "Disetujui" },
  { id: 7, name: "Pekan Olahraga Pemuda & Karang Taruna", instansi: "KONI Kota", bidangId: 2, kategori: "Pemuda", nominal: 180000000, tanggal: "20 Jul 2026", status: "Menunggu" },
  { id: 8, name: "Safari Ramadhan & Kerukunan Agama", instansi: "MUI Kota", bidangId: 3, kategori: "Kerukunan", nominal: 95000000, tanggal: "15 Jul 2026", status: "Disetujui" },
  { id: 9, name: "Pelatihan Kepemimpinan Pemuda Pancasila", instansi: "Karang Taruna", bidangId: 1, kategori: "Pemuda", nominal: 50000000, tanggal: "11 Jul 2026", status: "Disetujui" },
  { id: 10, name: "Bantuan Forum Lintas Agama", instansi: "Paguyuban Agama", bidangId: 3, kategori: "Kerukunan", nominal: 110000000, tanggal: "08 Jul 2026", status: "Ditolak" },
  { id: 11, name: "Festival Kebudayaan Nusantara", instansi: "Dinas Pariwisata", bidangId: 2, kategori: "Seni Budaya", nominal: 200000000, tanggal: "03 Jul 2026", status: "Menunggu" },
  { id: 12, name: "Pembinaan Parpol & Ormas Daerah", instansi: "Kesbangpol Kota", bidangId: 2, kategori: "Politik", nominal: 40000000, tanggal: "30 Jun 2026", status: "Disetujui" },
];

const statuses = ["Semua", "Disetujui", "Menunggu", "Ditolak"];
const PAGE_SIZE = 6;

const formatRupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

export default function HibahTable() {
  const { mode, bidangId } = useMode();
  const [proposalsList, setProposalsList] = useState<Proposal[]>(proposals);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Semua");
  const [filterBidang, setFilterBidang] = useState<number | "Semua">(
    mode === "bidang" ? bidangId : "Semua"
  );
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  // Form states for New Proposal
  const [newName, setNewName] = useState("");
  const [newInstansi, setNewInstansi] = useState("");
  const [newBidangId, setNewBidangId] = useState<BidangId>(mode === "bidang" ? bidangId : 1);
  const [newKategori, setNewKategori] = useState("Seni Budaya");
  const [newNominal, setNewNominal] = useState("");
  const [newPic, setNewPic] = useState("");
  const [newNoTelp, setNewNoTelp] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);

  const filtered = proposalsList.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.instansi.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "Semua" || p.status === status;
    const matchesBidang = filterBidang === "Semua" || p.bidangId === filterBidang;
    return matchesQuery && matchesStatus && matchesBidang;
  });

  const handleAddProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newInstansi.trim() || !newNominal) return;

    const numericNominal = Number(newNominal.replace(/\D/g, "")) || 50000000;
    const newP: Proposal = {
      id: Date.now(),
      name: newName,
      instansi: newInstansi,
      bidangId: newBidangId,
      kategori: newKategori,
      nominal: numericNominal,
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Menunggu",
    };

    setProposalsList([newP, ...proposalsList]);
    setShowAddModal(false);

    // Reset
    setNewName("");
    setNewInstansi("");
    setNewNominal("");
    setNewPic("");
    setNewNoTelp("");
    setNewFile(null);
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Filter:</span>

        {/* Bidang Dropdown */}
        {mode === "admin" && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500">Bidang:</span>
            <select
              value={filterBidang === "Semua" ? "Semua" : String(filterBidang)}
              onChange={(e) => {
                setFilterBidang(
                  e.target.value === "Semua" ? "Semua" : (Number(e.target.value) as BidangId)
                );
                setPage(1);
              }}
              className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
            >
              <option value="Semua">Semua Bidang</option>
              {([1, 2, 3, 4] as BidangId[]).map((id) => (
                <option key={id} value={String(id)}>
                  Bidang {id}
                </option>
              ))}
            </select>
          </div>
        )}

        {mode === "admin" && <div className="h-4 w-px bg-zinc-200 hidden sm:block" />}

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500">Status:</span>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "Semua" ? "Semua Status" : s}
              </option>
            ))}
          </select>
        </div>

        {/* Search & Actions on Right */}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Cari nama hibah..."
              className="h-9 w-44 rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-xs outline-none transition focus:border-red-400 focus:bg-white sm:w-56"
            />
          </div>

          <button
            onClick={() => alert("Mengunduh Rekap CSV Hibah...")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-900"
            title="Export Rekap CSV"
          >
            <DownloadIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {mode !== "bidang" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/25 transition hover:bg-red-500 active:scale-[0.98]"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              <span>Tambah Usulan Hibah</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3 font-semibold">Nama Usulan Hibah</th>
                <th className="px-5 py-3 font-semibold">Lembaga Pemohon</th>
                <th className="px-5 py-3 font-semibold">Tujuan Bidang</th>
                <th className="px-5 py-3 font-semibold">Kategori</th>
                <th className="px-5 py-3 font-semibold">Nominal Diajukan</th>
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
                  <td className="px-5 py-4 font-semibold text-zinc-900">{p.name}</td>
                  <td className="px-5 py-4 text-xs text-zinc-600">{p.instansi}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${
                        bidangInfo[p.bidangId].color
                      }`}
                    >
                      Bidang {p.bidangId}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                      {p.kategori}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold tabular-nums text-zinc-900">
                    {formatRupiah(p.nominal)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      {mode === "bidang" && (
                        <button
                          onClick={() => alert(`Lakukan Evaluasi Teknis Bidang ${p.bidangId} untuk "${p.name}"`)}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-red-500 shadow-sm"
                        >
                          <FileCheckIcon className="h-3.5 w-3.5" />
                          Evaluasi
                        </button>
                      )}
                      {mode === "admin" && (
                        <>
                          <button
                            onClick={() => setSelectedProposal(p)}
                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Lihat detail proposal"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              const newNom = prompt(`Ubah nominal usulan "${p.name}":`, String(p.nominal));
                              if (newNom) {
                                setProposalsList(proposalsList.map((item) => item.id === p.id ? { ...item, nominal: Number(newNom) || item.nominal } : item));
                              }
                            }}
                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus proposal "${p.name}"?`)) {
                                setProposalsList(proposalsList.filter((item) => item.id !== p.id));
                              }
                            }}
                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Hapus"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
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
              Menampilkan {(current - 1) * PAGE_SIZE + 1}–
              {(current - 1) * PAGE_SIZE + visible.length} dari {filtered.length} proposal
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={current === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
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
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
              >
                Berikutnya
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form Tambah Permohonan Usulan Hibah Baru */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">
                  Formulir Permohonan Hibah Baru
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Input data pengajuan proposal hibah daerah dari lembaga / organisasi kemasyarakatan.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddProposal} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-700">
                  Nama Kegiatan / Usulan Hibah *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Festival Seni Budaya Sunda & Karawitan 2026"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Lembaga / Ormas Pemohon *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Paguyuban Seni Budaya Kota"
                    value={newInstansi}
                    onChange={(e) => setNewInstansi(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Nominal Dana Diajukan (Rp) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Rp 120.000.000"
                    value={newNominal}
                    onChange={(e) => setNewNominal(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs font-semibold text-zinc-900 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Tujuan Bidang Teknis *
                  </label>
                  <select
                    value={newBidangId}
                    onChange={(e) => setNewBidangId(Number(e.target.value) as BidangId)}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-xs font-medium outline-none focus:border-red-400"
                  >
                    {([1, 2, 3, 4] as BidangId[]).map((id) => (
                      <option key={id} value={id}>
                        {bidangInfo[id].shortName} ({bidangInfo[id].fullName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Kategori Program / Kegiatan *
                  </label>
                  <select
                    value={newKategori}
                    onChange={(e) => setNewKategori(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-xs font-medium outline-none focus:border-red-400"
                  >
                    <option value="Seni Budaya">Seni Budaya & Tradisi</option>
                    <option value="Kerukunan">Kerukunan Antar Umat Beragama</option>
                    <option value="Pemuda">Kepemudaan & Olahraga</option>
                    <option value="Pendidikan">Pendidikan & Karakter Bangsa</option>
                    <option value="Politik">Pendidikan Politik Masyarakat</option>
                    <option value="Kawasan">Kewaspadaan & Pencegahan Konflik</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Nama Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Ketua / Pengurus"
                    value={newPic}
                    onChange={(e) => setNewPic(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Nomor Kontak / WhatsApp PIC
                  </label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={newNoTelp}
                    onChange={(e) => setNewNoTelp(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400"
                  />
                </div>
              </div>

              {/* Upload Berkas Proposal */}
              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-700">
                  Unggah Dokumen Proposal & Rencana Anggaran Biaya (RAB)
                </label>
                <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/60 p-4 text-center hover:border-red-500 hover:bg-red-50/20 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setNewFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {newFile ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <DocumentIcon className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-zinc-900 truncate max-w-xs">{newFile.name}</p>
                        <p className="text-[11px] text-emerald-600 font-semibold">
                          {(newFile.size / (1024 * 1024)).toFixed(2)} MB • Berkas Terpilih
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <DocumentIcon className="mx-auto h-7 w-7 text-zinc-400" />
                      <p className="text-xs font-semibold text-zinc-700">
                        Pilih file proposal (PDF atau DOCX)
                      </p>
                      <p className="text-[10px] text-zinc-400">Maksimal 25 MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-600/25 hover:from-red-700 hover:to-rose-700 transition active:scale-[0.98]"
                >
                  Daftarkan Usulan Hibah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Usulan Hibah */}
      {selectedProposal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
              <div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white mb-2 ${
                    bidangInfo[selectedProposal.bidangId].color
                  }`}
                >
                  Bidang {selectedProposal.bidangId}
                </span>
                <h4 className="text-lg font-bold text-zinc-900">
                  {selectedProposal.name}
                </h4>
                <p className="text-xs text-zinc-500">{selectedProposal.instansi}</p>
              </div>
              <button
                onClick={() => setSelectedProposal(null)}
                className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-100">
                  <span className="text-zinc-400">Nominal Diajukan:</span>
                  <p className="font-bold text-zinc-900 text-sm mt-0.5">{formatRupiah(selectedProposal.nominal)}</p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-100">
                  <span className="text-zinc-400">Status Proposal:</span>
                  <div className="mt-1">
                    <StatusBadge status={selectedProposal.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-zinc-100 p-3">
                  <span className="text-zinc-400">Kategori Kegiatan:</span>
                  <p className="font-semibold text-zinc-800 mt-0.5">{selectedProposal.kategori}</p>
                </div>
                <div className="rounded-xl border border-zinc-100 p-3">
                  <span className="text-zinc-400">Tanggal Masuk:</span>
                  <p className="font-semibold text-zinc-800 mt-0.5">{selectedProposal.tanggal}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-5 border-t border-zinc-100 mt-6">
              <button
                type="button"
                onClick={() => setSelectedProposal(null)}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
