"use client";
import { useState } from "react";
import { type Course, naira, thumb } from "@/lib/catalogue";
import { api, useStore } from "@/lib/client";

/** Price card on a course page: Add to cart / Buy now, or Continue learning. */
export function BuyBox({ course }: { course: Course }) {
  const { user, owned, requireLogin, addToCart, cart, setCartOpen, refreshOwned } = useStore();
  const [busy, setBusy] = useState(false),
    [err, setErr] = useState("");
  const mine = owned.has(course.id);
  const inCart = cart.some((c) => c.id === course.id);

  const buyNow = async () => {
    if (!user) return requireLogin("Log in to buy this course", buyNow);
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
    <div className="buy-box">
      <img src={thumb(course)} alt="" />
      {mine ? (
        <>
          <p className="buy-box__owned">✓ You're enrolled</p>
          <a className="btn btn--primary" href={`/learn/${course.id}`}>Continue learning</a>
        </>
      ) : (
        <>
          <div className="buy-box__price">
            <strong>{course.isFree ? "Free" : naira(course.price)}</strong>
            {!course.isFree && course.cancelPrice && Number(course.cancelPrice) > Number(course.price) && <s>{naira(Number(course.cancelPrice))}</s>}
          </div>
          {!course.isFree && (
            <button type="button" className="btn btn--ghost" onClick={() => (inCart ? setCartOpen(true) : (addToCart(course), setCartOpen(true)))}>
              {inCart ? "In cart - view" : "Add to cart"}
            </button>
          )}
          <button type="button" className="btn btn--primary" disabled={busy} onClick={buyNow}>
            {busy ? "Please wait…" : course.isFree ? "Enroll for free" : "Buy now"}
          </button>
          {err && <p className="auth-error">{err}</p>}
          <p className="buy-box__note">Secure payment by Paystack. Learn here or in the app with the same account.</p>
        </>
      )}
    </div>
  );
}
