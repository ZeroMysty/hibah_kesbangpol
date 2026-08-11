import {
  BuildingIcon,
  CalendarIcon,
  ChartIcon,
  ClockIcon,
  DocumentIcon,
  DownloadIcon,
  FolderIcon,
  MoneyIcon,
  PlusIcon,
  TrendDownIcon,
  TrendUpIcon,
} from "../components/icons";

// ---------- Static data ----------

const stats = [
  {
    label: "Total Proposal",
    value: "1.248",
    delta: "+12,5%",
    up: true,
    icon: DocumentIcon,
    accent: "bg-indigo-500",
    iconBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  },
  {
    label: "Dana Tersalurkan",
    value: "Rp 4,2 M",
    delta: "+8,2%",
    up: true,
    icon: MoneyIcon,
    accent: "bg-emerald-500",
    iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    label: "Menunggu Verifikasi",
    value: "37",
    delta: "-4,1%",
    up: false,
    icon: ClockIcon,
    accent: "bg-amber-500",
    iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },
  {
    label: "Instansi Penerima",
    value: "86",
    delta: "+2,3%",
    up: true,
    icon: BuildingIcon,
    accent: "bg-violet-500",
    iconBg: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  },
];

const monthlyData = [
  { month: "Jan", value: 420 },
  { month: "Feb", value: 380 },
  { month: "Mar", value: 510 },
  { month: "Apr", value: 460 },
  { month: "Mei", value: 620 },
  { month: "Jun", value: 540 },
  { month: "Jul", value: 720 },
];

const donutSegments = [
  { label: "Disetujui", value: 62, color: "#6366f1" },
  { label: "Menunggu", value: 25, color: "#f59e0b" },
  { label: "Ditolak", value: 13, color: "#ef4444" },
];

const proposals = [
  {
    name: "Revitalisasi Taman Budaya",
    instansi: "Dinas Kebudayaan Kota",
    nominal: "Rp 250.000.000",
    tanggal: "05 Agu 2026",
    status: "Disetujui",
  },
  {
    name: "Penguatan Kapasitas FKUB",
    instansi: "FKUB Kota",
    nominal: "Rp 85.000.000",
    tanggal: "04 Agu 2026",
    status: "Menunggu",
  },
  {
    name: "Festival Kerukunan Antar Umat",
    instansi: "Panitia FKUB",
    nominal: "Rp 120.000.000",
    tanggal: "01 Agu 2026",
    status: "Disetujui",
  },
  {
    name: "Pelatihan Wawasan Kebangsaan",
    instansi: "SMPN 4 Kota",
    nominal: "Rp 45.000.000",
    tanggal: "29 Jul 2026",
    status: "Ditolak",
  },
  {
    name: "Dialog Kebangsaan Mahasiswa",
    instansi: "Universitas Negeri",
    nominal: "Rp 60.000.000",
    tanggal: "27 Jul 2026",
    status: "Menunggu",
  },
];

const statusStyles: Record<string, string> = {
  Disetujui:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20",
  Menunggu:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-400/20",
  Ditolak:
    "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-400/20",
};

// ---------- Components ----------

function StatCard({
  stat,
}: {
  stat: (typeof stats)[number];
}) {
  const Icon = stat.icon;
  const DeltaIcon = stat.up ? TrendUpIcon : TrendDownIcon;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className={`absolute inset-x-0 top-0 h-0.5 ${stat.accent} opacity-80`} />
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            stat.up
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
          }`}
        >
          <DeltaIcon className="h-3 w-3" />
          {stat.delta}
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight">{stat.value}</p>
      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const maxValue = Math.max(...monthlyData.map((d) => d.value));
  const circumference = 2 * Math.PI * 52;
  let offset = 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            <CalendarIcon className="h-4 w-4" />
            {today}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">
            <DownloadIcon className="h-4 w-4" />
            Unduh Laporan
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 active:scale-[0.98]">
            <PlusIcon className="h-4 w-4" />
            Tambah Proposal
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Bar chart */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Dana Tersalurkan</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Realisasi per bulan (dalam juta rupiah)
              </p>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              Tahun 2026
            </span>
          </div>
          <div className="flex h-56 items-end gap-3 sm:gap-5">
            {monthlyData.map((d) => (
              <div key={d.month} className="group flex flex-1 flex-col items-center gap-2">
                <span className="text-[11px] font-semibold text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-500">
                  {d.value}
                </span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-400 transition-all duration-300 group-hover:from-indigo-500 group-hover:to-violet-300 dark:from-indigo-500 dark:to-violet-600"
                    style={{ height: `${(d.value / maxValue) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {d.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut chart */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold">Status Proposal</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Distribusi keseluruhan</p>

          <div className="relative mx-auto mt-6 h-44 w-44">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                strokeWidth="14"
                className="stroke-zinc-100 dark:stroke-zinc-800"
              />
              {donutSegments.map((seg) => {
                const dash = (seg.value / 100) * circumference;
                const el = (
                  <circle
                    key={seg.label}
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    strokeWidth="14"
                    stroke={seg.color}
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    strokeDashoffset={-offset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                );
                offset += dash;
                return el;
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold">1.248</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Proposal</p>
            </div>
          </div>

          <ul className="mt-6 space-y-3">
            {donutSegments.map((seg) => (
              <li key={seg.label} className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="flex-1 text-sm text-zinc-600 dark:text-zinc-300">
                  {seg.label}
                </span>
                <span className="text-sm font-semibold">{seg.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <FolderIcon className="h-5 w-5 text-indigo-500" />
            <h2 className="text-base font-semibold">Proposal Hibah Terbaru</h2>
          </div>
          <button className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400">
            Lihat semua →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
                <th className="px-5 py-3 font-semibold">Nama Hibah</th>
                <th className="px-5 py-3 font-semibold">Instansi</th>
                <th className="px-5 py-3 font-semibold">Nominal</th>
                <th className="px-5 py-3 font-semibold">Tanggal</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => (
                <tr
                  key={p.name}
                  className="border-b border-zinc-50 transition-colors last:border-0 hover:bg-zinc-50/70 dark:border-zinc-800/60 dark:hover:bg-zinc-800/40"
                >
                  <td className="px-5 py-4 font-medium">{p.name}</td>
                  <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">{p.instansi}</td>
                  <td className="px-5 py-4 font-semibold tabular-nums">{p.nominal}</td>
                  <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">{p.tanggal}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[p.status]}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
        <ChartIcon className="h-3.5 w-3.5" />
        Data diperbarui setiap 24 jam · Sistem Informasi Hibah Kesbangpol
      </p>
    </div>
  );
}
