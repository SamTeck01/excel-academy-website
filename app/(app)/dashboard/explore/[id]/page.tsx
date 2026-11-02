import { notFound } from "next/navigation";
import { CourseDetail, loadCourse } from "@/components/CourseDetail";

export const revalidate = 300;

/** The course page, inside the dashboard. */
export default async function DashboardCoursePage({ params }: { params: { id: string } }) {
  const r = await loadCourse(params.id);
  if (!r) notFound();
  return <CourseDetail c={r.c} reviews={r.reviews} inApp />;
}
