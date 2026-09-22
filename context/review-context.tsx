"use client";

// context/review-context.tsx
//
// Antrian review dokumen antara Bidang dan Admin.
// Bidang submit dokumen → status "menunggu" → Admin setujui/kembalikan.
// Jika dikembalikan, bidang bisa submit ulang.
// Semua data disimpan di localStorage (kesbangpol_review_queue).

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { BidangId } from "./mode-context";
import { LemariArsip } from "./hibah-context";

export type ReviewStatus = "menunggu" | "dikembalikan" | "disetujui";

export interface ReviewItem {
  id: string;
  bidangId: BidangId;
  bidangNama: string;
  name: string;
  instansi: string;
  kategori: string;
  nominal: number;
  tahun: string;
  lemariArsip: LemariArsip;
  rakArsip: string;
  nomorArsip: string;
  pic?: string;
  noTelp?: string;
  catatan?: string;
  fileName?: string;
  fileDataUrl?: string;
  fileType?: string;
  fileSize?: string;
  submittedAt: number;
  status: ReviewStatus;
  catatanAdmin?: string;
  returnedAt?: number;
  approvedAt?: number;
  resubmitCount?: number;
}

const REVIEW_STORAGE_KEY = "kesbangpol_review_queue";
const BIDANG_NOTIF_KEY = (bidangId: number) =>
  `kesbangpol_bidang_notif_${bidangId}`;

// ── LocalStorage helpers ─────────────────────────────────────────────────────
function loadReviewQueue(): ReviewItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REVIEW_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // korup, mulai kosong
  }
  return [];
}

function saveReviewQueue(list: ReviewItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(list));
}

export interface BidangNotification {
  id: string;
  type: "perbaikan" | "disetujui";
  reviewId: string;
  documentName: string;
  catatanAdmin?: string;
  createdAt: number;
  read: boolean;
}

function loadBidangNotifs(bidangId: number): BidangNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BIDANG_NOTIF_KEY(bidangId));
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveBidangNotifs(bidangId: number, list: BidangNotification[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BIDANG_NOTIF_KEY(bidangId), JSON.stringify(list));
}

