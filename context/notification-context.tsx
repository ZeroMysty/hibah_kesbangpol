"use client";

// context/notification-context.tsx
//
// Penyimpanan notifikasi bersama untuk admin. Setiap kali akun bidang
// menambah usulan hibah, menambah arsip, atau mendaftarkan lembaga baru,
// event itu dicatat ke sini (localStorage) supaya muncul di halaman
// Laporan (khusus admin) -- termasuk real-time lintas tab browser.

import { createContext, useContext, useEffect, useState } from "react";

export type NotificationType = "hibah" | "arsip" | "lembaga";

export type AppNotification = {
  id: string;
  type: NotificationType;
  bidangId: number;
  bidangNama: string;
  message: string;
  createdAt: number;
  read: boolean;
};

const STORAGE_KEY = "kesbangpol_notifications";
const MAX_STORED = 200; // batasi supaya localStorage tidak membengkak

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
    setNotifications(loadNotifications());

    // Sinkron lintas tab: kalau tab lain (akun bidang) nambah data,
    // tab admin ini ikut update tanpa perlu refresh manual.
    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setNotifications(JSON.parse(e.newValue));
        } catch {
          // abaikan data rusak
        }
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addNotification: NotificationContextType["addNotification"] = (n) => {
    setNotifications((prev) => {
      const next = [
        {
          ...n,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: Date.now(),
          read: false,
        },
        ...prev,
      ].slice(0, MAX_STORED);
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