"use client";
import { PageHead } from "@/components/app/ui";
import { siteUrl } from "@/lib/hosts";

const CONTACTS = [
  { title: "Chat on WhatsApp", text: "The quickest way to reach our team.", href: "https://wa.me/2348094579949", cta: "Open WhatsApp" },
  { title: "Call us", text: "+234 809 457 9949", href: "tel:+2348094579949", cta: "Call" },
  { title: "Email us", text: "info@excelacademyonline.com", href: "mailto:info@excelacademyonline.com", cta: "Send email" },
];
const READ = [
  ["Study tips and articles", "/blog"],
  ["About Excel Academy", "/about"],
  ["Terms of use", "/terms"],
  ["Privacy policy", "/privacy-policy"],
];

/** Everything a student would otherwise leave the dashboard to find. */
export default function HelpPage() {
  return (
    <>
      <PageHead title="Help & support" sub="Stuck on a payment, a lesson or your account? We're here." />
      <div className="p-grid">
        {CONTACTS.map((c) => (
          <a key={c.title} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="p-exam">
            <h3>{c.title}</h3>
            <p className="muted" style={{ overflowWrap: "anywhere" }}>{c.text}</p>
            <div className="p-exam__foot"><span /><strong>{c.cta} →</strong></div>
          </a>
        ))}
      </div>
      <h2 className="gm-h2">Good to read</h2>
      <div className="p-chips" style={{ flexWrap: "wrap" }}>
        {READ.map(([label, href]) => (
          <a key={href} className="pill-btn" href={siteUrl(href)}>{label}</a>
        ))}
      </div>
    </>
  );
}
