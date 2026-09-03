"use client";

import { useState, useEffect, useCallback } from "react";
import StatusBadge from "./status-badge";
import {
  MailIcon,
  PencilIcon,
  SearchIcon,
  TrashIcon,
  UserPlusIcon,
  XIcon,
} from "./icons";
import DeleteConfirmModal from "./delete-confirm-modal";

type User = {
  id: number;
  name: string;
  email: string;
  roleGroup: "Admin" | "Bidang 1" | "Bidang 2" | "Bidang 3" | "Bidang 4";
  roleTitle: string;
  status: string;
  initials: string;
  gradient: string;
};

const roles = ["Semua", "Admin", "Bidang 1", "Bidang 2", "Bidang 3", "Bidang 4"];

const gradientMap: Record<string, string> = {
  Admin: "from-emerald-500 to-teal-600",
  "Bidang 1": "from-blue-600 to-indigo-700",
  "Bidang 2": "from-red-600 to-rose-700",
  "Bidang 3": "from-amber-500 to-orange-600",
  "Bidang 4": "from-purple-600 to-indigo-800",
};

function dbRowToUser(row: any): User {
  const roleGroup = (row.peran as User["roleGroup"]) || "Admin";
  const name = row.nama_pengguna || "";
  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: row.id,
    name,
    email: row.email || "",
    roleGroup,
    roleTitle: row.jabatan || `Staff ${roleGroup}`,
    status: row.status || "Aktif",
    initials,
    gradient: gradientMap[roleGroup] || "from-zinc-500 to-zinc-700",
  };
}

