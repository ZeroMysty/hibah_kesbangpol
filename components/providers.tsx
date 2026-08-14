"use client";

import { ModeProvider } from "@/context/mode-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ModeProvider>{children}</ModeProvider>;
}
