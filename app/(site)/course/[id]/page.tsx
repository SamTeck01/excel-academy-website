import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { API, type Course, levelKey, levelLabel, naira, packageOf, programmeOf, thumb } from "@/lib/catalogue";
import { BuyButtons } from "@/components/BuyBox";
import { CourseTabs, type Lesson, type Review } from "@/components/CourseTabs";
import { Icon } from "@/components/Icon";

export const revalidate = 300;

type Detail = Course & { lessons: Lesson[] };

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
  return r
    ? {
        title: `${r.c.title} | Excel Academy`,
        description: (r.c.description || `${r.c.title} - video lectures, notes and past questions.`).slice(0, 160),
        openGraph: { images: [thumb(r.c)] },
      }
    : {};
}

/** Figma "Courses/ full package" (course details). */
export default async function CoursePage({ params }: { params: { id: string } }) {
  const r = await load(params.id);
  if (!r) notFound();
  const { c, reviews } = r;
  const lessons = c.lessons || [];
  const videos = lessons.reduce((n, l) => n + l.modules.length, 0);
  const prog = programmeOf(c);
  const progLabel = prog === "PD" ? "Professional Development" : prog;
  const tutor = c.creator && c.creator !== "wordpress-import" ? c.creator : "Ahmed Suluka ACA, ACCA";
  const oldPrice = !c.isFree && Number(c.cancelPrice) > Number(c.price) ? Number(c.cancelPrice) : 0;
  const paragraphs = (c.description || "").split(/\n{1,}/).map((s) => s.trim()).filter(Boolean);

  return (
    <main className="cd">
      <div className="container">
        <div className="cd__head">
          <h1>Course details</h1>
          <BuyButtons course={c} />
        </div>

        <section className="cd__card">
          <div className="cd__info">
            <img className="cd__thumb" src={thumb(c)} alt="" />
            <p className="cd__crumb">
              <a href={`/courses/${prog.toLowerCase()}`}>{progLabel}</a>
              {c.level ? ` / ${levelLabel(levelKey(c.level))}` : ""}
              <span className="cd__pkg">{packageOf(c.title)}</span>
            </p>
            <h2 className="cd__title">{c.title}</h2>
            <p className="cd__stats">
              {videos} lessons
              {c.reviewCount ? ` · ★ ${Number(c.rating).toFixed(1)} from ${c.reviewCount} review${c.reviewCount === 1 ? "" : "s"}` : ""}
            </p>
            <div className="cd__prices">
              {oldPrice > 0 && <s className="cd__old">{naira(oldPrice)}</s>}
              <span className="cd__price">{c.isFree ? "Free" : naira(c.price)}</span>
            </div>
          </div>
          <div className="cd__video">
            <img src="/img/figma/course-video.webp" alt="" />
            <span className="cd__play" aria-hidden="true">
              <svg viewBox="0 0 48 48" width="56" height="56"><circle cx="24" cy="24" r="22" fill="none" stroke="#fff" strokeWidth="2.5" /><path d="M20 16l12 8-12 8z" fill="#fff" /></svg>
            </span>
          </div>
        </section>

        <div className="cd__body">
          <div className="cd__main">
            <h2>Course description</h2>
            {paragraphs.length ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <>
                <p>The lessons in this course are designed for {prog === "PD" ? "professionals" : `${c.level ? levelLabel(levelKey(c.level)).toLowerCase() + " " : ""}"${progLabel}" students`} preparing for their examinations.</p>
                <p>To get the most from this course, watch the pre-recorded video lectures in order. The study notes, standard questions and answers and past question trends are there to broaden your understanding.</p>
              </>
            )}
            <p className="cd__tutor"><strong>Tutor:</strong> {tutor}</p>
          </div>

          <aside className="cd__side">
            <h2>Course includes</h2>
            <ul className="cd__includes">
              <li><span><Icon name="play" /></span>{videos} Lessons</li>
              <li><span><Icon name="file" /></span>Detailed notes</li>
              <li><span><Icon name="note" /></span>Exam-standard questions and detailed explanations</li>
              <li><span><Icon name="library" /></span>Solved past questions on each topic</li>
              <li><span><Icon name="chart" /></span>Past questions trend</li>
            </ul>
            <CourseTabs lessons={lessons} reviews={reviews} title={c.title} />
            <div className="cd__side-buy"><BuyButtons course={c} /></div>
          </aside>
        </div>
      </div>
    </main>
  );
}
