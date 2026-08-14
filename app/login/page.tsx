import type { Metadata } from "next";
import Image from "next/image";
import LoginForm from "../../components/login-form";

export const metadata: Metadata = {
  title: "Masuk | Sistem Pengarsipan Hibah Kesbangpol",
  description: "Portal Sistem Pengarsipan Hibah Bakesbangpol Kota Bandung",
};

// Siluet skyline kota Bandung
const skylineBack =
  "M0 200 L0 120 L40 120 L40 90 L80 90 L80 130 L130 130 L130 60 L170 60 L170 100 L210 100 L210 140 L260 140 L260 80 L310 80 L310 50 L350 50 L350 90 L400 90 L400 130 L450 130 L450 70 L490 70 L490 110 L530 110 L530 150 L580 150 L580 90 L620 90 L620 55 L660 55 L660 100 L700 100 L700 140 L750 140 L750 75 L790 75 L790 120 L830 120 L830 160 L880 160 L880 95 L920 95 L920 130 L970 130 L970 170 L1020 170 L1020 110 L1060 110 L1060 65 L1100 65 L1100 105 L1140 105 L1140 150 L1190 150 L1190 85 L1230 85 L1230 125 L1280 125 L1280 160 L1330 160 L1330 100 L1370 100 L1370 140 L1440 140 L1440 200 Z";

const skylineFront =
  "M0 200 L0 160 L50 160 L50 130 L100 130 L100 170 L150 170 L150 140 L200 140 L200 180 L260 180 L260 145 L310 145 L310 175 L360 175 L360 150 L420 150 L420 185 L480 185 L480 155 L540 155 L540 130 L590 130 L590 170 L650 170 L650 145 L700 145 L700 175 L760 175 L760 150 L820 150 L820 185 L880 185 L880 155 L940 155 L940 130 L1000 130 L1000 170 L1060 170 L1060 145 L1120 145 L1120 180 L1180 180 L1180 150 L1240 150 L1240 175 L1300 175 L1300 140 L1360 140 L1360 170 L1440 170 L1440 200 Z";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-slate-50">
      {/* ========================================================= */}
      {/* PANEL KIRI: Modern Kesbangpol Crimson & Navy Split Screen */}
      {/* ========================================================= */}
      <div className="relative hidden lg:flex lg:w-[48%] xl:w-[45%] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#7B0B14] via-[#94111C] to-[#141B4D] p-10 xl:p-14 text-white">
        {/* Glow & Decorative lighting */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        {/* Skyline Kota di Latar Bawah */}
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-44 w-full text-white/10"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={skylineBack} fill="currentColor" opacity="0.4" />
          <path d={skylineFront} fill="currentColor" opacity="0.8" />
        </svg>

        {/* Konten Utama Branding */}
        <div className="relative z-10 my-auto py-8 flex flex-col items-center text-center">
          {/* Logo Resmi Kesbangpol */}
          <div className="mb-6 flex justify-center">
            <Image
              src="/favicon.ico"
              alt="Logo Resmi Kesbangpol Kota Bandung"
              width={220}
              height={220}
              unoptimized
              className="h-52 w-52 object-contain transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-red-200">
            Badan Kesatuan Bangsa dan Politik
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Sistem Pengarsipan Hibah
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-red-100/85">
            Portal digital terpadu untuk pengarsipan naskah perjanjian hibah (NPHD), 
            verifikasi berkas empat bidang teknis, dan pemantauan realisasi dana hibah daerah.
          </p>
        </div>

        {/* Footer Panel Kiri */}
        <div className="relative z-10 text-xs text-white/50 text-center">
          © 2026 Bakesbangpol Kota Bandung. Hak Cipta Dilindungi.
        </div>
      </div>

      {/* ========================================================= */}
      {/* PANEL KANAN: Login Form Card                             */}
      {/* ========================================================= */}
      <div className="relative flex flex-1 items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-md">
          {/* Header Mobile Only */}
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <div className="mb-3">
              <Image
                src="/favicon.ico"
                alt="Logo Kesbangpol"
                width={80}
                height={80}
                unoptimized
                className="h-20 w-20 object-contain"
              />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-red-700">
              Bakesbangpol Kota Bandung
            </p>
            <h2 className="text-xl font-extrabold text-zinc-900">
              Sistem Pengarsipan Hibah
            </h2>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
