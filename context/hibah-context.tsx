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
  status?: "Aktif" | "Permanen" | "Inaktif";
  nominal?: number;
  pic?: string;
  noTelp?: string;
  catatan?: string;
  fileName?: string;
  fileDataUrl?: string;
  fileType?: string;
}

const initialProposals: ProposalItem[] = [
  // ==================== BIDANG 1: Ideologi, Wawasan Kebangsaan & Bela Negara ====================
  { id: 101, name: "Pendidikan & Pelatihan Intensif Paskibraka Kota 2026", instansi: "Paskibraka Kota (PPI)", bidangId: 1, kategori: "Pendidikan", nominal: 150000000, tanggal: "10 Agu 2026", tahun: "2026", lemariArsip: "Lemari Arsip 01", fileName: "NPHD_Paskibraka_2026.pdf", fileSize: "4.8 MB", pic: "Ahmad Fauzi, S.Sos" },
  { id: 102, name: "Kemah Wawasan Kebangsaan & Bela Negara Pramuka", instansi: "Kwartir Cabang Gerakan Pramuka", bidangId: 1, kategori: "Pemuda", nominal: 85000000, tanggal: "08 Agu 2026", tahun: "2026", lemariArsip: "Lemari Arsip 01", fileName: "Proposal_Kemah_Pramuka.pdf", fileSize: "3.2 MB", pic: "Drs. Bambang Suharto" },
  { id: 103, name: "Sosialisasi & Pemantapan Nilai Pancasila Pelajar", instansi: "SMPN 4 Kota", bidangId: 1, kategori: "Pendidikan", nominal: 45000000, tanggal: "29 Jul 2026", tahun: "2026", lemariArsip: "Lemari Arsip 01", fileName: "Proposal_Wasbang_SMPN4.pdf", fileSize: "1.8 MB", pic: "Dra. Siti Rahmah" },
  { id: 104, name: "Dialog Kebangsaan Mahasiswa & Generasi Muda", instansi: "Universitas Negeri", bidangId: 1, kategori: "Pendidikan", nominal: 60000000, tanggal: "27 Jul 2026", tahun: "2026", lemariArsip: "Lemari Arsip 01", fileName: "Proposal_Dialog_Mahasiswa.pdf", fileSize: "2.7 MB", pic: "Dr. Irwan Setiawan" },
  { id: 105, name: "Pelatihan Kepemimpinan Resimen Mahasiswa (Menwa)", instansi: "Skomen Mahawarman", bidangId: 1, kategori: "Bela Negara", nominal: 55000000, tanggal: "22 Jul 2026", tahun: "2026", lemariArsip: "Lemari Arsip 01", fileName: "NPHD_Diklat_Menwa_2026.pdf", fileSize: "3.5 MB", pic: "Mayor (Purn.) Hendra" },
  { id: 106, name: "Forum Pembauran Kebangsaan (FPK) Antar Etnis", instansi: "Sekretariat FPK Kota", bidangId: 1, kategori: "Kebangsaan", nominal: 70000000, tanggal: "14 Jul 2026", tahun: "2026", lemariArsip: "Lemari Arsip 01", fileName: "SK_Bantuan_FPK.pdf", fileSize: "2.9 MB", pic: "Drs. H. Maman" },

  // ==================== BIDANG 2: Politik Dalam Negeri & Organisasi Kemasyarakatan ====================
  { id: 201, name: "Revitalisasi Sanggar Budaya & Kreativitas Pemuda", instansi: "Dinas Kebudayaan & Karang Taruna", bidangId: 2, kategori: "Seni Budaya", nominal: 250000000, tanggal: "05 Agu 2026", tahun: "2026", lemariArsip: "Lemari Arsip 02", fileName: "Proposal_Taman_Budaya_2026.pdf", fileSize: "3.4 MB", pic: "Rizky Pratama, SH" },
  { id: 202, name: "Pemberdayaan Karang Taruna Berbasis Kelurahan", instansi: "Pengurus Karang Taruna Kota", bidangId: 2, kategori: "Pemuda", nominal: 95000000, tanggal: "03 Agu 2026", tahun: "2026", lemariArsip: "Lemari Arsip 02", fileName: "Proposal_Pemberdayaan_KT.pdf", fileSize: "2.8 MB", pic: "Yudi Firmansyah" },
  { id: 203, name: "Pekan Olahraga Pemuda & Pelajar Antar Kecamatan", instansi: "KONI / KNPI Kota", bidangId: 2, kategori: "Pemuda", nominal: 180000000, tanggal: "20 Jul 2026", tahun: "2026", lemariArsip: "Lemari Arsip 02", fileName: "Proposal_PO_KarangTaruna.pdf", fileSize: "5.0 MB", pic: "Asep Sunandar" },
  { id: 204, name: "Pendidikan Politik & Demokrasi Pemilih Pemula", instansi: "Yayasan Demokrasi Rakyat", bidangId: 2, kategori: "Politik", nominal: 65000000, tanggal: "18 Jul 2026", tahun: "2026", lemariArsip: "Lemari Arsip 02", fileName: "NPHD_Pendidikan_Politik.pdf", fileSize: "3.1 MB", pic: "H. Ridwan Kamil, MM" },
  { id: 205, name: "Fasilitasi Pembinaan Ormas & Lembaga Swadaya", instansi: "Forum Ormas Bersatu", bidangId: 2, kategori: "Ormas", nominal: 80000000, tanggal: "12 Jul 2026", tahun: "2026", lemariArsip: "Lemari Arsip 02", fileName: "Proposal_Pembinaan_Ormas.pdf", fileSize: "2.4 MB", pic: "Agus Supriatna" },
  { id: 206, name: "Festival Kebudayaan & Seni Tradisional Pasundan", instansi: "Paguyuban Pasundan", bidangId: 2, kategori: "Seni Budaya", nominal: 200000000, tanggal: "03 Jul 2026", tahun: "2026", lemariArsip: "Lemari Arsip 02", fileName: "NPHD_Paguyuban_Pasundan.pdf", fileSize: "4.5 MB", pic: "Prof. Dr. Didi Turmudzi" },

  // ==================== BIDANG 3: Ketahanan Ekonomi, Sosbud & Agama ====================
  { id: 301, name: "Penguatan Kapasitas Kerukunan Umat Beragama (FKUB)", instansi: "FKUB Kota", bidangId: 3, kategori: "Kerukunan", nominal: 85000000, tanggal: "04 Agu 2026", tahun: "2026", lemariArsip: "Lemari Arsip 03", fileName: "Proposal_FKUB_Kota_2026.pdf", fileSize: "2.1 MB", pic: "KH. Subhan Makmun" },
  { id: 302, name: "Festival Kerukunan Lintas Agama & Dialog Toleransi", instansi: "Panitia Bersama FKUB", bidangId: 3, kategori: "Kerukunan", nominal: 120000000, tanggal: "01 Agu 2026", tahun: "2026", lemariArsip: "Lemari Arsip 03", fileName: "NPHD_Festival_Kerukunan.pdf", fileSize: "4.2 MB", pic: "Pdt. Simon Petrus" },
  { id: 303, name: "Safari Dakwah & Pembinaan Rohani Kemasyarakatan", instansi: "MUI Kota", bidangId: 3, kategori: "Kerukunan", nominal: 95000000, tanggal: "15 Jul 2026", tahun: "2026", lemariArsip: "Lemari Arsip 03", fileName: "LPJ_Safari_Ramadhan.pdf", fileSize: "4.6 MB", pic: "Drs. KH. Miftah Faridl" },
  { id: 304, name: "Bantuan Sarana Forum Komunikasi Antar Umat Kristiani", instansi: "Badan Musyawarah Antar Gereja (BAMAG)", bidangId: 3, kategori: "Kerukunan", nominal: 110000000, tanggal: "08 Jul 2026", tahun: "2026", lemariArsip: "Lemari Arsip 03", fileName: "Proposal_Forum_Agama.pdf", fileSize: "3.3 MB", pic: "Pdt. Daniel Sudarto" },
  { id: 305, name: "Pemberdayaan Ekonomi Umat Berbasis Koperasi Masjid", instansi: "Dewan Kemakmuran Masjid Agung", bidangId: 3, kategori: "Ekonomi", nominal: 75000000, tanggal: "06 Jul 2026", tahun: "2026", lemariArsip: "Lemari Arsip 03", fileName: "NPHD_Ekonomi_Umat.pdf", fileSize: "3.7 MB", pic: "H. Cecep Saepudin" },
  { id: 306, name: "Fasilitasi Pagelaran Seni Budaya Lintas Agama", instansi: "Dewan Kesenian Kota", bidangId: 3, kategori: "Seni Budaya", nominal: 130000000, tanggal: "02 Jul 2026", tahun: "2026", lemariArsip: "Lemari Arsip 03", fileName: "Proposal_Seni_LintasAgama.pdf", fileSize: "4.1 MB", pic: "Dedi Rosadi, S.Sn" },

  // ==================== BIDANG 4: Kewaspadaan Nasional & Konflik Sosial ====================
  { id: 401, name: "Pelatihan Deteksi Dini & Early Warning System (FKDM)", instansi: "Forum Kewaspadaan Dini Masyarakat", bidangId: 4, kategori: "Kawasan", nominal: 95000000, tanggal: "07 Agu 2026", tahun: "2026", lemariArsip: "Lemari Arsip 04", fileName: "NPHD_FKDM_DeteksiDini.pdf", fileSize: "3.8 MB", pic: "Kolonel (Purn.) Agus Salim" },
  { id: 402, name: "Penyuluhan Pencegahan Narkoba & Ketahanan Wilayah", instansi: "BNNK / Relawan Wasnas", bidangId: 4, kategori: "Kawasan", nominal: 75000000, tanggal: "24 Jul 2026", tahun: "2026", lemariArsip: "Lemari Arsip 04", fileName: "Dokumen_Wasnas_BNNK.pdf", fileSize: "3.1 MB", pic: "AKBP (Purn.) Budiman" },
  { id: 403, name: "Sosialisasi Pencegahan Ekstremisme & Radikalisme", instansi: "Komunitas Kewaspadaan Generasi", bidangId: 4, kategori: "Kawasan", nominal: 65000000, tanggal: "19 Jul 2026", tahun: "2026", lemariArsip: "Lemari Arsip 04", fileName: "Proposal_Cegah_Radikalisme.pdf", fileSize: "2.6 MB", pic: "Dr. Hendra Wijaya" },
  { id: 404, name: "Pengawasan Orang Asing & Pemantauan Perbatasan Kota", instansi: "Satgas Pengawasan Orang Asing", bidangId: 4, kategori: "Kawasan", nominal: 110000000, tanggal: "11 Jul 2026", tahun: "2026", lemariArsip: "Lemari Arsip 04", fileName: "Proposal_Pengawasan_Asing.pdf", fileSize: "3.9 MB", pic: "Drs. Eko Prasetyo" },
  { id: 405, name: "Simulasi Mediasi & Penanganan Potensi Konflik Sosial", instansi: "Lembaga Advokasi Damai", bidangId: 4, kategori: "Kawasan", nominal: 80000000, tanggal: "05 Jul 2026", tahun: "2026", lemariArsip: "Lemari Arsip 04", fileName: "NPHD_Simulasi_Konflik.pdf", fileSize: "3.3 MB", pic: "Nurul Hidayat, SH" },
  { id: 406, name: "Pembinaan Satuan Relawan Tanggap Konflik Sosial", instansi: "Relawan Wasnas Jawa Barat", bidangId: 4, kategori: "Kawasan", nominal: 50000000, tanggal: "28 Jun 2026", tahun: "2026", lemariArsip: "Lemari Arsip 04", fileName: "Proposal_Relawan_Wasnas.pdf", fileSize: "2.2 MB", pic: "Deden Suryana" },

  // ==================== DOKUMEN HISTORIS (> 5 TAHUN / RETENSI LAMA) ====================
  { id: 501, name: "Bimbingan Teknis Wasbang & Bela Negara Pelajar 2020", instansi: "Forum Pendidik Karakter Bangsa", bidangId: 1, kategori: "Pendidikan", nominal: 40000000, tanggal: "12 Okt 2020", tahun: "2020", lemariArsip: "Lemari Arsip 01", fileName: "Dokumen_Wasbang_2020.pdf", fileSize: "3.0 MB", pic: "H. Sugeng, M.Pd" },
  { id: 502, name: "Fasilitasi Pendidikan Politik Pemilu Daerah 2019", instansi: "Lembaga Demokrasi Nusantara", bidangId: 2, kategori: "Politik", nominal: 75000000, tanggal: "15 Apr 2019", tahun: "2019", lemariArsip: "Lemari Arsip 02", fileName: "LPJ_Pendidikan_Politik_2019.pdf", fileSize: "4.1 MB", pic: "Dedi Suhendar" },
  { id: 503, name: "Bantuan Sarana Kerukunan Umat Beragama 2018", instansi: "Sekretariat FKUB Kota", bidangId: 3, kategori: "Kerukunan", nominal: 60000000, tanggal: "20 Agu 2018", tahun: "2018", lemariArsip: "Lemari Arsip 03", fileName: "SK_FKUB_2018.pdf", fileSize: "2.8 MB", pic: "Drs. H. Miftah" },
  { id: 504, name: "Deteksi Dini & Pencegahan Kerawanan Sosial 2020", instansi: "FKDM Kota", bidangId: 4, kategori: "Kawasan", nominal: 50000000, tanggal: "05 Des 2020", tahun: "2020", lemariArsip: "Lemari Arsip 04", fileName: "Dokumen_FKDM_2020.pdf", fileSize: "3.2 MB", pic: "Mayor Suwandi" },
];

