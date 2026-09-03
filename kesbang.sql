-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 03, 2026 at 05:40 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kesbang`
--

-- --------------------------------------------------------

--
-- Table structure for table `arsip`
--

CREATE TABLE `arsip` (
  `id` int(11) NOT NULL,
  `jenis_dokumen_arsip` varchar(255) DEFAULT NULL,
  `judul_berkas_dokumen` varchar(255) DEFAULT NULL,
  `nominal_anggaran` int(255) DEFAULT NULL,
  `lemari_arsip` varchar(255) DEFAULT NULL,
  `posisi_rak` varchar(255) DEFAULT NULL,
  `nomor_berkas_urut` varchar(255) DEFAULT NULL,
  `instansi_penerima` varchar(255) DEFAULT NULL,
  `bidang_pengampu` varchar(255) DEFAULT NULL,
  `tahun_anggaran` varchar(255) DEFAULT NULL,
  `scan_foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `arsip`
--

INSERT INTO `arsip` (`id`, `jenis_dokumen_arsip`, `judul_berkas_dokumen`, `nominal_anggaran`, `lemari_arsip`, `posisi_rak`, `nomor_berkas_urut`, `instansi_penerima`, `bidang_pengampu`, `tahun_anggaran`, `scan_foto`) VALUES
(3, 'Proposal & RAB', 'Proposal & Berkas Hibah: zaid sembriwing', 2147483647, 'Lemari Arsip 02', 'Rak 01', 'No. 02', 'pki', '2', '2026', 'RAB_dan_Desain_Kandang_Desa.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `data_hibah`
--

CREATE TABLE `data_hibah` (
  `id` int(11) NOT NULL,
  `jenis_dokume_arsip` varchar(255) DEFAULT NULL,
  `nominal_diajukan` varchar(255) DEFAULT NULL,
  `lembaga` varchar(255) DEFAULT NULL,
  `tujuan_bidang_teknis` varchar(255) DEFAULT NULL,
  `lemari_arsip` varchar(255) DEFAULT NULL,
  `posisi_rak` varchar(255) DEFAULT NULL,
  `nomor_berkas` varchar(255) DEFAULT NULL,
  `kategori_program` varchar(255) DEFAULT NULL,
  `nama_penanggung_jawab` varchar(255) DEFAULT NULL,
  `scan_foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_hibah`
--

INSERT INTO `data_hibah` (`id`, `jenis_dokume_arsip`, `nominal_diajukan`, `lembaga`, `tujuan_bidang_teknis`, `lemari_arsip`, `posisi_rak`, `nomor_berkas`, `kategori_program`, `nama_penanggung_jawab`, `scan_foto`) VALUES
(2, 'zaid sembriwing', '1234567890987654400', 'pki', '2', 'Lemari Arsip 02', 'Rak 01', 'No. 02', 'Seni Budaya', 'jaya', 'RAB_dan_Desain_Kandang_Desa.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `mitra_kerja`
--

CREATE TABLE `mitra_kerja` (
  `id` int(11) NOT NULL,
  `Nama_lembaga_ormas` varchar(255) DEFAULT NULL,
  `jenis_organisasi` varchar(255) DEFAULT NULL,
  `bidang_yang_terkait` varchar(255) DEFAULT NULL,
  `nama_ketua` varchar(255) DEFAULT NULL,
  `nomor_contact` varchar(50) DEFAULT NULL,
  `alamat_sekretariat` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengguna`
--

CREATE TABLE `pengguna` (
  `id` int(11) NOT NULL,
  `nama_pengguna` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `peran` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `jabatan` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `arsip`
--
ALTER TABLE `arsip`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `data_hibah`
--
ALTER TABLE `data_hibah`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mitra_kerja`
--
ALTER TABLE `mitra_kerja`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `arsip`
--
ALTER TABLE `arsip`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `data_hibah`
--
ALTER TABLE `data_hibah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mitra_kerja`
--
ALTER TABLE `mitra_kerja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
