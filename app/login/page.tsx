import type { Metadata } from "next";
import LoginForm from "../../components/login-form";
import {
  BuildingIcon,
  ChartIcon,
  DocumentIcon,
  ShieldIcon,
} from "../../components/icons";

export const metadata: Metadata = {
  title: "Masuk | Kesbangpol",
  description: "Masuk ke Sistem Informasi Hibah Kesbangpol",
};

const features = [
  {
    icon: DocumentIcon,
    title: "Pengajuan Hibah Digital",
    desc: "Ajukan dan pantau proposal hibah secara online tanpa antre.",
  },
  {
    icon: ChartIcon,
    title: "Realisasi Transparan",
    desc: "Lacak pencairan dana dan realisasi anggaran secara real-time.",
  },
  {
    icon: BuildingIcon,
    title: "Terintegrasi Instansi",
    desc: "Terhubung dengan seluruh instansi penerima hibah di daerah.",
  },
];

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left branding panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-500 p-10 text-white lg:flex xl:p-14">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-1/3 top-1/2 h-40 w-40 rounded-full bg-white/5" />

        {/* Brand */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-red-600 shadow-lg shadow-red-950/30">
            <ShieldIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">Kesbangpol</p>
            <p className="text-xs text-red-100">Sistem Informasi Hibah</p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative max-w-md">
          <h1 className="text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
            Kelola hibah daerah lebih mudah, transparan, dan akuntabel.
          </h1>
          <p className="mt-4 text-sm leading-6 text-red-100">
            Platform resmi Badan Kesatuan Bangsa dan Politik untuk pengajuan, verifikasi, dan
            pelaporan hibah secara digital.
          </p>

          {/* Features */}
          <ul className="mt-8 space-y-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{f.title}</p>
                    <p className="text-xs text-red-100">{f.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer */}
        <p className="relative text-xs text-red-200">
          (c) 2026 Kesbangpol. Seluruh hak cipta dilindungi undang-undang.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-6 py-12 sm:px-10 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30">
              <ShieldIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-zinc-900">Kesbangpol</p>
              <p className="text-xs text-zinc-500">Sistem Informasi Hibah</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Selamat datang kembali</h2>
          <p className="mt-1.5 text-sm text-zinc-500">
            Masuk menggunakan akun resmi Anda untuk melanjutkan.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