const initialArsip: ArsipItem[] = [
  // Bidang 1 (Aktif <= 5 Tahun)
  {
    id: "arsip-1",
    kode: "ARS-B1-2026-001",
    judul: "NPHD Pembinaan & Pelatihan Pasukan Pengibar Bendera Pusaka (Paskibraka) 2026",
    instansi: "Paskibraka Kota (PPI)",
    bidangId: 1,
    jenis: "NPHD",
    tahun: "2026",
    tanggal: "10 Agu 2026",
    ukuran: "4.8 MB",
    lemariArsip: "Lemari Arsip 01",
    fileName: "NPHD_Paskibraka_2026_TTE.pdf",
    nominal: 150000000,
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
    lemariArsip: "Lemari Arsip 01",
    fileName: "LPJ_Kemah_Pramuka_2026.pdf",
    nominal: 80000000,
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
    lemariArsip: "Lemari Arsip 01",
    fileName: "SK_Walikota_Wasbang_2026.pdf",
    nominal: 60000000,
  },
  {
    id: "arsip-4",
    kode: "ARS-B1-2025-014",
    judul: "Berita Acara Evaluasi Lapangan Diklat Paskibraka Kota T.A. 2025",
    instansi: "Purna Paskibraka Indonesia (PPI)",
    bidangId: 1,
    jenis: "Berita Acara",
    tahun: "2025",
    tanggal: "18 Nov 2025",
    ukuran: "3.2 MB",
    lemariArsip: "Lemari Arsip 01",
    fileName: "BA_Evaluasi_Paskibraka_2025.pdf",
  },

  // Bidang 2
  {
    id: "arsip-5",
    kode: "ARS-B2-2026-012",
    judul: "NPHD Revitalisasi Sanggar Budaya & Karang Taruna Kota",
    instansi: "Dinas Kebudayaan & Karang Taruna",
    bidangId: 2,
    jenis: "NPHD",
    tahun: "2026",
    tanggal: "05 Agu 2026",
    ukuran: "3.4 MB",
    lemariArsip: "Lemari Arsip 02",
    fileName: "NPHD_Taman_Budaya_Final.pdf",
    nominal: 250000000,
  },
  {
    id: "arsip-6",
    kode: "ARS-B2-2026-018",
    judul: "NPHD Festival Seni Kebudayaan Pasundan 2026",
    instansi: "Paguyuban Pasundan",
    bidangId: 2,
    jenis: "NPHD",
    tahun: "2026",
    tanggal: "03 Jul 2026",
    ukuran: "4.5 MB",
    lemariArsip: "Lemari Arsip 02",
    fileName: "NPHD_Paguyuban_Pasundan.pdf",
    nominal: 200000000,
  },
  {
    id: "arsip-7",
    kode: "ARS-B2-2025-045",
    judul: "LPJ Pelatihan Kepemimpinan Organisasi Kepemudaan (KNPI)",
    instansi: "DPD KNPI Kota Bandung",
    bidangId: 2,
    jenis: "LPJ Terverifikasi",
    tahun: "2025",
    tanggal: "15 Des 2025",
    ukuran: "8.1 MB",
    lemariArsip: "Lemari Arsip 02",
    fileName: "LPJ_KNPI_2025.pdf",
  },

  // Bidang 3
  {
    id: "arsip-8",
    kode: "ARS-B3-2026-008",
    judul: "Berita Acara Verifikasi Festival Kerukunan Antar Umat Beragama",
    instansi: "Panitia Bersama FKUB",
    bidangId: 3,
    jenis: "Berita Acara",
    tahun: "2026",
    tanggal: "01 Agu 2026",
    ukuran: "4.2 MB",
    lemariArsip: "Lemari Arsip 03",
    fileName: "BA_Verifikasi_FKUB.pdf",
    nominal: 120000000,
  },
  {
    id: "arsip-9",
    kode: "ARS-B3-2026-015",
    judul: "LPJ Safari Dakwah Ramadhan & Pembinaan Rohani",
    instansi: "MUI Kota Bandung",
    bidangId: 3,
    jenis: "LPJ Terverifikasi",
    tahun: "2026",
    tanggal: "15 Jul 2026",
    ukuran: "4.6 MB",
    lemariArsip: "Lemari Arsip 03",
    fileName: "LPJ_Safari_Ramadhan.pdf",
    nominal: 95000000,
  },
  {
    id: "arsip-10",
    kode: "ARS-B3-2025-088",
    judul: "SK Walikota Penetapan Hibah FKUB & Lembaga Keagamaan 2025",
    instansi: "FKUB Kota Bandung",
    bidangId: 3,
    jenis: "SK Hibah",
    tahun: "2025",
    tanggal: "10 Mar 2025",
    ukuran: "2.8 MB",
    lemariArsip: "Lemari Arsip 03",
    fileName: "SK_Hibah_FKUB_2025.pdf",
  },

  // Bidang 4
  {
    id: "arsip-11",
    kode: "ARS-B4-2026-021",
    judul: "NPHD Penyuluhan Anti Narkoba & Wawasan Nasional",
    instansi: "BNNK / Relawan Wasnas",
    bidangId: 4,
    jenis: "NPHD",
    tahun: "2026",
    tanggal: "24 Jul 2026",
    ukuran: "3.1 MB",
    lemariArsip: "Lemari Arsip 04",
    fileName: "NPHD_Wasnas_BNNK.pdf",
    nominal: 75000000,
  },
  {
    id: "arsip-12",
    kode: "ARS-B4-2026-029",
    judul: "NPHD Pelatihan Early Warning System & Deteksi Dini Konflik",
    instansi: "Forum Kewaspadaan Dini Masyarakat (FKDM)",
    bidangId: 4,
    jenis: "NPHD",
    tahun: "2026",
    tanggal: "07 Agu 2026",
    ukuran: "3.8 MB",
    lemariArsip: "Lemari Arsip 04",
    fileName: "NPHD_FKDM_DeteksiDini.pdf",
    nominal: 95000000,
  },
  {
    id: "arsip-13",
    kode: "ARS-B4-2025-061",
    judul: "LPJ Sosialisasi Pencegahan Ekstremisme & Radikalisme 2025",
    instansi: "Komunitas Kewaspadaan Generasi",
    bidangId: 4,
    jenis: "LPJ Terverifikasi",
    tahun: "2025",
    tanggal: "14 Agu 2025",
    ukuran: "6.2 MB",
    lemariArsip: "Lemari Arsip 04",
    fileName: "LPJ_Pencegahan_Radikalisme_2025.pdf",
  },
  {
    id: "arsip-14",
    kode: "ARS-B4-2025-033",
    judul: "Berita Acara Penanganan & Pemantauan Potensi Konflik Sosial",
    instansi: "Satgas Deteksi Dini Kota",
    bidangId: 4,
    jenis: "Berita Acara",
    tahun: "2025",
    tanggal: "19 Mei 2025",
    ukuran: "1.9 MB",
    lemariArsip: "Lemari Arsip 04",
    fileName: "BA_Penanganan_Konflik_2025.pdf",
  },

  // ==================== DOKUMEN HISTORIS (> 5 TAHUN / RETENSI LAMA) ====================
  {
    id: "arsip-hist-1",
    kode: "ARS-B1-2021-092",
    judul: "NPHD Pembinaan Kader Bela Negara & Wasbang Angkatan 2021",
    instansi: "Purna Paskibraka & Karang Taruna",
    bidangId: 1,
    jenis: "NPHD",
    tahun: "2021",
    tanggal: "14 Sep 2021",
    ukuran: "5.1 MB",
    lemariArsip: "Lemari Arsip 01",
    fileName: "NPHD_Wasbang_2021.pdf",
    nominal: 70000000,
  },
  {
    id: "arsip-hist-2",
    kode: "ARS-B2-2020-038",
    judul: "LPJ Penyaluran Bantuan Operasional Ormas Peduli Pandemi 2020",
    instansi: "Aliansi Ormas Bersatu Kota",
    bidangId: 2,
    jenis: "LPJ Terverifikasi",
    tahun: "2020",
    tanggal: "18 Nov 2020",
    ukuran: "7.8 MB",
    lemariArsip: "Lemari Arsip 02",
    fileName: "LPJ_Bantuan_Ormas_2020.pdf",
    nominal: 110000000,
  },
  {
    id: "arsip-hist-3",
    kode: "ARS-B3-2019-019",
    judul: "SK Hibah Renovasi Fasilitas Rumah Ibadah & Sarana Kerukunan 2019",
    instansi: "FKUB & Pengurus Rumah Ibadah",
    bidangId: 3,
    jenis: "SK Hibah",
    tahun: "2019",
    tanggal: "08 Mei 2019",
    ukuran: "3.6 MB",
    lemariArsip: "Lemari Arsip 03",
    fileName: "SK_Walikota_FKUB_2019.pdf",
    nominal: 85000000,
  },
  {
    id: "arsip-hist-4",
    kode: "ARS-B4-2018-055",
    judul: "Berita Acara Monitoring Kerawanan Konflik Pilkada Serentak 2018",
    instansi: "Forum Kewaspadaan Dini Masyarakat (FKDM)",
    bidangId: 4,
    jenis: "Berita Acara",
    tahun: "2018",
    tanggal: "22 Jun 2018",
    ukuran: "4.4 MB",
    lemariArsip: "Lemari Arsip 04",
    fileName: "BA_Monitoring_Pilkada_2018.pdf",
    nominal: 65000000,
  },
  {
    id: "arsip-hist-5",
    kode: "ARS-B0-2020-001",
    judul: "Berkas Khusus Laporan Audit Eksternal BPK Hibah Bakesbangpol",
    instansi: "Badan Pemeriksa Keuangan (BPK)",
    bidangId: 1,
    jenis: "LPJ Terverifikasi",
    tahun: "2020",
    tanggal: "12 Des 2020",
    ukuran: "12.5 MB",
    lemariArsip: "Lemari Arsip Khusus",
    fileName: "LHP_BPK_Hibah_2020.pdf",
  },
];

