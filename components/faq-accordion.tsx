"use client";

import { useState } from "react";
import { ChevronDownIcon, HelpIcon } from "./icons";

const faqs = [
  {
    q: "Bagaimana cara mengajukan proposal hibah?",
    a: "Masuk ke menu Data Hibah, lalu klik tombol Tambah Proposal. Isi formulir dengan lengkap meliputi nama kegiatan, instansi pengaju, rincian anggaran, dan dokumen pendukung. Proposal akan masuk ke antrean verifikasi setelah dikirim.",
  },
  {
    q: "Berapa lama proses verifikasi proposal?",
    a: "Proses verifikasi berlangsung maksimal 14 hari kerja sejak proposal diterima. Tim verifikator akan memeriksa kelengkapan dokumen dan kesesuaian anggaran. Status dapat dipantau secara real-time pada halaman Data Hibah.",
  },
  {
    q: "Apa saja dokumen yang wajib dilampirkan?",
    a: "Dokumen yang wajib dilampirkan meliputi: surat permohonan resmi, proposal kegiatan, RAB (Rencana Anggaran Biaya), profil instansi/organisasi, dan surat pernyataan kesediaan mematuhi ketentuan hibah.",
  },
  {
    q: "Bagaimana jika proposal saya ditolak?",
    a: "Proposal yang ditolak dapat diperbaiki dan diajukan ulang. Anda akan menerima catatan/alasan penolakan. Perbaiki sesuai saran yang diberikan, kemudian ajukan kembali melalui menu Data Hibah.",
  },
  {
    q: "Kapan pencairan dana dilakukan?",
    a: "Pencairan dana dilakukan setelah proposal disetujui dan surat perjanjian hibah ditandatangani. Proses pencairan umumnya memakan waktu 5-10 hari kerja melalui rekening resmi instansi penerima.",
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={faq.q}
            className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
              isOpen
                ? "border-red-200 shadow-md shadow-red-500/5"
                : "border-zinc-200 shadow-sm"
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-3 px-5 py-4 text-left"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <HelpIcon className="h-4 w-4" />
              </span>
              <span className="flex-1 text-sm font-semibold">{faq.q}</span>
              <ChevronDownIcon
                className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="border-t border-zinc-100 px-5 py-4 pl-16 text-sm leading-6 text-zinc-500">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
