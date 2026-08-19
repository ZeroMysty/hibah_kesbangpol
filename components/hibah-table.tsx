"use client";

import { useState, useEffect } from "react";
import { useMode, bidangInfo, BidangId } from "@/context/mode-context";
import { useHibah, ProposalItem, ProposalStatus } from "@/context/hibah-context";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentIcon,
  DownloadIcon,
  EyeIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  XIcon,
  ClockIcon,
} from "./icons";

const statuses = ["Semua", "Selesai", "Menunggu"];

const formatRupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

export default function HibahTable() {
  const { mode, bidangId } = useMode();
  const { proposals, addProposal, updateProposalStatus, deleteProposal } = useHibah();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Semua");
  const [filterBidang, setFilterBidang] = useState<number | "Semua">(
    mode === "bidang" ? bidangId : "Semua"
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ProposalItem | null>(null);

  // Form states for New Proposal
  const [newName, setNewName] = useState("");
  const [newInstansi, setNewInstansi] = useState("");
  const [newBidangId, setNewBidangId] = useState<BidangId>(mode === "bidang" ? bidangId : 1);
  const [newKategori, setNewKategori] = useState("Seni Budaya");
  const [newNominal, setNewNominal] = useState("");
  const [newPic, setNewPic] = useState("");
  const [newNoTelp, setNewNoTelp] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast notification feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync state when mode/bidangId updates from localStorage
  useEffect(() => {
    if (mode === "bidang") {
      setFilterBidang(bidangId);
      setNewBidangId(bidangId);
    }
  }, [mode, bidangId]);

  const filtered = proposals.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.instansi.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "Semua" || p.status === status;
    const matchesBidang =
      mode === "bidang"
        ? p.bidangId === bidangId
        : filterBidang === "Semua" || p.bidangId === filterBidang;
    return matchesQuery && matchesStatus && matchesBidang;
  });

  const handleAddProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newInstansi.trim() || !newNominal) return;

    setIsSubmitting(true);
    const numericNominal = Number(newNominal.replace(/\D/g, "")) || 50000000;

    await addProposal({
      name: newName,
      instansi: newInstansi,
      bidangId: newBidangId,
      kategori: newKategori,
      nominal: numericNominal,
      pic: newPic,
      noTelp: newNoTelp,
      file: newFile,
    });

    setIsSubmitting(false);
    setShowAddModal(false);

    // Reset
    setNewName("");
    setNewInstansi("");
    setNewNominal("");
    setNewPic("");
    setNewNoTelp("");
    setNewFile(null);

    showToast("Dokumen permohonan berhasil diunggah! Status: Menunggu / Proses.");
  };

  const handleChangeStatus = (id: number, newStatus: ProposalStatus, proposalName: string) => {
    updateProposalStatus(id, newStatus);

    if (newStatus === "Selesai") {
      showToast(`Status "${proposalName}" telah diubah ke SELESAI / DITERIMA dan otomatis dipindahkan ke Arsip Dokumen.`);
    } else {
      showToast(`Status "${proposalName}" diubah menjadi MENUNGGU / PROSES.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-zinc-900 px-5 py-3.5 text-xs font-semibold text-white shadow-2xl animate-fade-in">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckCircleIcon className="h-4 w-4" />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-zinc-400 hover:text-white"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Filter:</span>

        {/* Bidang Dropdown */}
        {mode === "admin" ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500">Bidang:</span>
            <select
              value={filterBidang === "Semua" ? "Semua" : String(filterBidang)}
              onChange={(e) =>
                setFilterBidang(
                  e.target.value === "Semua" ? "Semua" : (Number(e.target.value) as BidangId)
                )
              }
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
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500">Bidang:</span>
            <span
              className={`inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-sm ${bidangInfo[bidangId].color}`}
            >
              Bidang {bidangId}
            </span>
          </div>
        )}

        <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500">Status:</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama hibah / instansi..."
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

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/25 transition hover:bg-red-500 active:scale-[0.98]"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            <span>Tambah Usulan Hibah</span>
          </button>
        </div>
      </div>

      {/* Full Table (Full-height without restrictive height truncation) */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/70 text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3.5 font-semibold">Nama Usulan Hibah</th>
                <th className="px-5 py-3.5 font-semibold">Lembaga Pemohon</th>
                <th className="px-5 py-3.5 font-semibold">Tujuan Bidang</th>
                <th className="px-5 py-3.5 font-semibold">Kategori</th>
                <th className="px-5 py-3.5 font-semibold">Nominal Diajukan</th>
                <th className="px-5 py-3.5 font-semibold">Status Berkas</th>
                <th className="px-5 py-3.5 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-zinc-50/80"
                >
                  <td className="px-5 py-4 font-semibold text-zinc-900">
                    <p className="font-semibold text-zinc-900">{p.name}</p>
                    {p.fileName && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-normal text-zinc-400 mt-0.5">
                        <DocumentIcon className="h-3 w-3 text-zinc-400" />
                        {p.fileName}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-600 font-medium">{p.instansi}</td>
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

                  {/* Spreadsheet-like Simple Status Selector (No cut-off, Excel Style) */}
                  <td className="px-5 py-4">
                    <div className="relative inline-flex items-center">
                      <select
                        value={p.status}
                        onChange={(e) =>
                          handleChangeStatus(p.id, e.target.value as ProposalStatus, p.name)
                        }
                        className={`cursor-pointer appearance-none rounded-full py-1.5 pl-6 pr-7 text-xs font-bold ring-1 ring-inset outline-none transition-all shadow-sm ${
                          p.status === "Selesai"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/25 hover:bg-emerald-100/80"
                            : "bg-amber-50 text-amber-700 ring-amber-600/25 hover:bg-amber-100/80"
                        }`}
                        title="Klik untuk mengubah status (Menunggu / Selesai)"
                      >
                        <option value="Menunggu">Menunggu</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                      {/* Dot indicator */}
                      <span
                        className={`pointer-events-none absolute left-2.5 h-1.5 w-1.5 rounded-full ${
                          p.status === "Selesai" ? "bg-emerald-600" : "bg-amber-600"
                        }`}
                      />
                      {/* Down arrow */}
                      <ChevronDownIcon
                        className={`pointer-events-none absolute right-2 h-3.5 w-3.5 ${
                          p.status === "Selesai" ? "text-emerald-700" : "text-amber-700"
                        }`}
                      />
                    </div>
                  </td>

                  {/* Aksi */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedProposal(p)}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                        title="Lihat Detail & Dokumen"
                      >
                        <EyeIcon className="h-3.5 w-3.5" />
                        <span>Detail</span>
                      </button>

                      {mode === "admin" && (
                        <button
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus proposal "${p.name}"?`)) {
                              deleteProposal(p.id);
                              showToast(`Proposal "${p.name}" telah dihapus.`);
                            }
                          }}
                          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Hapus Proposal"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-sm text-zinc-400">
                    Tidak ada proposal yang cocok dengan kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info showing full count */}
        <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-5 py-3.5 text-xs text-zinc-500">
          <p>
            Menampilkan seluruh <strong className="font-semibold text-zinc-900">{filtered.length}</strong> data usulan hibah
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Menunggu: {filtered.filter((p) => p.status === "Menunggu").length}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Selesai: {filtered.filter((p) => p.status === "Selesai").length}
            </span>
          </div>
        </div>
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
                  Input data pengajuan proposal hibah. Berkas yang disimpan akan ditetapkan berstatus <strong className="text-amber-600">Menunggu</strong> dan belum masuk ke Arsip.
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
                  Unggah Dokumen Proposal & Rencana Anggaran Biaya (RAB) *
                </label>
                <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/60 p-4 text-center hover:border-red-500 hover:bg-red-50/20 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
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
                          {(newFile.size / (1024 * 1024)).toFixed(2)} MB • Berkas Terpilih (Siap dipratinjau)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <DocumentIcon className="mx-auto h-7 w-7 text-zinc-400" />
                      <p className="text-xs font-semibold text-zinc-700">
                        Pilih file dokumen proposal (PDF / Dokumen / Gambar)
                      </p>
                      <p className="text-[10px] text-zinc-400">Dokumen dapat langsung dilihat di sistem tanpa perlu diunduh</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Notice */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-800 flex items-center gap-2">
                <ClockIcon className="h-4 w-4 shrink-0 text-amber-600" />
                <span>Dokumen yang diunggah akan otomatis memiliki status <strong>Menunggu</strong> dan belum masuk ke Arsip.</span>
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
                  disabled={isSubmitting}
                  className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-600/25 hover:from-red-700 hover:to-rose-700 transition active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan Dokumen..." : "Simpan & Daftarkan Usulan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Usulan Hibah + Inline Document Viewer */}
      {selectedProposal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-4xl rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl my-6 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-zinc-100 pb-4 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${
                      bidangInfo[selectedProposal.bidangId].color
                    }`}
                  >
                    Bidang {selectedProposal.bidangId}
                  </span>
                  <span className="text-xs text-zinc-400">• {selectedProposal.kategori}</span>
                </div>
                <h4 className="text-lg font-bold text-zinc-900">
                  {selectedProposal.name}
                </h4>
                <p className="text-xs text-zinc-500 font-medium">{selectedProposal.instansi}</p>
              </div>
              <button
                onClick={() => setSelectedProposal(null)}
                className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body with Tabs / Info & Document Viewer */}
            <div className="mt-4 flex-1 overflow-y-auto space-y-5 pr-1 text-xs">
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-100">
                  <span className="text-zinc-400 block text-[11px]">Nominal Pengajuan</span>
                  <p className="font-bold text-zinc-900 text-sm mt-0.5">{formatRupiah(selectedProposal.nominal)}</p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-100">
                  <span className="text-zinc-400 block text-[11px]">Status Saat Ini</span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${
                        selectedProposal.status === "Selesai"
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                          : "bg-amber-50 text-amber-700 ring-amber-600/20"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {selectedProposal.status}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-100">
                  <span className="text-zinc-400 block text-[11px]">Tanggal Masuk</span>
                  <p className="font-semibold text-zinc-800 mt-0.5">{selectedProposal.tanggal}</p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-100">
                  <span className="text-zinc-400 block text-[11px]">PIC / Pemohon</span>
                  <p className="font-semibold text-zinc-800 mt-0.5 truncate">{selectedProposal.pic || "Ketua Pengurus"}</p>
                </div>
              </div>

              {/* Status Action Inside Detail */}
              <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3.5">
                <div>
                  <p className="font-bold text-zinc-900 text-xs">Ubah Status Pengajuan</p>
                  <p className="text-[11px] text-zinc-500">
                    {selectedProposal.status === "Selesai"
                      ? "Dokumen ini telah Selesai dan terdaftar di Arsip."
                      : "Pilih Selesai untuk memverifikasi dan memindahkan berkas ke Arsip."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleChangeStatus(selectedProposal.id, "Menunggu", selectedProposal.name);
                      setSelectedProposal({ ...selectedProposal, status: "Menunggu" });
                    }}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                      selectedProposal.status === "Menunggu"
                        ? "bg-amber-500 text-white shadow-sm"
                        : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    Menunggu
                  </button>
                  <button
                    onClick={() => {
                      handleChangeStatus(selectedProposal.id, "Selesai", selectedProposal.name);
                      setSelectedProposal({ ...selectedProposal, status: "Selesai" });
                    }}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                      selectedProposal.status === "Selesai"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    Selesai
                  </button>
                </div>
              </div>

              {/* Document Viewer Inline */}
              <div className="rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-900 shadow-inner">
                <div className="flex items-center justify-between bg-zinc-800 px-4 py-2.5 text-zinc-200 border-b border-zinc-700">
                  <div className="flex items-center gap-2">
                    <DocumentIcon className="h-4 w-4 text-red-400" />
                    <span className="font-semibold text-xs">
                      Pratinjau Dokumen Naskah Proposal & RAB
                    </span>
                    <span className="rounded bg-zinc-700 px-2 py-0.5 text-[10px] text-zinc-300">
                      {selectedProposal.fileName || "Naskah_Proposal_Resmi.pdf"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-400">
                      {selectedProposal.fileSize || "3.2 MB"}
                    </span>
                  </div>
                </div>

                {/* Document Display Area */}
                <div className="bg-zinc-100 p-4 sm:p-6 min-h-[380px] max-h-[480px] overflow-y-auto flex items-center justify-center">
                  {selectedProposal.fileDataUrl ? (
                    selectedProposal.fileType?.startsWith("image/") ? (
                      /* Image Preview */
                      <div className="max-w-full flex flex-col items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedProposal.fileDataUrl}
                          alt="Pratinjau Dokumen"
                          className="max-h-[420px] rounded-lg shadow-lg object-contain bg-white border border-zinc-200"
                        />
                      </div>
                    ) : (
                      /* PDF / Document Embed */
                      <iframe
                        src={selectedProposal.fileDataUrl}
                        title="Pratinjau Dokumen PDF"
                        className="w-full h-[420px] rounded-lg border border-zinc-300 bg-white shadow"
                      />
                    )
                  ) : (
                    /* Simulated Official Indonesian Government Document Preview for Mock Items */
                    <div className="w-full max-w-2xl rounded-xl bg-white p-6 sm:p-8 shadow-md border border-zinc-200 text-zinc-900 space-y-4 font-serif">
                      {/* Kop Surat Resmi */}
                      <div className="text-center border-b-2 border-zinc-900 pb-4">
                        <p className="text-[11px] uppercase tracking-widest font-sans font-bold text-zinc-700">
                          Pemerintah Kota Bandung
                        </p>
                        <h5 className="text-sm font-bold uppercase tracking-wider font-sans text-zinc-900">
                          Badan Kesatuan Bangsa dan Politik
                        </h5>
                        <p className="text-[10px] font-sans text-zinc-500 italic mt-0.5">
                          Jalan Wastukencana No. 2, Babakan Ciamis, Sumur Bandung, Kota Bandung
                        </p>
                      </div>

                      {/* Judul Naskah */}
                      <div className="text-center py-2">
                        <p className="font-bold text-xs uppercase underline tracking-wide">
                          Naskah Pengajuan Usulan Bantuan Hibah Daerah
                        </p>
                        <p className="text-[11px] font-sans text-zinc-500 mt-1">
                          Nomor Registrasi: REG-{selectedProposal.bidangId}-2026/0{selectedProposal.id}
                        </p>
                      </div>

                      {/* Isi Naskah */}
                      <div className="space-y-2 text-[11px] leading-relaxed text-zinc-800 font-sans">
                        <p>
                          Menindaklanjuti permohonan hibah tahun anggaran 2026, bersama ini disampaikan usulan kegiatan sebagai berikut:
                        </p>
                        <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 space-y-1 my-2">
                          <p><strong>Nama Usulan:</strong> {selectedProposal.name}</p>
                          <p><strong>Lembaga Pemohon:</strong> {selectedProposal.instansi}</p>
                          <p><strong>Bidang Pengampu:</strong> {bidangInfo[selectedProposal.bidangId].fullName}</p>
                          <p><strong>Kategori Kegiatan:</strong> {selectedProposal.kategori}</p>
                          <p><strong>Besaran Usulan:</strong> {formatRupiah(selectedProposal.nominal)}</p>
                          <p><strong>Status Berkas:</strong> <span className={selectedProposal.status === "Selesai" ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>{selectedProposal.status === "Selesai" ? "Disetujui & Diterima (Tervalidasi)" : "Dalam Tahap Evaluasi & Verifikasi Administrasi"}</span></p>
                        </div>
                        <p className="text-zinc-600 text-[10px] italic">
                          Dokumen ini telah diunggah dan terdaftar secara sah ke dalam Sistem Pengarsipan Hibah Digital Bakesbangpol Kota Bandung.
                        </p>
                      </div>

                      {/* Tanda Tangan */}
                      <div className="flex justify-between pt-4 text-[10px] font-sans">
                        <div className="text-center">
                          <p>Pemohon Hibah,</p>
                          <p className="mt-8 font-bold underline">{selectedProposal.pic || selectedProposal.instansi}</p>
                          <p className="text-zinc-400">Ketua / Penanggung Jawab</p>
                        </div>
                        <div className="text-center">
                          <p>Verifikator Bakesbangpol,</p>
                          <div className="my-1 inline-block rounded border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                            {selectedProposal.status === "Selesai" ? "TERVERIFIKASI DIGITAL" : "DALAM PROSES"}
                          </div>
                          <p className="mt-4 font-bold underline">Tim Evaluasi Bidang {selectedProposal.bidangId}</p>
                          <p className="text-zinc-400">NIP. 19850412 201001 1 008</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-4 shrink-0">
              <button
                type="button"
                onClick={() => alert(`Mengunduh dokumen "${selectedProposal.fileName || selectedProposal.name}"...`)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                <DownloadIcon className="h-3.5 w-3.5" />
                <span>Unduh Berkas Asli</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedProposal(null)}
                className="rounded-xl bg-zinc-900 px-5 py-2 text-xs font-bold text-white hover:bg-zinc-800"
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
