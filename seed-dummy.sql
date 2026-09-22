-- ============================================================================
-- DATA DUMMY: kesbang (Hibah, Arsip, Mitra Kerja/Penerima Hibah)
-- Cara pakai: buka phpMyAdmin -> pilih database `kesbang` -> tab SQL -> paste -> Go
--
-- PENTING:
--  1. Jalankan SEKALI saja. Tidak ada unique key, jadi kalau dijalankan 2x data jadi dobel.
--  2. Kalau mau reset dulu, buka komentar blok TRUNCATE di bawah (HATI-HATI: menghapus data asli).
--  3. File ini asumsi skema dari `kesbang.sql` v2.0 (kolom `jenis_dokumen_arsip`).
--     Kalau database kamu masih pakai kolom lama `jenis_dokume_arsip`, ganti namanya
--     pada INSERT data_hibah di bawah.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- (OPSIONAL) RESET DATA — hapus komentar di bawah kalau mau mulai dari kosong
-- ---------------------------------------------------------------------------
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE `data_hibah`;
-- TRUNCATE TABLE `arsip`;
-- TRUNCATE TABLE `mitra_kerja`;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. DATA DUMMY: data_hibah (Usulan/Dokumen Hibah) — 56 baris
--    Bidang 1 = Lemari Arsip 01, Bidang 2 = Lemari Arsip 02, dst.
--    Tahun 2022-2026 muncul di tabel Hibah; tahun lama (2018-2021) untuk uji retensi.
-- ============================================================================
INSERT INTO `data_hibah`
  (`jenis_dokumen_arsip`, `nominal_diajukan`, `lembaga`, `tujuan_bidang_teknis`, `lemari_arsip`, `posisi_rak`, `nomor_berkas`, `kategori_program`, `tahun_anggaran`, `status_hibah`, `nama_penanggung_jawab`, `scan_foto`, `created_at`)
VALUES
-- ── Bidang 1: Ideologi, Wawasan Kebangsaan & Bela Negara ──
('Pelatihan Kader Bela Negara Angkatan V', 120000000, 'Komunitas Bela Negara Garuda Muda', '1', 'Lemari Arsip 01', 'Rak 01', 'No. 01', 'Pendidikan', '2026', 'Diajukan', 'Budi Santoso', 'NPHD_BelaNegara_2026.pdf', '2026-01-12 09:30:00'),
('Sosialisasi Pancasila di Lingkungan Sekolah', 75000000, 'Yayasan Pendidikan Cendekia Bangsa', '1', 'Lemari Arsip 01', 'Rak 01', 'No. 02', 'Pendidikan', '2026', 'Proses Verifikasi', 'Siti Rahmawati', 'NPHD_Pancasila_Sekolah.pdf', '2026-02-03 10:15:00'),
('Festival Kesatuan Bangsa & Bahasa Daerah', 150000000, 'Sanggar Budaya Nusantara', '1', 'Lemari Arsip 01', 'Rak 02', 'No. 01', 'Seni Budaya', '2026', 'Disetujui', 'Dewi Lestari', 'Proposal_FKSB_2026.pdf', '2026-02-20 13:45:00'),
('Klinik Kewarganegaraan Generasi Muda', 60000000, 'Komunitas Studi Kebangsaan Insan', '1', 'Lemari Arsip 01', 'Rak 02', 'No. 02', 'Pendidikan', '2025', 'Disetujui', 'Agus Prasetyo', 'BA_KKW_2025.pdf', '2025-03-11 08:20:00'),
('Seminar Ideologi & Pencegahan Radikalisme', 85000000, 'Yayasan Nurul Iman', '1', 'Lemari Arsip 01', 'Rak 03', 'No. 01', 'Pendidikan', '2025', 'Disetujui', 'Ahmad Fauzi', 'LPJ_Seminar_Ideologi.pdf', '2025-05-06 14:00:00'),
('Lomba Cipta Poster Pancasila Tingkat Pelajar', 35000000, 'Karang Taruna Merdeka Jaya', '1', 'Lemari Arsip 01', 'Rak 03', 'No. 02', 'Pemuda', '2025', 'Ditolak', 'Rina Marlina', 'NPHD_Poster_Pancasila.pdf', '2025-07-19 09:00:00'),
('Bimbingan Wawasan Kebangsaan Pemuda Peduli', 50000000, 'Forum Komunikasi Pemuda Kabupaten', '1', 'Lemari Arsip 01', 'Rak 04', 'No. 01', 'Pemuda', '2024', 'Disetujui', 'Joko Susilo', 'SK_Wawasan_Kebangsaan.pdf', '2024-02-14 10:30:00'),
('Pelatihan Bela Negara Dasar (Persiapan Linmas)', 95000000, 'Masyarakat Peduli Keamanan Lingkungan (MKL)', '1', 'Lemari Arsip 01', 'Rak 04', 'No. 02', 'Kawasan', '2024', 'Disetujui', 'Hendra Wijaya', 'LPJ_BelaNegara_Dasar.pdf', '2024-04-25 11:00:00'),
('Diskusi Publik Konstitusi & Kebangsaan', 40000000, 'Ormas Kemahasiswaan Bina Ilmu', '1', 'Lemari Arsip 01', 'Rak 05', 'No. 01', 'Politik', '2023', 'Disetujui', 'Fatimah Zahra', 'BA_Diskusi_Konstitusi.pdf', '2023-03-08 13:15:00'),
('Upacara & Apel Kebangsaan Hari Sumpah Pemuda', 25000000, 'Paguyuban Pemuda Sepakat', '1', 'Lemari Arsip 01', 'Rak 05', 'No. 02', 'Pemuda', '2023', 'Disetujui', 'Bambang Sutrisno', 'Proposal_SumpahPemuda.pdf', '2023-10-02 08:45:00'),
('Kajian Kebinekaan & Toleransi Warga', 45000000, 'Forum Warga Kota Harmoni', '1', 'Lemari Arsip 01', 'Rak 01', 'No. 03', 'Kerukunan', '2022', 'Disetujui', 'Nur Aini Safitri', 'SK_Kebinekaan.pdf', '2022-04-18 09:20:00'),
('Pelatihan Pembina Warga Bela Negara', 70000000, 'Komunitas Veteran Muda Indonesia', '1', 'Lemari Arsip 01', 'Rak 02', 'No. 03', 'Pendidikan', '2022', 'Disetujui', 'Dedi Kurniawan', 'LPJ_Pembina_WBN.pdf', '2022-08-30 10:00:00'),
('Program Bela Negara Nasional 2019', 130000000, 'Komunitas Bela Negara Garuda Muda', '1', 'Lemari Arsip 01', 'Rak 05', 'No. 03', 'Pendidikan', '2019', 'Disetujui', 'Budi Santoso', 'BA_Audit_WBN_2019.pdf', '2019-05-10 09:00:00'),
('Kajian Keamanan Nasional 2018', 65000000, 'Lembaga Kajian Kebijakan Publik', '1', 'Lemari Arsip 01', 'Rak 05', 'No. 04', 'Kawasan', '2018', 'Disetujui', 'Agus Prasetyo', 'SK_Kajian_Wasbang_2018.pdf', '2018-04-19 09:20:00'),

