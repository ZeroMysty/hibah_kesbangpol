"use client";

import { CalendarIcon } from "./icons";

export default function CurrentDate() {
  return (
    <p
      className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500"
      suppressHydrationWarning
    >
      <CalendarIcon className="h-4 w-4" />
      {new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </p>
  );
}