export default function UserTable() {
  const [userList, setUserList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("Semua");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states untuk pengguna baru
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRoleGroup, setNewRoleGroup] = useState<User["roleGroup"]>("Admin");
  const [newRoleTitle, setNewRoleTitle] = useState("");
  const [newStatus, setNewStatus] = useState("Aktif");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/pengguna");
      if (res.ok) {
        const json = await res.json();
        setUserList((json.data || []).map(dbRowToUser));
      }
    } catch (err) {
      console.error("Gagal mengambil data pengguna dari DB:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = userList.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.roleTitle.toLowerCase().includes(query.toLowerCase());
    const matchesRole = role === "Semua" || u.roleGroup === role;
    return matchesQuery && matchesRole;
  });

  // Tambah akun pengguna -> Simpan ke tabel pengguna di MySQL
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    try {
      const res = await fetch("/api/pengguna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_pengguna: newName.trim(),
          email: newEmail.trim(),
          peran: newRoleGroup,
          status: newStatus,
          jabatan: newRoleTitle.trim() || `Staff Verifikator ${newRoleGroup}`,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const initials = newName
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        const newUser: User = {
          id: json.id,
          name: newName.trim(),
          email: newEmail.trim(),
          roleGroup: newRoleGroup,
          roleTitle: newRoleTitle.trim() || `Staff Verifikator ${newRoleGroup}`,
          status: newStatus,
          initials,
          gradient: gradientMap[newRoleGroup],
        };

        setUserList([newUser, ...userList]);
        setShowAddModal(false);
        showToast(`Pengguna "${newName}" berhasil ditambahkan ke database.`);

        setNewName("");
        setNewEmail("");
        setNewRoleTitle("");
        setNewStatus("Aktif");
      } else {
        const err = await res.json();
        alert(`Gagal menambahkan pengguna: ${err.error}`);
      }
    } catch (err) {
      console.error("Gagal simpan pengguna:", err);
    }
  };

  // Edit jabatan pengguna -> Update ke tabel pengguna di MySQL
  const handleEditJabatan = async (u: User) => {
    const newTitle = prompt(`Ubah jabatan untuk ${u.name}:`, u.roleTitle);
    if (!newTitle) return;

    try {
      const res = await fetch("/api/pengguna", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: u.id,
          nama_pengguna: u.name,
          email: u.email,
          peran: u.roleGroup,
          status: u.status,
          jabatan: newTitle.trim(),
        }),
      });

      if (res.ok) {
        setUserList(
          userList.map((item) =>
            item.id === u.id ? { ...item, roleTitle: newTitle.trim() } : item
          )
        );
        showToast(`Jabatan "${u.name}" berhasil diperbarui di database.`);
      } else {
        alert("Gagal memperbarui jabatan.");
      }
    } catch (err) {
      console.error("Gagal update jabatan:", err);
    }
  };

  // Hapus pengguna -> Hapus dari tabel pengguna di MySQL
  const executeDeleteUser = async (u: User) => {
    try {
      const res = await fetch(`/api/pengguna?id=${u.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUserList((prev) => prev.filter((item) => item.id !== u.id));
        showToast(`Akun "${u.name}" berhasil dihapus dari database.`);
      } else {
        alert("Gagal menghapus pengguna dari database.");
      }
    } catch (err) {
      console.error("Gagal hapus pengguna:", err);
    }
  };

  const roleCount = (r: string) =>
    r === "Semua" ? userList.length : userList.filter((u) => u.roleGroup === r).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-zinc-900 px-5 py-3.5 text-xs font-semibold text-white shadow-2xl animate-fade-in">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-zinc-400 hover:text-white"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Filter:</span>

        {/* Role Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500">Peran / Bidang:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r === "Semua"
                  ? `Semua Pengguna (${userList.length})`
                  : `${r} (${roleCount(r)})`}
              </option>
            ))}
          </select>
        </div>

        {/* Search & Add */}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari akun, email..."
              className="h-9 w-44 rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-xs outline-none transition focus:border-red-400 focus:bg-white sm:w-56"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/25 transition hover:bg-red-500 active:scale-[0.98]"
          >
            <UserPlusIcon className="h-3.5 w-3.5" />
            <span>Tambah Pengguna</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-3 font-semibold">Pengguna / Akun</th>
                <th className="px-5 py-3 font-semibold">Kelompok Peran</th>
                <th className="px-5 py-3 font-semibold">Jabatan / Keterangan</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-xs text-zinc-400">
                    Memuat data pengguna dari database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-zinc-400">
                    {userList.length === 0
                      ? "Belum ada data pengguna di database. Silakan klik 'Tambah Pengguna'."
                      : "Tidak ada akun pengguna yang cocok dengan kriteria pencarian."}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-zinc-50 transition-colors last:border-0 hover:bg-zinc-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${u.gradient} text-xs font-bold text-white shadow-sm`}
                        >
                          {u.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-zinc-900">{u.name}</p>
                          <p className="flex items-center gap-1 truncate text-xs text-zinc-500">
                            <MailIcon className="h-3 w-3 shrink-0" />
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          u.roleGroup === "Admin"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : u.roleGroup.startsWith("Bidang")
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-purple-50 text-purple-700 border border-purple-200"
                        }`}
                      >
                        {u.roleGroup}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-600">{u.roleTitle}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditJabatan(u)}
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-amber-50 hover:text-amber-600"
                          title="Edit Jabatan"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                          title="Hapus Akun"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Pengguna Baru */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">
                  Tambah Akun Pengguna Baru
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Daftarkan staf atau verifikator bidang untuk akses sistem e-Arsip Hibah.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-700">
                  Nama Lengkap Pegawai / Pengguna *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Mochamad Ramdani, S.IP"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-700">
                  Email Kedinasan (Username Login) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama@kesbangpol.go.id"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Kelompok Peran *
                  </label>
                  <select
                    value={newRoleGroup}
                    onChange={(e) => setNewRoleGroup(e.target.value as User["roleGroup"])}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-xs font-medium outline-none focus:border-red-400"
                  >
                    <option value="Admin">Admin Utama</option>
                    <option value="Bidang 1">Bidang 1 (Wasbang)</option>
                    <option value="Bidang 2">Bidang 2 (Poldagri & Ormas)</option>
                    <option value="Bidang 3">Bidang 3 (Ekosodbud & Agama)</option>
                    <option value="Bidang 4">Bidang 4 (Wasnas & Konflik)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-700">
                    Status Akun *
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-xs font-medium outline-none focus:border-red-400"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-700">
                  Jabatan / Penugasan Khusus
                </label>
                <input
                  type="text"
                  placeholder="Misal: Penata Arsip & Verifikator Berkas Hibah"
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-600/25 hover:from-red-700 hover:to-rose-700 transition active:scale-[0.98]"
                >
                  Simpan Akun Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.name || ""}
        onConfirm={() => {
          if (deleteTarget) {
            executeDeleteUser(deleteTarget);
          }
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