-- ── Bidang 2: Politik Dalam Negeri & Ormas ──
('Sosialisasi Pendidikan Politik Pemilu Damai 2026', 110000000, 'Forum Warga Peduli Pemilu', '2', 'Lemari Arsip 02', 'Rak 01', 'No. 01', 'Politik', '2026', 'Proses Verifikasi', 'Maya Puspita', 'NPHD_Politik_Pemilu.pdf', '2026-01-25 09:00:00'),
('Pendataan & Verifikasi Ormas Sosial Politik', 95000000, 'Sekretariat Bersama Ormas Kota', '2', 'Lemari Arsip 02', 'Rak 01', 'No. 02', 'Politik', '2026', 'Diajukan', 'Rizky Ramadhan', 'Proposal_Verifikasi_Ormas.pdf', '2026-02-08 10:30:00'),
('Workshop Manajemen Keorganisasian Ormas Baru', 65000000, 'Paguyuban Ormas Bersatu', '2', 'Lemari Arsip 02', 'Rak 02', 'No. 01', 'Politik', '2025', 'Disetujui', 'Tuti Alawiyah', 'SK_Workshop_Ormas.pdf', '2025-02-17 13:00:00'),
('Diskusi Publik Dinamika Politik Lokal', 55000000, 'Komunitas Kajian Politik Rakyat', '2', 'Lemari Arsip 02', 'Rak 02', 'No. 02', 'Politik', '2025', 'Disetujui', 'Gunawan Saputra', 'BA_Dinamika_Politik.pdf', '2025-04-09 14:30:00'),
('Sosialisasi Etika Bermedia Sosial Menjelang Pemilu', 48000000, 'Masyarakat Media Sipil Peduli', '2', 'Lemari Arsip 02', 'Rak 03', 'No. 01', 'Politik', '2024', 'Disetujui', 'Lilis Suryani', 'NPHD_Etika_Medsos.pdf', '2024-01-30 08:30:00'),
('Pelatihan Kaderisasi Ormas Keagamaan', 72000000, 'Majelis Taklim Assalam', '2', 'Lemari Arsip 02', 'Rak 03', 'No. 02', 'Pendidikan', '2024', 'Disetujui', 'Slamet Riyadi', 'LPJ_Kaderisasi_Ormas.pdf', '2024-06-12 09:45:00'),
('FGD Rencana Kerja Pemerintah & Partisipasi Warga', 52000000, 'Forum Aspirasi Warga Nusantara', '2', 'Lemari Arsip 02', 'Rak 04', 'No. 01', 'Politik', '2023', 'Disetujui', 'Yuni Astuti', 'Proposal_FGD_Renja.pdf', '2023-05-22 10:15:00'),
('Sosialisasi Kontrak Sosial & Demokrasi Lokal', 60000000, 'Lembaga Kajian Demokrasi Partisipatif', '2', 'Lemari Arsip 02', 'Rak 04', 'No. 02', 'Politik', '2023', 'Disetujui', 'Eko Purnomo', 'SK_Demokrasi_Lokal.pdf', '2023-09-05 11:20:00'),
('Rakor Penguatan Kapasitas Ormas Sosial Politik', 80000000, 'Sekretariat Bersama Ormas Kota', '2', 'Lemari Arsip 02', 'Rak 01', 'No. 03', 'Politik', '2022', 'Disetujui', 'Ratna Sari', 'BA_Rakor_Ormas.pdf', '2022-03-14 09:10:00'),
('Sosialisasi UU Ormas & Administrasi Kesbangpol', 47000000, 'Paguyuban Ormas Sejahtera', '2', 'Lemari Arsip 02', 'Rak 02', 'No. 03', 'Politik', '2022', 'Disetujui', 'Andi Saputra', 'LPJ_UU_Ormas.pdf', '2022-07-27 13:40:00'),
('Pemutakhiran Data Politik & Ormas', 38000000, 'Forum Aspirasi Warga Nusantara', '2', 'Lemari Arsip 02', 'Rak 03', 'No. 03', 'Politik', '2021', 'Disetujui', 'Mega Utami', 'NPHD_Data_Politik.pdf', '2021-04-06 10:25:00'),
('Konsolidasi Ormas Pemuda Pasca Pemilu', 53000000, 'Solidaritas Pemuda Demokrat', '2', 'Lemari Arsip 02', 'Rak 04', 'No. 03', 'Pemuda', '2020', 'Disetujui', 'Hendra Gunawan', 'SK_Konsolidasi_Pemuda.pdf', '2020-06-15 09:50:00'),
('Rekapitulasi Pengawasan Pemilu 2019', 150000000, 'Forum Warga Peduli Pemilu', '2', 'Lemari Arsip 02', 'Rak 05', 'No. 01', 'Politik', '2019', 'Disetujui', 'Maya Puspita', 'BA_Rekap_Pemilu_2019.pdf', '2019-05-14 10:10:00'),
('Sosialisasi Pendidikan Politik Warga 2018', 70000000, 'Lembaga Kajian Demokrasi Partisipatif', '2', 'Lemari Arsip 02', 'Rak 05', 'No. 02', 'Politik', '2018', 'Disetujui', 'Eko Purnomo', 'LPJ_Politik_2018.pdf', '2018-09-03 09:25:00'),

