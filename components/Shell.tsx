"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { api, authError, useStore } from "@/lib/client";
import { dashUrl } from "@/lib/hosts";
import { naira, thumb } from "@/lib/catalogue";

const NAV = [
  ["/", "Home"],
  ["/courses", "Courses"],
  ["/about", "About"],
  ["/contact", "Contact"],
] as const;
const TUTOR = "https://wa.me/2348094579949?text=Hello%20Excel%20Academy%2C%20I%27d%20like%20to%20become%20a%20tutor.";

/** The site navbar (design: Figma "Navbar"), with the student's account and cart. */
export function Navbar() {
  const path = usePathname();
  const { student, cart, setCartOpen, requireLogin } = useStore();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  const account = student ? (
    <span className="store-user">
      <span className="navbar__login">Hi, {student}</span>
      <a href={dashUrl("/dashboard")} className="btn btn--primary btn--sm">My dashboard</a>
    </span>
  ) : (
    <>
      <button type="button" className="navbar__login linklike" onClick={() => requireLogin()}>Log in</button>
      <a href="/signup" className="btn btn--primary btn--sm">Get started</a>
    </>
  );

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a href="/" className="logo" aria-label="Excel Academy home">
          <img src="/img/logo.webp" alt="" width={52} height={38} />
          <span>Excel Academy</span>
        </a>
        <span className="navbar__divider" aria-hidden="true" />
        <nav className="navbar__links" id="site-nav" aria-label="Main">
          {NAV.map(([href, label]) => (
            <a key={href} href={href} className={active(href) ? "is-active" : undefined} aria-current={active(href) ? "page" : undefined}>
              {label}
            </a>
          ))}
          <a href={TUTOR} target="_blank" rel="noopener">Become a tutor</a>
          <div className="navbar__mobile-actions">{account}</div>
        </nav>
        <div className="navbar__actions">
          <button type="button" className="cart-btn" aria-label={`Cart, ${cart.length} items`} onClick={() => setCartOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {cart.length > 0 && <span className="cart-btn__count">{cart.length}</span>}
          </button>
          {account}
        </div>
        {/* Phones: the cart sits next to the menu button (the desktop actions are hidden). */}
        <button type="button" className="cart-btn cart-btn--mobile" aria-label={`Cart, ${cart.length} items`} onClick={() => setCartOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          {cart.length > 0 && <span className="cart-btn__count">{cart.length}</span>}
        </button>
        <button className="navbar__toggle" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}

/** Sign in / create account (same Firebase account as the app). */
export function AuthForm({ initialMode = "in", onDone }: { initialMode?: "in" | "up"; onDone?: () => void }) {
  const { login, signup, google, resetPassword } = useStore();
  const [mode, setMode] = useState(initialMode),
    [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [busy, setBusy] = useState(false),
    [msg, setMsg] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      if (mode === "in") await login(email.trim(), password);
      else await signup(name.trim(), email.trim(), password);
      onDone?.();
    } catch (err) {
      setMsg(authError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <button type="button" className="auth-google" onClick={async () => {
        setMsg("");
        try { await google(); onDone?.(); } catch (err) { setMsg(authError(err)); }
      }}>
        <img src="/img/google.svg" alt="" width={18} height={18} /> Continue with Google
      </button>
      <div className="auth-or">or with email</div>
      {mode === "up" && <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Full name" required />}
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="Email address" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
        autoComplete={mode === "in" ? "current-password" : "new-password"} placeholder="Password" required minLength={6} />
      <div className="auth-error" role="alert">{msg}</div>
      <button type="submit" className="btn btn--primary" disabled={busy}>
        {busy ? "Please wait…" : mode === "in" ? "Log in" : "Create account"}
      </button>
      {mode === "in" && (
        <button type="button" className="auth-switch" onClick={async () => {
          if (!email.trim()) return setMsg("Type your email first, then tap Forgot password.");
          try { await resetPassword(email.trim()); setMsg("Check your email for a link to reset your password."); } catch (err) { setMsg(authError(err)); }
        }}>Forgot password?</button>
      )}
      <button type="button" className="auth-switch" onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(""); }}>
        {mode === "in" ? "New here? Create an account" : "Have an account? Log in"}
      </button>
    </form>
  );
}

/** Pops up when something needs a signed-in student. */
export function AuthDialog() {
  const { authPrompt, closeAuth } = useStore();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (authPrompt && !d.open) d.showModal();
    if (!authPrompt && d.open) d.close();
  }, [authPrompt]);
  return (
    <dialog ref={ref} className="auth-dialog" onClose={closeAuth} aria-label="Log in">
      <button type="button" className="auth-close" onClick={closeAuth} aria-label="Close">×</button>
      <div className="auth-dialog__body">
        <h2>Log in</h2>
        <p>{authPrompt?.reason}</p>
        {authPrompt && <AuthForm />}
      </div>
    </dialog>
  );
}

/** Slide-in cart; one Paystack checkout for everything in it (same as the app). */
export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, clearCart, user, requireLogin, owned } = useStore();
  const [busy, setBusy] = useState(false),
    [err, setErr] = useState("");
  const items = cart.filter((c) => !owned.has(c.id));
  const total = items.reduce((s, c) => s + (Number(c.price) || 0), 0);

  const checkout = async () => {
    if (!user) return requireLogin("Log in to complete your purchase", checkout);
    setBusy(true);
    setErr("");
    try {
      const r = await api<{ data: { authorization_url: string } }>("/payment/initialize-payment", {
        method: "POST",
        body: JSON.stringify({ courseIds: items.map((c) => c.id), returnTo: `${location.origin}/dashboard/payment` }),
      });
      location.href = r.data.authorization_url;
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <>
      <div className={`drawer-backdrop${cartOpen ? " is-open" : ""}`} onClick={() => setCartOpen(false)} />
      <aside className={`drawer${cartOpen ? " is-open" : ""}`} aria-label="Cart" aria-hidden={!cartOpen}>
        <div className="drawer__head">
          <h2>Your cart</h2>
          <button type="button" className="auth-close" onClick={() => setCartOpen(false)} aria-label="Close cart">×</button>
        </div>
        {items.length === 0 ? (
          <p className="drawer__empty">Your cart is empty. <a href={user ? "/dashboard/explore" : "/courses"}>Browse courses</a></p>
        ) : (
          <>
            <ul className="drawer__list">
              {items.map((c) => (
                <li key={c.id}>
                  <img src={thumb(c)} alt="" />
                  <div>
                    <strong>{c.title}</strong>
                    <span>{naira(c.price)}</span>
                  </div>
                  <button type="button" onClick={() => removeFromCart(c.id)} aria-label={`Remove ${c.title}`}>Remove</button>
                </li>
              ))}
            </ul>
            <div className="drawer__foot">
              {total >= 100000 && <p className="drawer__bonus">🎁 This order earns ₦3,500 off your next purchase.</p>}
              <div className="drawer__total"><span>Total</span><strong>{naira(total)}</strong></div>
              <p className="drawer__note">Any gift-box credit you have comes off at checkout.</p>
              {err && <p className="auth-error">{err}</p>}
              <button type="button" className="btn btn--primary" disabled={busy} onClick={checkout}>
                {busy ? "Opening Paystack…" : "Checkout"}
              </button>
              <button type="button" className="auth-switch" onClick={clearCart}>Clear cart</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
