import type { ReactNode } from "react";

export type AlertBannerVariant = "amber" | "rose" | "blue" | "zinc" | "emerald" | "red";

export type AlertBannerProps = {
  variant?: AlertBannerVariant;
  icon?: ReactNode;
  iconBox?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  size?: "sm" | "md";
};

const VARIANT_STYLES: Record<
  AlertBannerVariant,
  {
    container: string;
    iconBg: string;
    title: string;
    description: string;
  }
> = {
  amber: {
    container: "border-amber-200 bg-amber-50/90",
    iconBg: "bg-amber-100 text-amber-700",
    title: "text-amber-900",
    description: "text-amber-700",
  },
  rose: {
    container: "border-rose-200 bg-rose-50/90",
    iconBg: "bg-rose-100 text-rose-700",
    title: "text-rose-900",
    description: "text-rose-700",
  },
  red: {
    container: "border-rose-200 bg-rose-50/90",
    iconBg: "bg-rose-100 text-rose-700",
    title: "text-rose-900",
    description: "text-rose-700",
  },
  blue: {
    container: "border-blue-100 bg-blue-50/70",
    iconBg: "bg-blue-100 text-blue-700",
    title: "text-blue-900",
    description: "text-blue-700",
  },
  zinc: {
    container: "border-zinc-200 bg-zinc-100",
    iconBg: "bg-zinc-200 text-zinc-700",
    title: "text-zinc-900",
    description: "text-zinc-600",
  },
  emerald: {
    container: "border-emerald-200 bg-emerald-50/90",
    iconBg: "bg-emerald-100 text-emerald-700",
    title: "text-emerald-900",
    description: "text-emerald-700",
  },
};

/**
 * AlertBanner - Komponen banner notifikasi & peringatan terstandarisasi.
 * Menyatukan bentuk border-radius, background tint, tata letak ikon, teks, dan tombol aksi.
 */
export default function AlertBanner({
  variant = "amber",
  icon,
  iconBox = true,
  title,
  description,
  action,
  children,
  className = "",
  size = "md",
}: AlertBannerProps) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.amber;
  const paddingClass = size === "sm" ? "px-4 py-2.5" : "p-4";
  const bodyContent = description ?? children;

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl border ${styles.container} ${paddingClass} shadow-xs ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon &&
          (iconBox ? (
            <div
              className={`flex shrink-0 items-center justify-center rounded-xl ${styles.iconBg} ${
                size === "sm" ? "h-7 w-7 text-xs" : "h-10 w-10"
              }`}
            >
              {icon}
            </div>
          ) : (
            <div className="shrink-0 flex items-center">{icon}</div>
          ))}
        <div className="min-w-0">
          {title && <p className={`text-sm font-bold ${styles.title}`}>{title}</p>}
          {bodyContent && (
            <div className={`text-xs ${styles.description} leading-relaxed`}>{bodyContent}</div>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
