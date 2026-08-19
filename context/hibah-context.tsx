"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { BidangId } from "./mode-context";

export type ProposalStatus = "Menunggu" | "Selesai";

export interface ProposalItem {
  id: number;
  name: string;
  instansi: string;
  bidangId: BidangId;
  kategori: string;
  nominal: number;
  tanggal: string;
  status: ProposalStatus;
  pic?: string;
  noTelp?: string;
  catatan?: string;
  fileName?: string;
  fileSize?: string;
  fileDataUrl?: string; // Data URL or object URL for document viewer
  fileType?: string;
}

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
  nominal?: number;
  pic?: string;
  noTelp?: string;
  catatan?: string;
  fileName?: string;
  fileDataUrl?: string;
  fileType?: string;
}

const initialProposals: ProposalItem[] = [
  { id: 1, name: "Revitalisasi Taman Budaya", instansi: "Dinas Kebudayaan Kota", bidangId: 2, kategori: "Seni Budaya", nominal: 250000000, tanggal: "05 Agu 2026", status: "Selesai", fileName: "Proposal_Taman_Budaya_2026.pdf", fileSize: "3.4 MB" },
  { id: 2, name: "Penguatan Kapasitas FKUB", instansi: "FKUB Kota", bidangId: 3, kategori: "Kerukunan", nominal: 85000000, tanggal: "04 Agu 2026", status: "Menunggu", fileName: "Proposal_FKUB_Kota_2026.pdf", fileSize: "2.1 MB" },
  { id: 3, name: "Festival Kerukunan Antar Umat", instansi: "Panitia FKUB", bidangId: 3, kategori: "Kerukunan", nominal: 120000000, tanggal: "01 Agu 2026", status: "Selesai", fileName: "NPHD_Festival_Kerukunan.pdf", fileSize: "4.2 MB" },
  { id: 4, name: "Pelatihan Wawasan Kebangsaan", instansi: "SMPN 4 Kota", bidangId: 1, kategori: "Pendidikan", nominal: 45000000, tanggal: "29 Jul 2026", status: "Menunggu", fileName: "Proposal_Wasbang_SMPN4.pdf", fileSize: "1.8 MB" },
  { id: 5, name: "Dialog Kebangsaan Mahasiswa", instansi: "Universitas Negeri", bidangId: 1, kategori: "Pendidikan", nominal: 60000000, tanggal: "27 Jul 2026", status: "Menunggu", fileName: "Proposal_Dialog_Mahasiswa.pdf", fileSize: "2.7 MB" },
  { id: 6, name: "Penyuluhan Anti Narkoba & Wasnas", instansi: "BNNK / Komunitas", bidangId: 4, kategori: "Kawasan", nominal: 75000000, tanggal: "24 Jul 2026", status: "Selesai", fileName: "Dokumen_Wasnas_BNNK.pdf", fileSize: "3.1 MB" },
  { id: 7, name: "Pekan Olahraga Pemuda & Karang Taruna", instansi: "KONI Kota", bidangId: 2, kategori: "Pemuda", nominal: 180000000, tanggal: "20 Jul 2026", status: "Menunggu", fileName: "Proposal_PO_KarangTaruna.pdf", fileSize: "5.0 MB" },
  { id: 8, name: "Safari Ramadhan & Kerukunan Agama", instansi: "MUI Kota", bidangId: 3, kategori: "Kerukunan", nominal: 95000000, tanggal: "15 Jul 2026", status: "Selesai", fileName: "LPJ_Safari_Ramadhan.pdf", fileSize: "4.6 MB" },
  { id: 9, name: "Pelatihan Kepemimpinan Pemuda Pancasila", instansi: "Karang Taruna", bidangId: 1, kategori: "Pemuda", nominal: 50000000, tanggal: "11 Jul 2026", status: "Selesai", fileName: "SK_Penerima_Hibah_KT.pdf", fileSize: "2.9 MB" },
  { id: 10, name: "Bantuan Forum Lintas Agama", instansi: "Paguyuban Agama", bidangId: 3, kategori: "Kerukunan", nominal: 110000000, tanggal: "08 Jul 2026", status: "Menunggu", fileName: "Proposal_Forum_Agama.pdf", fileSize: "3.3 MB" },
  { id: 11, name: "Festival Kebudayaan Nusantara", instansi: "Dinas Pariwisata", bidangId: 2, kategori: "Seni Budaya", nominal: 200000000, tanggal: "03 Jul 2026", status: "Menunggu", fileName: "Proposal_Budaya_Nusantara.pdf", fileSize: "6.2 MB" },
  { id: 12, name: "Pembinaan Parpol & Ormas Daerah", instansi: "Kesbangpol Kota", bidangId: 2, kategori: "Politik", nominal: 40000000, tanggal: "30 Jun 2026", status: "Selesai", fileName: "NPHD_Pembinaan_Parpol.pdf", fileSize: "3.8 MB" },
];