-- ── Bidang 3: Ketahanan Ekonomi, Sosial Budaya & Agama ──
('Festival Seni Budaya Nusantara 2026', 200000000, 'Paguyuban Seni Krida Budaya', '3', 'Lemari Arsip 03', 'Rak 01', 'No. 01', 'Seni Budaya', '2026', 'Proses Verifikasi', 'Wawan Setiawan', 'NPHD_Festival_Seni.pdf', '2026-01-30 08:00:00'),
('Kajian Moderasi Beragama Antarlintas', 90000000, 'Forum Kerukunan Umat Beragama (FKUB)', '3', 'Lemari Arsip 03', 'Rak 01', 'No. 02', 'Kerukunan', '2026', 'Diajukan', 'Ika Damayanti', 'Proposal_Moderasi_Beragama.pdf', '2026-02-14 10:00:00'),
('Lomba Tabarruq & Kegiatan Ramadhan', 55000000, 'Majelis Taklim Baiturrahman', '3', 'Lemari Arsip 03', 'Rak 02', 'No. 01', 'Kerukunan', '2026', 'Diajukan', 'Fajar Nugroho', 'SK_Tabarruq.pdf', '2026-02-25 13:30:00'),
('Workshop Pemberdayaan Ekonomi Kreatif Pemuda', 130000000, 'Komunitas Kreator Muda Kota', '3', 'Lemari Arsip 03', 'Rak 02', 'No. 02', 'Pemuda', '2025', 'Disetujui', 'Yulia Kartika', 'LPJ_Ekonomi_Kreatif.pdf', '2025-03-03 09:30:00'),
('Pentas Seni Tradisi Masyarakat Lokal', 85000000, 'Sanggar Tari Manggar Segar', '3', 'Lemari Arsip 03', 'Rak 03', 'No. 01', 'Seni Budaya', '2025', 'Disetujui', 'Doni Firmansyah', 'BA_Pentas_Seni.pdf', '2025-05-28 14:10:00'),
('Buka Bersama & Santunan Anak Yatim', 45000000, 'Yayasan Sosial Anak Bangsa', '3', 'Lemari Arsip 03', 'Rak 03', 'No. 02', 'Kerukunan', '2025', 'Disetujui', 'Sari Wulandari', 'SK_Santunan_Yatim.pdf', '2025-03-17 08:50:00'),
('Pelatihan UMKM Warga Perkotaan', 175000000, 'Koperasi Warga Sejahtera Bersama', '3', 'Lemari Arsip 03', 'Rak 04', 'No. 01', 'Pendidikan', '2024', 'Disetujui', 'Taufik Hidayat', 'NPHD_UMKM.pdf', '2024-03-21 10:40:00'),
('Festival Kuliner Nusantara & Gotong Royong', 95000000, 'Paguyuban Pedagang Pasar Rakyat', '3', 'Lemari Arsip 03', 'Rak 04', 'No. 02', 'Seni Budaya', '2024', 'Disetujui', 'Nita Kurniasih', 'LPJ_Kuliner.pdf', '2024-08-09 09:20:00'),
('Turnamen Olahraga Antar Kampung', 110000000, 'Komite Olahraga Masyarakat Prima', '3', 'Lemari Arsip 03', 'Rak 05', 'No. 01', 'Pemuda', '2024', 'Ditolak', 'Bayu Anggara', 'Proposal_FORRA.pdf', '2024-05-04 13:00:00'),
('Pelatihan Paduan Suara Gereja & Orkestra', 65000000, 'Persatuan Pemuda Kristen Kasih', '3', 'Lemari Arsip 03', 'Rak 05', 'No. 02', 'Seni Budaya', '2023', 'Disetujui', 'Ririn Ekawati', 'BA_Paduan_Suara.pdf', '2023-04-12 10:30:00'),
('Seminar Ekonomi Umat & Kemandirian', 78000000, 'Yayasan Pendidikan Al-Hikmah', '3', 'Lemari Arsip 03', 'Rak 01', 'No. 03', 'Pendidikan', '2023', 'Disetujui', 'Anton Wibowo', 'SK_Ekonomi_Umat.pdf', '2023-06-08 09:15:00'),
('Gelar Karya UKM & Produk Unggulan Daerah', 140000000, 'Komunitas Tani Muda Lestari', '3', 'Lemari Arsip 03', 'Rak 02', 'No. 03', 'Pemuda', '2022', 'Disetujui', 'Lina Herlina', 'LPJ_Gelar_Karya.pdf', '2022-09-16 08:35:00'),
('Santunan Dhuafa & Jumat Berkah', 30000000, 'Majelis Taklim Assalam', '3', 'Lemari Arsip 03', 'Rak 03', 'No. 03', 'Kerukunan', '2021', 'Disetujui', 'Yusuf Maulana', 'NPHD_Santunan.pdf', '2021-05-07 10:00:00'),
('Festival Budaya Nusantara 2019', 160000000, 'Paguyuban Seni Krida Budaya', '3', 'Lemari Arsip 03', 'Rak 05', 'No. 03', 'Seni Budaya', '2019', 'Disetujui', 'Wawan Setiawan', 'BA_Festival_Budaya_2019.pdf', '2019-07-22 10:15:00'),
('Pentas Seni Tradisi 2018', 80000000, 'Sanggar Tari Manggar Segar', '3', 'Lemari Arsip 03', 'Rak 05', 'No. 04', 'Seni Budaya', '2018', 'Disetujui', 'Doni Firmansyah', 'SK_Pentas_Seni_2018.pdf', '2018-05-16 09:30:00'),

