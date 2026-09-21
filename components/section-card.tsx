import type { ReactNode } from "react";

type SectionCardProps = {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
};

/**
 * SectionCard - Wrapper card standar untuk panel/seksi di dashboard.
 *
 * @example
 * <SectionCard>...</SectionCard>
 * <SectionCard padding="sm" className="mt-4">...</SectionCard>
 */
export default function SectionCard({
  children,
  className = "",
  padding = "md",
}: SectionCardProps) {
  const padMap = {
    none: "",
    sm: "p-4",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
  };
  return (
    <div
      className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${padMap[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
