"use client";
import { useEffect } from "react";
import { AuthForm } from "./Shell";
import { useStore } from "@/lib/client";

/** Figma "Login" / "Sign up" pages. */
export function AuthPage({ mode }: { mode: "in" | "up" }) {
  const { user, ready } = useStore();
  const next = () => {
    const to = new URLSearchParams(location.search).get("next") || "/dashboard";
    location.href = to.startsWith("/") && !to.startsWith("//") ? to : "/dashboard";
  };
  useEffect(() => {
    if (ready && user) next();
  }, [ready, user]);
  return (
    <main className="auth-page">
      <div className="auth-page__card">
        <h1>{mode === "in" ? "Welcome back" : "Create your account"}</h1>
        <p>{mode === "in" ? "Log in to continue learning." : "Start learning with Excel Academy - the same account works in the app."}</p>
        <AuthForm initialMode={mode} onDone={next} />
      </div>
    </main>
  );
}
