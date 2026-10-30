import Script from "next/script";
import { Navbar } from "@/components/Shell";
import { Footer } from "@/components/site/Footer";

/** The public website: marketing navbar and footer (Figma "Navbar" / "footer"). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      {/* Menu, FAQ, testimonial carousel, contact-to-WhatsApp and motion. */}
      <Script src="/js/main.js" strategy="afterInteractive" />
      <Script src="/js/motion.js" strategy="afterInteractive" />
    </>
  );
}
