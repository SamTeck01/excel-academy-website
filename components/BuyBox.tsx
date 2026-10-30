"use client";
import { useState } from "react";
import type { Course } from "@/lib/catalogue";
import { api, useStore } from "@/lib/client";

/** Figma "Add to cart" / "Buy now" pair; "Continue learning" once enrolled. */
export function BuyButtons({ course }: { course: Course }) {
  const { user, owned, requireLogin, addToCart, cart, setCartOpen, refreshOwned } = useStore();
  const [busy, setBusy] = useState(false),
    [err, setErr] = useState("");
  const inCart = cart.some((c) => c.id === course.id);

  if (owned.has(course.id)) {
    return (
      <div className="buy-pair">
        <a className="pill-btn pill-btn--solid" href={`/learn/${course.id}`}>Continue learning</a>
      </div>
    );
  }

  // Nothing to watch yet: no buying until the lessons are uploaded.
  if (!course.lessonCount) {
    return (
      <div className="buy-pair">
        <span className="pill-btn" aria-disabled="true">Coming soon - lessons are being uploaded</span>
      </div>
    );
  }

  const buyNow = async () => {
    if (!user) return requireLogin(course.isFree ? "Log in to enroll in this course" : "Log in to buy this course", buyNow);
    setBusy(true);
    setErr("");
    try {
      if (course.isFree) {
        await api("/students/enroll-free", { method: "POST", body: JSON.stringify({ courseId: course.id }) });
        await refreshOwned();
        location.href = `/learn/${course.id}`;
        return;
      }
      const r = await api<{ data: { authorization_url: string } }>("/payment/initialize-payment", {
        method: "POST",
        body: JSON.stringify({ courseIds: [course.id], returnTo: `${location.origin}/payment/complete?course=${course.id}` }),
      });
      location.href = r.data.authorization_url;
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className="buy-pair">
      {!course.isFree && (
        <button type="button" className="pill-btn" onClick={() => { if (!inCart) addToCart(course); setCartOpen(true); }}>
          {inCart ? "View cart" : "Add to cart"}
        </button>
      )}
      <button type="button" className="pill-btn pill-btn--solid" disabled={busy} onClick={buyNow}>
        {busy ? "Please wait…" : course.isFree ? "Enroll for free" : "Buy now"}
      </button>
      {err && <p className="auth-error buy-pair__err">{err}</p>}
    </div>
  );
}
