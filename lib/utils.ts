/**
 * lib/utils.ts
 * Kumpulan utility function yang dipakai di seluruh aplikasi.
 * Import dari sini agar tidak duplikat di setiap komponen.
 */

// === Format Rupiah ===

/** Format angka ke format Rupiah lengkap. Contoh: 1500000 -> "Rp 1.500.000" */
export const formatRupiah = (n: number): string =>
  "Rp " + (n || 0).toLocaleString("id-ID");

/** Format angka ke Rupiah singkat. Contoh: 1500000 -> "Rp 1 Jt" */
export const formatShortRupiah = (num: number): string => {
  if (!num || num === 0) return "Rp 0";
  if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(1)} M`;
  if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${num.toLocaleString("id-ID")}`;
};

// === Format Waktu Relatif ===

/**
 * Format timestamp ke waktu relatif.
 * @param timestamp - Unix timestamp dalam milidetik
 * @param now       - Waktu sekarang dalam milidetik (default: Date.now())
 */
export function formatRelativeTime(timestamp: number, now: number = Date.now()): string {
  const diffSec = Math.floor((now - timestamp) / 1000);
  if (diffSec < 10) return "Baru saja";
  if (diffSec < 60) return `${diffSec} detik lalu`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  return `${Math.floor(diffHour / 24)} hari lalu`;
}

// === Warna Bidang ===

/** Warna hex per bidang Kesbangpol */
export const BIDANG_HEX: Record<1 | 2 | 3 | 4, string> = {
  1: "#3b82f6",
  2: "#e11d48",
  3: "#f59e0b",
  4: "#9333ea",
};

// === Misc ===

/** Ambil inisial dari nama lengkap. Contoh: "Budi Santoso" -> "BS" */
export function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "US"
  );
}
