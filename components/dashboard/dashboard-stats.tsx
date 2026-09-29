import StatCard, { StatCardProps } from "@/components/stat-card";

type DashboardStatsProps = {
  stats: StatCardProps[];
};

/**
 * DashboardStats - Grid kartu statistik eksekutif di dashboard.
 */
export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
