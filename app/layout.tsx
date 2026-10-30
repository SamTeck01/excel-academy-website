import type { Metadata, Viewport } from "next";
import "./styles.css";
import "./pages.css";
import "./motion.css";
import "./store.css";
import "./app.css";
import "./figma.css";
import "./portal.css";
import { StoreProvider } from "@/lib/client";
import { AuthDialog, CartDrawer } from "@/components/Shell";

export const metadata: Metadata = {
  metadataBase: new URL("https://excelacademyonline.com"),
  title: { default: "Excel Academy | Pass your Accounting & Finance exams", template: "%s" },
  description:
    "Online tuition for ICAN, ACCA, CITN, CIS, CIBN and more: video lectures, notes, past questions and mock exams from prize-winning tutors.",
  icons: { icon: "/img/logo.webp" },
  openGraph: { siteName: "Excel Academy", type: "website", images: ["/img/hero.webp"] },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f58634" };

/** Shared by the public site and the student app: fonts, account, cart, sign-in dialog. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>
          {children}
          <AuthDialog />
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
