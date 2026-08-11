import PageHeader from "../../../components/page-header";
import StatusBadge from "../../../components/status-badge";
import {
  ChartIcon,
  CheckIcon,
  ClockIcon,
  DocumentIcon,
  DownloadIcon,
  MoneyIcon,
  TrendUpIcon,
} from "../../../components/icons";

const summary = [
  {
    label: "Total Realisasi",
    value: "Rp 4,2 M",
    sub: "dari 1.248 proposal",
    icon: MoneyIcon,
    iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Target Tahunan",
    value: "Rp 6,5 M",
    sub: "anggaran hibah 2026",
    icon: ChartIcon,
    iconBg: "bg-red-50 text-red-600",
  },
  {
    label: "Persentase Capaian",
    value: "64,6%",
    sub: "+8,2% dari bulan lalu",
    icon: TrendUpIcon,
    iconBg: "bg-rose-50 text-rose-600",
  },
  {
    label: "Laporan Tersedia",
    value: "12",
    sub: "laporan bulan & tahunan",
    icon: DocumentIcon,
    iconBg: "bg-amber-50 text-amber-600",
  },
];

const reports = [
  {
    name: "Laporan Realisasi Dana Hibah",
    periode: "Juli 2026",
    size: "1,2 MB",
    status: "Final",
    type: "PDF",
  },
  {
    name: "Laporan Kinerja Triwulan II",
    periode: "Apr – Jun 2026",
    size: "860 KB",
    status: "Final",
    type: "PDF",
  },
  {
    name: "Ringkasan Anggaran Bulanan",
    periode: "Juni 2026",
    size: "540 KB",
    status: "Final",
    type: "XLSX",
  },
  {
    name: "Draft Laporan Triwulan III",
    periode: "Jul – Sep 2026",
    size: "1,1 MB",
    status: "Verifikasi",
    type: "PDF",
  },
  {
    name: "Laporan Pertanggungjawaban 2025",
    periode: "Tahunan 2025",
    size: "3,4 MB",
    status: "Final",
    type: "PDF",
  },
];

const typeColors: Record<string, string> = {
  PDF: "bg-red-50 text-red-600",
  XLSX: "bg-emerald-50 text-emerald-600",
  DOCX: "bg-sky-50 text-sky-600",
};

export default function LaporanPage() {
  const capaian = 64.6;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan"
        description="Pantau realisasi dana hibah dan unduh laporan berkala."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-500 hover:shadow-red-500/30 active:scale-[0.98]">
            <DownloadIcon className="h-4 w-4" />
            Unduh Semua
          </button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-2xl font-bold tracking-tight">{s.value}</p>
              <p className="mt-0.5 text-sm font-medium text-zinc-900">
                {s.label}
              </p>
              <p className="text-xs text-zinc-500">{s.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Realization progress */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Capaian Realisasi Tahunan</h2>
              <p className="text-sm text-zinc-500">
                Rp 4,2 M dari target Rp 6,5 M pada tahun 2026
              </p>
            </div>
            <span className="text-2xl font-bold text-red-600">
              {capaian}%
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-700"
              style={{ width: `${capaian}%` }}
            />
          </div>

          <div className="mt-8 space-y-5">
            {[
              { label: "Realisasi", value: 64.6, color: "bg-red-600" },
              { label: "Menunggu verifikasi", value: 22.4, color: "bg-amber-500" },
              { label: "Ditolak / dikembalikan", value: 13.0, color: "bg-red-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-zinc-600">{item.label}</span>
                  <span className="font-semibold">{item.value}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick summary list */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold">Ringkasan Cepat</h2>
          <p className="text-sm text-zinc-500">Status laporan terkini</p>
          <ul className="mt-5 space-y-4">
            {[
              { label: "Laporan final disetujui", value: "9", icon: CheckIcon, color: "text-emerald-500" },
              { label: "Sedang diverifikasi", value: "2", icon: ClockIcon, color: "text-amber-500" },
              { label: "Draft / belum dikirim", value: "1", icon: DocumentIcon, color: "text-zinc-400" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50 ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-zinc-500">Periode berjalan</p>
                  </div>
                  <span className="text-lg font-bold">{item.value}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Report files */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">Arsip Laporan</h2>
            <p className="text-sm text-zinc-500">
              Unduh laporan sesuai periode yang dibutuhkan
            </p>
          </div>
        </div>
        <ul className="divide-y divide-zinc-50">
          {reports.map((r) => (
            <li
              key={r.name}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-zinc-50/70"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-50">
                <DocumentIcon className="h-5 w-5 text-zinc-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.name}</p>
                <p className="text-xs text-zinc-500">
                  {r.periode} · {r.size}
                </p>
              </div>
              <span className={`hidden rounded-lg px-2 py-1 text-[11px] font-bold sm:block ${typeColors[r.type]}`}>
                {r.type}
              </span>
              <StatusBadge status={r.status} />
              <button
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                aria-label={`Unduh ${r.name}`}
              >
                <DownloadIcon className="h-3.5 w-3.5" />
                Unduh
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
