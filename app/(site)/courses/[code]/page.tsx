import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROGRAMMES, getCatalogue, programme, programmeOf } from "@/lib/catalogue";
import { ProgrammeCourses } from "@/components/ProgrammeCourses";
import { PhotoHero } from "@/components/PhotoHero";

export const revalidate = 300;
export const generateStaticParams = () => PROGRAMMES.map((p) => ({ code: p.code.toLowerCase() }));

export function generateMetadata({ params }: { params: { code: string } }): Metadata {
  const p = programme(params.code);
  return p ? { title: `${p.code === "PD" ? "Professional Development" : p.code} Courses | Excel Academy`, description: `Online lectures, notes and mock exams for ${p.name}.` } : {};
}

/** Figma "Courses/ ICAN". */
export default async function ProgrammePage({ params }: { params: { code: string } }) {
  const p = programme(params.code);
  if (!p) notFound();
  const courses = (await getCatalogue()).filter((c) => programmeOf(c) === p.code);

  return (
    <main>
      <PhotoHero>
        <p className="crumb"><a href="/courses">← All programs</a></p>
        <h1 className="photo-hero__title--sm">Great!, you made the right choice😎</h1>
        <p className="photo-hero__programme">{p.name}</p>
      </PhotoHero>
      <div className="container section" style={{ paddingTop: 8 }}>
        <ProgrammeCourses code={p.code} levels={p.levels} courses={courses} />
      </div>
    </main>
  );
}