-- ── Bidang 4: Kewaspadaan Nasional & Konflik Sosial ──
('Pelatihan Linmas Angkatan III', 125000000, 'Masyarakat Peduli Keamanan Lingkungan (MKL)', '4', 'Lemari Arsip 04', 'Rak 01', 'No. 01', 'Kawasan', '2026', 'Proses Verifikasi', 'Dina Marlina', 'NPHD_Linmas_III.pdf', '2026-02-01 09:00:00'),
('Sosialisasi Antisipasi Konflik Sosial Pilkada', 88000000, 'Forum Warga Rukun Kota', '4', 'Lemari Arsip 04', 'Rak 01', 'No. 02', 'Kawasan', '2026', 'Diajukan', 'Rudi Hartono', 'Proposal_Konflik_Pilkada.pdf', '2026-02-18 10:40:00'),
('Pendataan Wilayah Rawan Konflik Sosial', 62000000, 'Komunitas Pemantau Sosial', '4', 'Lemari Arsip 04', 'Rak 02', 'No. 01', 'Kawasan', '2025', 'Disetujui', 'Wina Oktaviani', 'SK_Rawan_Konflik.pdf', '2025-03-25 11:00:00'),
('Sosialisasi Radikalisme Berbasis Media Online', 57000000, 'Komunitas Literasi Digital Warga', '4', 'Lemari Arsip 04', 'Rak 02', 'No. 02', 'Kawasan', '2025', 'Disetujui', 'Rahmat Hidayat', 'LPJ_Literasi_Digital.pdf', '2025-06-10 13:20:00'),
('Baku Pimpinan & Penyegaran Linmas', 74000000, 'Perkumpulan Linmas Sejahtera', '4', 'Lemari Arsip 04', 'Rak 03', 'No. 01', 'Kawasan', '2024', 'Disetujui', 'Darmawan Setia', 'BA_Baku_Pimpinan.pdf', '2024-02-27 08:45:00'),
('Sosialisasi UU ITE & Etika Digital Remaja', 43000000, 'Karang Taruna Tunas Muda', '4', 'Lemari Arsip 04', 'Rak 03', 'No. 02', 'Kawasan', '2024', 'Disetujui', 'Putri Ayu Lestari', 'NPHD_UU_ITE.pdf', '2024-07-16 09:30:00'),
('Monev Potensi Kerawanan Sosial Pasca Bencana', 83000000, 'Relawan Kemanusiaan Peduli', '4', 'Lemari Arsip 04', 'Rak 04', 'No. 01', 'Kawasan', '2023', 'Disetujui', 'Endah Pratiwi', 'SK_Monev_Kerawanan.pdf', '2023-05-19 10:50:00'),
('Sosialisasi Pencegahan Terrorisme Berbasis Komunitas', 96000000, 'Komite Pencegahan Ekstremisme Warga', '4', 'Lemari Arsip 04', 'Rak 04', 'No. 02', 'Kawasan', '2023', 'Disetujui', 'Novi Rahayu', 'LPJ_Pencegahan_Terror.pdf', '2023-08-23 09:05:00'),
('Pelatihan Manajemen Konflik Tokoh Masyarakat', 70000000, 'Dewan Tokoh Masyarakat Sepakat', '4', 'Lemari Arsip 04', 'Rak 05', 'No. 01', 'Kawasan', '2022', 'Disetujui', 'Hariyanto Putra', 'Proposal_Manajemen_Konflik.pdf', '2022-04-29 13:25:00'),
('Sosialisasi Kamtibmas & Linmas Siaga', 51000000, 'Masyarakat Peduli Keamanan Lingkungan (MKL)', '4', 'Lemari Arsip 04', 'Rak 05', 'No. 02', 'Kawasan', '2022', 'Disetujui', 'Novi Rahayu', 'BA_Kamtibmas.pdf', '2022-10-11 08:15:00'),
('Penguatan Wasbang Wilayah Perbatasan', 66000000, 'Komunitas Bela Negara Garuda Muda', '4', 'Lemari Arsip 04', 'Rak 01', 'No. 03', 'Kawasan', '2021', 'Disetujui', 'Wahyu Prabowo', 'NPHD_Wasbang.pdf', '2021-03-23 10:35:00'),
('Simulasi Tanggap Krisis Sosial', 59000000, 'Relawan Kemanusiaan Peduli', '4', 'Lemari Arsip 04', 'Rak 02', 'No. 03', 'Kawasan', '2020', 'Disetujui', 'Sri Handayani', 'SK_Simulasi_Krisis.pdf', '2020-07-08 09:55:00'),
('Pelatihan Linmas Angkatan II 2018', 105000000, 'Masyarakat Peduli Keamanan Lingkungan (MKL)', '4', 'Lemari Arsip 04', 'Rak 05', 'No. 03', 'Kawasan', '2018', 'Disetujui', 'Darmawan Setia', 'LPJ_Linmas_2018.pdf', '2018-04-24 09:15:00');

-- ============================================================================
-- 2. DATA DUMMY: arsip (Arsip Digital) — 64 baris
--    Jenis dokumen: NPHD / Berita Acara / SK Hibah / LPJ Terverifikasi / Proposal & RAB
--    Ada dokumen lama (2016-2019) untuk menguji badge retensi & status Inaktif/Permanen
-- ============================================================================
INSERT INTO `arsip`
  (`jenis_dokumen_arsip`, `judul_berkas_dokumen`, `nominal_anggaran`, `lemari_arsip`, `posisi_rak`, `nomor_berkas_urut`, `instansi_penerima`, `bidang_pengampu`, `tahun_anggaran`, `scan_foto`, `created_at`)
