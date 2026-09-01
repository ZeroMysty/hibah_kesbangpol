"use client";

import { useState, useEffect } from "react";
import { bidangInfo, BidangId, useMode } from "@/context/mode-context";
import {
  BuildingIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  XIcon,
} from "@/components/icons";

type StatusLembaga = "Sedang Mengajukan" | "Terakhir Mengajukan";

interface LembagaItem {
  id: string;
  nama: string;
  singkatan: string;
  bidangId: BidangId;
  jenisOrganisasi: string;
  alamat: string;
  pic: string;
  noTelp?: string;
  namaProposal?: string;
  nilaiDiajukan?: string;
  nilaiDisetujui?: string;
  tanggalPengajuan?: string;
  tanggalUpdate?: string;
  status?: StatusLembaga;
  tahun?: string;
}

const mockLembaga: LembagaItem[] = [
  // ==================== BIDANG 1: Ideologi & Wawasan Kebangsaan ====================
  {
    id: "1",
    nama: "Pasukan Pengibar Bendera Pusaka (Paskibraka / PPI Kota)",
    singkatan: "PASKIBRA",
    bidangId: 1,
    jenisOrganisasi: "Organisasi Kepemudaan",
    alamat: "Jl. Wastukencana No. 2, Babakan Ciamis, Sumur Bandung",
    pic: "Ahmad Fauzi, S.Sos (Ketua PPI)",
    noTelp: "0812-2345-6789",
    namaProposal: "Pendidikan & Latihan Intensif Paskibraka Kota T.A. 2026",
    nilaiDiajukan: "Rp 150.000.000",
    status: "Sedang Mengajukan",
    tahun: "2026",
  },
  {
    id: "2",
    nama: "Gerakan Pramuka Kwarcab Kota",
    singkatan: "PRAMUKA",
    bidangId: 1,
    jenisOrganisasi: "Organisasi Kepemudaan",
    alamat: "Jl. LLRE Martadinata No. 157, Cihapit, Bandung Wetan",
    pic: "Drs. Bambang Suharto",
    noTelp: "0813-8765-4321",
    namaProposal: "Kemah Wawasan Kebangsaan & Bela Negara Tingkat Kota",
    nilaiDiajukan: "Rp 85.000.000",
    status: "Terakhir Mengajukan",
    tahun: "2025",
  },
  {
    id: "3",
    nama: "Forum Komunikasi Putra-Putri Purnawirawan (FKPPI)",
    singkatan: "FKPPI",
    bidangId: 1,
    jenisOrganisasi: "Ormas",
    alamat: "Jl. Banda No. 30, Citarum, Bandung Wetan",
    pic: "Kol. (Purn.) Suherman",
    noTelp: "0811-3456-7890",
    namaProposal: "Seminar Bela Negara & Ketahanan Nasional 2026",
    nilaiDiajukan: "Rp 65.000.000",
    status: "Sedang Mengajukan",
    tahun: "2026",
  },
  {
    id: "4",
    nama: "Resimen Mahasiswa Mahawarman (Menwa)",
    singkatan: "MENWA",
    bidangId: 1,
    jenisOrganisasi: "Organisasi Mahasiswa",
    alamat: "Jl. Dipati Ukur No. 35, Lebakgede, Coblong",
    pic: "Mayor (Purn.) Hendra",
    noTelp: "0821-4567-8901",
    namaProposal: "Pendidikan Dasar Disiplin & Karakter Kebangsaan Mahasiswa",
    nilaiDiajukan: "Rp 55.000.000",
    status: "Sedang Mengajukan",
    tahun: "2026",
  },

  // ==================== BIDANG 2: Politik Dalam Negeri & Ormas ====================
  {
    id: "5",
    nama: "Karang Taruna Kota Bandung",
    singkatan: "KT",
    bidangId: 2,
    jenisOrganisasi: "Organisasi Pemuda",
    alamat: "Jl. Sukabumi No. 18, Kacapiring, Batununggal",
    pic: "Rizky Pratama, SH",
    noTelp: "0857-1234-5678",
    namaProposal: "Pemberdayaan Pemuda Berbasis Komunitas Kelurahan 2026",
    nilaiDiajukan: "Rp 200.000.000",
    status: "Sedang Mengajukan",
    tahun: "2026",
  },
  {
    id: "6",
    nama: "Persatuan Wanita Republik Indonesia",
    singkatan: "PERWARI",
    bidangId: 2,
    jenisOrganisasi: "Ormas",
    alamat: "Jl. R.E. Martadinata No. 84, Cihapit, Bandung Wetan",
    pic: "Hj. Siti Rahayu, M.Pd",
    noTelp: "0818-9876-5432",
    namaProposal: "Pembinaan Perempuan & Kesetaraan Gender T.A. 2025",
    nilaiDiajukan: "Rp 120.000.000",
    status: "Terakhir Mengajukan",
    tahun: "2025",
  },
  {
    id: "7",
    nama: "Komite Nasional Pemuda Indonesia (KNPI)",
    singkatan: "KNPI",
    bidangId: 2,
    jenisOrganisasi: "Organisasi Kepemudaan",
    alamat: "Jl. Pelajar Pejuang 45 No. 65, Turangga, Lengkong",
    pic: "Asep Sunandar, ST",
    noTelp: "0812-7890-1234",
    namaProposal: "Pekan Olahraga & Pembinaan Kepemimpinan Pemuda Daerah",
    nilaiDiajukan: "Rp 180.000.000",
    status: "Terakhir Mengajukan",
    tahun: "2025",
  },
  {
    id: "8",
    nama: "Paguyuban Pasundan Kota Bandung",
    singkatan: "PASUNDAN",
    bidangId: 2,
    jenisOrganisasi: "Ormas Budaya",
    alamat: "Jl. Sumatra No. 41, Merdeka, Sumur Bandung",
    pic: "Prof. Dr. Didi Turmudzi",
    noTelp: "0811-2345-6781",
    namaProposal: "Festival Seni Budaya & Tradisi Budaya Sunda 2026",
    nilaiDiajukan: "Rp 200.000.000",
    status: "Sedang Mengajukan",
    tahun: "2026",
  },

  // ==================== BIDANG 3: Ketahanan Ekonomi, Sosbud & Agama ====================
  {
    id: "9",
    nama: "Forum Kerukunan Umat Beragama Kota",
    singkatan: "FKUB",
    bidangId: 3,
    jenisOrganisasi: "Forum Lintas Agama",
    alamat: "Jl. Merdeka No. 2, Babakan Ciamis, Sumur Bandung",
    pic: "KH. Abdurrahman Wahid Jr.",
    noTelp: "0813-3456-7892",
    namaProposal: "Festival Kerukunan Umat Beragama & Dialog Antar Iman 2026",
    nilaiDiajukan: "Rp 175.000.000",
    status: "Sedang Mengajukan",
    tahun: "2026",
  },
  {
    id: "10",
    nama: "Majelis Ulama Indonesia (MUI) Kota",
    singkatan: "MUI",
    bidangId: 3,
    jenisOrganisasi: "Lembaga Keagamaan",
    alamat: "Jl. Tamansari No. 1, Tamansari, Bandung Wetan",
    pic: "Drs. KH. Miftah Faridl",
    noTelp: "0812-4567-8903",
    namaProposal: "Safari Dakwah Ramadhan & Pembinaan Kerukunan Umat",
    nilaiDiajukan: "Rp 95.000.000",
    status: "Sedang Mengajukan",
    tahun: "2026",
  },
  {
    id: "11",
    nama: "Badan Musyawarah Antar Gereja (BAMAG)",
    singkatan: "BAMAG",
    bidangId: 3,
    jenisOrganisasi: "Lembaga Keagamaan",
    alamat: "Jl. Naripan No. 139, Kebon Pisang, Sumur Bandung",
    pic: "Pdt. Simon Petrus",
    noTelp: "0817-5678-9014",
    namaProposal: "Bantuan Forum Komunikasi & Pembinaan Harmoni Antar Gereja",
    nilaiDiajukan: "Rp 110.000.000",
    status: "Sedang Mengajukan",
    tahun: "2026",
  },
  {
    id: "12",
    nama: "Dewan Kesenian Kota Bandung",
    singkatan: "DKB",
    bidangId: 3,
    jenisOrganisasi: "Lembaga Kesenian",
    alamat: "Jl. Braga No. 22, Braga, Sumur Bandung",
    pic: "Dedi Rosadi, S.Sn",
    noTelp: "0819-6789-0125",
    namaProposal: "Pemberdayaan Sanggar Seni Budaya & Seniman Tradisional",
    nilaiDiajukan: "Rp 130.000.000",
    status: "Terakhir Mengajukan",
    tahun: "2025",
  },

  // ==================== BIDANG 4: Kewaspadaan Nasional & Konflik Sosial ====================
  {
    id: "13",
    nama: "Forum Kewaspadaan Dini Masyarakat (FKDM)",
    singkatan: "FKDM",
    bidangId: 4,
    jenisOrganisasi: "Forum Kewaspadaan",
    alamat: "Jl. Wastukencana No. 5, Babakan Ciamis, Sumur Bandung",
    pic: "Kolonel (Purn.) Agus Salim",
    noTelp: "0812-7890-1236",
    namaProposal: "Pelatihan Deteksi Dini & Early Warning System Konflik Sosial",
    nilaiDiajukan: "Rp 95.000.000",
    status: "Sedang Mengajukan",
    tahun: "2026",
  },
  {
    id: "14",
    nama: "Badan Narkotika Nasional Kota / Relawan Wasnas",
    singkatan: "BNNK",
    bidangId: 4,
    jenisOrganisasi: "Relawan Pencegahan",
    alamat: "Jl. Jawa No. 16, Merdeka, Sumur Bandung",
    pic: "AKBP (Purn.) Budiman",
    noTelp: "0813-8901-2347",
    namaProposal: "Penyuluhan Anti Narkoba & Ketahanan Kewilayahan Masyarakat",
    nilaiDiajukan: "Rp 75.000.000",
    status: "Sedang Mengajukan",
    tahun: "2026",
  },
  {
    id: "15",
    nama: "Satgas Deteksi Dini & Pencegahan Konflik",
    singkatan: "SATGAS-DD",
    bidangId: 4,
    jenisOrganisasi: "Satgas Daerah",
    alamat: "Jl. Aceh No. 36, Babakan Ciamis, Sumur Bandung",
    pic: "Nurul Hidayat, SH",
    noTelp: "0852-9012-3458",
    namaProposal: "Simulasi Mediasi & Pemantauan Titik Rawan Konflik Sosial",
    nilaiDiajukan: "Rp 80.000.000",
    status: "Terakhir Mengajukan",
    tahun: "2025",
  },
  {
    id: "16",
    nama: "Komunitas Pemantau Radikalisme & Wasnas",
    singkatan: "KPRW",
    bidangId: 4,
    jenisOrganisasi: "Komunitas Masyarakat",
    alamat: "Jl. Ir. H. Juanda No. 108, Lebakgede, Coblong",
    pic: "Dr. Hendra Wijaya, M.Si",
    noTelp: "0811-0123-4569",
    namaProposal: "Sosialisasi Pencegahan Ekstremisme & Radikalisme Pemuda",
    nilaiDiajukan: "Rp 65.000.000",
    status: "Sedang Mengajukan",
    tahun: "2026",
  },
];

