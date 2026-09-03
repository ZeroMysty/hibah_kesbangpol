"use client";

import React, { createContext, useContext, useState } from "react";
import { BidangId } from "./mode-context";
export type LemariArsip =
  | "Lemari Arsip 01"
  | "Lemari Arsip 02"
  | "Lemari Arsip 03"
  | "Lemari Arsip 04"
  | "Lemari Arsip Khusus";

export const LEMARI_OPTIONS: { id: LemariArsip; label: string; bidangId: BidangId | 0; desc: string }[] = [
  { id: "Lemari Arsip 01", label: "Lemari Arsip 01", bidangId: 1, desc: "Ideologi, Wawasan Kebangsaan & Bela Negara" },
  { id: "Lemari Arsip 02", label: "Lemari Arsip 02", bidangId: 2, desc: "Politik Dalam Negeri & Ormas" },
  { id: "Lemari Arsip 03", label: "Lemari Arsip 03", bidangId: 3, desc: "Ketahanan Ekonomi, Sosbud & Agama" },
  { id: "Lemari Arsip 04", label: "Lemari Arsip 04", bidangId: 4, desc: "Kewaspadaan Nasional & Konflik Sosial" },
  { id: "Lemari Arsip Khusus", label: "Lemari Arsip Khusus", bidangId: 0, desc: "Arsip Khusus / Gabungan / Cadangan" },
];

export const RAK_OPTIONS = [
  "Rak 01",
  "Rak 02",
  "Rak 03",
  "Rak 04",
  "Rak 05",
];

export interface ProposalItem {
  id: number;
  name: string;
  instansi: string;
  bidangId: BidangId;
  kategori: string;
  nominal: number;
  tanggal: string;
  tahun: string;
  lemariArsip: LemariArsip;
  rakArsip?: string;   // e.g. "Rak 01", "Rak 02", ...
  nomorArsip?: string; // e.g. "No. 01", "No. 12", ...
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
  lemariArsip: LemariArsip;
  rakArsip?: string;   // e.g. "Rak 01", "Rak 02", ...
  nomorArsip?: string; // e.g. "No. 01", "No. 12", ...
  status?: "Aktif" | "Permanen" | "Inaktif";
  nominal?: number;
  pic?: string;
  noTelp?: string;
  catatan?: string;
  fileName?: string;
  fileDataUrl?: string;
  fileType?: string;
}

const initialProposals: ProposalItem[] = [];

const initialArsip: ArsipItem[] = [];

interface HibahContextType {
  proposals: ProposalItem[];
  arsipList: ArsipItem[];
  addProposal: (
    proposal: Omit<ProposalItem, "id" | "tanggal" | "tahun" | "lemariArsip" | "rakArsip" | "nomorArsip"> & {
      file?: File | null;
      lemariArsip?: LemariArsip;
      rakArsip?: string;
      nomorArsip?: string;
    }
  ) => Promise<void>;
  updateProposalLemari: (id: number, newLemari: LemariArsip) => void;
  updateProposalLokasi: (id: number, newLemari: LemariArsip, newRak?: string, newNomor?: string) => void;
  updateProposal: (
    id: number,
    updates: Partial<Pick<ProposalItem, "name" | "instansi" | "kategori" | "nominal" | "lemariArsip" | "rakArsip" | "nomorArsip" | "pic" | "noTelp" | "catatan">>
  ) => void;
  deleteProposal: (id: number) => void;
  addArsip: (arsip: Omit<ArsipItem, "id">) => void;
  updateArsipLokasi: (id: string, newLemari: LemariArsip, newRak?: string, newNomor?: string) => void;
  deleteArsip: (id: string) => void;
  isOlderThan5Years: (tahunStr: string | number) => boolean;
}

const HibahContext = createContext<HibahContextType | undefined>(undefined);