VALUES
-- ── Bidang 1 ──
('NPHD', 'NPHD Hibah Pelatihan Kader Bela Negara Angkatan V', 120000000, 'Lemari Arsip 01', 'Rak 01', 'No. 01', 'Komunitas Bela Negara Garuda Muda', '1', '2026', 'NPHD_BelaNegara_2026.pdf', '2026-01-12 09:35:00'),
('SK Hibah', 'SK Hibah Sosialisasi Pancasila di Lingkungan Sekolah', 75000000, 'Lemari Arsip 01', 'Rak 01', 'No. 02', 'Yayasan Pendidikan Cendekia Bangsa', '1', '2026', 'SK_Pancasila_Sekolah.pdf', '2026-02-05 10:00:00'),
('Proposal & RAB', 'Proposal & RAB Festival Kesatuan Bangsa & Bahasa Daerah', 150000000, 'Lemari Arsip 01', 'Rak 02', 'No. 01', 'Sanggar Budaya Nusantara', '1', '2026', 'Proposal_FKSB_2026.pdf', '2026-02-21 09:10:00'),
('Berita Acara', 'Berita Acara Serah Terima Klinik Kewarganegaraan Generasi Muda', 60000000, 'Lemari Arsip 01', 'Rak 02', 'No. 02', 'Komunitas Studi Kebangsaan Insan', '1', '2025', 'BA_KKW_2025.pdf', '2025-03-15 10:20:00'),
('LPJ Terverifikasi', 'LPJ Terverifikasi Seminar Ideologi & Pencegahan Radikalisme', 85000000, 'Lemari Arsip 01', 'Rak 03', 'No. 01', 'Yayasan Nurul Iman', '1', '2025', 'LPJ_Seminar_Ideologi.pdf', '2025-06-30 11:00:00'),
('NPHD', 'NPHD Hibah Lomba Cipta Poster Pancasila Tingkat Pelajar', 35000000, 'Lemari Arsip 01', 'Rak 03', 'No. 02', 'Karang Taruna Merdeka Jaya', '1', '2025', 'NPHD_Poster_Pancasila.pdf', '2025-07-22 08:40:00'),
('SK Hibah', 'SK Hibah Bimbingan Wawasan Kebangsaan Pemuda Peduli', 50000000, 'Lemari Arsip 01', 'Rak 04', 'No. 01', 'Forum Komunikasi Pemuda Kabupaten', '1', '2024', 'SK_Wawasan_Kebangsaan.pdf', '2024-03-02 09:30:00'),
('LPJ Terverifikasi', 'LPJ Terverifikasi Pelatihan Bela Negara Dasar (Persiapan Linmas)', 95000000, 'Lemari Arsip 01', 'Rak 04', 'No. 02', 'Masyarakat Peduli Keamanan Lingkungan (MKL)', '1', '2024', 'LPJ_BelaNegara_Dasar.pdf', '2024-06-14 10:15:00'),
('Berita Acara', 'Berita Acara Verifikasi Diskusi Publik Konstitusi & Kebangsaan', 40000000, 'Lemari Arsip 01', 'Rak 05', 'No. 01', 'Ormas Kemahasiswaan Bina Ilmu', '1', '2023', 'BA_Diskusi_Konstitusi.pdf', '2023-03-20 13:00:00'),
('Proposal & RAB', 'Proposal & RAB Upacara Hari Sumpah Pemuda', 25000000, 'Lemari Arsip 01', 'Rak 05', 'No. 02', 'Paguyuban Pemuda Sepakat', '1', '2023', 'Proposal_SumpahPemuda.pdf', '2023-10-05 08:50:00'),
('SK Hibah', 'SK Hibah Kajian Kebinekaan & Toleransi Warga', 45000000, 'Lemari Arsip 01', 'Rak 01', 'No. 03', 'Forum Warga Kota Harmoni', '1', '2022', 'SK_Kebinekaan.pdf', '2022-05-02 10:05:00'),
('LPJ Terverifikasi', 'LPJ Terverifikasi Pelatihan Pembina Warga Bela Negara', 70000000, 'Lemari Arsip 01', 'Rak 02', 'No. 03', 'Komunitas Veteran Muda Indonesia', '1', '2022', 'LPJ_Pembina_WBN.pdf', '2022-09-12 09:45:00'),
('Berita Acara', 'Berita Acara Audit Program Bela Negara Nasional 2019', 130000000, 'Lemari Arsip 01', 'Rak 05', 'No. 03', 'Komunitas Bela Negara Garuda Muda', '1', '2019', 'BA_Audit_WBN_2019.pdf', '2019-06-11 10:00:00'),
('SK Hibah', 'SK Hibah Kajian Keamanan Nasional 2018', 65000000, 'Lemari Arsip 01', 'Rak 05', 'No. 04', 'Lembaga Kajian Kebijakan Publik', '1', '2018', 'SK_Kajian_Wasbang_2018.pdf', '2018-05-19 09:20:00'),
('LPJ Terverifikasi', 'LPJ Terverifikasi Festival Kesatuan Bangsa 2017', 90000000, 'Lemari Arsip 01', 'Rak 05', 'No. 05', 'Sanggar Budaya Nusantara', '1', '2017', 'LPJ_FKB_2017.pdf', '2017-08-25 13:30:00'),
('Berita Acara', 'Berita Acara Serah Terima Bantuan Bela Negara 2016', 55000000, 'Lemari Arsip 01', 'Rak 05', 'No. 06', 'Komunitas Veteran Muda Indonesia', '1', '2016', 'BA_BelaNegara_2016.pdf', '2016-09-14 08:45:00'),

-- ── Bidang 2 ──
('NPHD', 'NPHD Hibah Sosialisasi Pendidikan Politik Pemilu Damai', 110000000, 'Lemari Arsip 02', 'Rak 01', 'No. 01', 'Forum Warga Peduli Pemilu', '2', '2026', 'NPHD_Politik_Pemilu.pdf', '2026-01-26 09:05:00'),
('Proposal & RAB', 'Proposal & RAB Pendataan & Verifikasi Ormas Sosial Politik', 95000000, 'Lemari Arsip 02', 'Rak 01', 'No. 02', 'Sekretariat Bersama Ormas Kota', '2', '2026', 'Proposal_Verifikasi_Ormas.pdf', '2026-02-10 10:35:00'),
('SK Hibah', 'SK Hibah Workshop Manajemen Keorganisasian Ormas Baru', 65000000, 'Lemari Arsip 02', 'Rak 02', 'No. 01', 'Paguyuban Ormas Bersatu', '2', '2025', 'SK_Workshop_Ormas.pdf', '2025-02-20 13:05:00'),
('Berita Acara', 'Berita Acara Monitoring Diskusi Publik Dinamika Politik Lokal', 55000000, 'Lemari Arsip 02', 'Rak 02', 'No. 02', 'Komunitas Kajian Politik Rakyat', '2', '2025', 'BA_Dinamika_Politik.pdf', '2025-04-15 14:35:00'),
('NPHD', 'NPHD Hibah Sosialisasi Etika Bermedia Sosial Menjelang Pemilu', 48000000, 'Lemari Arsip 02', 'Rak 03', 'No. 01', 'Masyarakat Media Sipil Peduli', '2', '2024', 'NPHD_Etika_Medsos.pdf', '2024-02-01 08:35:00'),
('LPJ Terverifikasi', 'LPJ Terverifikasi Pelatihan Kaderisasi Ormas Keagamaan', 72000000, 'Lemari Arsip 02', 'Rak 03', 'No. 02', 'Majelis Taklim Assalam', '2', '2024', 'LPJ_Kaderisasi_Ormas.pdf', '2024-07-02 09:50:00'),
('Proposal & RAB', 'Proposal & RAB FGD Rencana Kerja Pemerintah & Partisipasi Warga', 52000000, 'Lemari Arsip 02', 'Rak 04', 'No. 01', 'Forum Aspirasi Warga Nusantara', '2', '2023', 'Proposal_FGD_Renja.pdf', '2023-05-25 10:20:00'),
('SK Hibah', 'SK Hibah Sosialisasi Kontrak Sosial & Demokrasi Lokal', 60000000, 'Lemari Arsip 02', 'Rak 04', 'No. 02', 'Lembaga Kajian Demokrasi Partisipatif', '2', '2023', 'SK_Demokrasi_Lokal.pdf', '2023-09-08 11:25:00'),
('Berita Acara', 'Berita Acara Rakor Penguatan Kapasitas Ormas Sosial Politik', 80000000, 'Lemari Arsip 02', 'Rak 01', 'No. 03', 'Sekretariat Bersama Ormas Kota', '2', '2022', 'BA_Rakor_Ormas.pdf', '2022-03-16 09:15:00'),
('LPJ Terverifikasi', 'LPJ Terverifikasi Sosialisasi UU Ormas & Administrasi Kesbangpol', 47000000, 'Lemari Arsip 02', 'Rak 02', 'No. 03', 'Paguyuban Ormas Sejahtera', '2', '2022', 'LPJ_UU_Ormas.pdf', '2022-08-01 13:45:00'),
('NPHD', 'NPHD Hibah Pemutakhiran Data Politik & Ormas', 38000000, 'Lemari Arsip 02', 'Rak 03', 'No. 03', 'Forum Aspirasi Warga Nusantara', '2', '2021', 'NPHD_Data_Politik.pdf', '2021-04-08 10:30:00'),
('SK Hibah', 'SK Hibah Konsolidasi Ormas Pemuda Pasca Pemilu', 53000000, 'Lemari Arsip 02', 'Rak 04', 'No. 03', 'Solidaritas Pemuda Demokrat', '2', '2020', 'SK_Konsolidasi_Pemuda.pdf', '2020-06-18 09:55:00'),
('Berita Acara', 'Berita Acara Rekapitulasi Pengawasan Pemilu 2019', 150000000, 'Lemari Arsip 02', 'Rak 05', 'No. 01', 'Forum Warga Peduli Pemilu', '2', '2019', 'BA_Rekap_Pemilu_2019.pdf', '2019-05-14 10:10:00'),
('LPJ Terverifikasi', 'LPJ Terverifikasi Sosialisasi Pendidikan Politik Warga 2018', 70000000, 'Lemari Arsip 02', 'Rak 05', 'No. 02', 'Lembaga Kajian Demokrasi Partisipatif', '2', '2018', 'LPJ_Politik_2018.pdf', '2018-09-03 09:25:00'),
('NPHD', 'NPHD Hibah Pendidikan Politik Desa 2017', 62000000, 'Lemari Arsip 02', 'Rak 05', 'No. 03', 'Forum Aspirasi Warga Nusantara', '2', '2017', 'NPHD_Politik_Desa_2017.pdf', '2017-04-21 10:40:00'),
('SK Hibah', 'SK Hibah Pendataan Ormas 2016', 45000000, 'Lemari Arsip 02', 'Rak 05', 'No. 04', 'Sekretariat Bersama Ormas Kota', '2', '2016', 'SK_Data_Ormas_2016.pdf', '2016-03-17 09:05:00'),