export default function LembagaPage() {
  const { mode, bidangId } = useMode();
  const [lembagaList, setLembagaList] = useState<LembagaItem[]>(mockLembaga);
  const [query, setQuery] = useState("");
  const [filterBidang, setFilterBidang] = useState<BidangId | "Semua">("Semua");
  const [filterStatus, setFilterStatus] = useState<StatusLembaga | "Semua">("Semua");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<LembagaItem | null>(null);

  // Edit Mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editNama, setEditNama] = useState("");
  const [editSingkatan, setEditSingkatan] = useState("");
  const [editBidang, setEditBidang] = useState<BidangId>(1);
  const [editJenis, setEditJenis] = useState("Ormas");
  const [editPic, setEditPic] = useState("");
  const [editNoTelp, setEditNoTelp] = useState("");
  const [editAlamat, setEditAlamat] = useState("");

  // Form states for New Lembaga
  const [nama, setNama] = useState("");
  const [singkatan, setSingkatan] = useState("");
  const [bidang, setBidang] = useState<BidangId>(mode === "bidang" ? bidangId : 1);
  const [jenisOrganisasi, setJenisOrganisasi] = useState("Ormas");
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
      l.alamat.toLowerCase().includes(q) ||
      l.pic.toLowerCase().includes(q) ||
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
      alamat: alamat || "Jl. Wastukencana No. 2, Bandung",
      pic: pic || "Penanggung Jawab Lembaga",
      noTelp: noTelp || "0812-xxxx-xxxx",
      status: "Sedang Mengajukan",
      tahun: "2026",
    };

    setLembagaList([newItem, ...lembagaList]);
    setShowAddModal(false);

    // Reset Form
    setNama("");
    setSingkatan("");
    setPic("");
    setNoTelp("");
    setAlamat("");
  };

  const startEdit = (item: LembagaItem) => {
    setIsEditing(true);
    setEditNama(item.nama);
    setEditSingkatan(item.singkatan);
    setEditBidang(item.bidangId);
    setEditJenis(item.jenisOrganisasi);
    setEditPic(item.pic);
    setEditNoTelp(item.noTelp || "");
    setEditAlamat(item.alamat);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDetail || !editNama.trim() || !editSingkatan.trim()) return;

    const updatedItem: LembagaItem = {
      ...selectedDetail,
      nama: editNama,
      singkatan: editSingkatan.toUpperCase(),
      bidangId: editBidang,
      jenisOrganisasi: editJenis,
      pic: editPic,
      noTelp: editNoTelp,
      alamat: editAlamat,
    };

    setLembagaList((prev) => prev.map((l) => (l.id === selectedDetail.id ? updatedItem : l)));
    setSelectedDetail(updatedItem);
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data lembaga ini secara permanen?")) {
      setLembagaList((prev) => prev.filter((item) => item.id !== id));
      setSelectedDetail(null);
      setIsEditing(false);
    }
  };

  const totalSedang = lembagaList.filter((l) => l.status === "Sedang Mengajukan").length;
  const totalTerakhir = lembagaList.filter((l) => l.status === "Terakhir Mengajukan").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-zinc-500">Total Lembaga</p>
          <p className="mt-2 text-2xl font-bold text-zinc-900">{lembagaList.length}</p>
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

        {/* Search & Action on Right */}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama / alamat / PIC..."
              className="h-9 w-44 rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-xs outline-none transition focus:border-red-400 focus:bg-white sm:w-60"
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
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/70 text-[11px] uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3.5 font-semibold">Lembaga / Organisasi</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">Bidang</th>
                <th className="px-5 py-3.5 font-semibold min-w-[220px]">Alamat</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">PIC / Kontak</th>
                <th className="px-5 py-3.5 text-left font-semibold whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-zinc-50/80"
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
                        <p className="text-[11px] text-zinc-400 mt-0.5">{item.jenisOrganisasi}</p>
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
                  <td className="px-5 py-4 max-w-[260px]">
                    <div className="flex items-start gap-1.5 text-xs text-zinc-600">
                      <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-zinc-400 mt-0.5" />
                      <span className="line-clamp-2 leading-relaxed">{item.alamat}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-xs font-semibold text-zinc-900">{item.pic}</p>
                    {item.noTelp && (
                      <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1">
                        <PhoneIcon className="h-3 w-3 text-zinc-400" />
                        {item.noTelp}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-left">
                    <button
                      onClick={() => {
                        setSelectedDetail(item);
                        setIsEditing(false);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm whitespace-nowrap shrink-0"
                      title="Lihat Detail Lembaga"
                    >
                      <EyeIcon className="h-3.5 w-3.5" />
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center text-sm text-zinc-400">
                    Tidak ada lembaga yang sesuai dengan filter pencarian.
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
            return (
              <div key={id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2.5 mb-3">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black text-white ${bidangInfo[id].color}`}
                  >
                    {id}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Bidang {id}</p>
                    <p className="text-[10px] text-zinc-400 line-clamp-1">{bidangInfo[id].fullName}</p>
                  </div>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Total Lembaga</span>
                    <span className="font-bold text-zinc-900">{items.length} organisasi</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail & Kelola Lembaga (Edit / Hapus) */}
      {selectedDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xs font-black text-white ${bidangInfo[selectedDetail.bidangId].color}`}
                >
                  {selectedDetail.singkatan.slice(0, 4)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 leading-tight">
                    {isEditing ? "Edit Data Lembaga / Ormas" : selectedDetail.nama}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {selectedDetail.jenisOrganisasi} &bull; {selectedDetail.singkatan}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedDetail(null);
                  setIsEditing(false);
                }}
                className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {isEditing ? (
              /* Form Mode Edit */
              <form onSubmit={handleSaveEdit} className="mt-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block font-bold text-zinc-700">Nama Lembaga *</label>
                    <input
                      type="text"
                      required
                      value={editNama}
                      onChange={(e) => setEditNama(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-bold text-zinc-700">Singkatan *</label>
                    <input
                      type="text"
                      required
                      value={editSingkatan}
                      onChange={(e) => setEditSingkatan(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs font-bold uppercase outline-none focus:border-red-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-bold text-zinc-700">Jenis Organisasi</label>
                    <select
                      value={editJenis}
                      onChange={(e) => setEditJenis(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs font-medium outline-none focus:border-red-400"
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
                    <label className="mb-1 block font-bold text-zinc-700">Bidang Pembina</label>
                    <select
                      value={editBidang}
                      onChange={(e) => setEditBidang(Number(e.target.value) as BidangId)}
                      className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs font-medium outline-none focus:border-red-400"
                    >
                      {([1, 2, 3, 4] as BidangId[]).map((id) => (
                        <option key={id} value={id}>
                          Bidang {id} - {bidangInfo[id].shortName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-bold text-zinc-700">PIC / Penanggung Jawab</label>
                    <input
                      type="text"
                      required
                      value={editPic}
                      onChange={(e) => setEditPic(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-red-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-bold text-zinc-700">Nomor WhatsApp / Telp</label>
                    <input
                      type="text"
                      required
                      value={editNoTelp}
                      onChange={(e) => setEditNoTelp(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-red-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block font-bold text-zinc-700">Alamat Sekretariat</label>
                  <textarea
                    rows={2}
                    required
                    value={editAlamat}
                    onChange={(e) => setEditAlamat(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-red-600/25 hover:bg-red-500 transition active:scale-[0.98]"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            ) : (
              /* View Mode Detail */
              <>
                <div className="mt-5 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-100">
                      <span className="text-zinc-400 block text-[11px] mb-1">Bidang Pembina</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${bidangInfo[selectedDetail.bidangId].color}`}
                      >
                        Bidang {selectedDetail.bidangId} ({bidangInfo[selectedDetail.bidangId].shortName})
                      </span>
                    </div>
                    <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-100">
                      <span className="text-zinc-400 block text-[11px] mb-1">Jenis Organisasi</span>
                      <p className="font-bold text-zinc-900 text-sm mt-0.5">{selectedDetail.jenisOrganisasi}</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-100 space-y-2">
                    <span className="text-zinc-400 block text-[11px]">Alamat Sekretariat Lengkap</span>
                    <p className="font-medium text-zinc-800 flex items-start gap-2 leading-relaxed">
                      <MapPinIcon className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                      {selectedDetail.alamat}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-100">
                      <span className="text-zinc-400 block text-[11px]">Ketua / Penanggung Jawab</span>
                      <p className="font-bold text-zinc-900 text-sm mt-1">{selectedDetail.pic}</p>
                    </div>
                    <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-100">
                      <span className="text-zinc-400 block text-[11px]">Nomor Kontak / WhatsApp</span>
                      <p className="font-bold text-zinc-900 text-sm mt-1 flex items-center gap-1.5">
                        <PhoneIcon className="h-3.5 w-3.5 text-emerald-600" />
                        {selectedDetail.noTelp || "0812-xxxx-xxxx"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-5 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedDetail.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                    <span>Hapus Lembaga</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(selectedDetail)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition shadow-sm"
                    >
                      <PencilIcon className="h-3.5 w-3.5" />
                      <span>Edit Data</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDetail(null)}
                      className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
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
                    Nama Ketua / Penanggung Jawab (PIC) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap & Gelar"
                    value={pic}
                    onChange={(e) => setPic(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Nomor WhatsApp / Telp PIC *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={noTelp}
                    onChange={(e) => setNoTelp(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-700">
                  Alamat Sekretariat Organisasi *
                </label>
                <textarea
                  rows={2}
                  required
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