const initialArsip: ArsipItem[] = [
  {
    id: "arsip-1",
    kode: "ARS-B1-2026-001",
    judul: "NPHD Pembinaan & Pelatihan Pasukan Pengibar Bendera Pusaka (Paskibraka) 2026",
    instansi: "Paskibraka Kota (PPI)",
    bidangId: 1,
    jenis: "NPHD",
    tahun: "2026",
    tanggal: "06 Agu 2026",
    ukuran: "4.8 MB",
    status: "Aktif",
    fileName: "NPHD_Paskibraka_2026_TTE.pdf",
  },
  {
    id: "arsip-2",
    kode: "ARS-B1-2026-002",
    judul: "LPJ Kemah Kebangsaan & Pendidikan Bela Negara Pemuda",
    instansi: "Kwartir Cabang Gerakan Pramuka",
    bidangId: 1,
    jenis: "LPJ Terverifikasi",
    tahun: "2026",
    tanggal: "02 Agu 2026",
    ukuran: "9.4 MB",
    status: "Aktif",
    fileName: "LPJ_Kemah_Pramuka_2026.pdf",
  },
  {
    id: "arsip-3",
    kode: "ARS-B1-2026-003",
    judul: "SK Penetapan Penerima Hibah Pemasyarakatan Pancasila & Wasbang",
    instansi: "Yayasan Generasi Bangsa Mandiri",
    bidangId: 1,
    jenis: "SK Hibah",
    tahun: "2026",
    tanggal: "25 Jul 2026",
    ukuran: "2.5 MB",
    status: "Aktif",
    fileName: "SK_Walikota_Wasbang_2026.pdf",
  },
  {
    id: "arsip-4",
    kode: "ARS-B2-2026-012",
    judul: "NPHD Revitalisasi Taman Budaya & Kesenian",
    instansi: "Dinas Kebudayaan Kota",
    bidangId: 2,
    jenis: "NPHD",
    tahun: "2026",
    tanggal: "05 Agu 2026",
    ukuran: "3.4 MB",
    status: "Aktif",
    fileName: "NPHD_Taman_Budaya_Final.pdf",
  },
  {
    id: "arsip-5",
    kode: "ARS-B3-2026-008",
    judul: "Berita Acara Verifikasi Festival Kerukunan Antar Umat",
    instansi: "Panitia FKUB",
    bidangId: 3,
    jenis: "Berita Acara",
    tahun: "2026",
    tanggal: "01 Agu 2026",
    ukuran: "4.2 MB",
    status: "Aktif",
    fileName: "BA_Verifikasi_FKUB.pdf",
  },
  {
    id: "arsip-6",
    kode: "ARS-B4-2026-021",
    judul: "NPHD Penyuluhan Anti Narkoba & Wasnas",
    instansi: "BNNK / Komunitas",
    bidangId: 4,
    jenis: "NPHD",
    tahun: "2026",
    tanggal: "24 Jul 2026",
    ukuran: "3.1 MB",
    status: "Aktif",
    fileName: "NPHD_Wasnas_BNNK.pdf",
  },
];

