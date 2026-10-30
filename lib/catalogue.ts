/**
 * Programmes, levels and the course catalogue - the same ones the app uses
 * (ExcelGroup programCatalogue / program_levels.dart, backend utils/programmes.js).
 */
export const API = (process.env.NEXT_PUBLIC_API_URL || "https://excel-academy-api-deic.onrender.com/api").replace(/\/$/, "");

export type Programme = { code: string; name: string; logo?: string; /** Figma programme card artwork. */ art?: string; levels: string[] };

export const PROGRAMMES: Programme[] = [
  { code: "ICAN", name: "Institute of chartered accountants of Nigeria (ICAN)", logo: "/img/programs/ICAN.webp", art: "/img/figma/ICAN.webp",
    levels: ["ATS 1 LEVEL", "ATS 2 LEVEL", "ATS 3 LEVEL", "FOUNDATION LEVEL", "SKILLS LEVEL", "PROFESSIONAL LEVEL"] },
  { code: "ACCA", name: "Association of Chartered Certified Accountants (ACCA)", logo: "/img/programs/ACCA.webp", art: "/img/figma/ACCA.webp",
    levels: ["APPLIED KNOWLEDGE LEVEL", "APPLIED SKILLS LEVEL", "STRATEGIC PROFESSIONAL LEVEL"] },
  { code: "CIBN", name: "Chartered Institute of Banking of Nigeria (CIBN)", logo: "/img/programs/CIBN.webp", art: "/img/figma/CIBN.webp",
    levels: ["DIPLOMA LEVEL", "INTERMEDIATE LEVEL", "CHARTERED BANKER LEVEL", "OTHER CERTIFICATIONS"] },
  { code: "CFA", name: "Chartered Financial Analysts (CFA)", logo: "/img/programs/CFA.webp", art: "/img/figma/CFA.webp", levels: ["LEVEL 1", "LEVEL 2", "LEVEL 3"] },
  { code: "CPA", name: "Certified Public Accountant (CPA)", logo: "/img/programs/CPA.webp", art: "/img/figma/CPA.webp", levels: [] },
  { code: "CITN", name: "Chartered Institute of Taxation of Nigeria (CITN)", logo: "/img/programs/CITN.webp", art: "/img/figma/CITN.webp", levels: ["FOUNDATION LEVEL", "PT1 LEVEL", "PT2 LEVEL"] },
  { code: "CIPM", name: "Chartered Institute of Personnel Management of Nigeria (CIPM)", logo: "/img/programs/CIPM.webp", art: "/img/figma/CIPM.webp",
    levels: ["FOUNDATION LEVEL", "INTERMEDIATE 1 LEVEL", "INTERMEDIATE 2 LEVEL", "PROFESSIONAL 1 LEVEL", "PROFESSIONAL 2 LEVEL"] },
  { code: "ANAN", name: "Association of National Accountants of Nigeria (ANAN)", logo: "/img/programs/ANAN.webp", art: "/img/figma/ANAN.webp", levels: [] },
  { code: "CIS", name: "Chartered Institute of Stockbrokers (CIS)", logo: "/img/programs/CIS.webp", art: "/img/figma/CIS.webp", levels: ["LEVEL 1", "LEVEL 2"] },
  { code: "CIMA", name: "Chartered Institute of Management Accountants (CIMA)", logo: "/img/programs/CIMA.webp", art: "/img/figma/CIMA.webp", levels: ["LEVEL 1", "LEVEL 2"] },
  { code: "ICSAN", name: "Chartered Governance Institute of Nigeria (ICSAN)",
    levels: ["FOUNDATION LEVEL", "PRE-PROFESSIONAL LEVEL", "PROFESSIONAL PROGRAMME PART I LEVEL", "PROFESSIONAL PROGRAMME PART II LEVEL"] },
  { code: "CIIN", name: "Chartered Insurance Institute of Nigeria (CIIN)", levels: ["FOUNDATION LEVEL", "INTERMEDIATE LEVEL", "ASSOCIATESHIP LEVEL"] },
  { code: "JUPEB", name: "Joint Universities Preliminary Examinations Board (JUPEB)", levels: [] },
  { code: "CFE", name: "Certified Fraud Examiner (CFE)", levels: [] },
  { code: "CISA", name: "Certified Information Systems Auditor (CISA)", levels: [] },
  { code: "PD", name: "Professional Development", levels: [] },
];
export const programme = (code: string) => PROGRAMMES.find((p) => p.code === code.toUpperCase());

export type Course = {
  id: string;
  title: string;
  description: string;
  creator: string;
  thumbnail: string;
  price: number;
  cancelPrice?: number;
  isFree: boolean;
  level: string;
  program: string;
  owned?: boolean;
  lessonCount: number;
  rating: number | null;
  reviewCount: number;
};

export const programmeOf = (c: Pick<Course, "program">) => (c.program && programme(c.program) ? c.program : "PD");
export const levelKey = (l?: string) => String(l || "").trim().toUpperCase();
export const levelLabel = (l: string) =>
  l.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\b(Ats|Pt\d?|Ii|I)\b/g, (m) => m.toUpperCase());
/** "Premium" courses are the Full package, "Revision" the Revision package. */
export const packageOf = (title: string) => (/revision/i.test(title) ? "Revision package" : "Full package");
export const naira = (n: number) => "₦" + Number(n || 0).toLocaleString("en-NG");
export const thumb = (c: Pick<Course, "thumbnail">) =>
  c.thumbnail && !/\/wp-content\/?$/.test(c.thumbnail) ? c.thumbnail : "/img/hero.webp";

/** Public catalogue, fetched on the server and cached for 5 minutes. */
export async function getCatalogue(): Promise<Course[]> {
  try {
    const res = await fetch(`${API}/all-courses`, { next: { revalidate: 300 } });
    const body = await res.json();
    return ((body.AllCourses || []) as Course[]).filter((c) => Number((c as { status?: number }).status ?? 1) === 1);
  } catch {
    return [];
  }
}
