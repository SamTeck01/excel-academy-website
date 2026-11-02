/**
 * The site lives on two addresses: the public website and the student
 * dashboard. Firebase keeps a login per address, so the dashboard also drops a
 * small first-name cookie across the domain. It only tells the website "greet
 * this person"; it unlocks nothing, the API still requires the real login.
 */
export const SITE = "https://excelacademyonline.com";
export const DASH = "https://dashboard.excelacademyonline.com";
const COOKIE = "ea_student";
const ROOT = "excelacademyonline.com";

const host = () => (typeof location === "undefined" ? "" : location.hostname);
export const onWebsite = () => host() === ROOT || host() === `www.${ROOT}`;
export const onDashboard = () => host() === `dashboard.${ROOT}`;

/** A dashboard page's address from anywhere. Other hosts (Vercel, local) serve both, so stay put. */
export const dashUrl = (path: string) => (onWebsite() ? DASH + path : path);
export const siteUrl = (path: string) => (onDashboard() ? SITE + path : path);

const scope = () => (host().endsWith(ROOT) ? `; domain=.${ROOT}` : "");

export function rememberStudent(name: string) {
  document.cookie = `${COOKIE}=${encodeURIComponent(name || "Student")}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax${scope()}${location.protocol === "https:" ? "; secure" : ""}`;
}
export function forgetStudent() {
  document.cookie = `${COOKIE}=; path=/; max-age=0${scope()}`;
}
export function rememberedStudent(): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}
