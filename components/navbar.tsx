"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMode } from "@/context/mode-context";
import { useReview } from "@/context/review-context";
import {
  ArchiveIcon,
  BuildingIcon,
  ChartIcon,
  DashboardIcon,
  DocumentIcon,
  FolderIcon,
  HelpIcon,
  LogoutIcon,
  SettingsIcon,
  UsersIcon,
  XIcon,
} from "./icons";

type NavbarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Navbar({ open, onClose }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, currentUser, logout, getUrl, bidangId } = useMode();
  const { totalPendingCount, myReturned, bidangUnreadCount } = useReview();

  const isActive = (slug: string) => {
    const segments = pathname.split("/").filter(Boolean);
    const currentSlug = (segments[segments.length - 1] || "Beranda").toLowerCase();
    const target = slug.toLowerCase();
    if (target === "beranda") {
      return (
        currentSlug === "beranda" ||
        ["admin", "bidang1", "bidang2", "bidang3", "bidang4"].includes(currentSlug)
      );
    }
    if (target === "dokumen") {
      return currentSlug === "dokumen" || currentSlug === "hibah";
    }
    if (target === "lemari") {
      return currentSlug === "lemari" || currentSlug === "arsip";
    }
    return currentSlug === target;
  };

  const mainMenu = [
    { name: "Beranda", slug: "Beranda", href: getUrl("Beranda"), icon: DashboardIcon },
    {
      name: "Daftar Dokumen",
      slug: "Dokumen",
      href: getUrl("Dokumen"),
      icon: DocumentIcon,
    },
    { name: "Denah Lemari", slug: "Lemari", href: getUrl("Lemari"), icon: ArchiveIcon },
    { name: "Penerima Hibah", slug: "Lembaga", href: getUrl("Lembaga"), icon: BuildingIcon },
    // Menu Laporan & Pengguna hanya tampil untuk mode admin, staff bidang tidak melihatnya sama sekali.
    ...(mode === "admin"
      ? [
          {
            name: "Laporan",
            slug: "Laporan",
            href: getUrl("Laporan"),
            icon: ChartIcon,
            badge: totalPendingCount > 0 ? String(totalPendingCount) : undefined,
            badgeColor: "bg-red-600",
          },
          { name: "Pengguna", slug: "Pengguna", href: getUrl("Pengguna"), icon: UsersIcon },
        ]
      : [
          {
            name: "Laporan",
            slug: "Laporan",
            href: getUrl("Laporan"),
            icon: ChartIcon,
            badge:
              bidangUnreadCount(bidangId) > 0
                ? String(bidangUnreadCount(bidangId))
                : myReturned(bidangId).length > 0
                ? String(myReturned(bidangId).length)
                : undefined,
            badgeColor: "bg-amber-500",
          },
        ]),
  ];

  const secondaryMenu = [
    { name: "Pengaturan", slug: "Pengaturan", href: getUrl("Pengaturan"), icon: SettingsIcon },
    { name: "Bantuan", slug: "Bantuan", href: getUrl("Bantuan"), icon: HelpIcon },
  ];

  const renderItem = (item: {
    name: string;
    slug: string;
    href: string;
    icon: (p: { className?: string }) => React.ReactNode;
    badge?: string;
    badgeColor?: string;
  }) => {
    const active = isActive(item.slug);
    const Icon = item.icon;
    return (
      <li key={item.name}>
        <Link
          href={item.href}
          onClick={onClose}
          className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
            active
              ? "bg-gradient-to-r from-red-50 to-transparent text-red-700 font-semibold"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          <Icon
            className={`h-5 w-5 shrink-0 transition-colors ${
              active
                ? "text-red-600"
                : "text-zinc-400 group-hover:text-zinc-600"
            }`}
          />
          <span className="flex-1 truncate">{item.name}</span>
          {item.badge && (
            <span className={`rounded-full ${item.badgeColor || "bg-red-600"} px-2 py-0.5 text-[10px] font-bold text-white`}>
              {item.badge}
            </span>
          )}
          {active && <span className="h-1.5 w-1.5 rounded-full bg-red-600" />}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-zinc-100 px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm border border-zinc-200">
            <Image
              src="/favicon.ico"
              alt="Logo Kesbangpol"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight text-zinc-900">
              Kesbangpol
            </p>
            <p className="truncate text-[11px] font-medium text-zinc-500">
              Sistem Pengarsipan Hibah
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 lg:hidden"
            aria-label="Tutup menu"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          <div>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Menu Utama ({mode.toUpperCase()})
            </p>
            <ul className="space-y-1">{mainMenu.map(renderItem)}</ul>
          </div>
          <div>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Lainnya
            </p>
            <ul className="space-y-1">{secondaryMenu.map(renderItem)}</ul>
          </div>
        </nav>

        {/* User */}
        <div className="border-t border-zinc-100 p-3">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-2.5">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${currentUser.gradient} text-xs font-bold text-white`}
            >
              {currentUser.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-zinc-900">
                {currentUser.name}
              </p>
              <p className="truncate text-[10px] text-zinc-500">
                {currentUser.email}
              </p>
            </div>
            <button
              onClick={() => {
                logout();
                onClose();
                router.push("/login");
              }}
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label="Keluar / Ganti Akun"
              title="Keluar / Ganti Akun"
            >
              <LogoutIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}