import type { Metadata } from "next";
import { PROGRAMMES, getCatalogue, programmeOf } from "@/lib/catalogue";
import { PhotoHero } from "@/components/PhotoHero";
import { existsSync } from "node:fs";
import { join } from "node:path";

/** Figma card artwork when it is in public/, otherwise the programme logo. */
const artFor = (p: { art?: string; logo?: string }) =>
  p.art && existsSync(join(process.cwd(), "public", p.art)) ? { src: p.art, full: true } : p.logo ? { src: p.logo, full: false } : null;

export const metadata: Metadata = {
  title: "Courses | Excel Academy",
  description: "Explore ICAN, ACCA, CITN, CIS, CIBN, CIPM, CFA, CIMA and professional development courses.",
};
export const revalidate = 300;

/** Figma "Courses": hero, then "Select from the available programs". */
export default async function CoursesPage() {
  const courses = await getCatalogue();
  const count = (code: string) => courses.filter((c) => programmeOf(c) === code).length;
  // The ten programmes in the design, then any others that have courses.
  const shown = PROGRAMMES.filter((p) => p.logo || count(p.code) > 0);

  return (
    <main>
      <PhotoHero>
        <h1>Explore the program that’s best fit for you🧑🏾‍💻</h1>
        <p>Take your career to the next level with an online degree, get started with our verified courses</p>
        <a href="#programs" className="btn btn--primary">Get started with us</a>
      </PhotoHero>

      <section className="container section" id="programs">
        <h2 className="programs-title">Select from the available programs</h2>
        <div className="program-grid">
          {shown.map((p) => (
            <a key={p.code} href={`/courses/${p.code.toLowerCase()}`} className="program-card">
              <div className="program-card__art">
                {artFor(p) ? (
                  <img src={artFor(p)!.src} alt={`${p.code} logo`} loading="lazy" className={artFor(p)!.full ? undefined : "is-logo"} />
                ) : (
                  <span className="program-card__code">{p.code === "PD" ? "Professional Development" : p.code}</span>
                )}
              </div>
              <h3>{p.name}</h3>
              {!count(p.code) && <span className="program-card__count">Coming soon</span>}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
