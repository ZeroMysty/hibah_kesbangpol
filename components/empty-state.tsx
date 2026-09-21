import type { ReactNode } from "react";
import { DocumentIcon } from "./icons";

type EmptyStateProps = {
  message?: string;
  icon?: (props: { className?: string }) => ReactNode;
};

/**
 * EmptyState - Tampilan kosong standar untuk tabel/list yang belum ada data.
 *
 * @example
 * // Di dalam <tbody>
 * <tr>
 *   <td colSpan={6}>
 *     <EmptyState message="Belum ada data usulan hibah." />
 *   </td>
 * </tr>
 *
 * // Di luar tabel
 * <EmptyState icon={FolderIcon} message="Belum ada arsip." />
 */
export default function EmptyState({
  message = "Belum ada data.",
  icon: Icon = DocumentIcon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
        <Icon className="h-7 w-7" />
      </div>
      <p className="max-w-xs text-sm text-zinc-400">{message}</p>
    </div>
  );
}

/**
 * TableEmptyRow - Versi EmptyState untuk baris tabel (<tbody>).
 *
 * @example
 * <tbody>
 *   {isLoading && <TableEmptyRow colSpan={6} message="Memuat data..." />}
 *   {!isLoading && data.length === 0 && <TableEmptyRow colSpan={6} message="Belum ada data." />}
 * </tbody>
 */
export function TableEmptyRow({
  colSpan,
  message = "Belum ada data.",
}: {
  colSpan: number;
  message?: string;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-12 text-center text-xs text-zinc-400">
        {message}
      </td>
    </tr>
  );
}