-- ── Bidang 3 ──
('NPHD', 'NPHD Hibah Festival Seni Budaya Nusantara 2026', 200000000, 'Lemari Arsip 03', 'Rak 01', 'No. 01', 'Paguyuban Seni Krida Budaya', '3', '2026', 'NPHD_Festival_Seni.pdf', '2026-01-31 08:05:00'),
('Proposal & RAB', 'Proposal & RAB Kajian Moderasi Beragama Antarlintas', 90000000, 'Lemari Arsip 03', 'Rak 01', 'No. 02', 'Forum Kerukunan Umat Beragama (FKUB)', '3', '2026', 'Proposal_Moderasi_Beragama.pdf', '2026-02-15 10:05:00'),
('SK Hibah', 'SK Hibah Lomba Tabarruq & Kegiatan Ramadhan', 55000000, 'Lemari Arsip 03', 'Rak 02', 'No. 01', 'Majelis Taklim Baiturrahman', '3', '2026', 'SK_Tabarruq.pdf', '2026-02-27 13:35:00'),
('LPJ Terverifikasi', 'LPJ Terverifikasi Workshop Pemberdayaan Ekonomi Kreatif Pemuda', 130000000, 'Lemari Arsip 03', 'Rak 02', 'No. 02', 'Komunitas Kreator Muda Kota', '3', '2025', 'LPJ_Ekonomi_Kreatif.pdf', '2025-04-10 09:35:00'),
('Berita Acara', 'Berita Acara Pentas Seni Tradisi Masyarakat Lokal', 85000000, 'Lemari Arsip 03', 'Rak 03', 'No. 01', 'Sanggar Tari Manggar Segar', '3', '2025', 'BA_Pentas_Seni.pdf', '2025-06-02 14:15:00'),
('SK Hibah', 'SK Hibah Buka Bersama & Santunan Anak Yatim', 45000000, 'Lemari Arsip 03', 'Rak 03', 'No. 02', 'Yayasan Sosial Anak Bangsa', '3', '2025', 'SK_Santunan_Yatim.pdf', '2025-03-19 08:55:00'),
('NPHD', 'NPHD Hibah Pelatihan UMKM Warga Perkotaan', 175000000, 'Lemari Arsip 03', 'Rak 04', 'No. 01', 'Koperasi Warga Sejahtera Bersama', '3', '2024', 'NPHD_UMKM.pdf', '2024-03-25 10:45:00'),
('LPJ Terverifikasi', 'LPJ Terverifikasi Festival Kuliner Nusantara & Gotong Royong', 95000000, 'Lemari Arsip 03', 'Rak 04', 'No. 02', 'Paguyuban Pedagang Pasar Rakyat', '3', '2024', 'LPJ_Kuliner.pdf', '2024-08-14 09:25:00'),
('Proposal & RAB', 'Proposal & RAB Turnamen Olahraga Antar Kampung', 110000000, 'Lemari Arsip 03', 'Rak 05', 'No. 01', 'Komite Olahraga Masyarakat Prima', '3', '2024', 'Proposal_FORRA.pdf', '2024-05-06 13:05:00'),
('Berita Acara', 'Berita Acara Pelatihan Paduan Suara Gereja & Orkestra', 65000000, 'Lemari Arsip 03', 'Rak 05', 'No. 02', 'Persatuan Pemuda Kristen Kasih', '3', '2023', 'BA_Paduan_Suara.pdf', '2023-04-14 10:35:00'),
('SK Hibah', 'SK Hibah Seminar Ekonomi Umat & Kemandirian', 78000000, 'Lemari Arsip 03', 'Rak 01', 'No. 03', 'Yayasan Pendidikan Al-Hikmah', '3', '2023', 'SK_Ekonomi_Umat.pdf', '2023-06-11 09:20:00'),
('LPJ Terverifikasi', 'LPJ Terverifikasi Gelar Karya UKM & Produk Unggulan Daerah', 140000000, 'Lemari Arsip 03', 'Rak 02', 'No. 03', 'Komunitas Tani Muda Lestari', '3', '2022', 'LPJ_Gelar_Karya.pdf', '2022-09-20 08:40:00'),
('NPHD', 'NPHD Hibah Santunan Dhuafa & Jumat Berkah', 30000000, 'Lemari Arsip 03', 'Rak 03', 'No. 03', 'Majelis Taklim Assalam', '3', '2021', 'NPHD_Santunan.pdf', '2021-05-10 10:05:00'),
('Berita Acara', 'Berita Acara Rekap Festival Budaya Nusantara 2019', 160000000, 'Lemari Arsip 03', 'Rak 05', 'No. 03', 'Paguyuban Seni Krida Budaya', '3', '2019', 'BA_Festival_Budaya_2019.pdf', '2019-07-22 10:15:00'),
('SK Hibah', 'SK Hibah Pentas Seni Tradisi 2018', 80000000, 'Lemari Arsip 03', 'Rak 05', 'No. 04', 'Sanggar Tari Manggar Segar', '3', '2018', 'SK_Pentas_Seni_2018.pdf', '2018-05-16 09:30:00'),
('LPJ Terverifikasi', 'LPJ Terverifikasi Seminar Ekonomi Kreatif 2017', 72000000, 'Lemari Arsip 03', 'Rak 05', 'No. 05', 'Komunitas Kreator Muda Kota', '3', '2017', 'LPJ_Ekraf_2017.pdf', '2017-06-28 11:10:00'),
('Berita Acara', 'Berita Acara Serah Terima Bantuan Sosial 2016', 55000000, 'Lemari Arsip 03', 'Rak 05', 'No. 06', 'Yayasan Sosial Anak Bangsa', '3', '2016', 'BA_Bansos_2016.pdf', '2016-09-14 08:45:00'),

