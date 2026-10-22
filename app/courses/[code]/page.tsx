import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROGRAMMES, getCatalogue, programme, programmeOf } from "@/lib/catalogue";
import { ProgrammeCourses } from "@/components/ProgrammeCourses";

export const revalidate = 300;
export const generateStaticParams = () => PROGRAMMES.map((p) => ({ code: p.code.toLowerCase() }));

export function generateMetadata({ params }: { params: { code: string } }): Metadata {
  const p = programme(params.code);
  return p ? { title: `${p.code} Courses | Excel Academy`, description: `Online lectures, notes and mock exams for ${p.name}.` } : {};
}

/** Figma "Courses/ ICAN": level tabs, Full/Revision package, course cards. */
export default async function ProgrammePage({ params }: { params: { code: string } }) {
  const p = programme(params.code);
  if (!p) notFound();
  const courses = (await getCatalogue()).filter((c) => programmeOf(c) === p.code);

  return (
    <main>
      <section className="program-hero">
        <div className="container">
          <a href="/courses" className="crumb">← All programs</a>
          <p className="program-hero__eyebrow">Great!, you made the right choice😎</p>
          <h1>{p.name}</h1>
        </div>
      </section>
      <section className="container section" style={{ paddingTop: 16 }}>
        <ProgrammeCourses levels={p.levels} courses={courses} />
      </section>
    </main>
  );
}
