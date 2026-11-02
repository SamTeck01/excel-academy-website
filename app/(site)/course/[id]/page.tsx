import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { thumb } from "@/lib/catalogue";
import { CourseDetail, loadCourse } from "@/components/CourseDetail";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const r = await loadCourse(params.id);
  return r
    ? {
        title: `${r.c.title} | Excel Academy`,
        description: (r.c.description || `${r.c.title} - video lectures, notes and past questions.`).slice(0, 160),
        openGraph: { images: [thumb(r.c)] },
      }
    : {};
}

export default async function CoursePage({ params }: { params: { id: string } }) {
  const r = await loadCourse(params.id);
  if (!r) notFound();
  return <CourseDetail c={r.c} reviews={r.reviews} />;
}