-- ── Bidang 4 ──
('NPHD', 'NPHD Hibah Pelatihan Linmas Angkatan III', 125000000, 'Lemari Arsip 04', 'Rak 01', 'No. 01', 'Masyarakat Peduli Keamanan Lingkungan (MKL)', '4', '2026', 'NPHD_Linmas_III.pdf', '2026-02-02 09:05:00'),
('Proposal & RAB', 'Proposal & RAB Sosialisasi Antisipasi Konflik Sosial Pilkada', 88000000, 'Lemari Arsip 04', 'Rak 01', 'No. 02', 'Forum Warga Rukun Kota', '4', '2026', 'Proposal_Konflik_Pilkada.pdf', '2026-02-19 10:45:00'),
('SK Hibah', 'SK Hibah Pendataan Wilayah Rawan Konflik Sosial', 62000000, 'Lemari Arsip 04', 'Rak 02', 'No. 01', 'Komunitas Pemantau Sosial', '4', '2025', 'SK_Rawan_Konflik.pdf', '2025-03-28 11:05:00'),
('LPJ Terverifikasi', 'LPJ Terverifikasi Sosialisasi Radikalisme Berbasis Media Online', 57000000, 'Lemari Arsip 04', 'Rak 02', 'No. 02', 'Komunitas Literasi Digital Warga', '4', '2025', 'LPJ_Literasi_Digital.pdf', '2025-07-01 13:25:00'),
('Berita Acara', 'Berita Acara Baku Pimpinan & Penyegaran Linmas', 74000000, 'Lemari Arsip 04', 'Rak 03', 'No. 01', 'Perkumpulan Linmas Sejahtera', '4', '2024', 'BA_Baku_Pimpinan.pdf', '2024-03-01 08:50:00'),
('NPHD', 'NPHD Hibah Sosialisasi UU ITE & Etika Digital Remaja', 43000000, 'Lemari Arsip 04', 'Rak 03', 'No. 02', 'Karang Taruna Tunas Muda', '4', '2024', 'NPHD_UU_ITE.pdf', '2024-07-18 09:35:00'),
('SK Hibah', 'SK Hibah Monev Potensi Kerawanan Sosial Pasca Bencana', 83000000, 'Lemari Arsip 04', 'Rak 04', 'No. 01', 'Relawan Kemanusiaan Peduli', '4', '2023', 'SK_Monev_Kerawanan.pdf', '2023-05-23 10:55:00'),
('LPJ Terverifikasi', 'LPJ Terverifikasi Sosialisasi Pencegahan Terrorisme Berbasis Komunitas', 96000000, 'Lemari Arsip 04', 'Rak 04', 'No. 02', 'Komite Pencegahan Ekstremisme Warga', '4', '2023', 'LPJ_Pencegahan_Terror.pdf', '2023-08-27 09:10:00'),
('Proposal & RAB', 'Proposal & RAB Pelatihan Manajemen Konflik Tokoh Masyarakat', 70000000, 'Lemari Arsip 04', 'Rak 05', 'No. 01', 'Dewan Tokoh Masyarakat Sepakat', '4', '2022', 'Proposal_Manajemen_Konflik.pdf', '2022-05-02 13:30:00'),
('Berita Acara', 'Berita Acara Sosialisasi Kamtibmas & Linmas Siaga', 51000000, 'Lemari Arsip 04', 'Rak 05', 'No. 02', 'Masyarakat Peduli Keamanan Lingkungan (MKL)', '4', '2022', 'BA_Kamtibmas.pdf', '2022-10-14 08:20:00'),
('NPHD', 'NPHD Hibah Penguatan Wasbang Wilayah Perbatasan', 66000000, 'Lemari Arsip 04', 'Rak 01', 'No. 03', 'Komunitas Bela Negara Garuda Muda', '4', '2021', 'NPHD_Wasbang.pdf', '2021-03-25 10:40:00'),
('SK Hibah', 'SK Hibah Simulasi Tanggap Krisis Sosial', 59000000, 'Lemari Arsip 04', 'Rak 02', 'No. 03', 'Relawan Kemanusiaan Peduli', '4', '2020', 'SK_Simulasi_Krisis.pdf', '2020-07-10 10:00:00'),
('LPJ Terverifikasi', 'LPJ Terverifikasi Pelatihan Linmas Angkatan II 2018', 105000000, 'Lemari Arsip 04', 'Rak 05', 'No. 03', 'Masyarakat Peduli Keamanan Lingkungan (MKL)', '4', '2018', 'LPJ_Linmas_2018.pdf', '2018-04-24 09:15:00'),
('Berita Acara', 'Berita Acara Koordinasi Keamanan Wilayah 2017', 47000000, 'Lemari Arsip 04', 'Rak 05', 'No. 04', 'Forum Warga Rukun Kota', '4', '2017', 'BA_Koordinasi_2017.pdf', '2017-05-09 10:25:00'),
('Proposal & RAB', 'Proposal & RAB Sosialisasi Antisipasi Konflik 2016', 52000000, 'Lemari Arsip 04', 'Rak 05', 'No. 05', 'Komunitas Pemantau Sosial', '4', '2016', 'Proposal_Konflik_2016.pdf', '2016-06-20 09:35:00');

-- ============================================================================
-- 3. DATA DUMMY: mitra_kerja (Penerima Hibah / Lembaga & Ormas) — 30 baris
-- ============================================================================
INSERT INTO `mitra_kerja`
  (`Nama_lembaga_ormas`, `jenis_organisasi`, `bidang_yang_terkait`, `nama_ketua`, `nomor_contact`, `alamat_sekretariat`)
