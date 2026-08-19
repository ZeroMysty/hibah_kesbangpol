"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMode } from "@/context/mode-context";
import DashboardShell from "../../components/dashboard-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, getUrl } = useMode();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // Redirect legacy routes to enterprise portal URL structure
    if (!pathname.startsWith("/portal/u/")) {
      const slug = pathname.replace(/^\//, "") || "Beranda";
      const targetSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
      router.replace(getUrl(targetSlug || "Beranda"));
    }
  }, [pathname, isLoggedIn, router, getUrl]);

  return <DashboardShell>{children}</DashboardShell>;
}
