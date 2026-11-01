"use client";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/client";
import { useNotifications } from "@/lib/useApi";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Award01Icon, BookOpen01Icon, Globe02Icon, Home01Icon, Logout01Icon, Menu01Icon, Notification03Icon, Search01Icon, ShoppingBag02Icon, Task01Icon, UserIcon,
} from "@hugeicons/core-free-icons";

type Item = { href: string; label: string; icon: IconSvgElement; match?: (p: string) => boolean };

// One outline icon set (Hugeicons), one size and stroke everywhere.
const I = {
  home: Home01Icon,
  courses: BookOpen01Icon,
  explore: Search01Icon,
  exam: Task01Icon,
  game: Award01Icon,
  bell: Notification03Icon,
  user: UserIcon,
  cart: ShoppingBag02Icon,
  logout: Logout01Icon,
  site: Globe02Icon,
};
const Icon = ({ d }: { d: IconSvgElement }) => <HugeiconsIcon icon={d} size={20} strokeWidth={1.6} aria-hidden="true" />;

const NAV: Item[] = [
  { href: "/dashboard", label: "Home", icon: I.home, match: (p) => p === "/dashboard" },
  { href: "/dashboard/courses", label: "My courses", icon: I.courses, match: (p) => p.startsWith("/dashboard/courses") || p.startsWith("/learn") },
  { href: "/dashboard/explore", label: "Explore", icon: I.explore },
  { href: "/dashboard/mock-exams", label: "Mock exams", icon: I.exam },
  { href: "/dashboard/challenges", label: "Challenges", icon: I.game },
  { href: "/dashboard/notifications", label: "Notifications", icon: I.bell },
  { href: "/dashboard/account", label: "Account", icon: I.user },
];
// Phones: the four daily places, everything else in the More sheet.
const TAB_HREFS = ["/dashboard", "/dashboard/courses", "/dashboard/mock-exams", "/dashboard/challenges"];
const TABS = NAV.filter((n) => TAB_HREFS.includes(n.href));
const MORE = NAV.filter((n) => !TAB_HREFS.includes(n.href));

/** The student app frame (web version of the mobile app). */
export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname() || "/dashboard";
  const { user, ready, logout, cart, setCartOpen } = useStore();
  const notes = useNotifications();
  const [q, setQ] = useState("");
  const [more, setMore] = useState(false);
  useEffect(() => {
    if (!more) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setMore(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [more]);
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
            <span>{n.label === "My courses" ? "Courses" : n.label === "Mock exams" ? "Mocks" : n.label === "Challenges" ? "Play" : n.label}</span>
          </a>
        ))}
        <button type="button" className={MORE.some(on) ? "is-active" : undefined} aria-expanded={more} onClick={() => setMore(true)}>
          <Icon d={Menu01Icon} />
          <span>More</span>
          {(notes.data?.unread || 0) > 0 && <i className="portal__dot" aria-label="Unread notifications" />}
        </button>
      </nav>
      {more && (
        <div className="portal__sheet" onClick={() => setMore(false)}>
          <div role="dialog" aria-modal="true" aria-label="More" onClick={(e) => e.stopPropagation()}>
            <span className="portal__grab" aria-hidden="true" />
            {MORE.map((n) => (
              <a key={n.href} href={n.href} className={on(n) ? "is-active" : undefined}>
                <Icon d={n.icon} />
                <span>{n.label}</span>
                {n.href === "/dashboard/notifications" && (notes.data?.unread || 0) > 0 && <b>{notes.data?.unread}</b>}
              </a>
            ))}
            <a href="/"><Icon d={I.site} /><span>Back to website</span></a>
            <button type="button" className="is-danger" onClick={async () => { await logout(); location.href = "/"; }}>
              <Icon d={I.logout} /><span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
