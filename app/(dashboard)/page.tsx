import Link from "next/link";
import {
  BuildingIcon,
  ChartIcon,
  ChevronRightIcon,
  ClockIcon,
  DocumentIcon,
  DownloadIcon,
  FolderIcon,
  MoneyIcon,
  PlusIcon,
  TrendDownIcon,
  TrendUpIcon,
} from "../../components/icons";
import CurrentDate from "../../components/current-date";
import StatusBadge from "../../components/status-badge";

// ---------- Static data ----------

const stats = [
  {
    label: "Total Proposal",
    value: "1.248",
    delta: "+12,5%",
    up: true,
    icon: DocumentIcon,
    accent: "bg-red-500",
    iconBg: "bg-red-50 text-red-600",
  },
  {
    label: "Dana Tersalurkan",
    value: "Rp 4,2 M",
    delta: "+8,2%",
    up: true,
    icon: MoneyIcon,
    accent: "bg-emerald-500",
    iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Menunggu Verifikasi",
    value: "37",
    delta: "-4,1%",
    up: false,
    icon: ClockIcon,
    accent: "bg-amber-500",
    iconBg: "bg-amber-50 text-amber-600",
  },
  {
    label: "Instansi Penerima",
    value: "86",
    delta: "+2,3%",
    up: true,
    icon: BuildingIcon,
    accent: "bg-rose-500",
    iconBg: "bg-rose-50 text-rose-600",
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
  { label: "Disetujui", value: 62, color: "#dc2626" },
  { label: "Menunggu", value: 25, color: "#f59e0b" },
  { label: "Ditolak", value: 13, color: "#a1a1aa" },
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

// ---------- Components ----------

function StatCard({
  stat,
}: {
  stat: (typeof stats)[number];
}) {
  const Icon = stat.icon;
  const DeltaIcon = stat.up ? TrendUpIcon : TrendDownIcon;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className={`absolute inset-x-0 top-0 h-0.5 ${stat.accent} opacity-80`} />
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            stat.up
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          <DeltaIcon className="h-3 w-3" />
          {stat.delta}
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight">{stat.value}</p>
      <p className="mt-0.5 text-sm text-zinc-500">{stat.label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const maxValue = Math.max(...monthlyData.map((d) => d.value));
  const circumference = 2 * Math.PI * 52;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
          <CurrentDate />
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/laporan"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-zinc-400 hover:bg-zinc-50"
          >
            <DownloadIcon className="h-4 w-4" />
            Unduh Laporan
          </Link>
          <button className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-500 hover:shadow-red-500/30 active:scale-[0.98]">
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
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Dana Tersalurkan</h2>
              <p className="text-sm text-zinc-500">
                Realisasi per bulan (dalam juta rupiah)
              </p>
            </div>
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
              Tahun 2026
            </span>
          </div>
          <div className="flex h-56 items-end gap-3 sm:gap-5">
            {monthlyData.map((d) => (
              <div key={d.month} className="group flex h-full flex-1 flex-col items-center gap-2">
                <span className="text-[11px] font-semibold text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100">
                  {d.value}
                </span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-red-600 to-rose-400 transition-all duration-300 group-hover:from-red-500 group-hover:to-rose-300"
                    style={{ height: `${(d.value / maxValue) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-zinc-500">
                  {d.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut chart */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold">Status Proposal</h2>
          <p className="text-sm text-zinc-500">Distribusi keseluruhan</p>

          <div className="relative mx-auto mt-6 h-44 w-44">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                strokeWidth="14"
                className="stroke-zinc-100"
              />
              {donutSegments.map((seg, i) => {
                const dash = (seg.value / 100) * circumference;
                const prevOffset = donutSegments
                  .slice(0, i)
                  .reduce((acc, s) => acc + (s.value / 100) * circumference, 0);
                return (
                  <circle
                    key={seg.label}
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    strokeWidth="14"
                    stroke={seg.color}
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    strokeDashoffset={-prevOffset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold">1.248</p>
              <p className="text-xs text-zinc-500">Total Proposal</p>
            </div>
          </div>

          <ul className="mt-6 space-y-3">
            {donutSegments.map((seg) => (
              <li key={seg.label} className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="flex-1 text-sm text-zinc-600">
                  {seg.label}
                </span>
                <span className="text-sm font-semibold">{seg.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <FolderIcon className="h-5 w-5 text-red-500" />
            <h2 className="text-base font-semibold">Proposal Hibah Terbaru</h2>
          </div>
          <Link
            href="/hibah"
            className="inline-flex items-center gap-1 text-sm font-medium text-red-600 transition-colors hover:text-red-500"
          >
            Lihat semua
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-400">
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
                  className="border-b border-zinc-50 transition-colors last:border-0 hover:bg-zinc-50/70"
                >
                  <td className="px-5 py-4 font-medium">{p.name}</td>
                  <td className="px-5 py-4 text-zinc-500">{p.instansi}</td>
                  <td className="px-5 py-4 font-semibold tabular-nums">{p.nominal}</td>
                  <td className="px-5 py-4 text-zinc-500">{p.tanggal}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
        <ChartIcon className="h-3.5 w-3.5" />
        Data diperbarui setiap 24 jam · Sistem Informasi Hibah Kesbangpol
      </p>
    </div>
  );
}
