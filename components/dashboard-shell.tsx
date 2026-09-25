"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./navbar";
import { BellIcon, MenuIcon, SearchIcon, LogoutIcon, AlertIcon } from "./icons";
import { useMode } from "@/context/mode-context";
import { useReview } from "@/context/review-context";
import { formatRelativeTime } from "@/lib/utils";

const notifications: {
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}[] = [];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);
  const { currentUser, isLoggedIn, logout, getUrl, getHomeUrl, mode, bidangId } = useMode();
  const { totalPendingCount, bidangNotifications, bidangUnreadCount, markBidangNotifsRead, myReturned } = useReview();
  const pathname = usePathname();
  const router = useRouter();

  const now = Date.now();
  const myNotifs = mode === "bidang" ? bidangNotifications(bidangId) : [];
  const myUnread = mode === "bidang" ? bidangUnreadCount(bidangId) : 0;
  const myReturnedDocs = mode === "bidang" ? myReturned(bidangId) : [];
  // Mode Kaban adalah view-only: tidak ada notifikasi review maupun perbaikan

  // Close notif dropdown when clicking outside
  useEffect(() => {
    if (!notifOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  // Extract page slug from pathname
  const segments = pathname.split("/").filter(Boolean);
  const currentSlug = segments[segments.length - 1] || "Beranda";

  const pageTitleMap: Record<string, string> = {
    beranda: "Beranda",
    admin: "Beranda",
    bidang1: "Beranda",
    bidang2: "Beranda",
    bidang3: "Beranda",
    bidang4: "Beranda",
    kaban: "Beranda",
    dokumen: "Daftar Dokumen",
    lemari: "Denah Lemari",
    hibah: "Data Hibah",
    arsip: "Arsip Dokumen Bidang",
    lembaga: "Penerima Hibah",
    laporan: "Laporan & Statistik",
    pengguna: "Pengguna",
    pengaturan: "Pengaturan",
    bantuan: "Bantuan",
  };

  const isBeranda = [
    "beranda",
    "admin",
    "bidang1",
    "bidang2",
    "bidang3",
    "bidang4",
    "kaban",
  ].includes(currentSlug.toLowerCase());

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
            {isBeranda ? (
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`${getUrl("Dokumen")}?q=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
            className="ml-auto relative hidden sm:block"
          >
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari data..."
              className="h-9 w-60 rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-xs outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-500/10 focus:bg-white"
            />
          </form>

          {/* Notifications — Admin: pending review count | Bidang: perbaikan dokumen */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen((v) => !v);
                if (mode === "bidang" && myUnread > 0) markBidangNotifsRead(bidangId);
              }}
              className="relative rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              aria-label="Notifikasi"
              aria-expanded={notifOpen}
            >
              <BellIcon className="h-5 w-5" />
              {/* Badge merah untuk admin (pending review) */}
              {mode === "admin" && totalPendingCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                  {totalPendingCount > 9 ? "9+" : totalPendingCount}
                </span>
              )}
              {/* Badge oranye untuk bidang (notif perbaikan belum dibaca) */}
              {mode === "bidang" && myUnread > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">
                  {myUnread > 9 ? "9+" : myUnread}
                </span>
              )}
              {/* Ping animasi jika ada unread */}
              {((mode === "admin" && totalPendingCount > 0) || (mode === "bidang" && myUnread > 0)) && (
                <span className="absolute right-1 top-1 flex h-4 w-4">
                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${mode === "admin" ? "bg-red-400" : "bg-amber-400"}`} />
                </span>
              )}
            </button>

            {notifOpen && (
              <div
                role="dialog"
                aria-label="Daftar notifikasi"
                className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-950/10 sm:w-96"
              >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
                    <p className="text-sm font-semibold">Notifikasi</p>
                    {mode === "admin" && totalPendingCount > 0 && (
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                        {totalPendingCount} dokumen perlu review
                      </span>
                    )}
                    {mode === "bidang" && myUnread > 0 && (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                        {myUnread} belum dibaca
                      </span>
                    )}
                    {((mode === "admin" && totalPendingCount === 0) || (mode === "bidang" && myUnread === 0 && myNotifs.length === 0)) && (
                      <span className="text-[11px] text-zinc-400">Tidak ada notifikasi</span>
                    )}
                  </div>

                  {/* Konten Admin */}
                  {mode === "admin" && (
                    totalPendingCount > 0 ? (
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                          <AlertIcon className="h-5 w-5 text-red-600 shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-red-800">{totalPendingCount} dokumen menunggu review</p>
                            <p className="text-xs text-red-600 mt-0.5">Buka halaman Laporan untuk meninjau</p>
                          </div>
                        </div>
                        <button
                          onClick={() => { setNotifOpen(false); router.push(getUrl("Laporan")); }}
                          className="w-full rounded-xl bg-red-600 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                        >
                          Buka Antrian Review →
                        </button>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-xs text-zinc-400">
                        Tidak ada dokumen yang menunggu review.
                      </div>
                    )
                  )}

                  {/* Konten Bidang */}
                  {mode === "bidang" && (
                    myNotifs.length > 0 ? (
                      <>
                        <ul className="max-h-72 overflow-y-auto divide-y divide-zinc-100">
                          {myNotifs.slice(0, 10).map((n) => (
                            <li
                              key={n.id}
                              className={`px-4 py-3 transition-colors hover:bg-zinc-50 ${
                                !n.read ? "bg-amber-50/60" : ""
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <AlertIcon className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold text-zinc-900 truncate">{n.documentName}</p>
                                  {n.catatanAdmin && (
                                    <p className="text-[11px] text-amber-700 italic mt-0.5 line-clamp-2">"{n.catatanAdmin}"</p>
                                  )}
                                  <p className="text-[10px] text-zinc-400 mt-1">{formatRelativeTime(n.createdAt, now)}</p>
                                </div>
                                {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />}
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t border-zinc-100 p-3">
                          <button
                            onClick={() => { setNotifOpen(false); router.push(getUrl("Laporan")); }}
                            className="w-full rounded-xl bg-amber-500 py-2 text-xs font-semibold text-white transition hover:bg-amber-400"
                          >
                            Lihat & Perbaiki Dokumen →
                          </button>
                        </div>
                      </>
                    ) : myReturnedDocs.length > 0 ? (
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                          <AlertIcon className="h-5 w-5 text-amber-600 shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-amber-800">{myReturnedDocs.length} dokumen perlu perbaikan</p>
                            <p className="text-xs text-amber-600 mt-0.5">Admin telah mengembalikan dokumen Anda</p>
                          </div>
                        </div>
                        <button
                          onClick={() => { setNotifOpen(false); router.push(getUrl("Laporan")); }}
                          className="w-full rounded-xl bg-amber-500 py-2 text-xs font-semibold text-white transition hover:bg-amber-400"
                        >
                          Perbaiki Sekarang →
                        </button>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-xs text-zinc-400">
                        Tidak ada notifikasi saat ini.
                      </div>
                    )
                  )}
              </div>
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