VALUES
('Paguyuban Seni Krida Budaya', 'Sanggar Seni', '3', 'Wawan Setiawan', '081234567001', 'Jl. Melati Raya No. 45, Kel. Sukamaju'),
('Forum Kerukunan Umat Beragama (FKUB)', 'Forum Masyarakat', '3', 'KH. Abdul Karim', '081234567002', 'Jl. Masjid Agung No. 1, Kel. Kauman'),
('Karang Taruna Merdeka Jaya', 'Karang Taruna', '1', 'Rina Marlina', '081234567003', 'Jl. Kenanga No. 12, Kel. Merdeka'),
('Yayasan Pendidikan Cendekia Bangsa', 'Yayasan', '1', 'Siti Rahmawati', '081234567004', 'Jl. Pendidikan No. 21, Kel. Cendekia'),
('Komunitas Bela Negara Garuda Muda', 'Komunitas Pemuda', '1', 'Budi Santoso', '081234567005', 'Jl. Veteran No. 9, Kel. Garuda'),
('Forum Komunikasi Pemuda Kabupaten', 'Komunitas Pemuda', '2', 'Joko Susilo', '081234567006', 'Jl. Pemuda No. 33, Kel. Tunas'),
('Masyarakat Peduli Keamanan Lingkungan (MKL)', 'Forum Masyarakat', '4', 'Hendra Wijaya', '081234567007', 'Jl. Pos Polisi Raya No. 5, Kel. Siaga'),
('Koperasi Warga Sejahtera Bersama', 'Koperasi', '3', 'Taufik Hidayat', '081234567008', 'Jl. Pasar Baru No. 18, Kel. Sejahtera'),
('Majelis Taklim Assalam', 'Ormas Keagamaan', '2', 'Tuti Alawiyah', '081234567009', 'Jl. Nurani No. 27, Kel. Assalam'),
('Majelis Taklim Baiturrahman', 'Ormas Keagamaan', '3', 'Fajar Nugroho', '081234567010', 'Jl. Baiturrahman No. 3, Kel. Kauman'),
('Sanggar Budaya Nusantara', 'Sanggar Seni', '1', 'Dewi Lestari', '081234567011', 'Jl. Cendrawasih No. 7, Kel. Nusantara'),
('Sanggar Tari Manggar Segar', 'Sanggar Seni', '3', 'Doni Firmansyah', '081234567012', 'Jl. Bunga Manggar No. 14, Kel. Segar'),
('Komunitas Kreator Muda Kota', 'Komunitas Pemuda', '3', 'Yulia Kartika', '081234567013', 'Jl. Kreatif No. 8, Kel. Muda'),
('Komunitas Tani Muda Lestari', 'Komunitas Pemuda', '3', 'Lina Herlina', '081234567014', 'Jl. Baru Tani No. 22, Kel. Lestari'),
('Paguyuban Pedagang Pasar Rakyat', 'Paguyuban', '3', 'Nita Kurniasih', '081234567015', 'Jl. Pasar Rakyat Blok C No. 2, Kel. Pasar'),
('Komite Olahraga Masyarakat Prima', 'Komunitas Pemuda', '3', 'Bayu Anggara', '081234567016', 'Jl. Stadion Mini No. 4, Kel. Prima'),
('Persatuan Pemuda Kristen Kasih', 'Ormas Keagamaan', '3', 'Ririn Ekawati', '081234567017', 'Jl. Betlehem No. 11, Kel. Kasih'),
('Yayasan Sosial Anak Bangsa', 'Yayasan', '3', 'Sari Wulandari', '081234567018', 'Jl. Merpati No. 16, Kel. Bangsa'),
('Yayasan Griya Asuh Anak', 'Yayasan', '3', 'Anton Wibowo', '081234567019', 'Jl. Kasih Ibu No. 6, Kel. Asuh'),
('Yayasan Pendidikan Al-Hikmah', 'Yayasan', '2', 'Ahmad Fauzi', '081234567020', 'Jl. Al-Hikmah No. 10, Kel. Hikmah'),
('Paguyuban Ormas Bersatu', 'Ormas Sosial Politik', '2', 'Gunawan Saputra', '081234567021', 'Jl. Sekretariat No. 24, Kel. Bersatu'),
('Sekretariat Bersama Ormas Kota', 'Ormas Sosial Politik', '2', 'Ratna Sari', '081234567022', 'Jl. Kesbangpol Raya No. 1, Kel. Kota'),
('Forum Aspirasi Warga Nusantara', 'Forum Masyarakat', '2', 'Yuni Astuti', '081234567023', 'Jl. Aspirasi No. 19, Kel. Warga'),
('Lembaga Kajian Demokrasi Partisipatif', 'Lembaga Swadaya Masyarakat', '2', 'Eko Purnomo', '081234567024', 'Jl. Demokrasi No. 30, Kel. Partisipatif'),
('Forum Warga Peduli Pemilu', 'Forum Masyarakat', '2', 'Maya Puspita', '081234567025', 'Jl. Pemilu Raya No. 2, Kel. Damai'),
('Komunitas Pemantau Sosial', 'Lembaga Swadaya Masyarakat', '4', 'Wina Oktaviani', '081234567026', 'Jl. Pemantau No. 13, Kel. Sosial'),
('Komunitas Literasi Digital Warga', 'Komunitas Pemuda', '4', 'Rahmat Hidayat', '081234567027', 'Jl. Digital No. 5, Kel. Warga'),
('Perkumpulan Linmas Sejahtera', 'Forum Masyarakat', '4', 'Darmawan Setia', '081234567028', 'Jl. Siaga No. 7, Kel. Sejahtera'),
('Relawan Kemanusiaan Peduli', 'Lembaga Swadaya Masyarakat', '4', 'Endah Pratiwi', '081234567029', 'Jl. Kemanusiaan No. 3, Kel. Peduli'),
('Dewan Tokoh Masyarakat Sepakat', 'Forum Masyarakat', '4', 'Hariyanto Putra', '081234567030', 'Jl. Musyawarah No. 25, Kel. Sepakat');

-- ============================================================================
-- VERIFIKASI: cek jumlah baris setelah seeding
-- ============================================================================
SELECT 'data_hibah' AS tabel, COUNT(*) AS jumlah FROM `data_hibah`
UNION ALL
SELECT 'arsip', COUNT(*) FROM `arsip`
UNION ALL
SELECT 'mitra_kerja', COUNT(*) FROM `mitra_kerja`;
