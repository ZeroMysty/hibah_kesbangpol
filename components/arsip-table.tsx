"use client";

import { useState, useEffect } from "react";
import { useMode, bidangInfo, BidangId } from "@/context/mode-context";
import { useHibah, ArsipItem } from "@/context/hibah-context";
import {
  ArchiveIcon,
  CheckCircleIcon,
  DocumentIcon,
  DownloadIcon,
  EyeIcon,
  FileCheckIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  XIcon,
} from "./icons";

const jenisList = ["Semua", "NPHD", "Berita Acara", "SK Hibah", "LPJ Terverifikasi", "Proposal & RAB"];
const currentYear = new Date().getFullYear();
const tahunList = ["Semua", ...Array.from({ length: 5 }, (_, i) => String(currentYear - i))];

export default function ArsipTable() {
  const { mode, bidangId } = useMode();
  const { arsipList, addArsip, deleteArsip } = useHibah();

  const [query, setQuery] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("Semua");
  const [selectedTahun, setSelectedTahun] = useState("Semua");
  const [activeBidangFilter, setActiveBidangFilter] = useState<number | "Semua">(
    mode === "bidang" ? bidangId : "Semua"
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<ArsipItem | null>(null);

  // Form New Archive State with Complete Metadata
  const [newKode, setNewKode] = useState(`ARS-B${mode === "bidang" ? bidangId : 1}-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [newJudul, setNewJudul] = useState("");
  const [newInstansi, setNewInstansi] = useState("");
  const [newJenis, setNewJenis] = useState<ArsipItem["jenis"]>("NPHD");
  const [newBidang, setNewBidang] = useState<BidangId>(mode === "bidang" ? bidangId : 1);
  const [newTahun, setNewTahun] = useState("2026");
  const [newTanggal, setNewTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [newNominal, setNewNominal] = useState("");
  const [newCatatan, setNewCatatan] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when mode/bidangId updates from localStorage
  useEffect(() => {
    if (mode === "bidang") {
      setActiveBidangFilter(bidangId);
      setNewBidang(bidangId);
      setNewKode(`ARS-B${bidangId}-2026-${Math.floor(100 + Math.random() * 900)}`);
    }
  }, [mode, bidangId]);

  const filteredArsip = arsipList.filter((item) => {
    // Mode restriction: if in Bidang mode, strictly filter to that specific bidang
    const matchesBidang =
      mode === "bidang"
        ? item.bidangId === bidangId
        : activeBidangFilter === "Semua"
        ? true
        : item.bidangId === activeBidangFilter;

    const matchesJenis = selectedJenis === "Semua" || item.jenis === selectedJenis;
    const matchesTahun = selectedTahun === "Semua" || item.tahun === selectedTahun;
    const matchesQuery =
      item.judul.toLowerCase().includes(query.toLowerCase()) ||
      item.kode.toLowerCase().includes(query.toLowerCase()) ||
      item.instansi.toLowerCase().includes(query.toLowerCase());

    return matchesBidang && matchesJenis && matchesTahun && matchesQuery;
  });

  const handleAddArchive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJudul.trim() || !newInstansi.trim()) return;

    setIsSubmitting(true);
    let fileDataUrl: string | undefined = undefined;
    let fileType: string | undefined = undefined;

    if (selectedFile) {
      fileType = selectedFile.type;
      try {
        fileDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(selectedFile);
        });
      } catch (err) {
        console.error("Gagal membaca file:", err);
      }
    }

    const formattedDate = new Date(newTanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    addArsip({
      kode: newKode || `ARS-B${newBidang}-${newTahun}-${Math.floor(100 + Math.random() * 900)}`,
      judul: newJudul,
      instansi: newInstansi,
      bidangId: newBidang,
      jenis: newJenis,
      tahun: newTahun,
      tanggal: formattedDate,
      ukuran: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : `${(Math.random() * 4 + 1.5).toFixed(1)} MB`,
      status: "Aktif",
      nominal: Number(newNominal.replace(/\D/g, "")) || undefined,
      catatan: newCatatan,
      fileName: selectedFile ? selectedFile.name : `${newJudul.replace(/\s+/g, "_")}.pdf`,
      fileDataUrl,
      fileType,
    });

    setIsSubmitting(false);
    setShowAddModal(false);

    // Reset Form
    setNewJudul("");
    setNewInstansi("");
    setNewNominal("");
    setNewCatatan("");
    setSelectedFile(null);
    setNewKode(`ARS-B${newBidang}-2026-${Math.floor(100 + Math.random() * 900)}`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Widget */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Total Berkas Terarsip</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <ArchiveIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-900">{filteredArsip.length} Dokumen</p>
          <p className="mt-0.5 text-[11px] text-zinc-400">Terverifikasi & Aman Digital</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Berkas NPHD & SK</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileCheckIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-900">
            {filteredArsip.filter((a) => a.jenis === "NPHD" || a.jenis === "SK Hibah").length} NPHD/SK
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-400">Siap Cetak / Audit</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">LPJ Terverifikasi</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircleIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-900">
            {filteredArsip.filter((a) => a.jenis === "LPJ Terverifikasi").length} Berkas LPJ
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-400">Selesai Pertanggungjawaban</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Penyimpanan Terpakai</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <DocumentIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-900">42.5 MB</p>
          <p className="mt-0.5 text-[11px] text-zinc-400">Kapasitas Cloud Server Kesbangpol</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Filter:
        </span>

        {/* Bidang Filter / Badge */}
        {mode === "admin" ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500">Bidang:</span>
            <select
              value={activeBidangFilter === "Semua" ? "Semua" : String(activeBidangFilter)}
              onChange={(e) =>
                setActiveBidangFilter(
                  e.target.value === "Semua" ? "Semua" : (Number(e.target.value) as BidangId)
                )
              }
              className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
            >
              <option value="Semua">Semua Bidang</option>
              {([1, 2, 3, 4] as BidangId[]).map((id) => (
                <option key={id} value={String(id)}>
                  {bidangInfo[id].shortName}
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

        {/* Tahun Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500">Tahun:</span>
          <select
            value={selectedTahun}
            onChange={(e) => setSelectedTahun(e.target.value)}
            className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
          >
            {tahunList.map((t) => (
              <option key={t} value={t}>
                {t === "Semua" ? "Semua Tahun" : `T.A. ${t}`}
              </option>
            ))}
          </select>
        </div>

        <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

        {/* Jenis Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500">Jenis:</span>
          <select
            value={selectedJenis}
            onChange={(e) => setSelectedJenis(e.target.value)}
            className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
          >
            {jenisList.map((j) => (
              <option key={j} value={j}>
                {j}
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
              placeholder="Cari kode arsip, judul..."
              className="h-9 w-44 rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-xs outline-none transition focus:border-red-400 focus:bg-white sm:w-56"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/25 transition hover:bg-red-500 active:scale-[0.98]"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            <span>Tambah Arsip</span>
          </button>
        </div>
      </div>

      {/* Full Main Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/70 text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3.5 font-semibold">Kode Arsip</th>
                <th className="px-5 py-3.5 font-semibold">Judul Dokumen</th>
                <th className="px-5 py-3.5 font-semibold">Bidang</th>
                <th className="px-5 py-3.5 font-semibold">Jenis</th>
                <th className="px-5 py-3.5 font-semibold">Tahun / Tgl</th>
                <th className="px-5 py-3.5 font-semibold">Ukuran</th>
                <th className="px-5 py-3.5 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredArsip.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-zinc-50/80"
                >
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 px-2 py-1 rounded">
                      {item.kode}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-zinc-900">{item.judul}</p>
                      <p className="text-xs text-zinc-500">{item.instansi}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${
                        bidangInfo[item.bidangId].color
                      }`}
                    >
                      Bidang {item.bidangId}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                      {item.jenis}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs font-semibold text-zinc-800">T.A. {item.tahun}</p>
                    <p className="text-[11px] text-zinc-400">{item.tanggal}</p>
                  </td>
                  <td className="px-5 py-4 text-xs font-mono text-zinc-500">{item.ukuran}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedDetail(item)}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                        title="Lihat Detail & Pratinjau Dokumen"
                      >
                        <EyeIcon className="h-3.5 w-3.5" />
                        <span>Detail</span>
                      </button>

                      {mode === "admin" && (
                        <button
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus arsip "${item.judul}"?`)) {
                              deleteArsip(item.id);
                            }
                          }}
                          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Hapus Arsip"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredArsip.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-sm text-zinc-400">
                    Tidak ada berkas arsip yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info showing full count */}
        <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-5 py-3.5 text-xs text-zinc-500">
          <p>
            Menampilkan seluruh <strong className="font-semibold text-zinc-900">{filteredArsip.length}</strong> berkas arsip digital
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Database Arsip Bakesbangpol Kota Bandung</span>
          </div>
        </div>
      </div>

      {/* Modal Add New Archive */}
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
                  Formulir Pengarsipan Dokumen Hibah Baru
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Lengkapi seluruh metadata naskah hibah untuk pengarsipan digital terintegrasi.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddArchive} className="mt-5 space-y-4">
              {/* Kode Arsip & Tahun Anggaran */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Nomor / Kode Berkas Arsip *
                  </label>
                  <input
                    type="text"
                    required
                    value={newKode}
                    onChange={(e) => setNewKode(e.target.value)}
                    placeholder="ARS-B1-2026-001"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2.5 text-xs font-mono font-bold text-zinc-900 outline-none focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Tahun Anggaran *
                  </label>
                  <select
                    value={newTahun}
                    onChange={(e) => setNewTahun(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs font-medium text-zinc-800 outline-none focus:border-red-400"
                  >
                    <option value="2026">2026 (Tahun Anggaran Berjalan)</option>
                    <option value="2025">2025 (Tahun Anggaran Lalu)</option>
                    <option value="2024">2024 (Arsip Riwayat)</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
              </div>

              {/* Judul Dokumen */}
              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-700">
                  Judul Dokumen / Naskah Perjanjian Hibah *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: NPHD Penyaluran Hibah Pembinaan Pramuka Kwartir Cabang T.A. 2026"
                  value={newJudul}
                  onChange={(e) => setNewJudul(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                />
              </div>

              {/* Instansi & Nominal */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Nama Lembaga / Ormas Penerima *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Kwartir Cabang Gerakan Pramuka"
                    value={newInstansi}
                    onChange={(e) => setNewInstansi(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Nominal Dana Hibah (Rp)
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Rp 85.000.000"
                    value={newNominal}
                    onChange={(e) => setNewNominal(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              </div>

              {/* Bidang, Jenis & Tanggal */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Bidang Pengampu *
                  </label>
                  <select
                    value={mode === "bidang" ? bidangId : newBidang}
                    disabled={mode === "bidang"}
                    onChange={(e) => setNewBidang(Number(e.target.value) as BidangId)}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-xs outline-none focus:border-red-400 disabled:bg-zinc-100 disabled:text-zinc-500"
                  >
                    {([1, 2, 3, 4] as BidangId[]).map((id) => (
                      <option key={id} value={id}>
                        {bidangInfo[id].shortName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Jenis Naskah / Berkas *
                  </label>
                  <select
                    value={newJenis}
                    onChange={(e) => setNewJenis(e.target.value as ArsipItem["jenis"])}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-xs outline-none focus:border-red-400"
                  >
                    <option value="NPHD">NPHD (Naskah Perjanjian)</option>
                    <option value="Berita Acara">Berita Acara Verifikasi</option>
                    <option value="SK Hibah">SK Penetapan Walikota</option>
                    <option value="LPJ Terverifikasi">LPJ Terverifikasi (Lunas)</option>
                    <option value="Proposal & RAB">Proposal & Rincian RAB</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Tanggal Pengesahan *
                  </label>
                  <input
                    type="date"
                    required
                    value={newTanggal}
                    onChange={(e) => setNewTanggal(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-red-400"
                  />
                </div>
              </div>

              {/* Upload File Berkas */}
              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-700">
                  Unggah Berkas PDF Dokumen Digital (Maks. 25 MB)
                </label>
                <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/60 p-4 text-center hover:border-red-500 hover:bg-red-50/20 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {selectedFile ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <DocumentIcon className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-zinc-900 truncate max-w-xs">{selectedFile.name}</p>
                        <p className="text-[11px] text-emerald-600 font-semibold">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Berkas Terpilih Siap Unggah
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <DocumentIcon className="mx-auto h-7 w-7 text-zinc-400" />
                      <p className="text-xs font-semibold text-zinc-700">
                        Pilih file dokumen arsip (PDF / Gambar)
                      </p>
                      <p className="text-[10px] text-zinc-400">Dapat langsung dilihat di sistem tanpa perlu download</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-700">
                  Catatan Ringkas / Keterangan Dokumen
                </label>
                <textarea
                  rows={2}
                  placeholder="Tambahkan nomor registrasi naskah atau catatan khusus..."
                  value={newCatatan}
                  onChange={(e) => setNewCatatan(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                />
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
                  {isSubmitting ? "Menyimpan..." : "Simpan & Daftarkan Arsip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Berkas Arsip + Inline Document Viewer */}
      {selectedDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-4xl rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl my-6 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-zinc-100 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                  <ArchiveIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      {selectedDetail.kode}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white ${
                        bidangInfo[selectedDetail.bidangId].color
                      }`}
                    >
                      Bidang {selectedDetail.bidangId}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-zinc-900 mt-1">
                    {selectedDetail.judul}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-zinc-100 p-3 bg-zinc-50">
                  <span className="text-zinc-400 block text-[11px]">Lembaga Penerima</span>
                  <p className="font-bold text-zinc-800 mt-0.5 truncate">{selectedDetail.instansi}</p>
                </div>
                <div className="rounded-xl border border-zinc-100 p-3 bg-zinc-50">
                  <span className="text-zinc-400 block text-[11px]">Kategori Berkas</span>
                  <p className="font-bold text-zinc-800 mt-0.5">{selectedDetail.jenis}</p>
                </div>
                <div className="rounded-xl border border-zinc-100 p-3 bg-zinc-50">
                  <span className="text-zinc-400 block text-[11px]">Tahun Anggaran</span>
                  <p className="font-bold text-zinc-800 mt-0.5">T.A. {selectedDetail.tahun}</p>
                </div>
                <div className="rounded-xl border border-zinc-100 p-3 bg-zinc-50">
                  <span className="text-zinc-400 block text-[11px]">Tanggal Pengarsipan</span>
                  <p className="font-bold text-zinc-800 mt-0.5">{selectedDetail.tanggal}</p>
                </div>
              </div>

              {/* Inline Document Preview Box */}
              <div className="rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-900 shadow-inner">
                <div className="flex items-center justify-between bg-zinc-800 px-4 py-2.5 text-zinc-200 border-b border-zinc-700">
                  <div className="flex items-center gap-2">
                    <DocumentIcon className="h-4 w-4 text-emerald-400" />
                    <span className="font-semibold text-xs">
                      Pratinjau Naskah Arsip Digital Resmi
                    </span>
                    <span className="rounded bg-zinc-700 px-2 py-0.5 text-[10px] text-zinc-300">
                      {selectedDetail.fileName || `${selectedDetail.kode}.pdf`}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400">{selectedDetail.ukuran}</span>
                </div>

                {/* Document Display Area */}
                <div className="bg-zinc-100 p-4 sm:p-6 min-h-[380px] max-h-[480px] overflow-y-auto flex items-center justify-center">
                  {selectedDetail.fileDataUrl ? (
                    selectedDetail.fileType?.startsWith("image/") ? (
                      /* Image Preview */
                      <div className="max-w-full flex flex-col items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedDetail.fileDataUrl}
                          alt="Pratinjau Berkas Arsip"
                          className="max-h-[420px] rounded-lg shadow-lg object-contain bg-white border border-zinc-200"
                        />
                      </div>
                    ) : (
                      /* PDF Embed */
                      <iframe
                        src={selectedDetail.fileDataUrl}
                        title="Pratinjau Berkas PDF"
                        className="w-full h-[420px] rounded-lg border border-zinc-300 bg-white shadow"
                      />
                    )
                  ) : (
                    /* Simulated Official Digital Naskah Archive */
                    <div className="w-full max-w-2xl rounded-xl bg-white p-6 sm:p-8 shadow-md border border-zinc-200 text-zinc-900 space-y-4 font-serif">
                      {/* Kop Surat Naskah Arsip */}
                      <div className="text-center border-b-2 border-zinc-900 pb-4">
                        <p className="text-[11px] uppercase tracking-widest font-sans font-bold text-zinc-700">
                          Pemerintah Daerah Kota Bandung
                        </p>
                        <h5 className="text-sm font-bold uppercase tracking-wider font-sans text-zinc-900">
                          Badan Kesatuan Bangsa dan Politik
                        </h5>
                        <p className="text-[10px] font-sans text-zinc-500 italic mt-0.5">
                          Arsip Resmi Naskah Perjanjian Hibah Daerah (NPHD) Terverifikasi Digital
                        </p>
                      </div>

                      {/* Judul Naskah */}
                      <div className="text-center py-2">
                        <p className="font-bold text-xs uppercase underline tracking-wide">
                          {selectedDetail.judul}
                        </p>
                        <p className="text-[11px] font-sans text-zinc-500 mt-1">
                          Nomor Arsip: {selectedDetail.kode}
                        </p>
                      </div>

                      {/* Isi Naskah */}
                      <div className="space-y-2 text-[11px] leading-relaxed text-zinc-800 font-sans">
                        <p>
                          Bahwa naskah dokumen hibah berikut telah memenuhi seluruh persyaratan verifikasi administrasi dan teknis, serta telah diarsipkan secara permanen ke dalam Sistem Digital Bakesbangpol:
                        </p>
                        <div className="bg-zinc-50 p-3.5 rounded-lg border border-zinc-200 space-y-1.5 my-2">
                          <p><strong>Lembaga Penerima:</strong> {selectedDetail.instansi}</p>
                          <p><strong>Bidang Pengampu:</strong> {bidangInfo[selectedDetail.bidangId].fullName}</p>
                          <p><strong>Jenis Dokumen:</strong> {selectedDetail.jenis}</p>
                          <p><strong>Tahun Anggaran:</strong> T.A. {selectedDetail.tahun}</p>
                          <p><strong>Tanggal Pengesahan:</strong> {selectedDetail.tanggal}</p>
                          <p><strong>Status Pengarsipan:</strong> <span className="text-emerald-700 font-bold">TERDAFTAR & SAH (DIGITAL SIGNED)</span></p>
                        </div>
                      </div>

                      {/* Tanda Tangan & Cap Digital */}
                      <div className="flex justify-between pt-4 text-[10px] font-sans">
                        <div className="text-center">
                          <p>Pihak Penerima,</p>
                          <p className="mt-8 font-bold underline">{selectedDetail.instansi}</p>
                          <p className="text-zinc-400">Penerima Hibah Daerah</p>
                        </div>
                        <div className="text-center">
                          <p>Kepala Bakesbangpol Kota Bandung,</p>
                          <div className="my-1 inline-block rounded border border-emerald-500 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                            TERTANDATANGANI ELEKTRONIK (BSrE)
                          </div>
                          <p className="mt-4 font-bold underline">Drs. H. Bambang Sukardi, M.Si</p>
                          <p className="text-zinc-400">Pembina Utama Muda / NIP. 19680315 199303 1 005</p>
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
                onClick={() => alert(`Mengunduh berkas naskah arsip "${selectedDetail.kode} - ${selectedDetail.judul}"...`)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                <DownloadIcon className="h-3.5 w-3.5" />
                <span>Unduh Berkas Arsip</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
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
