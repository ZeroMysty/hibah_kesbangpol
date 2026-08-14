"use client";

import { useState } from "react";
import { useMode, bidangInfo, BidangId } from "@/context/mode-context";
import {
  ArchiveIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentIcon,
  DownloadIcon,
  EyeIcon,
  FileCheckIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  XIcon,
} from "./icons";

export interface ArsipItem {
  id: string;
  kode: string;
  judul: string;
  instansi: string;
  bidangId: BidangId;
  jenis: "NPHD" | "Berita Acara" | "SK Hibah" | "LPJ Terverifikasi" | "Proposal & RAB";
  tahun: string;
  tanggal: string;
  ukuran: string;
  status: "Aktif" | "Permanen" | "Inaktif";
  fileUrl?: string;
}

const mockArsip: ArsipItem[] = [
  // BIDANG 1 — Ideologi & Wawasan Kebangsaan (Paskibra, Pramuka, PPI, Wasbang, Bela Negara)
  {
    id: "1",
    kode: "ARS-B1-2026-001",
    judul: "NPHD Pembinaan & Pelatihan Pasukan Pengibar Bendera Pusaka (Paskibraka) 2026",
    instansi: "Paskibraka Kota (PPI)",
    bidangId: 1,
    jenis: "NPHD",
    tahun: "2026",
    tanggal: "06 Agu 2026",
    ukuran: "4.8 MB",
    status: "Aktif",
  },
  {
    id: "2",
    kode: "ARS-B1-2026-002",
    judul: "LPJ Kemah Kebangsaan & Pendidikan Bela Negara Pemuda",
    instansi: "Kwartir Cabang Gerakan Pramuka",
    bidangId: 1,
    jenis: "LPJ Terverifikasi",
    tahun: "2026",
    tanggal: "02 Agu 2026",
    ukuran: "9.4 MB",
    status: "Aktif",
  },
  {
    id: "3",
    kode: "ARS-B1-2026-003",
    judul: "SK Penetapan Penerima Hibah Pemasyarakatan Pancasila & Wasbang",
    instansi: "Yayasan Generasi Bangsa Mandiri",
    bidangId: 1,
    jenis: "SK Hibah",
    tahun: "2026",
    tanggal: "25 Jul 2026",
    ukuran: "2.5 MB",
    status: "Aktif",
  },
  {
    id: "4",
    kode: "ARS-B1-2025-014",
    judul: "Berita Acara Evaluasi Lapangan Diklat Paskibraka Kota T.A. 2025",
    instansi: "Purna Paskibraka Indonesia (PPI)",
    bidangId: 1,
    jenis: "Berita Acara",
    tahun: "2025",
    tanggal: "18 Nov 2025",
    ukuran: "3.2 MB",
    status: "Permanen",
  },
  {
    id: "5",
    kode: "ARS-B1-2025-074",
    judul: "Proposal & RAB Seminar Nilai Kejuangan 45 & Wawasan Nusantara",
    instansi: "DHC Badan Pembudayaan Kejuangan 45",
    bidangId: 1,
    jenis: "Proposal & RAB",
    tahun: "2025",
    tanggal: "10 Okt 2025",
    ukuran: "5.3 MB",
    status: "Permanen",
  },

  // BIDANG 2 — Politik Dalam Negeri & Ormas (Karang Taruna, KNPI, PERWARI, Ormas)
  {
    id: "6",
    kode: "ARS-B2-2026-006",
    judul: "NPHD Fasilitasi Pendidikan Politik Pemilih Pemula & Generasi Z",
    instansi: "Komite Nasional Pemuda Indonesia (KNPI)",
    bidangId: 2,
    jenis: "NPHD",
    tahun: "2026",
    tanggal: "04 Agu 2026",
    ukuran: "4.1 MB",
    status: "Aktif",
  },
  {
    id: "7",
    kode: "ARS-B2-2026-007",
    judul: "Berita Acara Verifikasi Administrasi & Faktual Ormas Kota",
    instansi: "Persatuan Wanita Republik Indonesia (PERWARI)",
    bidangId: 2,
    jenis: "Berita Acara",
    tahun: "2026",
    tanggal: "29 Jul 2026",
    ukuran: "2.9 MB",
    status: "Aktif",
  },
  {
    id: "8",
    kode: "ARS-B2-2025-089",
    judul: "LPJ Akhir Tahun Bantuan Pembinaan Karang Taruna Se-Kota",
    instansi: "Karang Taruna Kota",
    bidangId: 2,
    jenis: "LPJ Terverifikasi",
    tahun: "2025",
    tanggal: "15 Des 2025",
    ukuran: "8.7 MB",
    status: "Permanen",
  },
  {
    id: "9",
    kode: "ARS-B2-2025-042",
    judul: "SK Hibah Fasilitasi Partisipasi Politik Pemilu Serentak 2025",
    instansi: "Lembaga Advokasi Demokrasi Masyarakat",
    bidangId: 2,
    jenis: "SK Hibah",
    tahun: "2025",
    tanggal: "12 Sep 2025",
    ukuran: "3.6 MB",
    status: "Permanen",
  },

  // BIDANG 3 — Ketahanan Ekonomi, Sosbud & Agama (FKUB, Dewan Kesenian, Ormas Keagamaan)
  {
    id: "10",
    kode: "ARS-B3-2026-010",
    judul: "LPJ Festival Kerukunan Umat Beragama & Harmoni Nusantara",
    instansi: "Forum Kerukunan Umat Beragama (FKUB)",
    bidangId: 3,
    jenis: "LPJ Terverifikasi",
    tahun: "2026",
    tanggal: "28 Jul 2026",
    ukuran: "12.4 MB",
    status: "Aktif",
  },
  {
    id: "11",
    kode: "ARS-B3-2026-011",
    judul: "NPHD Pembinaan Ketahanan Seni & Budaya Tradisional Daerah",
    instansi: "Dewan Kesenian Kota",
    bidangId: 3,
    jenis: "NPHD",
    tahun: "2026",
    tanggal: "22 Jul 2026",
    ukuran: "3.7 MB",
    status: "Aktif",
  },
  {
    id: "12",
    kode: "ARS-B3-2025-055",
    judul: "Berita Acara Evaluasi Lapangan Lembaga Keagamaan FKUB",
    instansi: "Badan Kerjasama Antar Gereja (BKAG)",
    bidangId: 3,
    jenis: "Berita Acara",
    tahun: "2025",
    tanggal: "02 Okt 2025",
    ukuran: "2.1 MB",
    status: "Permanen",
  },

  // BIDANG 4 — Kewaspadaan Nasional & Penanganan Konflik (FKDM, Wasnas, Deteksi Dini)
  {
    id: "13",
    kode: "ARS-B4-2026-013",
    judul: "NPHD Pelatihan Sistem Deteksi Dini & Kesiapsiagaan Konflik",
    instansi: "Forum Kewaspadaan Dini Masyarakat (FKDM)",
    bidangId: 4,
    jenis: "NPHD",
    tahun: "2026",
    tanggal: "20 Jul 2026",
    ukuran: "3.1 MB",
    status: "Aktif",
  },
  {
    id: "14",
    kode: "ARS-B4-2025-061",
    judul: "LPJ Sosialisasi Pencegahan Ekstremisme & Radikalisme",
    instansi: "Komunitas Kewaspadaan Nasional",
    bidangId: 4,
    jenis: "LPJ Terverifikasi",
    tahun: "2025",
    tanggal: "14 Agu 2025",
    ukuran: "6.2 MB",
    status: "Permanen",
  },
  {
    id: "15",
    kode: "ARS-B4-2025-033",
    judul: "Berita Acara Penanganan & Pemantauan Potensi Konflik Sosial",
    instansi: "Satgas Deteksi Dini Kota",
    bidangId: 4,
    jenis: "Berita Acara",
    tahun: "2025",
    tanggal: "19 Mei 2025",
    ukuran: "1.9 MB",
    status: "Permanen",
  },
];

