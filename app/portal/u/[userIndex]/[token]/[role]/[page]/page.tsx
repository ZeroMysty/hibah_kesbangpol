"use client";

import React from "react";
import { useParams } from "next/navigation";
import DashboardPage from "@/app/(dashboard)/page";
import HibahTable from "@/components/hibah-table";
import ArsipTable from "@/components/arsip-table";
import LembagaPage from "@/app/(dashboard)/lembaga/page";
import LaporanPage from "@/app/(dashboard)/laporan/page";
import PenggunaPage from "@/app/(dashboard)/pengguna/page";
import PengaturanPage from "@/app/(dashboard)/pengaturan/page";
import BantuanPage from "@/app/(dashboard)/bantuan/page";

export default function EnterprisePortalDynamicSubPage() {
  const params = useParams();
  const pageParam = (Array.isArray(params.page) ? params.page[0] : params.page || "").toLowerCase();

  switch (pageParam) {
    case "beranda":
      return <DashboardPage />;
    case "hibah":
      return <HibahTable />;
    case "arsip":
      return <ArsipTable />;
    case "lembaga":
      return <LembagaPage />;
    case "laporan":
      return <LaporanPage />;
    case "pengguna":
      return <PenggunaPage />;
    case "pengaturan":
      return <PengaturanPage />;
    case "bantuan":
      return <BantuanPage />;
    default:
      return <DashboardPage />;
  }
}