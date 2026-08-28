"use client";

import { useState, useEffect } from "react";
import { useMode, bidangInfo, BidangId } from "@/context/mode-context";
import {
  useHibah,
  ProposalItem,
  LemariArsip,
  LEMARI_OPTIONS,
} from "@/context/hibah-context";
import StatusBadge, { RetentionBadge } from "./status-badge";
import {
  ArchiveIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentIcon,
  DownloadIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  XIcon,
} from "./icons";

const lemariFilterList = [
  "Semua",
  "Lemari Arsip 01",
  "Lemari Arsip 02",
  "Lemari Arsip 03",
  "Lemari Arsip 04",
  "Lemari Arsip Khusus",
];

const formatRupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

export default function HibahTable() {
  const { mode, bidangId } = useMode();
  const {
    proposals,
    addProposal,
    updateProposal,
    updateProposalLemari,
    deleteProposal,
    isOlderThan5Years,
  } = useHibah();

  const [query, setQuery] = useState("");
  const [filterLemari, setFilterLemari] = useState("Semua");
  const [filterBidang, setFilterBidang] = useState<number | "Semua">(
    mode === "bidang" ? bidangId : "Semua"
  );
  // Auto-hide documents older than 5 years (permanent — only Arsip Hibah can show these)
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ProposalItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editInstansi, setEditInstansi] = useState("");
  const [editKategori, setEditKategori] = useState("");
  const [editNominal, setEditNominal] = useState("");
  const [editPic, setEditPic] = useState("");
  const [editNoTelp, setEditNoTelp] = useState("");
  const [editCatatan, setEditCatatan] = useState("");

  // Form states for New Proposal
  const [newName, setNewName] = useState("");
  const [newInstansi, setNewInstansi] = useState("");
  const [newBidangId, setNewBidangId] = useState<BidangId>(
    mode === "bidang" ? bidangId : 1
  );
  const [newLemari, setNewLemari] = useState<LemariArsip>(
    mode === "bidang"
      ? (`Lemari Arsip 0${bidangId}` as LemariArsip)
      : "Lemari Arsip 01"
  );
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
      setNewLemari(`Lemari Arsip 0${bidangId}` as LemariArsip);
    }
  }, [mode, bidangId]);

  const filtered = proposals.filter((p) => {
    // Hard filter: documents older than 5 years are not shown here
    // They are accessible exclusively via the Arsip Hibah page
    if (isOlderThan5Years(p.tahun || p.tanggal)) return false;

    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.instansi.toLowerCase().includes(query.toLowerCase());
    const matchesLemari =
      filterLemari === "Semua" || p.lemariArsip === filterLemari;
    const matchesBidang =
      mode === "bidang"
        ? p.bidangId === bidangId
        : filterBidang === "Semua" || p.bidangId === filterBidang;

    return matchesQuery && matchesLemari && matchesBidang;
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
      lemariArsip: newLemari,
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

    showToast(`Dokumen usulan hibah berhasil diarsipkan ke ${newLemari}!`);
  };

  const handleChangeLemari = (
    id: number,
    targetLemari: LemariArsip,
    proposalName: string
  ) => {
    updateProposalLemari(id, targetLemari);
    showToast(`Dokumen "${proposalName}" telah dipindahkan ke ${targetLemari}.`);
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

        {/* Lemari Arsip Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500">Lemari:</span>
          <select
            value={filterLemari}
            onChange={(e) => setFilterLemari(e.target.value)}
            className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
          >
            {lemariFilterList.map((s) => (
              <option key={s} value={s}>
                {s === "Semua" ? "Semua Lemari" : s}
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
            onClick={() => alert("Mengunduh Rekap CSV Hibah Berdasarkan Lemari Arsip...")}
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

      {/* Full Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/70 text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3.5 font-semibold">Nama Usulan Hibah</th>
                <th className="px-5 py-3.5 font-semibold">Lembaga Pemohon</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">Tujuan Bidang</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">Kategori</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">Nominal Diajukan</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">Lemari Arsip</th>
                <th className="px-5 py-3.5 text-left font-semibold whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((p) => {
                return (
                  <tr
                    key={p.id}
                    className="transition-colors hover:bg-zinc-50/80"
                  >
                    <td className="px-5 py-4 font-semibold text-zinc-900">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-zinc-900">{p.name}</p>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-normal text-zinc-400 mt-0.5 whitespace-nowrap">
                        <span>Tahun {p.tahun || p.tanggal}</span>
                        {p.fileName && (
                          <span className="inline-flex items-center gap-1">
                            &bull; <DocumentIcon className="h-3 w-3 text-zinc-400" />
                            {p.fileName}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-600 font-medium">{p.instansi}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white whitespace-nowrap shrink-0 ${
                          bidangInfo[p.bidangId].color
                        }`}
                      >
                        Bidang {p.bidangId}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 whitespace-nowrap shrink-0">
                        {p.kategori}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold tabular-nums text-zinc-900 whitespace-nowrap">
                      {formatRupiah(p.nominal)}
                    </td>

                    {/* Spreadsheet-like Lemari Arsip Selector */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="relative inline-flex items-center">
                        <select
                          value={p.lemariArsip}
                          onChange={(e) =>
                            handleChangeLemari(
                              p.id,
                              e.target.value as LemariArsip,
                              p.name
                            )
                          }
                          className="cursor-pointer appearance-none rounded-full py-1.5 pl-3.5 pr-7 text-xs font-bold ring-1 ring-inset outline-none transition-all shadow-sm bg-white hover:bg-zinc-50 whitespace-nowrap shrink-0"
                          title="Klik untuk memindahkan ke Lemari Arsip lain"
                        >
                          {LEMARI_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {/* Down arrow */}
                        <ChevronDownIcon className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-zinc-500" />
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="px-5 py-4 whitespace-nowrap text-left">
                      <div className="flex items-center justify-start gap-1.5">
                        <button
                          onClick={() => setSelectedProposal(p)}
                          className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm whitespace-nowrap shrink-0"
                          title="Lihat Detail & Dokumen"
                        >
                          <EyeIcon className="h-3.5 w-3.5" />
                          <span>Detail</span>
                        </button>

                        {mode === "admin" && (
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus dokumen "${p.name}"?`)) {
                                deleteProposal(p.id);
                                showToast(`Dokumen "${p.name}" telah dihapus.`);
                              }
                            }}
                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Hapus Usulan"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-sm text-zinc-400">
                    Tidak ada usulan hibah yang cocok dengan kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-5 py-3.5 text-xs text-zinc-500">
          <p>
            Menampilkan <strong className="font-semibold text-zinc-900">{filtered.length}</strong> data usulan hibah aktif
            <span className="text-zinc-400 ml-1">(5 tahun terakhir)</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">
              Penyimpanan: 5 Lemari Arsip Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Modal Form Tambah Usulan Hibah Baru */}
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
                  Formulir Pengarsipan Hibah Baru
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Input data usulan hibah dan tentukan Lemari Arsip penyimpanan berkas fisik & digital.
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
                    onChange={(e) => {
                      const id = Number(e.target.value) as BidangId;
                      setNewBidangId(id);
                      setNewLemari(`Lemari Arsip 0${id}` as LemariArsip);
                    }}
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
                    Penempatan Lemari Arsip *
                  </label>
                  <select
                    value={newLemari}
                    onChange={(e) => setNewLemari(e.target.value as LemariArsip)}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-xs font-bold text-zinc-800 outline-none focus:border-red-400 bg-zinc-50"
                  >
                    {LEMARI_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label} - {opt.desc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              </div>

              {/* Upload Berkas Proposal */}
              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-700">
                  Unggah Dokumen Berkas Hibah (NPHD/Proposal/LPJ) *
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
                        Pilih file dokumen hibah (PDF / Dokumen / Gambar)
                      </p>
                      <p className="text-[10px] text-zinc-400">Dokumen dapat langsung dilihat di sistem tanpa perlu diunduh</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Storage Notice */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 text-xs text-zinc-700 flex items-center gap-2">
                <ArchiveIcon className="h-4 w-4 shrink-0 text-red-600" />
                <span>Dokumen akan tersimpan di <strong>{newLemari}</strong> dan terintegrasi otomatis ke sistem arsip digital.</span>
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
                  {isSubmitting ? "Menyimpan Berkas..." : "Simpan & Masukkan ke Lemari Arsip"}
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
                  {isOlderThan5Years(selectedProposal.tahun || selectedProposal.tanggal) && (
                    <RetentionBadge isOlder={true} />
                  )}
                </div>
                <h4 className="text-lg font-bold text-zinc-900">
                  {selectedProposal.name}
                </h4>
                <p className="text-xs text-zinc-500 font-medium">{selectedProposal.instansi}</p>
              </div>
              <div className="flex items-center gap-2">
                {mode === "admin" && !isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditName(selectedProposal.name);
                      setEditInstansi(selectedProposal.instansi);
                      setEditKategori(selectedProposal.kategori);
                      setEditNominal(selectedProposal.nominal.toString());
                      setEditPic(selectedProposal.pic || "");
                      setEditNoTelp(selectedProposal.noTelp || "");
                      setEditCatatan(selectedProposal.catatan || "");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition"
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                    Edit
                  </button>
                )}
                <button
                  onClick={() => { setSelectedProposal(null); setIsEditing(false); }}
                  className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="mt-4 flex-1 overflow-y-auto space-y-5 pr-1 text-xs">

              {/* ---- Edit Panel ---- */}
              {isEditing && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 space-y-3">
                  <p className="text-xs font-bold text-blue-800 mb-1">Mode Edit — Ubah Data Usulan</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Nama Usulan</label>
                      <input value={editName} onChange={e => setEditName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Lembaga Pemohon</label>
                      <input value={editInstansi} onChange={e => setEditInstansi(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Kategori</label>
                      <input value={editKategori} onChange={e => setEditKategori(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Nominal (angka)</label>
                      <input type="number" value={editNominal} onChange={e => setEditNominal(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-500 mb-1">PIC / Kontak</label>
                      <input value={editPic} onChange={e => setEditPic(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-500 mb-1">No. Telepon</label>
                      <input value={editNoTelp} onChange={e => setEditNoTelp(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Catatan</label>
                    <textarea value={editCatatan} onChange={e => setEditCatatan(e.target.value)} rows={2}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 resize-none" />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        const updates = {
                          name: editName,
                          instansi: editInstansi,
                          kategori: editKategori,
                          nominal: parseFloat(editNominal) || selectedProposal.nominal,
                          pic: editPic,
                          noTelp: editNoTelp,
                          catatan: editCatatan,
                        };
                        updateProposal(selectedProposal.id, updates);
                        setSelectedProposal({ ...selectedProposal, ...updates });
                        setIsEditing(false);
                        showToast("Data berhasil diperbarui.");
                      }}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                    >
                      Simpan Perubahan
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-100">
                  <span className="text-zinc-400 block text-[11px]">Nominal Hibah</span>
                  <p className="font-bold text-zinc-900 text-sm mt-0.5">{formatRupiah(selectedProposal.nominal)}</p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-100">
                  <span className="text-zinc-400 block text-[11px]">Lokasi Lemari Arsip</span>
                  <div className="mt-1">
                    <StatusBadge status={selectedProposal.lemariArsip} />
                  </div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-100">
                  <span className="text-zinc-400 block text-[11px]">Tahun / Tgl Masuk</span>
                  <p className="font-semibold text-zinc-800 mt-0.5">{selectedProposal.tanggal}</p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-100">
                  <span className="text-zinc-400 block text-[11px]">PIC / Pemohon</span>
                  <p className="font-semibold text-zinc-800 mt-0.5 truncate">{selectedProposal.pic || "Ketua Pengurus"}</p>
                </div>
              </div>

              {/* Quick Lemari Switcher Inside Detail */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3.5">
                <div>
                  <p className="font-bold text-zinc-900 text-xs">Pindahkan Lokasi Lemari Arsip</p>
                  <p className="text-[11px] text-zinc-500">
                    Ubah lokasi lemari arsip penyimpanan dokumen ini secara instan.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {LEMARI_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        handleChangeLemari(selectedProposal.id, opt.id, selectedProposal.name);
                        setSelectedProposal({ ...selectedProposal, lemariArsip: opt.id });
                      }}
                      className={`rounded-xl px-2.5 py-1.5 text-[11px] font-bold transition ${
                        selectedProposal.lemariArsip === opt.id
                          ? "bg-red-600 text-white shadow-sm"
                          : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Viewer Inline */}
              <div className="rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-900 shadow-inner">
                <div className="flex items-center justify-between bg-zinc-800 px-4 py-2.5 text-zinc-200 border-b border-zinc-700">
                  <div className="flex items-center gap-2">
                    <DocumentIcon className="h-4 w-4 text-red-400" />
                    <span className="font-semibold text-xs">
                      Pratinjau Dokumen Naskah Hibah & Berkas
                    </span>
                    <span className="rounded bg-zinc-700 px-2 py-0.5 text-[10px] text-zinc-300">
                      {selectedProposal.fileName || "Naskah_Hibah_Resmi.pdf"}
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
                          Arsip Naskah Hibah Daerah
                        </p>
                        <p className="text-[11px] font-sans text-zinc-500 mt-1">
                          Nomor Registrasi: REG-{selectedProposal.bidangId}-{selectedProposal.tahun || "2026"}/0{selectedProposal.id}
                        </p>
                      </div>

                      {/* Isi Naskah */}
                      <div className="space-y-2 text-[11px] leading-relaxed text-zinc-800 font-sans">
                        <p>
                          Dokumen pengarsipan bantuan hibah daerah tercatat pada basis data pengarsipan Bakesbangpol:
                        </p>
                        <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 space-y-1 my-2">
                          <p><strong>Nama Usulan:</strong> {selectedProposal.name}</p>
                          <p><strong>Lembaga Pemohon:</strong> {selectedProposal.instansi}</p>
                          <p><strong>Bidang Pengampu:</strong> {bidangInfo[selectedProposal.bidangId].fullName}</p>
                          <p><strong>Kategori Kegiatan:</strong> {selectedProposal.kategori}</p>
                          <p><strong>Besaran Usulan:</strong> {formatRupiah(selectedProposal.nominal)}</p>
                          <p><strong>Penempatan Lemari Arsip:</strong> <span className="text-red-700 font-bold">{selectedProposal.lemariArsip}</span></p>
                          <p><strong>Status Retensi:</strong> {isOlderThan5Years(selectedProposal.tahun || selectedProposal.tanggal) ? "Arsip Retensi (> 5 Tahun)" : "Arsip Aktif (≤ 5 Tahun)"}</p>
                        </div>
                        <p className="text-zinc-600 text-[10px] italic">
                          Dokumen ini telah diarsipkan dan tersimpan secara sah ke dalam Sistem Pengarsipan Hibah Digital Bakesbangpol Kota Bandung.
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
                          <p>Petugas Pengarsip Bakesbangpol,</p>
                          <div className="my-1 inline-block rounded border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                            TERARSIP DIGITAL & FISIK
                          </div>
                          <p className="mt-4 font-bold underline">{selectedProposal.lemariArsip}</p>
                          <p className="text-zinc-400">Ruang Arsip Bakesbangpol</p>
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
                onClick={() => { setSelectedProposal(null); setIsEditing(false); }}
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
