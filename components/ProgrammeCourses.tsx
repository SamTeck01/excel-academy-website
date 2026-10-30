"use client";
import { useMemo, useState } from "react";
import { type Course, levelKey, levelLabel, naira, packageOf, thumb } from "@/lib/catalogue";
import { useStore } from "@/lib/client";

const instructor = (c: Course) => (c.creator && c.creator !== "wordpress-import" ? c.creator : "Admin");

/**
 * Figma course card: orange course artwork, title, rating + price chip,
 * "By … in ICAN", and a full-width "Enroll course" button.
 */
export function CourseCard({ c, programme }: { c: Course; programme: string }) {
  const { owned } = useStore();
  const mine = owned.has(c.id) || c.owned;
  return (
    <article className="fcard">
      <a href={`/course/${c.id}`} className="fcard__art" aria-label={c.title}>
        <img src={thumb(c)} alt="" loading="lazy" decoding="async" />
      </a>
      <a href={`/course/${c.id}`} className="fcard__title">{c.title}</a>
      <div className="fcard__meta">
        <span className="fcard__rating" title={c.reviewCount ? `${c.reviewCount} reviews` : "No reviews yet"}>
          <span aria-hidden="true">★</span> {c.reviewCount ? Number(c.rating).toFixed(1) : "New"}
        </span>
        {c.lessonCount > 0 && <span className="fcard__chip">{c.lessonCount} lessons</span>}
        <span className="fcard__chip fcard__chip--price">{c.isFree ? "Free" : naira(c.price)}</span>
      </div>
      <div className="fcard__by">
        <img src="/img/logo.webp" alt="" width={20} height={15} /> By {instructor(c)} in {programme}
      </div>
      <a href={mine ? `/learn/${c.id}` : `/course/${c.id}`} className={`fcard__btn${mine ? " fcard__btn--owned" : !c.lessonCount ? " fcard__btn--soon" : ""}`}>
        {mine ? "Continue learning" : c.lessonCount ? "Enroll course" : "Coming soon"}
      </a>
    </article>
  );
}

/** Figma "Courses/ ICAN": every level as its own section; package switch by the first heading. */
export function ProgrammeCourses({ code, levels, courses }: { code: string; levels: string[]; courses: Course[] }) {
  const [pkg, setPkg] = useState<"Full package" | "Revision package" | "All">("All");
  const hasPackages = courses.some((c) => /revision/i.test(c.title)) && courses.some((c) => /premium/i.test(c.title));
  const visible = useMemo(() => courses.filter((c) => pkg === "All" || packageOf(c.title) === pkg), [courses, pkg]);

  const sections = useMemo(() => {
    const out: [string, Course[]][] = levels.map((l) => [l, visible.filter((c) => levelKey(c.level) === l)]);
    const rest = visible.filter((c) => !levels.includes(levelKey(c.level)));
    if (rest.length) out.push([levels.length ? "Other courses" : "All courses", rest]);
    return out.filter(([, cs]) => cs.length);
  }, [levels, visible]);

  if (!courses.length) {
    return <p className="store-empty">Courses for this programme are coming soon. <a href="/contact">Talk to us</a> to be told when they're ready.</p>;
  }

  const toggle = hasPackages && (
    <div className="pkg-toggle" role="group" aria-label="Package">
      {(["Full package", "Revision package"] as const).map((p) => (
        <button key={p} type="button" aria-pressed={pkg === p} onClick={() => setPkg(pkg === p ? "All" : p)}>
          {p}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {sections.map(([level, cs], i) => (
        <section key={level} className="level-section" aria-labelledby={`lvl-${i}`}>
          <div className="level-section__head">
            <h2 id={`lvl-${i}`}>{levelLabel(level)}</h2>
            {i === 0 && toggle}
          </div>
          <div className="fgrid">
            {cs.map((c) => <CourseCard key={c.id} c={c} programme={code === "PD" ? "Professional Development" : code} />)}
          </div>
        </section>
      ))}
      {!sections.length && (
        <>
          <div className="level-section__head">{toggle}</div>
          <p className="store-empty">No {pkg.toLowerCase()} courses here yet.</p>
        </>
      )}
    </>
  );
}
