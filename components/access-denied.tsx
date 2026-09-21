import Link from "next/link";
import { LockIcon } from "./icons";

type AccessDeniedProps = {
  homeUrl: string;
  title?: string;
  description?: string;
};

/**
 * AccessDenied - Tampilan "Akses Terbatas" untuk halaman admin-only.
 *
 * @example
 * const { mode, getHomeUrl } = useMode();
 * if (mode !== "admin") return <AccessDenied homeUrl={getHomeUrl()} />;
 */
export default function AccessDenied({
  homeUrl,
  title = "Akses Terbatas",
  description = "Halaman ini hanya dapat diakses oleh Administrator. Hubungi admin jika kamu memerlukan perubahan data.",
}: AccessDeniedProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <LockIcon className="h-8 w-8" />
      </div>
      <div>
        <h1 className="text-lg font-bold text-zinc-900">{title}</h1>
        <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
      </div>
      <Link
        href={homeUrl}
        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-500 active:scale-[0.98]"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
