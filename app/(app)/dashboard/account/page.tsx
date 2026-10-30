"use client";
import { useEffect, useState, type FormEvent } from "react";
import { api, auth, authError, profileRef, setDoc, updateProfile, useStore } from "@/lib/client";
import { naira } from "@/lib/catalogue";

type Order = { reference: string; amount: number; paidAt?: string; courses?: { title?: string }[]; courseIds?: string[] };

/** The student's account: name, password, purchases, sign out. */
export default function AccountPage() {
  const { user, ready, logout, resetPassword } = useStore();
  const [name, setName] = useState(""),
    [phone, setPhone] = useState(""),
    [saving, setSaving] = useState(false),
    [msg, setMsg] = useState(""),
    [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      location.href = "/login?next=/dashboard/account";
      return;
    }
    setName(user.displayName || "");
    api<{ data?: Order[] | { orders?: Order[] } }>("/students/orders")
      .then((r) => setOrders(Array.isArray(r.data) ? r.data : r.data?.orders || []))
      .catch(() => setOrders([]));
  }, [ready, user]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setSaving(true);
    setMsg("");
    try {
      await updateProfile(auth.currentUser, { displayName: name.trim() });
      // The same profile the app shows (merge: only these fields change).
      await setDoc(profileRef(auth.currentUser.uid), { name: name.trim(), username: name.trim(), ...(phone ? { phoneNumber: phone.trim() } : {}) }, { merge: true });
      setMsg("Saved.");
    } catch (err) {
      setMsg(authError(err) || "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!ready || !user) return <main className="container section"><div className="sk" style={{ height: 240 }} /></main>;
  const google = user.providerData.some((p) => p.providerId === "google.com");

  return (
    <main className="container section account">
      <h1 className="section-title">My account</h1>
      <div className="account__grid">
        <form className="account__card auth-form" onSubmit={save}>
          <h2>Profile</h2>
          <label>Full name<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required /></label>
          <label>Phone number (optional)<input value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" /></label>
          <label>Email<input value={user.email || ""} disabled /></label>
          <button className="btn btn--primary" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
          <p className="auth-error" role="status">{msg}</p>
        </form>

        <div className="account__card">
          <h2>Password</h2>
          {google ? (
            <p>You sign in with Google, so there's no Excel Academy password to change.</p>
          ) : (
            <>
              <p>We'll email you a secure link to set a new password.</p>
              <button className="btn btn--ghost" onClick={async () => {
                try { await resetPassword(user.email || ""); setMsg("Password reset email sent - check your inbox."); } catch (err) { setMsg(authError(err)); }
              }}>Email me a reset link</button>
            </>
          )}
          <h2 style={{ marginTop: 28 }}>Signed in</h2>
          <p>Your account works on this website and in the Excel Academy app. In the app, an account can be used on one phone at a time.</p>
          <button className="btn btn--ghost" onClick={async () => { await logout(); location.href = "/"; }}>Log out</button>
        </div>

        <div className="account__card account__orders">
          <h2>Purchases</h2>
          {!orders ? <div className="sk" style={{ height: 80 }} /> : !orders.length ? (
            <p>No purchases yet. <a href="/courses">Browse courses</a></p>
          ) : (
            <ul>
              {orders.map((o) => (
                <li key={o.reference}>
                  <span>{(o.courses || []).map((c) => c.title).filter(Boolean).join(", ") || `${(o.courseIds || []).length} course(s)`}</span>
                  <strong>{naira(o.amount)}</strong>
                  <small>{o.paidAt ? new Date(o.paidAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : ""}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
