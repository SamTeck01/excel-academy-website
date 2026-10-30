"use client";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/client";
import { useNotifications } from "@/lib/useApi";

type Item = { href: string; label: string; icon: ReactNode; match?: (p: string) => boolean };

const I = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />,
  courses: <><path d="M4 5h11a3 3 0 0 1 3 3v12H7a3 3 0 0 1-3-3V5Z" /><path d="M18 8h2v12" /><path d="M8 9h6M8 13h6" /></>,
  explore: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  exam: <><path d="M9 4h6l1 2h3v14H5V6h3l1-2Z" /><path d="m9 13 2 2 4-4" /></>,
  bell: <><path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2Z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  cart: <><path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></>,
  logout: <><path d="M15 4h4v16h-4" /><path d="M10 8l-4 4 4 4M6 12h10" /></>,
  site: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
};
const Icon = ({ d }: { d: ReactNode }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);

const NAV: Item[] = [
  { href: "/dashboard", label: "Home", icon: I.home, match: (p) => p === "/dashboard" },
  { href: "/dashboard/courses", label: "My courses", icon: I.courses, match: (p) => p.startsWith("/dashboard/courses") || p.startsWith("/learn") },
  { href: "/dashboard/explore", label: "Explore", icon: I.explore },
  { href: "/dashboard/mock-exams", label: "Mock exams", icon: I.exam },
  { href: "/dashboard/notifications", label: "Notifications", icon: I.bell },
  { href: "/dashboard/account", label: "Account", icon: I.user },
];
const TABS = NAV.filter((n) => n.href !== "/dashboard/notifications");

/** The student app frame (web version of the mobile app). */
export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname() || "/dashboard";
  const { user, ready, logout, cart, setCartOpen } = useStore();
  const notes = useNotifications();
  const [q, setQ] = useState("");
  const on = (n: Item) => (n.match ? n.match(path) : path.startsWith(n.href));

  // Signed-out visitors go to the login page and come straight back.
  useEffect(() => {
    if (ready && !user) location.replace(`/login?next=${encodeURIComponent(path + location.search)}`);
  }, [ready, user, path]);

  const search = (e: FormEvent) => {
    e.preventDefault();
    location.href = `/dashboard/explore?q=${encodeURIComponent(q.trim())}`;
  };

  if (!ready || !user) {
    return (
      <div className="portal-boot" aria-busy="true">
        <img src="/img/logo.webp" alt="" width={56} height={41} />
        <span>Loading your dashboard…</span>
      </div>
    );
  }

  const unread = notes.data?.unread || 0;
  const name = user.displayName || user.email?.split("@")[0] || "Student";

  return (
    <div className="portal">
      <aside className="portal__side" aria-label="Main">
        <a href="/dashboard" className="portal__brand">
          <img src="/img/logo.webp" alt="" width={40} height={29} />
          <span>Excel Academy</span>
        </a>
        <nav className="portal__nav">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={on(n) ? "is-active" : undefined} aria-current={on(n) ? "page" : undefined}>
              <Icon d={n.icon} />
              <span>{n.label}</span>
              {n.href.endsWith("notifications") && unread > 0 && <b className="portal__badge">{unread > 99 ? "99+" : unread}</b>}
            </a>
          ))}
        </nav>
        <div className="portal__side-foot">
          <a href="/"><Icon d={I.site} /><span>Excel Academy website</span></a>
          <button type="button" onClick={async () => { await logout(); location.href = "/"; }}>
            <Icon d={I.logout} /><span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="portal__main">
        <header className="portal__top">
          <a href="/dashboard" className="portal__brand portal__brand--top" aria-label="Dashboard">
            <img src="/img/logo.webp" alt="" width={36} height={26} />
          </a>
          <form className="portal__search" onSubmit={search} role="search">
            <Icon d={I.explore} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses" aria-label="Search courses" />
          </form>
          <div className="portal__actions">
            <a href="/dashboard/notifications" className="portal__iconbtn" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
              <Icon d={I.bell} />
              {unread > 0 && <b className="portal__dot" />}
            </a>
            <button type="button" className="portal__iconbtn" aria-label={`Cart, ${cart.length} items`} onClick={() => setCartOpen(true)}>
              <Icon d={I.cart} />
              {cart.length > 0 && <b className="portal__count">{cart.length}</b>}
            </button>
            <a href="/dashboard/account" className="portal__avatar" aria-label="Account">
              {user.photoURL ? <img src={user.photoURL} alt="" /> : <span>{name[0]?.toUpperCase()}</span>}
            </a>
          </div>
        </header>
        <main className="portal__content">{children}</main>
      </div>

      <nav className="portal__tabs" aria-label="Main">
        {TABS.map((n) => (
          <a key={n.href} href={n.href} className={on(n) ? "is-active" : undefined} aria-current={on(n) ? "page" : undefined}>
            <Icon d={n.icon} />
            <span>{n.label === "My courses" ? "Courses" : n.label === "Mock exams" ? "Mocks" : n.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
