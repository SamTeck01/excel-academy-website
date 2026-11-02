"use client";
import type { ReactNode } from "react";
import { useStore } from "@/lib/client";
import { dashUrl } from "@/lib/hosts";

/** A website call to action: new visitors go to the courses, students straight to their dashboard. */
export function CtaLink({ className, children, href = "/courses" }: { className?: string; children: ReactNode; href?: string }) {
  const { student } = useStore();
  return student ? (
    <a href={dashUrl("/dashboard")} className={className}>Go to my dashboard</a>
  ) : (
    <a href={href} className={className}>{children}</a>
  );
}
