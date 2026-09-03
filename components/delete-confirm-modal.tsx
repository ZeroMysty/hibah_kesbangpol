"use client";

import { TrashIcon, XIcon } from "./icons";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemName: string;
  description?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  title = "Konfirmasi Hapus Data",
  itemName,
  description = "Data ini akan terhapus secara permanen dari database MySQL di server XAMPP dan tidak dapat dikembalikan.",
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-2xl transition-all">
        {/* Header Icon */}
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-50/50">
            <TrashIcon className="h-6 w-6" />
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-bold text-zinc-900 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Apakah Anda yakin ingin menghapus data{" "}
            <strong className="font-bold text-zinc-900">"{itemName}"</strong>?
          </p>
          <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3 text-[11px] font-medium text-amber-800 flex items-start gap-2 mt-2">
            <span className="shrink-0 text-amber-600 font-bold">⚠️</span>
            <span>{description}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4.5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-600/25 hover:from-red-700 hover:to-rose-700 transition active:scale-[0.98]"
          >
            <TrashIcon className="h-3.5 w-3.5" />
            <span>Ya, Hapus dari Database</span>
          </button>
        </div>
      </div>
    </div>
  );
}
