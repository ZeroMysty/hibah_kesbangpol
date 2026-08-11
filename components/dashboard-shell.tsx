"use client";

import { useState } from "react";
import Navbar from "./navbar";
import { BellIcon, MenuIcon, SearchIcon } from "./icons";

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

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Navbar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main column */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 dark:border-zinc-800 dark:bg-zinc-900/80">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 lg:hidden dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label="Buka menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <div className="hidden text-sm text-zinc-500 sm:block dark:text-zinc-400">
            <span className="text-zinc-400 dark:text-zinc-500">Beranda</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">Dashboard</span>
          </div>

          {/* Search */}
          <div className="ml-auto hidden items-center md:flex">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="search"
                placeholder="Cari hibah, instansi..."
                className="h-9 w-56 rounded-full border border-zinc-200 bg-zinc-100/70 pl-9 pr-4 text-sm outline-none transition-all duration-300 placeholder:text-zinc-400 focus:w-72 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-800/70 dark:focus:bg-zinc-800 dark:focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative ml-auto md:ml-0">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              aria-label="Notifikasi"
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
                <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-950/10 sm:w-96 dark:border-zinc-700 dark:bg-zinc-900">
                  <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                    <p className="text-sm font-semibold">Notifikasi</p>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                      {notifications.filter((n) => n.unread).length} baru
                    </span>
                  </div>
                  <ul className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <li
                        key={n.title}
                        className={`flex gap-3 border-b border-zinc-50 px-4 py-3 transition-colors hover:bg-zinc-50 last:border-0 dark:border-zinc-800/60 dark:hover:bg-zinc-800/50 ${
                          n.unread ? "bg-indigo-50/50 dark:bg-indigo-500/5" : ""
                        }`}
                      >
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                            n.unread ? "bg-indigo-500" : "bg-zinc-300 dark:bg-zinc-600"
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {n.title}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                            {n.desc}
                          </p>
                          <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">{n.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white ring-2 ring-white dark:ring-zinc-900">
              AD
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold">Admin Kesbangpol</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Administrator</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