// ── Context interface ────────────────────────────────────────────────────────
interface ReviewContextType {
  // Semua item
  reviewQueue: ReviewItem[];
  // Antrian pending (untuk admin)
  pendingReviews: ReviewItem[];
  // Dikembalikan ke bidang tertentu
  myReturned: (bidangId: BidangId) => ReviewItem[];
  // Notifikasi bidang
  bidangNotifications: (bidangId: BidangId) => BidangNotification[];
  bidangUnreadCount: (bidangId: BidangId) => number;
  markBidangNotifsRead: (bidangId: BidangId) => void;
  // Aksi
  submitForReview: (
    item: Omit<
      ReviewItem,
      "id" | "submittedAt" | "status" | "returnedAt" | "approvedAt" | "resubmitCount"
    >
  ) => void;
  approveReview: (id: string) => ReviewItem | null;
  returnReview: (id: string, catatanAdmin: string) => void;
  resubmitReview: (id: string) => void;
  totalPendingCount: number;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

// ── Provider ────────────────────────────────────────────────────────────────
export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviewQueue, setReviewQueue] = useState<ReviewItem[]>([]);
  const [bidangNotifsMap, setBidangNotifsMap] = useState<
    Record<number, BidangNotification[]>
  >({});

  // Muat dari localStorage saat mount
  useEffect(() => {
    const queue = loadReviewQueue();
    setReviewQueue(queue);

    // Muat notif semua bidang (1-4)
    const map: Record<number, BidangNotification[]> = {};
    for (let b = 1; b <= 4; b++) {
      map[b] = loadBidangNotifs(b);
    }
    setBidangNotifsMap(map);

    // Sinkronisasi lintas tab
    function handleStorage(e: StorageEvent) {
      if (e.key === REVIEW_STORAGE_KEY && e.newValue) {
        try {
          setReviewQueue(JSON.parse(e.newValue));
        } catch {}
      }
      for (let b = 1; b <= 4; b++) {
        if (e.key === BIDANG_NOTIF_KEY(b) && e.newValue) {
          try {
            const parsed: BidangNotification[] = JSON.parse(e.newValue);
            setBidangNotifsMap((prev) => ({ ...prev, [b]: parsed }));
          } catch {}
        }
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const pendingReviews = reviewQueue.filter((r) => r.status === "menunggu");
  const totalPendingCount = pendingReviews.length;

  const myReturned = useCallback(
    (bidangId: BidangId) =>
      reviewQueue.filter(
        (r) => r.status === "dikembalikan" && r.bidangId === bidangId
      ),
    [reviewQueue]
  );

  const bidangNotifications = useCallback(
    (bidangId: BidangId): BidangNotification[] =>
      bidangNotifsMap[bidangId] || [],
    [bidangNotifsMap]
  );

  const bidangUnreadCount = useCallback(
    (bidangId: BidangId) =>
      (bidangNotifsMap[bidangId] || []).filter((n) => !n.read).length,
    [bidangNotifsMap]
  );

  const markBidangNotifsRead = useCallback(
    (bidangId: BidangId) => {
      setBidangNotifsMap((prev) => {
        const updated = (prev[bidangId] || []).map((n) => ({ ...n, read: true }));
        saveBidangNotifs(bidangId, updated);
        return { ...prev, [bidangId]: updated };
      });
    },
    []
  );

  // ── Aksi ─────────────────────────────────────────────────────────────────

  const submitForReview = useCallback(
    (
      item: Omit<
        ReviewItem,
        "id" | "submittedAt" | "status" | "returnedAt" | "approvedAt" | "resubmitCount"
      >
    ) => {
      const newItem: ReviewItem = {
        ...item,
        id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        submittedAt: Date.now(),
        status: "menunggu",
        resubmitCount: 0,
      };
      setReviewQueue((prev) => {
        const next = [newItem, ...prev];
        saveReviewQueue(next);
        return next;
      });
    },
    []
  );

  // Admin setujui — mengembalikan ReviewItem yang disetujui agar caller bisa pakai datanya
  const approveReview = useCallback((id: string): ReviewItem | null => {
    let approved: ReviewItem | null = null;
    setReviewQueue((prev) => {
      const next = prev.map((r) => {
        if (r.id === id) {
          approved = { ...r, status: "disetujui", approvedAt: Date.now() };
          return approved;
        }
        return r;
      });
      saveReviewQueue(next);
      return next;
    });
    return approved;
  }, []);

  // Admin kembalikan dengan catatan
  const returnReview = useCallback(
    (id: string, catatanAdmin: string) => {
      let returned: ReviewItem | null = null;
      setReviewQueue((prev) => {
        const next = prev.map((r) => {
          if (r.id === id) {
            returned = {
              ...r,
              status: "dikembalikan",
              catatanAdmin,
              returnedAt: Date.now(),
            };
            return returned;
          }
          return r;
        });
        saveReviewQueue(next);
        return next;
      });

      // Tambah notifikasi untuk bidang ybs
      if (returned) {
        const r = returned as ReviewItem;
        setBidangNotifsMap((prev) => {
          const existing = prev[r.bidangId] || [];
          const notif: BidangNotification = {
            id: `bnotif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type: "perbaikan",
            reviewId: id,
            documentName: r.name,
            catatanAdmin,
            createdAt: Date.now(),
            read: false,
          };
          const updated = [notif, ...existing];
          saveBidangNotifs(r.bidangId, updated);
          return { ...prev, [r.bidangId]: updated };
        });
      }
    },
    []
  );

  // Bidang submit ulang setelah perbaikan
  const resubmitReview = useCallback((id: string) => {
    setReviewQueue((prev) => {
      const next = prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: "menunggu" as ReviewStatus,
            catatanAdmin: undefined,
            returnedAt: undefined,
            submittedAt: Date.now(),
            resubmitCount: (r.resubmitCount || 0) + 1,
          };
        }
        return r;
      });
      saveReviewQueue(next);
      return next;
    });
  }, []);

  return (
    <ReviewContext.Provider
      value={{
        reviewQueue,
        pendingReviews,
        myReturned,
        bidangNotifications,
        bidangUnreadCount,
        markBidangNotifsRead,
        submitForReview,
        approveReview,
        returnReview,
        resubmitReview,
        totalPendingCount,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  const ctx = useContext(ReviewContext);
  if (!ctx) {
    throw new Error("useReview harus dipakai di dalam <ReviewProvider>");
  }
  return ctx;
}
