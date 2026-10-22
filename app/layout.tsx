import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./styles.css";
import "./pages.css";
import "./motion.css";
import "./store.css";
import "./app.css";
import { StoreProvider } from "@/lib/client";
import { AuthDialog, CartDrawer, Navbar } from "@/components/Shell";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://excelacademyonline.com"),
  title: { default: "Excel Academy | Pass your Accounting & Finance exams", template: "%s" },
  description:
    "Online tuition for ICAN, ACCA, CITN, CIS, CIBN and more: video lectures, notes, past questions and mock exams from prize-winning tutors.",
  icons: { icon: "/img/logo.webp" },
  openGraph: { siteName: "Excel Academy", type: "website", images: ["/img/hero.webp"] },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f58634" };

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
          <Navbar />
          {children}
          <Footer />
          <AuthDialog />
          <CartDrawer />
        </StoreProvider>
        {/* Menu, FAQ, testimonial carousel, contact-to-WhatsApp and motion (from the Figma build). */}
        <Script src="/js/main.js" strategy="afterInteractive" />
        <Script src="/js/motion.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
