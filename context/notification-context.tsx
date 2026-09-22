"use client";

// context/notification-context.tsx
//
// Penyimpanan notifikasi bersama untuk admin. Setiap kali akun bidang
// menambah usulan hibah, menambah arsip, atau mendaftarkan lembaga baru,
// event itu dicatat ke sini (localStorage) supaya muncul di halaman
// Laporan (khusus admin) -- termasuk real-time lintas tab browser.
//
// Notifikasi otomatis terhapus setelah 3 hari (EXPIRY_MS) supaya halaman
// Laporan selalu berisi aktivitas terbaru saja, bukan menumpuk selamanya.

import { createContext, useContext, useEffect, useState } from "react";

export type NotificationType = "hibah" | "arsip" | "lembaga" | "dokumen_masuk";

export type AppNotification = {
  id: string;
  type: NotificationType;
  bidangId: number;
  bidangNama: string;
  message: string;
  createdAt: number;
  read: boolean;
  reviewId?: string; // link ke ReviewItem jika terkait alur review
};

const STORAGE_KEY = "kesbangpol_notifications";
const MAX_STORED = 200; // batasi supaya localStorage tidak membengkak
const EXPIRY_MS = 3 * 24 * 60 * 60 * 1000; // 3 hari
// Seberapa sering dicek ulang selama halaman tetap terbuka (1 jam cukup,
// tidak perlu presisi ke detik untuk fitur "kadaluarsa 3 hari").
const PRUNE_INTERVAL_MS = 60 * 60 * 1000;

function loadNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // data korup, mulai dari kosong
  }
  return [];
}

function saveNotifications(list: AppNotification[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Buang semua notifikasi yang sudah lebih tua dari 3 hari.
function pruneExpired(list: AppNotification[]): AppNotification[] {
  const cutoff = Date.now() - EXPIRY_MS;
  return list.filter((n) => n.createdAt >= cutoff);
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    // Muat data, langsung buang yang sudah lebih dari 3 hari sejak awal buka.
    const pruned = pruneExpired(loadNotifications());
    setNotifications(pruned);
    saveNotifications(pruned);

    // Sinkron lintas tab: kalau tab lain (akun bidang) nambah data,
    // tab admin ini ikut update tanpa perlu refresh manual.
    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setNotifications(pruneExpired(JSON.parse(e.newValue)));
        } catch {
          // abaikan data rusak
        }
      }
    }
    window.addEventListener("storage", handleStorage);

    // Selama halaman ini tetap terbuka lama, cek ulang tiap beberapa waktu
    // supaya notifikasi yang "lewat 3 hari" tetap hilang tanpa perlu refresh.
    const interval = setInterval(() => {
      setNotifications((prev) => {
        const next = pruneExpired(prev);
        if (next.length !== prev.length) saveNotifications(next);
        return next;
      });
    }, PRUNE_INTERVAL_MS);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  const addNotification: NotificationContextType["addNotification"] = (n) => {
    setNotifications((prev) => {
      const withNew = [
        {
          ...n,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: Date.now(),
          read: false,
        },
        ...prev,
      ];
      // Buang yang kadaluarsa (>3 hari) sekaligus batasi jumlah maksimum.
      const next = pruneExpired(withNew).slice(0, MAX_STORED);
      saveNotifications(next);
      return next;
    });
  };

  const markAllRead = () => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      saveNotifications(next);
      return next;
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications harus dipakai di dalam <NotificationProvider>");
  }
  return ctx;
}