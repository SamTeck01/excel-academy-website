"use client";
import { useMemo, useState } from "react";
import { type Course, levelKey, levelLabel, naira, packageOf, thumb } from "@/lib/catalogue";
import { useStore } from "@/lib/client";

/** A course card (Figma: image, title, price/Free, "Enroll course"). */
export function CourseCard({ c }: { c: Course }) {
  const { owned } = useStore();
  const mine = owned.has(c.id) || c.owned;
  return (
    <a href={`/course/${c.id}`} className="course-card">
      <div className="course-card__img"><img src={thumb(c)} alt="" loading="lazy" decoding="async" /></div>
      <div className="course-card__body">
        <div className="course-card__meta">
          {c.level ? levelLabel(levelKey(c.level)) : "Course"}
          {c.lessonCount ? ` · ${c.lessonCount} lessons` : ""}
        </div>
        <h3 className="course-card__title">{c.title}</h3>
        <div className="course-card__meta">By {c.creator && c.creator !== "wordpress-import" ? c.creator : "Excel Academy"}</div>
        <div className="course-card__foot">
          {mine ? (
            <span className="course-card__owned">✓ Enrolled - continue</span>
          ) : (
            <>
              <span className="course-card__price">{c.isFree ? "Free" : naira(c.price)}</span>
              <span className="btn btn--primary">Enroll course</span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}

export function ProgrammeCourses({ levels, courses }: { levels: string[]; courses: Course[] }) {
  const present = levels.filter((l) => courses.some((c) => levelKey(c.level) === l));
  const [level, setLevel] = useState(present[0] || ""),
    [pkg, setPkg] = useState<"all" | "Full package" | "Revision package">("all"),
    [q, setQ] = useState("");
  const hasPackages = courses.some((c) => /revision/i.test(c.title)) && courses.some((c) => /premium/i.test(c.title));

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return courses.filter(
      (c) =>
        (s ? c.title.toLowerCase().includes(s) : !present.length || levelKey(c.level) === level) &&
        (pkg === "all" || packageOf(c.title) === pkg),
    );
  }, [courses, level, pkg, q, present.length]);

  if (!courses.length) {
    return <p className="store-empty">Courses for this programme are coming soon. <a href="/contact">Talk to us</a> to be notified.</p>;
  }

  return (
    <>
      {present.length > 0 && (
        <div className="store-tabs level-tabs" role="tablist" aria-label="Levels">
          {present.map((l) => (
            <button key={l} role="tab" aria-selected={l === level} className="store-tab" aria-pressed={l === level}
              onClick={() => { setLevel(l); setQ(""); }}>
              {levelLabel(l)}
            </button>
          ))}
        </div>
      )}
      <div className="store-bar">
        {hasPackages ? (
          <div className="store-tabs" aria-label="Package">
            {(["all", "Full package", "Revision package"] as const).map((p) => (
              <button key={p} className="store-tab" aria-pressed={pkg === p} onClick={() => setPkg(p)}>
                {p === "all" ? "All packages" : p}
              </button>
            ))}
          </div>
        ) : <span />}
        <input className="store-search" type="search" placeholder="Search courses" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search courses" />
      </div>
      {list.length ? (
        <div className="store-grid">{list.map((c) => <CourseCard key={c.id} c={c} />)}</div>
      ) : (
        <p className="store-empty">No course matches.</p>
      )}
    </>
  );
}
