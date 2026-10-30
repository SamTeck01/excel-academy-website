"use client";
import { useEffect, useState } from "react";
import { api, useStore } from "@/lib/client";

/** Paystack brings the student back here; we confirm and send them to learn. */
export default function PaymentComplete() {
  const { ready, user, clearCart, refreshOwned } = useStore();
  const [state, setState] = useState<"checking" | "ok" | "pending">("checking"),
    [course, setCourse] = useState("");

  useEffect(() => {
    if (!ready) return;
    const q = new URLSearchParams(location.search);
    const ref = q.get("reference") || q.get("trxref");
    setCourse(q.get("course") || "");
    if (!ref || !user) return setState("pending");
    api(`/payment/verify-payment/${encodeURIComponent(ref)}`)
      .then(async () => {
        clearCart();
        await refreshOwned();
        setState("ok");
      })
      .catch(() => setState("pending"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user]);

  return (
    <main className="container section store-empty" style={{ minHeight: "50vh" }}>
      {state === "checking" && <h1>Confirming your payment…</h1>}
      {state === "ok" && (
        <>
          <h1>Payment confirmed 🎉</h1>
          <p>Your course is unlocked here and in the Excel Academy app.</p>
          <a className="btn btn--primary" href={course ? `/learn/${course}` : "/dashboard/courses"}>Start learning</a>
        </>
      )}
      {state === "pending" && (
        <>
          <h1>Payment received</h1>
          <p>If you were charged, your course unlocks within a few minutes. Check My learning shortly.</p>
          <a className="btn btn--primary" href="/dashboard">Go to My learning</a>
        </>
      )}
    </main>
  );
}
