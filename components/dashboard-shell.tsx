"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./navbar";
import { BellIcon, MenuIcon, SearchIcon, LogoutIcon } from "./icons";
import { useMode } from "@/context/mode-context";

const notifications = [
  {
    title: "Proposal baru masuk",
    desc: "Revitalisasi Taman Budaya diajukan oleh Dinas Kebudayaan.",
    time: "5 menit lalu",
    unread: true,
  },
  {
    title: "Pencairan dana disetujui",
    desc: "Hibah FKUB Kota sebesar Rp85.000.000 telah dicairkan.",
    time: "1 jam lalu",
    unread: true,
  },
  {
    title: "Laporan bulanan siap",
    desc: "Laporan realisasi hibah bulan Juli telah dibuat otomatis.",
    time: "3 jam lalu",
    unread: false,
  },
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser, isLoggedIn, logout, getUrl, getHomeUrl } = useMode();
  const pathname = usePathname();
  const router = useRouter();

  // Extract page slug from pathname
  const segments = pathname.split("/").filter(Boolean);
  const currentSlug = segments[segments.length - 1] || "Beranda";

  const pageTitleMap: Record<string, string> = {
    beranda: "Beranda",
    hibah: "Data Hibah",
    arsip: "Arsip Dokumen Bidang",
    lembaga: "Lembaga & Ormas",
    pengguna: "Pengguna",
    pengaturan: "Pengaturan",
    bantuan: "Bantuan",
  };

  const pageTitle = pageTitleMap[currentSlug.toLowerCase()] ?? "Dashboard";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-sm text-zinc-500">
        Mengarahkan ke halaman login...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Navbar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main column */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 lg:hidden"
            aria-label="Buka menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <div className="hidden text-sm sm:flex sm:items-center sm:gap-1.5">
            {currentSlug.toLowerCase() === "beranda" ? (
              <span className="font-semibold text-zinc-900">{pageTitle}</span>
            ) : currentSlug.toLowerCase() === "pengaturan" || currentSlug.toLowerCase() === "bantuan" ? (
              <span className="font-semibold text-zinc-900">{pageTitle}</span>
            ) : (
              <>
                <Link href={getHomeUrl()} className="text-zinc-400 hover:text-red-600 transition-colors">
                  Beranda
                </Link>
                <span className="text-zinc-300">/</span>
                <span className="font-semibold text-zinc-900">{pageTitle}</span>
              </>
            )}
          </div>

          {/* Search Box */}
          <div className="ml-auto relative hidden sm:block">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari data..."
              className="h-9 w-52 rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-500/10 focus:bg-white focus:w-64"
              style={{ transition: "width 0.2s" }}
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              aria-label="Notifikasi"
              aria-expanded={notifOpen}
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
            </button>

            {notifOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotifOpen(false)}
                  aria-hidden="true"
                />
                <div
                  role="dialog"
                  aria-label="Daftar notifikasi"
                  className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-950/10 sm:w-96"
                >
                  <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
                    <p className="text-sm font-semibold">Notifikasi</p>
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                      {notifications.filter((n) => n.unread).length} baru
                    </span>
                  </div>
                  <ul className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <li
                        key={n.title}
                        className={`flex gap-3 border-b border-zinc-50 px-4 py-3 transition-colors hover:bg-zinc-50 last:border-0 ${
                          n.unread ? "bg-red-50/50" : ""
                        }`}
                      >
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                            n.unread ? "bg-red-500" : "bg-zinc-300"
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-zinc-900">
                            {n.title}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
                            {n.desc}
                          </p>
                          <p className="mt-1 text-[11px] text-zinc-400">{n.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* User Profile — click avatar/name to go to /pengaturan */}
          <div className="flex items-center gap-2 border-l border-zinc-200 pl-3">
            <button
              onClick={() => router.push(getUrl("Pengaturan"))}
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${currentUser.gradient} text-xs font-bold text-white ring-2 ring-white shadow-sm transition-transform hover:scale-105 active:scale-95`}
              title="Buka Pengaturan Profil"
              aria-label="Profil Pengguna"
            >
              {currentUser.initials}
            </button>
            <button
              onClick={() => router.push(getUrl("Pengaturan"))}
              className="hidden leading-tight lg:block max-w-[140px] text-left hover:opacity-75 transition-opacity"
              title="Buka Pengaturan Profil"
            >
              <p className="truncate text-xs font-bold text-zinc-900">{currentUser.name}</p>
              <p className="truncate text-[10px] text-zinc-500">{currentUser.roleLabel}</p>
            </button>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="ml-1 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
              title="Keluar"
              aria-label="Keluar dari akun"
            >
              <LogoutIcon className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
