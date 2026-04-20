"use client";

import { usePathname } from "next/navigation";

export function HideOnAuth({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;
  return <>{children}</>;
}