export function HibahProvider({ children }: { children: React.ReactNode }) {
  const [proposals, setProposals] = useState<ProposalItem[]>(initialProposals);
  const [arsipList, setArsipList] = useState<ArsipItem[]>(initialArsip);

  // Helper untuk menentukan apakah dokumen > 5 tahun (terhadap tahun berjalan 2026)
  const isOlderThan5Years = (tahunStr: string | number) => {
    const currentYear = new Date().getFullYear();
    const docYear = typeof tahunStr === "string" ? parseInt(tahunStr, 10) : tahunStr;
    if (isNaN(docYear)) return false;
    return currentYear - docYear >= 5;
  };

  const addProposal = async (
    newP: Omit<ProposalItem, "id" | "tanggal" | "tahun" | "lemariArsip" | "rakArsip" | "nomorArsip"> & {
      file?: File | null;
      lemariArsip?: LemariArsip;
      rakArsip?: string;
      nomorArsip?: string;
    }
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

    const defaultLemari: LemariArsip =
      newP.lemariArsip ||
      (newP.bidangId === 1
        ? "Lemari Arsip 01"
        : newP.bidangId === 2
        ? "Lemari Arsip 02"
        : newP.bidangId === 3
        ? "Lemari Arsip 03"
        : "Lemari Arsip 04");

    const defaultRak = newP.rakArsip || "Rak 01";
    const defaultNomor = newP.nomorArsip || `No. ${String(Math.floor(1 + Math.random() * 30)).padStart(2, "0")}`;

    const currentYear = new Date().getFullYear().toString();

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
      tahun: currentYear,
      lemariArsip: defaultLemari,
      rakArsip: defaultRak,
      nomorArsip: defaultNomor,
      pic: newP.pic,
      noTelp: newP.noTelp,
      catatan: newP.catatan,
      fileName,
      fileSize: fileSize || "2.5 MB",
      fileDataUrl,
      fileType,
    };

    setProposals((prev) => [created, ...prev]);

    // Otomatis buat entri di arsip dokumen
    const newKode = `ARS-B${newP.bidangId}-${currentYear}-${Math.floor(100 + Math.random() * 900)}`;
    const newArsipItem: ArsipItem = {
      id: `arsip-auto-${created.id}`,
      kode: newKode,
      judul: `Proposal & Berkas Hibah: ${newP.name}`,
      instansi: newP.instansi,
      bidangId: newP.bidangId,
      jenis: "Proposal & RAB",
      tahun: currentYear,
      tanggal: created.tanggal,
      ukuran: created.fileSize || "3.5 MB",
      lemariArsip: defaultLemari,
      rakArsip: defaultRak,
      nomorArsip: defaultNomor,
      nominal: newP.nominal,
      pic: newP.pic,
      noTelp: newP.noTelp,
      fileName: fileName || `Proposal_${newP.name.replace(/\s+/g, "_")}.pdf`,
      fileDataUrl,
      fileType,
    };

    setArsipList((arsipPrev) => [newArsipItem, ...arsipPrev]);
  };

  const updateProposalLokasi = (
    id: number,
    newLemari: LemariArsip,
    newRak?: string,
    newNomor?: string
  ) => {
    setProposals((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            lemariArsip: newLemari,
            ...(newRak !== undefined ? { rakArsip: newRak } : {}),
            ...(newNomor !== undefined ? { nomorArsip: newNomor } : {}),
          };
        }
        return item;
      })
    );

    // Sync dengan arsip jika ada
    setArsipList((arsipPrev) =>
      arsipPrev.map((item) => {
        if (item.id === `arsip-auto-${id}`) {
          return {
            ...item,
            lemariArsip: newLemari,
            ...(newRak !== undefined ? { rakArsip: newRak } : {}),
            ...(newNomor !== undefined ? { nomorArsip: newNomor } : {}),
          };
        }
        return item;
      })
    );
  };

  const updateProposalLemari = (id: number, newLemari: LemariArsip) => {
    updateProposalLokasi(id, newLemari);
  };

  const updateArsipLokasi = (
    id: string,
    newLemari: LemariArsip,
    newRak?: string,
    newNomor?: string
  ) => {
    setArsipList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            lemariArsip: newLemari,
            ...(newRak !== undefined ? { rakArsip: newRak } : {}),
            ...(newNomor !== undefined ? { nomorArsip: newNomor } : {}),
          };
        }
        return item;
      })
    );
  };

  const updateProposal = (
    id: number,
    updates: Partial<Pick<ProposalItem, "name" | "instansi" | "kategori" | "nominal" | "lemariArsip" | "rakArsip" | "nomorArsip" | "pic" | "noTelp" | "catatan">>
  ) => {
    setProposals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteProposal = (id: number) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
    setArsipList((prev) => prev.filter((a) => a.id !== `arsip-auto-${id}`));
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
        updateProposalLemari,
        updateProposalLokasi,
        updateProposal,
        deleteProposal,
        addArsip,
        updateArsipLokasi,
        deleteArsip,
        isOlderThan5Years,
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
