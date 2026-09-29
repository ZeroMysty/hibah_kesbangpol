import type { ElementType, ReactNode } from "react";

export type StatCardProps = {
  label: string;
  value: string | number;
  delta?: string | ReactNode;
  sub?: string | ReactNode;
  icon?: ElementType<{ className?: string }>;
  accent?: string;
  iconBg?: string;
  className?: string;
  onClick?: () => void;
};

/**
 * StatCard - Komponen kartu metrik statistik terstandarisasi.
 * Menyatukan bentuk kartu, padding, icon badge, dan accent bar di seluruh aplikasi.
 */
export default function StatCard({
  label,
  value,
  delta,
  sub,
  icon: Icon,
  accent,
  iconBg = "bg-red-50 text-red-600",
  className = "",
  onClick,
}: StatCardProps) {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs transition hover:shadow-md ${
        isClickable ? "cursor-pointer active:scale-[0.98]" : ""
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-500 line-clamp-1">{label}</span>
        {Icon && (
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${iconBg}`}>
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-2xl font-bold tracking-tight text-zinc-900 truncate" title={String(value)}>
          {value}
        </p>
        {(delta || sub) && (
          <div className="mt-1 flex flex-col gap-0.5">
            {delta && <span className="text-[11px] font-medium text-zinc-500 truncate">{delta}</span>}
            {sub && <span className="text-[10px] text-zinc-400 font-normal truncate">{sub}</span>}
          </div>
        )}
      </div>

      {accent && <div className={`absolute bottom-0 left-0 right-0 h-1 ${accent}`} />}
    </div>
  );
}
