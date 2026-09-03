"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { bidangInfo, BidangId, useMode } from "@/context/mode-context";
import {
  BuildingIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  EyeIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UploadIcon,
  XIcon,
} from "@/components/icons";

type StatusLembaga = "Sedang Mengajukan" | "Terakhir Mengajukan";

export interface JenisOrgOption {
  value: string;
  label: string;
  desc: string;
}

export interface JenisOrgGroup {
  group: string;
  options: JenisOrgOption[];
}

export const JENIS_ORGANISASI_GROUPS: JenisOrgGroup[] = [
  {
    group: "Organisasi Politik (Parpol)",
    options: [
      {
        value: "Organisasi Politik (Parpol)",
        label: "Organisasi Politik (Parpol)",
        desc: "Wadah resmi partisipasi politik warga negara untuk meraih jabatan politik melalui Pemilu.",
      },
    ],
  },
  {
    group: "Organisasi Kemasyarakatan (Ormas)",
    options: [
      {
        value: "Ormas Berbadan Hukum Yayasan",
        label: "Ormas Berbadan Hukum Yayasan",
        desc: "Berfokus pada kegiatan sosial, keagamaan, dan kemanusiaan.",
      },
      {
        value: "Ormas Berbadan Hukum Perkumpulan",
        label: "Ormas Berbadan Hukum Perkumpulan",
        desc: "Berfokus pada berbasis keanggotaan (seperti asosiasi profesi atau alumni).",
      },
      {
        value: "Ormas Tidak Berbadan Hukum (SKT Kesbangpol)",
        label: "Ormas Tidak Berbadan Hukum (SKT Kesbangpol)",
        desc: "Memiliki Surat Keterangan Terdaftar (SKT) resmi di Kesbangpol.",
      },
    ],
  },
  {
    group: "Lembaga / Forum Kemitraan Pemerintah (Lembaga Non-Struktural)",
    options: [
      {
        value: "Forum Kemitraan - FKDM (Kewaspadaan Dini)",
        label: "FKDM (Forum Kewaspadaan Dini Masyarakat)",
        desc: "Forum formal kewaspadaan dini pencegahan ancaman & potensi konflik wilayah.",
      },
      {
        value: "Forum Kemitraan - FKUB (Kerukunan Umat Beragama)",
        label: "FKUB (Forum Kerukunan Umat Beragama)",
        desc: "Forum formal kerukunan antarumat beragama dan rekomendasi pendirian rumah ibadah.",
      },
      {
        value: "Forum Kemitraan - FPK (Forum Pembauran Kebangsaan)",
        label: "FPK (Forum Pembauran Kebangsaan)",
        desc: "Forum integrasi dan pembauran suku, ras, etnis, dan adat budaya.",
      },
      {
        value: "Lembaga Non-Struktural Lainnya",
        label: "Lembaga Non-Struktural Lainnya",
        desc: "Lembaga kemitraan formal bentukan regulasi/pemerintah untuk tugas khusus.",
      },
    ],
  },
  {
    group: "Lembaga Kemasyarakatan Desa/Kelurahan (LKD/LKK)",
    options: [
      {
        value: "Lembaga Kemasyarakatan Desa/Kelurahan (LKD/LKK)",
        label: "LKD / LKK (Karang Taruna, RT/RW, LKM)",
        desc: "Wadah partisipasi warga di tingkat akar rumput yang berkoordinasi dengan Kesbangpol untuk ketahanan wilayah.",
      },
    ],
  },
  {
    group: "Organisasi Kepemudaan (OKP) & Kemahasiswaan",
    options: [
      {
        value: "Organisasi Kepemudaan (OKP) & Kemahasiswaan",
        label: "Organisasi Kepemudaan (OKP / HMI / GMNI / PMII / Pramuka / BEM)",
        desc: "Organisasi berbasis pelajar/pemuda yang masuk dalam pembinaan wawasan kebangsaan dan ketahanan nasional.",
      },
    ],
  },
  {
    group: "Organisasi Keagamaan & Adat/Budaya",
    options: [
      {
        value: "Organisasi Keagamaan (MUI / PGI / KWI / PHDI / Walubi / Matakin)",
        label: "Organisasi Keagamaan (MUI, PGI, KWI, PHDI, Walubi, Matakin)",
        desc: "Majelis-majelis agama yang menjaga kerukunan antarumat beragama.",
      },
      {
        value: "Lembaga Adat & Budaya Daerah",
        label: "Lembaga Adat & Budaya Daerah",
        desc: "Lembaga dan paguyuban adat daerah yang menjaga kerukunan sosial-budaya.",
      },
    ],
  },
  {
    group: "Badan Usaha / Sektor Swasta & Lembaga Asing",
    options: [
      {
        value: "Organisasi Non-Pemerintah Asing (NGO/LSM Asing)",
        label: "Organisasi Non-Pemerintah Asing (NGO/LSM Asing)",
        desc: "Perlu izin operasional khusus Kesbangpol untuk beroperasi di daerah.",
      },
      {
        value: "Perusahaan Swasta / Sektor Industri",
        label: "Perusahaan Swasta / Sektor Industri",
        desc: "Ditangani dalam konteks pengawasan Tenaga Kerja Asing (TKA) dan pemantauan ketahanan iklim kerja/konflik industrial.",
      },
    ],
  },
];

