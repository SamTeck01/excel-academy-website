import type { Metadata } from "next";
import { AuthPage } from "@/components/AuthPage";

export const metadata: Metadata = { title: "Sign up | Excel Academy" };
export default function Page() {
  return <AuthPage mode="up" />;
}