interface HibahContextType {
  proposals: ProposalItem[];
  arsipList: ArsipItem[];
  addProposal: (proposal: Omit<ProposalItem, "id" | "tanggal" | "status"> & { file?: File | null }) => Promise<void>;
  updateProposalStatus: (id: number, newStatus: ProposalStatus) => void;
  deleteProposal: (id: number) => void;
  addArsip: (arsip: Omit<ArsipItem, "id">) => void;
  deleteArsip: (id: string) => void;
}

const HibahContext = createContext<HibahContextType | undefined>(undefined);

export function HibahProvider({ children }: { children: React.ReactNode }) {
  const [proposals, setProposals] = useState<ProposalItem[]>(initialProposals);
  const [arsipList, setArsipList] = useState<ArsipItem[]>(initialArsip);

  const addProposal = async (
    newP: Omit<ProposalItem, "id" | "tanggal" | "status"> & { file?: File | null }
  ) => {
    let fileDataUrl: string | undefined = undefined;
    let fileName: string | undefined = undefined;
    let fileSize: string | undefined = undefined;
    let fileType: string | undefined = undefined;

    if (newP.file) {
      fileName = newP.file.name;
      fileSize = `${(newP.file.size / (1024 * 1024)).toFixed(2)} MB`;
      fileType = newP.file.type;

      try {
        fileDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(newP.file as File);
        });
      } catch (err) {
        console.error("Gagal membaca file data URL:", err);
      }
    }

    const created: ProposalItem = {
      id: Date.now(),
      name: newP.name,
      instansi: newP.instansi,
      bidangId: newP.bidangId,
      kategori: newP.kategori,
      nominal: newP.nominal,
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Menunggu", // Baru didaftarkan berstatus Menunggu
      pic: newP.pic,
      noTelp: newP.noTelp,
      catatan: newP.catatan,
      fileName,
      fileSize: fileSize || "2.5 MB",
      fileDataUrl,
      fileType,
    };

    setProposals((prev) => [created, ...prev]);
  };

  const updateProposalStatus = (id: number, newStatus: ProposalStatus) => {
    setProposals((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, status: newStatus };
          // Jika diubah menjadi Selesai, otomatis pindahkan/masukkan ke Arsip
          if (newStatus === "Selesai") {
            const currentYear = new Date().getFullYear().toString();
            const newKode = `ARS-B${item.bidangId}-${currentYear}-${Math.floor(100 + Math.random() * 900)}`;
            const newArsipItem: ArsipItem = {
              id: `arsip-auto-${item.id}`,
              kode: newKode,
              judul: `NPHD & Berkas Pengajuan: ${item.name}`,
              instansi: item.instansi,
              bidangId: item.bidangId,
              jenis: "NPHD",
              tahun: currentYear,
              tanggal: new Date().toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
              ukuran: item.fileSize || "3.5 MB",
              status: "Aktif",
              nominal: item.nominal,
              pic: item.pic,
              noTelp: item.noTelp,
              fileName: item.fileName || `NPHD_${item.name.replace(/\s+/g, "_")}.pdf`,
              fileDataUrl: item.fileDataUrl,
              fileType: item.fileType,
            };

            setArsipList((arsipPrev) => {
              // Hindari duplikasi jika sudah pernah ada
              const exists = arsipPrev.some((a) => a.id === newArsipItem.id);
              if (exists) return arsipPrev;
              return [newArsipItem, ...arsipPrev];
            });
          }
          return updated;
        }
        return item;
      })
    );
  };

  const deleteProposal = (id: number) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
  };

  const addArsip = (newItem: Omit<ArsipItem, "id">) => {
    const created: ArsipItem = {
      ...newItem,
      id: `arsip-${Date.now()}`,
    };
    setArsipList((prev) => [created, ...prev]);
  };

  const deleteArsip = (id: string) => {
    setArsipList((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <HibahContext.Provider
      value={{
        proposals,
        arsipList,
        addProposal,
        updateProposalStatus,
        deleteProposal,
        addArsip,
        deleteArsip,
      }}
    >
      {children}
    </HibahContext.Provider>
  );
}

export function useHibah() {
  const context = useContext(HibahContext);
  if (!context) {
    throw new Error("useHibah must be used within a HibahProvider");
  }
  return context;
}