interface HibahContextType {
  proposals: ProposalItem[];
  arsipList: ArsipItem[];
  addProposal: (proposal: Omit<ProposalItem, "id" | "tanggal" | "tahun" | "lemariArsip"> & { file?: File | null; lemariArsip?: LemariArsip }) => Promise<void>;
  updateProposalLemari: (id: number, newLemari: LemariArsip) => void;
  updateProposal: (id: number, updates: Partial<Pick<ProposalItem, "name" | "instansi" | "kategori" | "nominal" | "pic" | "noTelp" | "catatan">>) => void;
  deleteProposal: (id: number) => void;
  addArsip: (arsip: Omit<ArsipItem, "id">) => void;
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
    newP: Omit<ProposalItem, "id" | "tanggal" | "tahun" | "lemariArsip"> & { file?: File | null; lemariArsip?: LemariArsip }
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
      nominal: newP.nominal,
      pic: newP.pic,
      noTelp: newP.noTelp,
      fileName: fileName || `Proposal_${newP.name.replace(/\s+/g, "_")}.pdf`,
      fileDataUrl,
      fileType,
    };

    setArsipList((arsipPrev) => [newArsipItem, ...arsipPrev]);
  };

  const updateProposalLemari = (id: number, newLemari: LemariArsip) => {
    setProposals((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, lemariArsip: newLemari };
        }
        return item;
      })
    );

    // Sync dengan arsip jika ada
    setArsipList((arsipPrev) =>
      arsipPrev.map((item) => {
        if (item.id === `arsip-auto-${id}`) {
          return { ...item, lemariArsip: newLemari };
        }
        return item;
      })
    );
  };

  const updateProposal = (
    id: number,
    updates: Partial<Pick<ProposalItem, "name" | "instansi" | "kategori" | "nominal" | "pic" | "noTelp" | "catatan">>
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
        updateProposal,
        deleteProposal,
        addArsip,
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
