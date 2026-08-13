import type { Metadata } from "next";
import LoginForm from "../../components/login-form";
import { ShieldIcon } from "../../components/icons";

export const metadata: Metadata = {
  title: "Masuk | Kesbangpol",
  description: "Masuk ke Sistem Informasi Hibah Kesbangpol",
};

// Siluet skyline kota (meniru latar layanan.bandung.go.id), dibuat dengan SVG inline
const skylineBack =
  "M0 200 L0 120 L40 120 L40 90 L80 90 L80 130 L130 130 L130 60 L170 60 L170 100 L210 100 L210 140 L260 140 L260 80 L310 80 L310 50 L350 50 L350 90 L400 90 L400 130 L450 130 L450 70 L490 70 L490 110 L530 110 L530 150 L580 150 L580 90 L620 90 L620 55 L660 55 L660 100 L700 100 L700 140 L750 140 L750 75 L790 75 L790 120 L830 120 L830 160 L880 160 L880 95 L920 95 L920 130 L970 130 L970 170 L1020 170 L1020 110 L1060 110 L1060 65 L1100 65 L1100 105 L1140 105 L1140 150 L1190 150 L1190 85 L1230 85 L1230 125 L1280 125 L1280 160 L1330 160 L1330 100 L1370 100 L1370 140 L1440 140 L1440 200 Z";

const skylineFront =
  "M0 200 L0 160 L50 160 L50 130 L100 130 L100 170 L150 170 L150 140 L200 140 L200 180 L260 180 L260 145 L310 145 L310 175 L360 175 L360 150 L420 150 L420 185 L480 185 L480 155 L540 155 L540 130 L590 130 L590 170 L650 170 L650 145 L700 145 L700 175 L760 175 L760 150 L820 150 L820 185 L880 185 L880 155 L940 155 L940 130 L1000 130 L1000 170 L1060 170 L1060 145 L1120 145 L1120 180 L1180 180 L1180 150 L1240 150 L1240 175 L1300 175 L1300 140 L1360 140 L1360 170 L1440 170 L1440 200 Z";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#eef2fb]">
      {/* Latar skyline kota */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38vh] w-full text-[#1A237E]"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={skylineBack} fill="currentColor" opacity="0.06" />
        <path d={skylineFront} fill="currentColor" opacity="0.1" />
      </svg>

      {/* Panel kiri: branding */}
      <div className="relative z-10 hidden flex-1 flex-col items-center justify-center lg:flex">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-600 text-white shadow-xl shadow-red-600/25">
            <ShieldIcon className="h-10 w-10" />
          </div>
          <p className="mt-6 text-3xl font-bold tracking-tight text-zinc-900">Kesbangpol</p>
          <p className="mt-1 text-sm text-zinc-500">Sistem Informasi Hibah</p>
          <p className="mt-8 max-w-sm text-sm leading-6 text-zinc-500">
            Kelola hibah daerah lebih mudah, transparan, dan akuntabel.
          </p>
        </div>
      </div>

      {/* Panel kanan: form login */}
      <div className="relative z-10 flex w-full items-center justify-center px-4 py-12 sm:px-8 lg:w-auto lg:min-w-[700px] lg:justify-end lg:py-16 lg:pr-16 xl:pr-24">
        <div className="w-full max-w-2xl">
          {/* Branding versi mobile */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white">
              <ShieldIcon className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="text-lg font-bold tracking-tight text-zinc-900">Kesbangpol</p>
              <p className="text-xs text-zinc-500">Sistem Informasi Hibah</p>
            </div>
          </div>

          {/* Kartu login */}
          <div className="rounded-lg border border-zinc-200 bg-white px-12 py-14 shadow-xl shadow-zinc-900/5 sm:px-14">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
