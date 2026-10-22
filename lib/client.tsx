"use client";
/**
 * Signed-in student, cart and the API - shared by every page.
 * Accounts are the same Firebase accounts as the app.
 */
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail,
  signInWithPopup, GoogleAuthProvider, updateProfile, signOut, type User,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore/lite";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { API, type Course } from "./catalogue";

const app = getApps()[0] || initializeApp({
  apiKey: "AIzaSyD_b49nKGyE6FrKyJ0X0GipuiTn9nwZOnI",
  authDomain: "excel-academy-online.firebaseapp.com",
  projectId: "excel-academy-online",
  appId: "1:1027112230279:web:7356d98f35a5b54df9c722",
});
export const auth = getAuth(app);
const fs = getFirestore(app);

/** Calls the Excel Academy API as the signed-in student. */
export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth.currentUser) headers.Authorization = "Bearer " + (await auth.currentUser.getIdToken());
  let res: Response;
  try {
    res = await fetch(API + path, { ...init, headers });
  } catch {
    throw new Error("No internet connection - check your network and try again.");
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.status === "fail" || body.status === "error") throw new Error(body.message || `Something went wrong (${res.status})`);
  return body as T;
}

export const authError = (e: unknown) =>
  (({
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/user-not-found": "No account with that email - create one instead.",
    "auth/email-already-in-use": "That email already has an account - log in instead.",
    "auth/weak-password": "Use at least 6 characters for the password.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
    "auth/network-request-failed": "No internet connection.",
    "auth/popup-closed-by-user": "",
  }) as Record<string, string>)[(e as { code?: string }).code || ""] ?? "Something went wrong. Please try again.";

/** The same profile document the app creates at sign-up. */
async function ensureProfile(user: User, name?: string) {
  const ref = doc(fs, "users", user.uid);
  const snap = await getDoc(ref).catch(() => null);
  if (snap && snap.exists()) return;
  await setDoc(ref, {
    name: name || user.displayName || "", username: name || user.displayName || "", phoneNumber: "",
    datecreated: new Date().toString(), dp: user.photoURL || null, email: user.email || "",
  }).catch(() => {});
}

type Ctx = {
  user: User | null;
  ready: boolean;
  owned: Set<string>;
  refreshOwned: () => Promise<void>;
  cart: Course[];
  addToCart: (c: Course) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  /** Opens the sign-in dialog; `then` runs once signed in. */
  requireLogin: (reason?: string, then?: () => void) => void;
  authPrompt: { reason: string; then?: () => void } | null;
  closeAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  google: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};
const StoreContext = createContext<Ctx | null>(null);
export const useStore = () => useContext(StoreContext)!;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null),
    [ready, setReady] = useState(false),
    [owned, setOwned] = useState<Set<string>>(new Set()),
    [cart, setCart] = useState<Course[]>([]),
    [cartOpen, setCartOpen] = useState(false),
    [authPrompt, setAuthPrompt] = useState<Ctx["authPrompt"]>(null);

  const refreshOwned = useCallback(async () => {
    if (!auth.currentUser) return setOwned(new Set());
    try {
      const r = await api<{ AllCourses?: { _id?: string; id?: string }[] }>("/students/my-courses");
      setOwned(new Set((r.AllCourses || []).map((c) => String(c.id || c._id))));
    } catch {
      /* keeps the last known list */
    }
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ea-cart") || "[]");
      if (Array.isArray(saved)) setCart(saved);
    } catch {}
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
      refreshOwned();
    });
  }, [refreshOwned]);

  useEffect(() => {
    try {
      localStorage.setItem("ea-cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const after = useCallback(async () => {
    const then = authPrompt?.then;
    setAuthPrompt(null);
    await refreshOwned();
    then?.();
  }, [authPrompt, refreshOwned]);

  const value = useMemo<Ctx>(
    () => ({
      user, ready, owned, refreshOwned, cart, cartOpen, setCartOpen, authPrompt,
      addToCart: (c) => setCart((cs) => (cs.some((x) => x.id === c.id) ? cs : [...cs, c])),
      removeFromCart: (id) => setCart((cs) => cs.filter((c) => c.id !== id)),
      clearCart: () => setCart([]),
      requireLogin: (reason, then) => setAuthPrompt({ reason: reason || "Use the same account as the Excel Academy app.", then }),
      closeAuth: () => setAuthPrompt(null),
      login: async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
        await after();
      },
      signup: async (name, email, password) => {
        const { user: u } = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(u, { displayName: name });
        await ensureProfile(u, name);
        await after();
      },
      google: async () => {
        const { user: u } = await signInWithPopup(auth, new GoogleAuthProvider());
        await ensureProfile(u);
        await after();
      },
      resetPassword: (email) => sendPasswordResetEmail(auth, email),
      logout: async () => {
        await signOut(auth);
        setOwned(new Set());
      },
    }),
    [user, ready, owned, refreshOwned, cart, cartOpen, authPrompt, after],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
