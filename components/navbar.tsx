"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartIcon,
  DashboardIcon,
  FolderIcon,
  HelpIcon,
  LogoutIcon,
  SettingsIcon,
  ShieldIcon,
  UsersIcon,
  XIcon,
} from "./icons";

const mainMenu = [
  { name: "Dashboard", href: "/", icon: DashboardIcon },
  { name: "Data Hibah", href: "/hibah", icon: FolderIcon, badge: "12" },
  { name: "Laporan", href: "/laporan", icon: ChartIcon },
  { name: "Pengguna", href: "/pengguna", icon: UsersIcon },
];

const secondaryMenu = [
  { name: "Pengaturan", href: "/pengaturan", icon: SettingsIcon },
  { name: "Bantuan", href: "/bantuan", icon: HelpIcon },
];

type NavbarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Navbar({ open, onClose }: NavbarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const renderItem = (
    item: {
      name: string;
      href: string;
      icon: (p: { className?: string }) => React.ReactNode;
      badge?: string;
    }
  ) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    return (
      <li key={item.name}>
        <Link
          href={item.href}
          onClick={onClose}
          className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
            active
              ? "bg-gradient-to-r from-indigo-50 to-transparent text-indigo-700 dark:from-indigo-500/15 dark:text-indigo-300"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          }`}
        >
          <Icon
            className={`h-5 w-5 shrink-0 transition-colors ${
              active
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
            }`}
          />
          <span className="flex-1">{item.name}</span>
          {item.badge && (
            <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-indigo-500">
              {item.badge}
            </span>
          )}
          {active && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-900 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
            <ShieldIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
              Kesbangpol
            </p>
            <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
              Sistem Informasi Hibah
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 lg:hidden dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label="Tutup menu"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          <div>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Menu Utama
            </p>
            <ul className="space-y-1">{mainMenu.map(renderItem)}</ul>
          </div>
          <div>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Lainnya
            </p>
            <ul className="space-y-1">{secondaryMenu.map(renderItem)}</ul>
          </div>
        </nav>

        {/* User */}
        <div className="border-t border-zinc-100 p-3 dark:border-zinc-800">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/60">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Admin Kesbangpol
              </p>
              <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                admin@kesbangpol.go.id
              </p>
            </div>
            <button
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              aria-label="Keluar"
              title="Keluar"
            >
              <LogoutIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
