"use client";

import { useRouter } from "next/navigation";
import { bidangInfo, useMode } from "@/context/mode-context";
import { LogoutIcon } from "./icons";

export default function ModeSwitcher() {
  const { mode, bidangId, currentUser, logout } = useMode();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Active Account Info Badge */}
      <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 shadow-sm text-xs">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-zinc-400 font-medium hidden md:inline">Terotentikasi:</span>
        <span className="font-bold text-zinc-900">
          {mode === "admin" && "Admin Kesbangpol"}
          {mode === "bidang" && `Staff ${bidangInfo[bidangId].shortName}`}
        </span>
        <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 font-mono">
          {currentUser.initials}
        </span>
      </div>

      {/* Logout & Switch Account Button */}
      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 px-2.5 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white"
        title="Keluar / Ganti Akun Login"
      >
        <LogoutIcon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Ganti Akun</span>
      </button>
    </div>
  );
}