// Helper to get description from selected value
const getJenisOrgDesc = (val: string): string => {
  for (const g of JENIS_ORGANISASI_GROUPS) {
    const found = g.options.find((o) => o.value === val);
    if (found) return found.desc;
  }
  return "";
};

// Custom Dropdown with explicitly BOLD non-selectable Group Headers
function JenisOrganisasiDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOpt = JENIS_ORGANISASI_GROUPS.flatMap((g) => g.options).find(
    (o) => o.value === value
  );
  const selectedGroup = JENIS_ORGANISASI_GROUPS.find((g) =>
    g.options.some((o) => o.value === value)
  );

  const filteredGroups = JENIS_ORGANISASI_GROUPS.map((grp) => ({
    ...grp,
    options: grp.options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase()) ||
        opt.desc.toLowerCase().includes(search.toLowerCase()) ||
        grp.group.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((grp) => grp.options.length > 0);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-xl border bg-white px-3.5 py-2.5 text-left text-xs transition focus:outline-none ${
          isOpen
            ? "border-red-500 ring-4 ring-red-500/10 shadow-xs"
            : "border-zinc-200 hover:border-zinc-300"
        }`}
      >
        <div className="min-w-0 flex-1 pr-2">
          {selectedGroup && (
            <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              {selectedGroup.group}
            </span>
          )}
          <span className="block font-semibold text-zinc-900 truncate">
            {selectedOpt ? selectedOpt.label : value}
          </span>
        </div>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-red-500" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-72 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/15">
          {/* Search Bar inside dropdown */}
          <div className="border-b border-zinc-100 p-2 bg-zinc-50/70">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari bentuk/kategori organisasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-full rounded-lg border border-zinc-200 bg-white pl-8 pr-3 text-xs outline-none focus:border-red-400"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto divide-y divide-zinc-100">
            {filteredGroups.map((grp) => (
              <div key={grp.group}>
                {/* JUDUL KATEGORI - DIJADIKAN BOLD & TIDAK DAPAT DIPILIH */}
                <div className="sticky top-0 z-10 bg-zinc-100/95 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-zinc-900 backdrop-blur-xs border-y border-zinc-200/80 flex items-center gap-2 select-none cursor-default shadow-2xs">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-600"></span>
                  <span className="font-black text-zinc-950">{grp.group}</span>
                </div>

                {/* PILIHAN SUB-ORGANISASI */}
                <div className="p-1 space-y-0.5">
                  {grp.options.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onChange(opt.value);
                          setIsOpen(false);
                          setSearch("");
                        }}
                        className={`group flex w-full items-start gap-2.5 rounded-xl px-3 py-2 text-left text-xs transition ${
                          isSelected
                            ? "bg-red-50 text-red-900 font-semibold"
                            : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] ${
                            isSelected
                              ? "border-red-600 bg-red-600 text-white"
                              : "border-zinc-300 group-hover:border-zinc-400"
                          }`}
                        >
                          {isSelected && <CheckCircleIcon className="h-3 w-3" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs leading-snug">{opt.label}</p>
                          <p className="mt-0.5 text-[10px] text-zinc-400 leading-tight">
                            {opt.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredGroups.length === 0 && (
              <div className="p-4 text-center text-xs text-zinc-400">
                Tidak ada jenis organisasi yang cocok dengan kata kunci.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface LembagaItem {
  id: string;
  nama: string;
  singkatan: string;
  logo?: string;
  bidangId: BidangId;
  jenisOrganisasi: string;
  alamat: string;
  pic: string;
  noTelp?: string;
  status?: StatusLembaga;
  tahun?: string;
}

const mockLembaga: LembagaItem[] = [
  {
    id: "1",
    nama: "Forum Kerukunan Umat Beragama (FKUB) Kota",
    singkatan: "FKUB",
    bidangId: 3,
    jenisOrganisasi: "Forum Kemitraan - FKUB (Kerukunan Umat Beragama)",
    alamat: "Jl. Wastukencana No. 2, Babakan Ciamis, Kota Bandung",
    pic: "Drs. H. Ahmad Fauzi, M.Ag",
    noTelp: "0812-3456-7890",
    status: "Sedang Mengajukan",
    tahun: "2026",
  },
  {
    id: "2",
    nama: "Forum Pembauran Kebangsaan (FPK)",
    singkatan: "FPK",
    bidangId: 1,
    jenisOrganisasi: "Forum Kemitraan - FPK (Forum Pembauran Kebangsaan)",
    alamat: "Jl. Aceh No. 36, Merdeka, Kota Bandung",
    pic: "Prof. Dr. I Wayan Sudarta",
    noTelp: "0813-8899-1122",
    status: "Sedang Mengajukan",
    tahun: "2026",
  },
  {
    id: "3",
    nama: "Forum Kewaspadaan Dini Masyarakat (FKDM)",
    singkatan: "FKDM",
    bidangId: 4,
    jenisOrganisasi: "Forum Kemitraan - FKDM (Kewaspadaan Dini)",
    alamat: "Gedung Kesbangpol Lt. 2, Kota Bandung",
    pic: "Kolonel (Purn) Hendra S.",
    noTelp: "0811-2233-4455",
    status: "Terakhir Mengajukan",
    tahun: "2025",
  },
  {
    id: "4",
    nama: "Himpunan Mahasiswa Islam (HMI) Cabang",
    singkatan: "HMI",
    bidangId: 1,
    jenisOrganisasi: "Organisasi Kepemudaan (OKP) & Kemahasiswaan",
    alamat: "Jl. Dago No. 88, Coblong, Kota Bandung",
    pic: "Rizky Ramadhan, S.IP",
    noTelp: "0821-9988-7766",
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
  const [editLogo, setEditLogo] = useState<string | undefined>(undefined);
  const [editBidang, setEditBidang] = useState<BidangId>(1);
  const [editJenis, setEditJenis] = useState(JENIS_ORGANISASI_GROUPS[0].options[0].value);
  const [editPic, setEditPic] = useState("");
  const [editNoTelp, setEditNoTelp] = useState("");
  const [editAlamat, setEditAlamat] = useState("");

  // Form states for New Lembaga
  const [nama, setNama] = useState("");
  const [singkatan, setSingkatan] = useState("");
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [bidang, setBidang] = useState<BidangId>(mode === "bidang" ? bidangId : 1);
  const [jenisOrganisasi, setJenisOrganisasi] = useState(
    JENIS_ORGANISASI_GROUPS[1].options[0].value
  );
  const [pic, setPic] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [alamat, setAlamat] = useState("");

  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when mode/bidangId updates
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

  const handleLogoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string | undefined) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file logo maksimal 2MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddLembaga = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !singkatan.trim()) return;

    const newItem: LembagaItem = {
      id: String(Date.now()),
      nama: nama.trim(),
      singkatan: singkatan.trim().toUpperCase(),
      logo,
      bidangId: bidang,
      jenisOrganisasi,
      alamat: alamat.trim() || "Jl. Wastukencana No. 2, Bandung",
      pic: pic.trim() || "Penanggung Jawab Lembaga",
      noTelp: noTelp.trim() || "0812-xxxx-xxxx",
      status: "Sedang Mengajukan",
      tahun: "2026",
    };

    setLembagaList([newItem, ...lembagaList]);
    setShowAddModal(false);

    // Reset Form
    setNama("");
    setSingkatan("");
    setLogo(undefined);
    setPic("");
    setNoTelp("");
    setAlamat("");
    setJenisOrganisasi(JENIS_ORGANISASI_GROUPS[1].options[0].value);
  };

  const startEdit = (item: LembagaItem) => {
    setIsEditing(true);
    setEditNama(item.nama);
    setEditSingkatan(item.singkatan);
    setEditLogo(item.logo);
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
      nama: editNama.trim(),
      singkatan: editSingkatan.trim().toUpperCase(),
      logo: editLogo,
      bidangId: editBidang,
      jenisOrganisasi: editJenis,
      pic: editPic.trim(),
      noTelp: editNoTelp.trim(),
      alamat: editAlamat.trim(),
    };

    setLembagaList((prev) => prev.map((l) => (l.id === selectedDetail.id ? updatedItem : l)));
    setSelectedDetail(updatedItem);
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data mitra kerja ini secara permanen?")) {
      setLembagaList((prev) => prev.filter((item) => item.id !== id));
      setSelectedDetail(null);
      setIsEditing(false);
    }
  };

  const totalSedang = lembagaList.filter((l) => l.status === "Sedang Mengajukan").length;
  const totalTerakhir = lembagaList.filter((l) => l.status === "Terakhir Mengajukan").length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-zinc-500">Total Mitra Kerja</p>
          <p className="mt-2 text-2xl font-bold text-zinc-900">{lembagaList.length}</p>
          <p className="mt-0.5 text-[11px] text-zinc-400">Dari semua bidang binaan</p>
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
          <p className="text-xs font-semibold text-zinc-500">Bidang Pembina</p>
          <p className="mt-2 text-2xl font-bold text-zinc-900">4 Bidang</p>
          <p className="mt-0.5 text-[11px] text-zinc-400">Bakesbangpol</p>
        </div>
      </div>

      {/* Filter & Action Bar */}
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

        {/* Search & Add Button on Right */}
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
            <span>Daftarkan Mitra Kerja</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/70 text-[11px] uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3.5 font-semibold">Mitra Kerja / Organisasi</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">Bidang</th>
                <th className="px-5 py-3.5 font-semibold min-w-[220px]">Alamat</th>
                <th className="px-5 py-3.5 font-semibold whitespace-nowrap">PIC / Kontak</th>
                <th className="px-5 py-3.5 text-left font-semibold whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-zinc-50/80">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {item.logo ? (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.logo}
                            alt={item.nama}
                            className="h-full w-full object-contain p-0.5"
                          />
                        </div>
                      ) : (
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[10px] font-black text-white shadow-xs ${bidangInfo[item.bidangId].color}`}
                        >
                          {item.singkatan.slice(0, 4)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-zinc-900 leading-tight">{item.nama}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{item.jenisOrganisasi}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white whitespace-nowrap shadow-xs ${bidangInfo[item.bidangId].color}`}
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
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors shadow-xs whitespace-nowrap shrink-0"
                      title="Lihat Detail Mitra Kerja"
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
                    Tidak ada mitra kerja yang sesuai dengan filter pencarian.
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
                    <p className="text-[10px] text-zinc-400 line-clamp-1">
                      {bidangInfo[id].fullName}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Total Mitra Kerja</span>
                    <span className="font-bold text-zinc-900">{items.length} organisasi</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail & Kelola (Edit / Hapus) */}
      {selectedDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-3.5">
                {selectedDetail.logo ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedDetail.logo}
                      alt={selectedDetail.nama}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xs font-black text-white shadow-sm ${bidangInfo[selectedDetail.bidangId].color}`}
                  >
                    {selectedDetail.singkatan.slice(0, 4)}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-zinc-900 leading-tight">
                    {isEditing ? "Edit Data Mitra Kerja" : selectedDetail.nama}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {selectedDetail.singkatan} &bull; Bidang {selectedDetail.bidangId}
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
                {/* Upload / Ganti Logo */}
                <div>
                  <label className="mb-1.5 block font-bold text-zinc-700">Logo Organisasi</label>
                  <div className="flex items-center gap-4 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/70 p-3">
                    {editLogo ? (
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={editLogo}
                          alt="Logo Preview"
                          className="h-full w-full object-contain p-1"
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-zinc-200 text-zinc-400">
                        <BuildingIcon className="h-6 w-6" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => editFileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition shadow-2xs"
                        >
                          <UploadIcon className="h-3.5 w-3.5 text-zinc-500" />
                          <span>{editLogo ? "Ganti Logo" : "Upload Logo"}</span>
                        </button>
                        {editLogo && (
                          <button
                            type="button"
                            onClick={() => setEditLogo(undefined)}
                            className="rounded-xl px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-400">PNG, JPG, JPEG (Maks. 2MB)</p>
                      <input
                        ref={editFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleLogoUpload(e, setEditLogo)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block font-bold text-zinc-700">Nama Lengkap *</label>
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

                {/* Jenis Organisasi dengan Custom Dropdown & Bold Header */}
                <div>
                  <label className="mb-1 block font-bold text-zinc-700">Jenis Organisasi *</label>
                  <JenisOrganisasiDropdown value={editJenis} onChange={setEditJenis} />
                  {getJenisOrgDesc(editJenis) && (
                    <p className="mt-1.5 rounded-lg bg-zinc-50 p-2 text-[11px] text-zinc-500 border border-zinc-100">
                      {getJenisOrgDesc(editJenis)}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                  <label className="mb-1 block font-bold text-zinc-700">Alamat Mitra Kerja *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Alamat kantor / sekretariat mitra kerja..."
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
                      <span className="text-zinc-400 block text-[11px] mb-1">Status Keaktifan</span>
                      <p className="font-bold text-zinc-900 text-xs mt-0.5">
                        {selectedDetail.status || "Aktif"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-100 space-y-1">
                    <span className="text-zinc-400 block text-[11px]">Kategori & Bentuk Lembaga</span>
                    <p className="font-bold text-zinc-900 text-xs">{selectedDetail.jenisOrganisasi}</p>
                    {getJenisOrgDesc(selectedDetail.jenisOrganisasi) && (
                      <p className="text-[11px] text-zinc-500 leading-relaxed pt-1">
                        {getJenisOrgDesc(selectedDetail.jenisOrganisasi)}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-100 space-y-2">
                    <span className="text-zinc-400 block text-[11px]">Alamat Mitra Kerja</span>
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
                    <span>Hapus Data</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(selectedDetail)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition shadow-xs"
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

      {/* Modal Daftarkan Mitra Kerja Baru */}
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
                  Formulir Pendaftaran Mitra Kerja
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Registrasi organisasi / lembaga mitra binaan ke database Kesbangpol.
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
              {/* Upload Logo Mitra Kerja */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-zinc-700">
                  Logo Organisasi / Mitra Kerja (Opsional)
                </label>
                <div className="flex items-center gap-4 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/70 p-3.5 transition hover:border-red-300">
                  {logo ? (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logo}
                        alt="Logo Preview"
                        className="h-full w-full object-contain p-1"
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-zinc-200/80 text-zinc-400">
                      <BuildingIcon className="h-7 w-7" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => addFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition shadow-2xs"
                      >
                        <UploadIcon className="h-4 w-4 text-zinc-500" />
                        <span>{logo ? "Ganti File Logo" : "Pilih Logo"}</span>
                      </button>
                      {logo && (
                        <button
                          type="button"
                          onClick={() => setLogo(undefined)}
                          className="rounded-xl px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Format PNG, JPG, atau JPEG (Maksimal 2 MB).
                    </p>
                    <input
                      ref={addFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleLogoUpload(e, setLogo)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Nama Lengkap Organisasi / Mitra Kerja *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Forum Pembauran Kebangsaan Kota"
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
                    placeholder="FPK"
                    value={singkatan}
                    onChange={(e) => setSingkatan(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs font-bold uppercase outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              </div>

              {/* Jenis Organisasi dengan Kategori Lengkap & Header Bold Non-Selectable */}
              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-700">
                  Jenis / Bentuk Organisasi *
                </label>
                <JenisOrganisasiDropdown value={jenisOrganisasi} onChange={setJenisOrganisasi} />
                {getJenisOrgDesc(jenisOrganisasi) && (
                  <p className="mt-1.5 rounded-xl bg-zinc-50 p-2.5 text-[11px] text-zinc-500 border border-zinc-100 leading-relaxed">
                    <span className="font-semibold text-zinc-700">Penjelasan:</span>{" "}
                    {getJenisOrgDesc(jenisOrganisasi)}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  Alamat Mitra Kerja *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Alamat kantor / sekretariat mitra kerja..."
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
                  Daftarkan Mitra Kerja Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
