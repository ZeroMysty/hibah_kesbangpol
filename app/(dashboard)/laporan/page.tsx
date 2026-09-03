"use client";

// app/(dashboard)/laporan/page.tsx
//
// Halaman ini sekarang khusus ADMIN: berisi feed notifikasi setiap kali
// akun bidang menambah usulan hibah, menambah arsip, atau mendaftarkan
// lembaga baru.

import Link from "next/link";
import { useMode } from "@/context/mode-context";
import { useNotifications, type AppNotification } from "@/context/notification-context";
import { LockIcon, FolderIcon, ArchiveIcon, BuildingIcon, CheckIcon } from "@/components/icons";

const typeIcon: Record<AppNotification["type"], (props: { className?: string }) => React.ReactNode> = {
  hibah: FolderIcon,
  arsip: ArchiveIcon,
  lembaga: BuildingIcon,
};

const typeColor: Record<AppNotification["type"], string> = {
  hibah: "bg-red-50 text-red-600",
  arsip: "bg-sky-50 text-sky-600",
  lembaga: "bg-emerald-50 text-emerald-600",
};

const typeLabel: Record<AppNotification["type"], string> = {
  hibah: "Usulan Hibah Baru",
  arsip: "Arsip Baru",
  lembaga: "Lembaga Baru",
};

function formatRelativeTime(timestamp: number, now: number): string {
  const diffSec = Math.floor((now - timestamp) / 1000);
  if (diffSec < 10) return "Baru saja";
  if (diffSec < 60) return `${diffSec} detik lalu`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} hari lalu`;
}

export default function LaporanPage() {
  const { mode } = useMode();
  const { notifications, unreadCount, markAllRead } = useNotifications();

  if (mode !== "admin") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <LockIcon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-zinc-900">Akses Terbatas</h1>
          <p className="mt-1 max-w-sm text-sm text-zinc-500">
            Halaman Laporan berisi notifikasi aktivitas seluruh bidang dan hanya dapat
            diakses oleh Administrator.
          </p>
        </div>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-500 active:scale-[0.98]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const now = Date.now();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Laporan Aktivitas</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Notifikasi setiap ada usulan hibah, arsip, atau lembaga baru dari seluruh bidang.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-zinc-400 hover:bg-zinc-50"
          >
            <CheckIcon className="h-4 w-4" />
            Tandai semua dibaca ({unreadCount})
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {notifications.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-zinc-400">
            Belum ada aktivitas. Notifikasi akan muncul di sini begitu ada bidang yang
            menambah usulan hibah, arsip, atau lembaga baru.
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {notifications.map((n) => {
              const Icon = typeIcon[n.type];
              return (
                <li
                  key={n.id}
                  className={`flex items-start gap-3.5 px-5 py-4 transition-colors ${
                    n.read ? "" : "bg-red-50/30"
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${typeColor[n.type]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                        {typeLabel[n.type]}
                      </span>
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                        Bidang {n.bidangId} · {n.bidangNama}
                      </span>
                      {!n.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-zinc-800">{n.message}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {formatRelativeTime(n.createdAt, now)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}