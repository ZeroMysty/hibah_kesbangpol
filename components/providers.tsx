"use client";

import { ModeProvider } from "@/context/mode-context";
import { HibahProvider } from "@/context/hibah-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ModeProvider>
      <HibahProvider>{children}</HibahProvider>
    </ModeProvider>
  );
}
