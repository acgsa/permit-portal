"use client";
import { useAuth } from "@/contexts/AuthContext";
import { USGRibbon } from "@/components/USGRibbon";

export function USGRibbonConditional({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return (
    <>
      {!token && <USGRibbon />}
      {children}
    </>
  );
}
