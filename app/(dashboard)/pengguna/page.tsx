"use client";

// Halaman ini hanya boleh diakses oleh Admin. Staff bidang yang mencoba
// membuka /pengguna langsung lewat URL (bukan cuma lewat klik sidebar)
// akan tetap diarahkan ke tampilan "Akses Terbatas" ini.

import Link from "next/link";
import { useMode } from "../../../context/mode-context";
import UserTable from "../../../components/user-table";
import { LockIcon } from "../../../components/icons";

export default function PenggunaPage() {
  const { mode, getHomeUrl } = useMode();

  if (mode !== "admin") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <LockIcon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-zinc-900">Akses Terbatas</h1>
          <p className="mt-1 max-w-sm text-sm text-zinc-500">
            Halaman manajemen pengguna hanya dapat diakses oleh Administrator.
            Hubungi admin jika kamu memerlukan perubahan data pengguna.
          </p>
        </div>
        <Link
          href={getHomeUrl()}
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-500 active:scale-[0.98]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return <UserTable />;
}