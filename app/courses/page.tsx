import type { Metadata } from "next";
import { PROGRAMMES, getCatalogue, programmeOf } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Courses | Excel Academy",
  description: "Explore ICAN, ACCA, CITN, CIS, CIBN, CIPM, CFA, CIMA and professional development courses.",
};
export const revalidate = 300;

/** Figma "Courses": hero, then "Select from the available programs". */
export default async function CoursesPage() {
  const courses = await getCatalogue();
  const count = (code: string) => courses.filter((c) => programmeOf(c) === code).length;
  const shown = PROGRAMMES.filter((p) => p.logo || count(p.code) > 0);

  return (
    <main>
      <section className="courses-hero">
        <div className="container courses-hero__inner">
          <div>
            <h1>Explore the program that’s best fit for you🧑🏾‍💻</h1>
            <p>Take your career to the next level with an online course, get started with our verified courses and prize-winning tutors.</p>
            <a href="#programs" className="btn btn--primary">Get started with us</a>
          </div>
          <div className="courses-hero__stats">
            <div><strong>15+</strong><span>Qualified and Certified Tutors</span></div>
            <div><strong>{courses.length}+</strong><span>Courses to choose from</span></div>
            <div><strong>5,000+</strong><span>Students learning with us</span></div>
          </div>
        </div>
      </section>

      <section className="container section" id="programs">
        <h2 className="section-title">Select from the available programs</h2>
        <div className="program-grid">
          {shown.map((p) => (
            <a key={p.code} href={`/courses/${p.code.toLowerCase()}`} className="program-card">
              <div className="program-card__art">
                {p.logo ? <img src={p.logo} alt="" /> : <span className="program-card__code">{p.code}</span>}
              </div>
              <h3>{p.name}</h3>
              <span className="program-card__count">{count(p.code) ? `${count(p.code)} courses` : "Coming soon"}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
