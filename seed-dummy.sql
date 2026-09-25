-- Seed data dummy baru untuk database kesbang.
-- Menghapus data pada data_hibah, arsip, dan mitra_kerja.
-- Akun pengguna tidak dihapus.
-- Hasil: 48 penerima, 120 dokumen hibah, dan 96 arsip.

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `data_hibah`;
TRUNCATE TABLE `arsip`;
TRUNCATE TABLE `mitra_kerja`;
SET FOREIGN_KEY_CHECKS = 1;

-- 48 penerima: 12 penerima untuk setiap bidang.
INSERT INTO `mitra_kerja`
  (`Nama_lembaga_ormas`, `jenis_organisasi`, `bidang_yang_terkait`, `nama_ketua`, `nomor_contact`, `alamat_sekretariat`)
WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 48
)
SELECT
  CONCAT('Penerima Baru ', LPAD(MOD(n - 1, 12) + 1, 2, '0'), ' Bidang ', MOD(n - 1, 4) + 1),
  CASE MOD(n - 1, 6)
    WHEN 0 THEN 'Komunitas Pemuda'
    WHEN 1 THEN 'Yayasan'
    WHEN 2 THEN 'Forum Masyarakat'
    WHEN 3 THEN 'Karang Taruna'
    WHEN 4 THEN 'Lembaga Non-Struktural'
    ELSE 'Ormas Keagamaan'
  END,
  CAST(MOD(n - 1, 4) + 1 AS CHAR),
  CONCAT('Ketua Baru ', LPAD(n, 2, '0')),
  CONCAT('0812', LPAD(100000 + n, 7, '0')),
  CONCAT('Jl. Kolaborasi No. ', n, ', Kota Bandung')
FROM seq;

-- 120 dokumen hibah: 30 dokumen per bidang, tahun 2023-2026.
INSERT INTO `data_hibah`
  (`jenis_dokumen_arsip`, `nominal_diajukan`, `lembaga`, `tujuan_bidang_teknis`, `lemari_arsip`, `posisi_rak`, `nomor_berkas`, `kategori_program`, `tahun_anggaran`, `status_hibah`, `nama_penanggung_jawab`, `scan_foto`, `created_at`)
WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 120
)
SELECT
  CONCAT(
    CASE MOD(n - 1, 5)
      WHEN 0 THEN 'Program Penguatan Kapasitas '
      WHEN 1 THEN 'Pelatihan Masyarakat '
      WHEN 2 THEN 'Festival Kolaborasi '
      WHEN 3 THEN 'Sosialisasi Kebangsaan '
      ELSE 'Pemberdayaan Organisasi '
    END,
    LPAD(n, 3, '0')
  ),
  25000000 + (n * 2750000),
  CONCAT('Penerima Baru ', LPAD(MOD(FLOOR((n - 1) / 4), 12) + 1, 2, '0'), ' Bidang ', MOD(n - 1, 4) + 1),
  CAST(MOD(n - 1, 4) + 1 AS CHAR),
  CONCAT('Lemari Arsip 0', MOD(n - 1, 4) + 1),
  CONCAT('Rak 0', MOD(n - 1, 5) + 1),
  CONCAT('No. ', LPAD(MOD(n - 1, 30) + 1, 2, '0')),
  CASE MOD(n - 1, 5)
    WHEN 0 THEN 'Pendidikan'
    WHEN 1 THEN 'Pemuda'
    WHEN 2 THEN 'Seni Budaya'
    WHEN 3 THEN 'Kerukunan'
    ELSE 'Kawasan'
  END,
  CAST(2023 + MOD(n - 1, 4) AS CHAR),
  CASE MOD(n - 1, 4)
    WHEN 0 THEN 'Diajukan'
    WHEN 1 THEN 'Proses Verifikasi'
    WHEN 2 THEN 'Disetujui'
    ELSE 'Ditolak'
  END,
  CONCAT('Penanggung Jawab ', LPAD(n, 3, '0')),
  CONCAT('dokumen_baru_', LPAD(n, 3, '0'), '.pdf'),
  DATE_ADD('2023-01-10 09:00:00', INTERVAL n DAY)
FROM seq;

-- 96 arsip: 24 arsip per bidang, tahun 2021-2026.
INSERT INTO `arsip`
  (`jenis_dokumen_arsip`, `judul_berkas_dokumen`, `nominal_anggaran`, `lemari_arsip`, `posisi_rak`, `nomor_berkas_urut`, `instansi_penerima`, `bidang_pengampu`, `tahun_anggaran`, `scan_foto`, `created_at`)
WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 96
)
SELECT
  CASE MOD(n - 1, 5)
    WHEN 0 THEN 'NPHD'
    WHEN 1 THEN 'Berita Acara'
    WHEN 2 THEN 'SK Hibah'
    WHEN 3 THEN 'LPJ Terverifikasi'
    ELSE 'Proposal & RAB'
  END,
  CONCAT('Arsip Dokumen Program Baru ', LPAD(n, 3, '0')),
  30000000 + (n * 3200000),
  CONCAT('Lemari Arsip 0', MOD(n - 1, 4) + 1),
  CONCAT('Rak 0', MOD(n - 1, 5) + 1),
  CONCAT('No. ', LPAD(MOD(n - 1, 24) + 1, 2, '0')),
  CONCAT('Penerima Baru ', LPAD(MOD(FLOOR((n - 1) / 4), 12) + 1, 2, '0'), ' Bidang ', MOD(n - 1, 4) + 1),
  CAST(MOD(n - 1, 4) + 1 AS CHAR),
  CAST(2021 + MOD(n - 1, 6) AS CHAR),
  CONCAT('arsip_baru_', LPAD(n, 3, '0'), '.pdf'),
  DATE_ADD('2021-02-05 10:00:00', INTERVAL n DAY)
FROM seq;

-- Verifikasi jumlah data setelah seed.
SELECT 'mitra_kerja' AS tabel, COUNT(*) AS jumlah FROM `mitra_kerja`
UNION ALL
SELECT 'data_hibah', COUNT(*) FROM `data_hibah`
UNION ALL
SELECT 'arsip', COUNT(*) FROM `arsip`;
