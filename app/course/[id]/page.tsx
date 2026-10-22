import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { API, type Course, levelKey, levelLabel, naira, packageOf, programmeOf, thumb } from "@/lib/catalogue";
import { BuyBox } from "@/components/BuyBox";

export const revalidate = 300;

type Lesson = { _id: string; lesson_name: string; modules: { _id: string; module_name: string; hasVideo?: boolean }[] };
type Detail = Course & { lessons: Lesson[] };
type Review = { uid: string; name?: string; rating: number; comment?: string; createdAt?: string };

async function load(id: string) {
  const [d, r] = await Promise.all([
    fetch(`${API}/get-course-details/${encodeURIComponent(id)}`, { next: { revalidate: 300 } }).then((x) => (x.ok ? x.json() : null)).catch(() => null),
    fetch(`${API}/course/${encodeURIComponent(id)}/reviews`, { next: { revalidate: 300 } }).then((x) => (x.ok ? x.json() : null)).catch(() => null),
  ]);
  const c = d?.courseDetails as Detail | undefined;
  if (!c) return null;
  const reviews = ((r?.data?.reviews || r?.data || []) as Review[]).filter((x) => x && x.rating);
  return { c: { ...c, id: c.id || (c as { _id?: string })._id || id }, reviews };
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const r = await load(params.id);
  return r ? { title: `${r.c.title} | Excel Academy`, description: (r.c.description || `${r.c.title} - online lectures and mock exams.`).slice(0, 160), openGraph: { images: [thumb(r.c)] } } : {};
}

/** Figma "Courses/ full package". */
export default async function CoursePage({ params }: { params: { id: string } }) {
  const r = await load(params.id);
  if (!r) notFound();
  const { c, reviews } = r;
  const lessons = c.lessons || [];
  const videos = lessons.reduce((n, l) => n + l.modules.length, 0);
  const prog = programmeOf(c);
  const tutor = c.creator && c.creator !== "wordpress-import" ? c.creator : "Ahmed Suluka ACA, ACCA";

  return (
    <main>
      <section className="course-hero">
        <div className="container course-hero__inner">
          <div>
            <p className="crumb">
              <a href={`/courses/${prog.toLowerCase()}`}>{prog === "PD" ? "Professional Development" : prog}</a>
              {c.level ? ` / ${levelLabel(levelKey(c.level))}` : ""}
            </p>
            <span className="pill">{packageOf(c.title)}</span>
            <h1>{c.title}</h1>
            <p className="course-hero__meta">
              {videos} lessons{c.reviewCount ? ` · ★ ${Number(c.rating).toFixed(1)} (${c.reviewCount} reviews)` : ""}
            </p>
          </div>
          <BuyBox course={c} />
        </div>
      </section>

      <section className="container section course-body">
        <div>
          <h2>Course description</h2>
          <p>{c.description || `The lessons in this course are designed for ${prog === "PD" ? "professionals" : `${prog} students`} preparing for their examinations.`}</p>
          <p><strong>Tutor:</strong> {tutor}</p>

          <h2>Course content</h2>
          <div className="curriculum">
            {lessons.map((l, i) => (
              <details key={l._id || i} open={i === 0}>
                <summary>{l.lesson_name || `Section ${i + 1}`} <span>{l.modules.length} lessons</span></summary>
                <ul>
                  {l.modules.map((m) => (
                    <li key={m._id}>
                      <span aria-hidden="true">{m.hasVideo === false ? "📄" : "▶"}</span> {m.module_name}
                      <span className="lock" aria-label="Unlocks after enrolling">🔒</span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
            {!lessons.length && <p className="store-empty">The lesson list will appear here soon.</p>}
          </div>

          <h2>Reviews</h2>
          {reviews.length ? (
            <ul className="reviews">
              {reviews.slice(0, 20).map((rv, i) => (
                <li key={rv.uid || i}>
                  <strong>{rv.name || "Student"}</strong> <span className="stars">{"★".repeat(Math.round(rv.rating))}</span>
                  {rv.comment && <p>{rv.comment}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="store-empty">No reviews yet - be the first after you enroll.</p>
          )}
        </div>
        <aside className="course-includes">
          <h3>Course includes</h3>
          <ul>
            <li>{videos} video lessons</li>
            <li>Detailed notes</li>
            <li>Exam-standard questions with explanations</li>
            <li>Solved past questions on each topic</li>
            <li>A mock exam with solutions</li>
            <li>Learn on the website or the Excel Academy app</li>
          </ul>
          {!c.isFree && c.cancelPrice && Number(c.cancelPrice) > Number(c.price) && (
            <p className="course-includes__save">You save {naira(Number(c.cancelPrice) - Number(c.price))}</p>
          )}
        </aside>
      </section>
    </main>
  );
}