const jenisList = ["Semua", "NPHD", "Berita Acara", "SK Hibah", "LPJ Terverifikasi", "Proposal & RAB"];
const currentYear = new Date().getFullYear();
const tahunList = ["Semua", ...Array.from({ length: 5 }, (_, i) => String(currentYear - i))];

export default function ArsipTable() {
  const { mode, bidangId, setBidangId } = useMode();
  const [query, setQuery] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("Semua");
  const [selectedTahun, setSelectedTahun] = useState("Semua");
  const [activeBidangFilter, setActiveBidangFilter] = useState<number | "Semua">(
    mode === "bidang" ? bidangId : "Semua"
  );
  const [arsipList, setArsipList] = useState<ArsipItem[]>(mockArsip);
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
  const [newVerifikator, setNewVerifikator] = useState("Staff Evaluator");
  const [newCatatan, setNewCatatan] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleAddArchive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJudul.trim() || !newInstansi.trim()) return;

    const formattedDate = new Date(newTanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newItem: ArsipItem = {
      id: String(Date.now()),
      kode: newKode || `ARS-B${newBidang}-${newTahun}-${Math.floor(100 + Math.random() * 900)}`,
      judul: newJudul,
      instansi: newInstansi,
      bidangId: newBidang,
      jenis: newJenis,
      tahun: newTahun,
      tanggal: formattedDate,
      ukuran: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : `${(Math.random() * 4 + 1.5).toFixed(1)} MB`,
      status: "Aktif",
    };

    setArsipList([newItem, ...arsipList]);
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

      {/* Filter Bar — Bidang + Tahun + Jenis (semua dalam satu baris) */}
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

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3 font-semibold">Kode Arsip</th>
                <th className="px-5 py-3 font-semibold">Judul Dokumen</th>
                <th className="px-5 py-3 font-semibold">Bidang</th>
                <th className="px-5 py-3 font-semibold">Jenis</th>
                <th className="px-5 py-3 font-semibold">Tahun / Tgl</th>
                <th className="px-5 py-3 font-semibold">Ukuran</th>
                <th className="px-5 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredArsip.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-zinc-50 transition-colors last:border-0 hover:bg-zinc-50/70"
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
                        onClick={() => alert(`Mengunduh berkas arsip: ${item.judul}`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Unduh Berkas Arsip"
                      >
                        <DownloadIcon className="h-3.5 w-3.5" />
                        Unduh
                      </button>
                      <button
                        onClick={() => setSelectedDetail(item)}
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                        title="Lihat Detail Dokumen"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredArsip.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-zinc-400">
                    Tidak ada berkas arsip yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add New Archive (Lengkap & Terperinci) */}
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
                <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/60 p-5 text-center hover:border-red-500 hover:bg-red-50/20 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.zip"
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
                      <DocumentIcon className="mx-auto h-8 w-8 text-zinc-400" />
                      <p className="text-xs font-semibold text-zinc-700">
                        Klik atau seret file PDF naskah ke area ini
                      </p>
                      <p className="text-[10px] text-zinc-400">Mendukung format PDF, DOCX, ZIP bertandatangan resmi</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Catatan / Keterangan */}
              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-700">
                  Catatan Ringkas / Keterangan Dokumen
                </label>
                <textarea
                  rows={2}
                  placeholder="Tambahkan catatan khusus verifikasi atau nomor registrasi naskah..."
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
                  className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-600/25 hover:from-red-700 hover:to-rose-700 transition active:scale-[0.98]"
                >
                  Simpan & Daftarkan Arsip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Berkas Arsip */}
      {selectedDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                  <ArchiveIcon className="h-6 w-6" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    {selectedDetail.kode}
                  </span>
                  <h4 className="text-base font-bold text-zinc-900 mt-1">
                    Detail Naskah Arsip
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

            <div className="mt-5 space-y-3.5 text-xs">
              <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
                <p className="font-bold text-zinc-900 text-sm">{selectedDetail.judul}</p>
                <p className="text-zinc-500 mt-0.5 font-medium">{selectedDetail.instansi}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-zinc-100 p-3 bg-white">
                  <span className="text-zinc-400">Bidang Pengampu:</span>
                  <p className="font-bold text-zinc-800 mt-0.5">{bidangInfo[selectedDetail.bidangId].fullName}</p>
                </div>
                <div className="rounded-xl border border-zinc-100 p-3 bg-white">
                  <span className="text-zinc-400">Kategori Berkas:</span>
                  <p className="font-bold text-zinc-800 mt-0.5">{selectedDetail.jenis}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-zinc-100 p-3 bg-white">
                  <span className="text-zinc-400">Tahun Anggaran:</span>
                  <p className="font-bold text-zinc-800 mt-0.5">T.A. {selectedDetail.tahun}</p>
                </div>
                <div className="rounded-xl border border-zinc-100 p-3 bg-white">
                  <span className="text-zinc-400">Tanggal Arsip:</span>
                  <p className="font-bold text-zinc-800 mt-0.5">{selectedDetail.tanggal}</p>
                </div>
                <div className="rounded-xl border border-zinc-100 p-3 bg-white">
                  <span className="text-zinc-400">Ukuran File:</span>
                  <p className="font-bold text-zinc-800 mt-0.5 font-mono">{selectedDetail.ukuran}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-6 border-t border-zinc-100 mt-6">
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Memulai unduhan berkas naskah ${selectedDetail.kode} (${selectedDetail.judul})...`);
                  setSelectedDetail(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-red-500"
              >
                <DownloadIcon className="h-3.5 w-3.5" />
                <span>Unduh Berkas PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
