"use client";

import { useState } from "react";
import PageHeader from "./page-header";
import StatusBadge from "./status-badge";
import {
  MailIcon,
  PencilIcon,
  SearchIcon,
  TrashIcon,
  UserPlusIcon,
} from "./icons";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  initials: string;
  gradient: string;
};

const users: User[] = [
  { id: 1, name: "Budi Santoso", email: "budi@kesbangpol.go.id", role: "Admin", status: "Aktif", lastActive: "2 menit lalu", initials: "BS", gradient: "from-emerald-500 to-teal-600" },
  { id: 2, name: "Siti Rahayu", email: "siti@kesbangpol.go.id", role: "Verifikator", status: "Aktif", lastActive: "15 menit lalu", initials: "SR", gradient: "from-red-500 to-rose-600" },
  { id: 3, name: "Agus Wibowo", email: "agus@kesbangpol.go.id", role: "Bendahara", status: "Aktif", lastActive: "1 jam lalu", initials: "AW", gradient: "from-amber-500 to-orange-600" },
  { id: 4, name: "Dewi Lestari", email: "dewi@kesbangpol.go.id", role: "Verifikator", status: "Nonaktif", lastActive: "3 hari lalu", initials: "DL", gradient: "from-pink-500 to-rose-600" },
  { id: 5, name: "Rudi Hartono", email: "rudi@kesbangpol.go.id", role: "Operator", status: "Aktif", lastActive: "2 jam lalu", initials: "RH", gradient: "from-sky-500 to-cyan-600" },
  { id: 6, name: "Maya Anggraini", email: "maya@kesbangpol.go.id", role: "Operator", status: "Aktif", lastActive: "Kemarin", initials: "MA", gradient: "from-rose-500 to-rose-600" },
  { id: 7, name: "Joko Prasetyo", email: "joko@kesbangpol.go.id", role: "Admin", status: "Nonaktif", lastActive: "2 minggu lalu", initials: "JP", gradient: "from-zinc-500 to-zinc-600" },
  { id: 8, name: "Fitri Handayani", email: "fitri@kesbangpol.go.id", role: "Verifikator", status: "Aktif", lastActive: "5 menit lalu", initials: "FH", gradient: "from-lime-500 to-green-600" },
];

const roles = ["Semua", "Admin", "Verifikator", "Bendahara", "Operator"];

export default function UserTable() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("Semua");

  const filtered = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = role === "Semua" || u.role === role;
    return matchesQuery && matchesRole;
  });

  const roleCount = (r: string) => (r === "Semua" ? users.length : users.filter((u) => u.role === r).length);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengguna"
        description="Kelola akun pengguna yang memiliki akses ke sistem informasi hibah."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-500 hover:shadow-red-500/30 active:scale-[0.98]">
            <UserPlusIcon className="h-4 w-4" />
            Tambah Pengguna
          </button>
        }
      />

      {/* Role filter chips */}
      <div className="flex flex-wrap gap-1.5">
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            aria-pressed={role === r}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              role === r
                ? "bg-red-600 text-white shadow-sm shadow-red-600/30"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {r}
            <span
              className={`rounded-full px-1.5 text-[10px] ${
                role === r ? "bg-white/20" : "bg-zinc-200 text-zinc-500"
              }`}
            >
              {roleCount(r)}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama atau email pengguna..."
          aria-label="Cari pengguna"
          className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-4 text-sm outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3 font-semibold">Pengguna</th>
                <th className="px-5 py-3 font-semibold">Peran</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Terakhir Aktif</th>
                <th className="px-5 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-zinc-50 transition-colors last:border-0 hover:bg-zinc-50/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${u.gradient} text-xs font-bold text-white`}
                      >
                        {u.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{u.name}</p>
                        <p className="flex items-center gap-1 truncate text-xs text-zinc-500">
                          <MailIcon className="h-3 w-3 shrink-0" />
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-5 py-4 text-zinc-500">{u.lastActive}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
                        aria-label={`Edit ${u.name}`}
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={`Hapus ${u.name}`}
                        title="Hapus"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-zinc-400">
                    Tidak ada pengguna yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
