"use client";
import { ModeProvider } from "@/context/mode-context";
import { NotificationProvider } from "@/context/notification-context";
import { HibahProvider } from "@/context/hibah-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <ModeProvider>
        <HibahProvider>{children}</HibahProvider>
      </ModeProvider>
    </NotificationProvider>
  );
}