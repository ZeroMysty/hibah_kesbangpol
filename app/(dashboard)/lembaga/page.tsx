"use client";

import { useState, useEffect } from "react";
import { bidangInfo, BidangId, useMode } from "@/context/mode-context";
import {
  BuildingIcon,
  CheckCircleIcon,
  ClockIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "@/components/icons";

type StatusLembaga = "Sedang Mengajukan" | "Terakhir Mengajukan";

interface LembagaItem {
  id: string;
  nama: string;
  singkatan: string;
  bidangId: BidangId;
  jenisOrganisasi: string;
  namaProposal: string;
  nilaiDiajukan: string;
  nilaiDisetujui?: string;
  tanggalPengajuan: string;
  tanggalUpdate: string;
  status: StatusLembaga;
  tahun: string;
  pic: string;
}

const mockLembaga: LembagaItem[] = [
  // ==================== BIDANG 1: Ideologi & Wawasan Kebangsaan ====================
  {
    id: "1",
    nama: "Pasukan Pengibar Bendera Pusaka (Paskibraka / PPI Kota)",
    singkatan: "PASKIBRA",
    bidangId: 1,
    jenisOrganisasi: "Organisasi Kepemudaan",
    namaProposal: "Pendidikan & Latihan Intensif Paskibraka Kota T.A. 2026",
    nilaiDiajukan: "Rp 150.000.000",
    tanggalPengajuan: "10 Jul 2026",
    tanggalUpdate: "05 Agu 2026",
    status: "Sedang Mengajukan",
    tahun: "2026",
    pic: "Ahmad Fauzi, S.Sos (Ketua PPI)",
  },
  {
    id: "2",
    nama: "Gerakan Pramuka Kwarcab Kota",
    singkatan: "PRAMUKA",
    bidangId: 1,
    jenisOrganisasi: "Organisasi Kepemudaan",
    namaProposal: "Kemah Wawasan Kebangsaan & Bela Negara Tingkat Kota",
    nilaiDiajukan: "Rp 85.000.000",
    nilaiDisetujui: "Rp 80.000.000",
    tanggalPengajuan: "15 Mar 2025",
    tanggalUpdate: "20 Jun 2025",
    status: "Terakhir Mengajukan",
    tahun: "2025",
    pic: "Drs. Bambang Suharto",
  },
  {
    id: "3",
    nama: "Forum Komunikasi Putra-Putri Purnawirawan (FKPPI)",
    singkatan: "FKPPI",
    bidangId: 1,
    jenisOrganisasi: "Ormas",
    namaProposal: "Seminar Bela Negara & Ketahanan Nasional 2026",
    nilaiDiajukan: "Rp 65.000.000",
    tanggalPengajuan: "22 Jul 2026",
    tanggalUpdate: "10 Agu 2026",
    status: "Sedang Mengajukan",
    tahun: "2026",
    pic: "Kol. (Purn.) Suherman",
  },
  {
    id: "4",
    nama: "Resimen Mahasiswa Mahawarman (Menwa)",
    singkatan: "MENWA",
    bidangId: 1,
    jenisOrganisasi: "Organisasi Mahasiswa",
    namaProposal: "Pendidikan Dasar Disiplin & Karakter Kebangsaan Mahasiswa",
    nilaiDiajukan: "Rp 55.000.000",
    tanggalPengajuan: "14 Jul 2026",
    tanggalUpdate: "22 Jul 2026",
    status: "Sedang Mengajukan",
    tahun: "2026",
    pic: "Mayor (Purn.) Hendra",
  },

  // ==================== BIDANG 2: Politik Dalam Negeri & Ormas ====================
  {
    id: "5",
    nama: "Karang Taruna Kota Bandung",
    singkatan: "KT",
    bidangId: 2,
    jenisOrganisasi: "Organisasi Pemuda",
    namaProposal: "Pemberdayaan Pemuda Berbasis Komunitas Kelurahan 2026",
    nilaiDiajukan: "Rp 200.000.000",
    tanggalPengajuan: "01 Agu 2026",
    tanggalUpdate: "12 Agu 2026",
    status: "Sedang Mengajukan",
    tahun: "2026",
    pic: "Rizky Pratama, SH",
  },
  {
    id: "6",
    nama: "Persatuan Wanita Republik Indonesia",
    singkatan: "PERWARI",
    bidangId: 2,
    jenisOrganisasi: "Ormas",
    namaProposal: "Pembinaan Perempuan & Kesetaraan Gender T.A. 2025",
    nilaiDiajukan: "Rp 120.000.000",
    nilaiDisetujui: "Rp 115.000.000",
    tanggalPengajuan: "10 Feb 2025",
    tanggalUpdate: "01 Jul 2025",
    status: "Terakhir Mengajukan",
    tahun: "2025",
    pic: "Hj. Siti Rahayu, M.Pd",
  },
  {
    id: "7",
    nama: "Komite Nasional Pemuda Indonesia (KNPI)",
    singkatan: "KNPI",
    bidangId: 2,
    jenisOrganisasi: "Organisasi Kepemudaan",
    namaProposal: "Pekan Olahraga & Pembinaan Kepemimpinan Pemuda Daerah",
    nilaiDiajukan: "Rp 180.000.000",
    nilaiDisetujui: "Rp 175.000.000",
    tanggalPengajuan: "05 Apr 2025",
    tanggalUpdate: "15 Des 2025",
    status: "Terakhir Mengajukan",
    tahun: "2025",
    pic: "Asep Sunandar, ST",
  },
  {
    id: "8",
    nama: "Paguyuban Pasundan Kota Bandung",
    singkatan: "PASUNDAN",
    bidangId: 2,
    jenisOrganisasi: "Ormas Budaya",
    namaProposal: "Festival Seni Budaya & Tradisi Budaya Sunda 2026",
    nilaiDiajukan: "Rp 200.000.000",
    tanggalPengajuan: "03 Jul 2026",
    tanggalUpdate: "18 Jul 2026",
    status: "Sedang Mengajukan",
    tahun: "2026",
    pic: "Prof. Dr. Didi Turmudzi",
  },

  // ==================== BIDANG 3: Ketahanan Ekonomi, Sosbud & Agama ====================
  {
    id: "9",
    nama: "Forum Kerukunan Umat Beragama Kota",
    singkatan: "FKUB",
    bidangId: 3,
    jenisOrganisasi: "Forum Lintas Agama",
    namaProposal: "Festival Kerukunan Umat Beragama & Dialog Antar Iman 2026",
    nilaiDiajukan: "Rp 175.000.000",
    tanggalPengajuan: "18 Jul 2026",
    tanggalUpdate: "08 Agu 2026",
    status: "Sedang Mengajukan",
    tahun: "2026",
    pic: "KH. Abdurrahman Wahid Jr.",
  },
  {
    id: "10",
    nama: "Majelis Ulama Indonesia (MUI) Kota",
    singkatan: "MUI",
    bidangId: 3,
    jenisOrganisasi: "Lembaga Keagamaan",
    namaProposal: "Safari Dakwah Ramadhan & Pembinaan Kerukunan Umat",
    nilaiDiajukan: "Rp 95.000.000",
    nilaiDisetujui: "Rp 95.000.000",
    tanggalPengajuan: "01 Mar 2025",
    tanggalUpdate: "15 Jul 2026",
    status: "Sedang Mengajukan",
    tahun: "2026",
    pic: "Drs. KH. Miftah Faridl",
  },
  {
    id: "11",
    nama: "Badan Musyawarah Antar Gereja (BAMAG)",
    singkatan: "BAMAG",
    bidangId: 3,
    jenisOrganisasi: "Lembaga Keagamaan",
    namaProposal: "Bantuan Forum Komunikasi & Pembinaan Harmoni Antar Gereja",
    nilaiDiajukan: "Rp 110.000.000",
    tanggalPengajuan: "08 Jul 2026",
    tanggalUpdate: "20 Jul 2026",
    status: "Sedang Mengajukan",
    tahun: "2026",
    pic: "Pdt. Simon Petrus",
  },
  {
    id: "12",
    nama: "Dewan Kesenian Kota Bandung",
    singkatan: "DKB",
    bidangId: 3,
    jenisOrganisasi: "Lembaga Kesenian",
    namaProposal: "Pemberdayaan Sanggar Seni Budaya & Seniman Tradisional",
    nilaiDiajukan: "Rp 130.000.000",
    nilaiDisetujui: "Rp 125.000.000",
    tanggalPengajuan: "12 Jan 2025",
    tanggalUpdate: "15 Nov 2025",
    status: "Terakhir Mengajukan",
    tahun: "2025",
    pic: "Dedi Rosadi, S.Sn",
  },

  // ==================== BIDANG 4: Kewaspadaan Nasional & Konflik Sosial ====================
  {
    id: "13",
    nama: "Forum Kewaspadaan Dini Masyarakat (FKDM)",
    singkatan: "FKDM",
    bidangId: 4,
    jenisOrganisasi: "Forum Kewaspadaan",
    namaProposal: "Pelatihan Deteksi Dini & Early Warning System Konflik Sosial",
    nilaiDiajukan: "Rp 95.000.000",
    tanggalPengajuan: "25 Jul 2026",
    tanggalUpdate: "11 Agu 2026",
    status: "Sedang Mengajukan",
    tahun: "2026",
    pic: "Kolonel (Purn.) Agus Salim",
  },
  {
    id: "14",
    nama: "Badan Narkotika Nasional Kota / Relawan Wasnas",
    singkatan: "BNNK",
    bidangId: 4,
    jenisOrganisasi: "Relawan Pencegahan",
    namaProposal: "Penyuluhan Anti Narkoba & Ketahanan Kewilayahan Masyarakat",
    nilaiDiajukan: "Rp 75.000.000",
    nilaiDisetujui: "Rp 75.000.000",
    tanggalPengajuan: "12 Jan 2025",
    tanggalUpdate: "24 Jul 2026",
    status: "Sedang Mengajukan",
    tahun: "2026",
    pic: "AKBP (Purn.) Budiman",
  },
  {
    id: "15",
    nama: "Satgas Deteksi Dini & Pencegahan Konflik",
    singkatan: "SATGAS-DD",
    bidangId: 4,
    jenisOrganisasi: "Satgas Daerah",
    namaProposal: "Simulasi Mediasi & Pemantauan Titik Rawan Konflik Sosial",
    nilaiDiajukan: "Rp 80.000.000",
    nilaiDisetujui: "Rp 78.000.000",
    tanggalPengajuan: "05 Mei 2025",
    tanggalUpdate: "19 Mei 2025",
    status: "Terakhir Mengajukan",
    tahun: "2025",
    pic: "Nurul Hidayat, SH",
  },
  {
    id: "16",
    nama: "Komunitas Pemantau Radikalisme & Wasnas",
    singkatan: "KPRW",
    bidangId: 4,
    jenisOrganisasi: "Komunitas Masyarakat",
    namaProposal: "Sosialisasi Pencegahan Ekstremisme & Radikalisme Pemuda",
    nilaiDiajukan: "Rp 65.000.000",
    tanggalPengajuan: "19 Jul 2026",
    tanggalUpdate: "01 Agu 2026",
    status: "Sedang Mengajukan",
    tahun: "2026",
    pic: "Dr. Hendra Wijaya, M.Si",
  },
];

export default function LembagaPage() {
  const { mode, bidangId } = useMode();
  const [lembagaList, setLembagaList] = useState<LembagaItem[]>(mockLembaga);
  const [query, setQuery] = useState("");
  const [filterBidang, setFilterBidang] = useState<BidangId | "Semua">("Semua");
  const [filterStatus, setFilterStatus] = useState<StatusLembaga | "Semua">("Semua");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for New Lembaga
  const [nama, setNama] = useState("");
  const [singkatan, setSingkatan] = useState("");
  const [bidang, setBidang] = useState<BidangId>(mode === "bidang" ? bidangId : 1);
  const [jenisOrganisasi, setJenisOrganisasi] = useState("Ormas");
  const [namaProposal, setNamaProposal] = useState("");
  const [nilaiDiajukan, setNilaiDiajukan] = useState("");
  const [pic, setPic] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [alamat, setAlamat] = useState("");

  // Sync state when mode/bidangId updates from localStorage
  useEffect(() => {
    if (mode === "bidang") {
      setFilterBidang(bidangId);
      setBidang(bidangId);
    }
  }, [mode, bidangId]);

  const filtered = lembagaList.filter((l) => {
    const matchBidang =
      mode === "bidang"
        ? l.bidangId === bidangId
        : filterBidang === "Semua" || l.bidangId === filterBidang;
    const matchStatus = filterStatus === "Semua" || l.status === filterStatus;
    const q = query.toLowerCase();
    const matchQuery =
      l.nama.toLowerCase().includes(q) ||
      l.singkatan.toLowerCase().includes(q) ||
      l.namaProposal.toLowerCase().includes(q) ||
      l.jenisOrganisasi.toLowerCase().includes(q);
    return matchBidang && matchStatus && matchQuery;
  });

  const handleAddLembaga = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !singkatan.trim()) return;

    const newItem: LembagaItem = {
      id: String(Date.now()),
      nama,
      singkatan: singkatan.toUpperCase(),
      bidangId: bidang,
      jenisOrganisasi,
      namaProposal: namaProposal || "Pengajuan Proposal Hibah T.A. 2026",
      nilaiDiajukan: nilaiDiajukan || "Rp 50.000.000",
      tanggalPengajuan: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      tanggalUpdate: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Sedang Mengajukan",
      tahun: "2026",
      pic: pic ? `${pic} (${noTelp || "Kontak"})` : "Penanggung Jawab Lembaga",
    };

    setLembagaList([newItem, ...lembagaList]);
    setShowAddModal(false);

    // Reset Form
    setNama("");
    setSingkatan("");
    setNamaProposal("");
    setNilaiDiajukan("");
    setPic("");
    setNoTelp("");
    setAlamat("");
  };

  const totalSedang = lembagaList.filter((l) => l.status === "Sedang Mengajukan").length;
  const totalTerakhir = lembagaList.filter((l) => l.status === "Terakhir Mengajukan").length;

  return (
    <div className="space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-zinc-500">Total Lembaga</p>
            <p className="mt-2 text-2xl font-bold text-zinc-900">{mockLembaga.length}</p>
            <p className="mt-0.5 text-[11px] text-zinc-400">Dari semua bidang</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
            <p className="text-xs font-semibold text-amber-700">Sedang Mengajukan</p>
            <p className="mt-2 text-2xl font-bold text-amber-700">{totalSedang}</p>
            <p className="mt-0.5 text-[11px] text-amber-500">Proposal aktif dalam proses</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
            <p className="text-xs font-semibold text-emerald-700">Pernah Mengajukan</p>
            <p className="mt-2 text-2xl font-bold text-emerald-700">{totalTerakhir}</p>
            <p className="mt-0.5 text-[11px] text-emerald-500">Riwayat disetujui / selesai</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-zinc-500">Bidang Aktif</p>
            <p className="mt-2 text-2xl font-bold text-zinc-900">4 Bidang</p>
            <p className="mt-0.5 text-[11px] text-zinc-400">Kesbangpol</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Filter:</span>
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
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as StatusLembaga | "Semua")}
              className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
            >
              <option value="Semua">Semua Status</option>
              <option value="Sedang Mengajukan">Sedang Mengajukan</option>
              <option value="Terakhir Mengajukan">Terakhir Mengajukan</option>
            </select>
          </div>

          {/* Search & Action on Right */}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari lembaga / proposal..."
                className="h-9 w-44 rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-xs outline-none transition focus:border-red-400 focus:bg-white sm:w-56"
              />
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/25 transition hover:bg-red-500 active:scale-[0.98]"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              <span>Daftarkan Lembaga</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/70 text-[11px] uppercase tracking-wider text-zinc-400">
                  <th className="px-5 py-3 font-semibold">Lembaga / Organisasi</th>
                  <th className="px-5 py-3 font-semibold">Bidang</th>
                  <th className="px-5 py-3 font-semibold">Nama Proposal</th>
                  <th className="px-5 py-3 font-semibold">Nilai Diajukan</th>
                  <th className="px-5 py-3 font-semibold">Tanggal Pengajuan</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">PIC</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-zinc-50 transition-colors last:border-0 hover:bg-zinc-50/80"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[9px] font-black text-white ${bidangInfo[item.bidangId].color}`}
                        >
                          {item.singkatan.slice(0, 4)}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 leading-tight">{item.nama}</p>
                          <p className="text-[11px] text-zinc-400">{item.jenisOrganisasi}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white whitespace-nowrap shadow-sm ${bidangInfo[item.bidangId].color}`}
                      >
                        Bidang {item.bidangId}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-[200px]">
                      <p className="text-xs font-medium text-zinc-800 leading-snug line-clamp-2">
                        {item.namaProposal}
                      </p>
                      <p className="mt-0.5 text-[10px] text-zinc-400">T.A. {item.tahun}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-xs font-bold text-zinc-900">{item.nilaiDiajukan}</p>
                      {item.nilaiDisetujui && (
                        <p className="mt-0.5 text-[10px] font-semibold text-emerald-600">
                          Disetujui: {item.nilaiDisetujui}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-xs font-medium text-zinc-700">{item.tanggalPengajuan}</p>
                      <p className="text-[10px] text-zinc-400">Update: {item.tanggalUpdate}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {item.status === "Sedang Mengajukan" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                          </span>
                          Sedang Mengajukan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                          <CheckCircleIcon className="h-3 w-3" />
                          Terakhir Mengajukan
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-xs text-zinc-600">{item.pic}</p>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center text-sm text-zinc-400">
                      Tidak ada lembaga yang sesuai dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ringkasan Per Bidang — hanya tampil untuk Admin */}
        {mode === "admin" && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {([1, 2, 3, 4] as BidangId[]).map((id) => {
              const items = lembagaList.filter((l) => l.bidangId === id);
              const sedang = items.filter((l) => l.status === "Sedang Mengajukan").length;
              const selesai = items.filter((l) => l.status === "Terakhir Mengajukan").length;
              return (
                <div key={id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black text-white ${bidangInfo[id].color}`}
                    >
                      {id}
                    </span>
                    <p className="text-xs font-bold text-zinc-900">Bidang {id}</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Total</span>
                      <span className="font-bold text-zinc-900">{items.length} lembaga</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center gap-1 text-amber-600">
                        <ClockIcon className="h-3 w-3" /> Sedang
                      </span>
                      <span className="font-bold text-amber-700">{sedang}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircleIcon className="h-3 w-3" /> Selesai
                      </span>
                      <span className="font-bold text-emerald-700">{selesai}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* Modal Daftarkan Lembaga / Ormas Baru */}
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
                  Formulir Pendaftaran Lembaga / Ormas
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Registrasi organisasi pemohon dana hibah ke database Bakesbangpol.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddLembaga} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Nama Lengkap Lembaga / Ormas *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Ikatan Alumni Resimen Mahasiswa Indonesia"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Singkatan / Akronim *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="IARMI"
                    value={singkatan}
                    onChange={(e) => setSingkatan(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs font-bold uppercase outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Jenis Organisasi *
                  </label>
                  <select
                    value={jenisOrganisasi}
                    onChange={(e) => setJenisOrganisasi(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-xs font-medium outline-none focus:border-red-400"
                  >
                    <option value="Ormas">Organisasi Kemasyarakatan (Ormas)</option>
                    <option value="Organisasi Kepemudaan">Organisasi Kepemudaan (OKP)</option>
                    <option value="Forum Lintas Agama">Forum Lintas Agama / FKUB</option>
                    <option value="Sanggar Seni & Budaya">Sanggar Seni & Budaya</option>
                    <option value="LSM">Lembaga Swadaya Masyarakat (LSM)</option>
                    <option value="Yayasan">Yayasan / Komunitas Keagamaan</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Bidang Pembina di Kesbangpol *
                  </label>
                  <select
                    value={mode === "bidang" ? bidangId : bidang}
                    disabled={mode === "bidang"}
                    onChange={(e) => setBidang(Number(e.target.value) as BidangId)}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-xs font-medium outline-none focus:border-red-400 disabled:bg-zinc-100"
                  >
                    {([1, 2, 3, 4] as BidangId[]).map((id) => (
                      <option key={id} value={id}>
                        Bidang {id} - {bidangInfo[id].fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Nama Usulan Proposal Awal
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Diklat Kepemimpinan Pemuda Pancasila 2026"
                    value={namaProposal}
                    onChange={(e) => setNamaProposal(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Estimasi Nilai Hibah yang Diajukan
                  </label>
                  <input
                    type="text"
                    placeholder="Rp 75.000.000"
                    value={nilaiDiajukan}
                    onChange={(e) => setNilaiDiajukan(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Nama Ketua / Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap & Gelar"
                    value={pic}
                    onChange={(e) => setPic(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Nomor WhatsApp / Telp PIC
                  </label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={noTelp}
                    onChange={(e) => setNoTelp(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-700">
                  Alamat Sekretariat Organisasi
                </label>
                <textarea
                  rows={2}
                  placeholder="Alamat kantor sekretariat ormas / lembaga..."
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
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
                  Daftarkan Lembaga Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
