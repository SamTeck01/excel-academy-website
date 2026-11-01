"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api, useStore } from "@/lib/client";
import { Icon } from "@/components/Icon";

type Module = { _id: string; module_name: string; firebase_id: string; hasVideo?: boolean };
type Lesson = { _id: string; lesson_name: string; modules: Module[] };
type Detail = { title: string; lessons: Lesson[]; completedModules?: string[]; progress?: number; owned?: boolean };

/**
 * Figma "Courses/ LMS": the lesson player. Video on the left, the course
 * contents on the right with ticks for finished lessons; progress is saved to
 * the same record the app uses, so students can switch between web and app.
 */
export default function LearnPage({ params }: { params: { id: string } }) {
  const { user, ready, requireLogin } = useStore();
  const [course, setCourse] = useState<Detail | null>(null),
    [error, setError] = useState(""),
    [current, setCurrent] = useState<Module | null>(null),
    [done, setDone] = useState<Set<string>>(new Set()),
    [menuOpen, setMenuOpen] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  const all = useMemo(() => (course?.lessons || []).flatMap((l) => l.modules), [course]);
  const playable = all.filter((m) => m.firebase_id);
  const idx = current ? playable.findIndex((m) => m._id === current._id) : -1;

  const load = useCallback(async () => {
    setError("");
    try {
      const r = await api<{ courseDetails: Detail }>(`/get-course-details/${encodeURIComponent(params.id)}`);
      const d = r.courseDetails;
      setCourse(d);
      const finished = new Set(d.completedModules || []);
      setDone(finished);
      const mods = (d.lessons || []).flatMap((l) => l.modules).filter((m) => m.firebase_id);
      setCurrent(mods.find((m) => !finished.has(m._id)) || mods[0] || null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [params.id]);

  useEffect(() => {
    if (!ready) return;
    if (!user) return requireLogin("Log in to watch your course", load);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user]);

  const markDone = async (m: Module) => {
    if (done.has(m._id)) return;
    setDone((s) => new Set(s).add(m._id));
    api("/students/progress", { method: "POST", body: JSON.stringify({ courseId: params.id, moduleId: m._id }) }).catch(() => {});
  };
  const go = (step: number) => {
    const next = playable[idx + step];
    if (next) setCurrent(next);
  };

  if (ready && !user) return <main className="container section"><p className="store-empty">Log in to watch this course.</p></main>;
  if (error) {
    return (
      <main className="container section store-error">
        <p>{error}</p>
        <button className="btn btn--primary" onClick={load}>Try again</button>
      </main>
    );
  }
  if (!course) return <main className="container section"><div className="sk" style={{ height: 420 }} /></main>;
  if (!playable.length) {
    return (
      <main className="container section store-empty">
        <h1>{course.title}</h1>
        <p>You haven't enrolled in this course yet.</p>
        <a className="btn btn--primary" href={`/course/${params.id}`}>See the course</a>
      </main>
    );
  }

  const percent = all.length ? Math.round((all.filter((m) => done.has(m._id)).length / all.length) * 100) : 0;

  return (
    <main className="lms">
      <div className="lms__player">
        <p className="crumb"><a href="/dashboard">← My learning</a></p>
        <h1>{course.title}</h1>
        {current && (
          <>
            <video
              key={current._id}
              ref={video}
              src={current.firebase_id}
              controls
              playsInline
              preload="metadata"
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              onEnded={() => { markDone(current); go(1); }}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration && v.currentTime / v.duration > 0.9) markDone(current);
              }}
            />
            <div className="lms__bar">
              <h2>{current.module_name}</h2>
              <div>
                <button className="btn btn--ghost" disabled={idx <= 0} onClick={() => go(-1)}>Previous</button>
                <button className="btn btn--primary" disabled={idx >= playable.length - 1} onClick={() => go(1)}>Next lesson</button>
              </div>
            </div>
          </>
        )}
        <p className="lms__progress"><span style={{ width: `${percent}%` }} /> {percent}% complete</p>
        <p className="lms__mock">Ready to test yourself? <a href={`/dashboard/mock-exams/${params.id}`}>Take this course's mock exam</a>.</p>
      </div>

      <aside className={`lms__contents${menuOpen ? " is-open" : ""}`}>
        <button className="lms__toggle" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Hide" : "Show"} course contents</button>
        {course.lessons.map((l, i) => (
          <details key={l._id || i} open={l.modules.some((m) => m._id === current?._id)}>
            <summary>{l.lesson_name || `Section ${i + 1}`}</summary>
            <ul>
              {l.modules.map((m) => (
                <li key={m._id}>
                  <button
                    className={m._id === current?._id ? "is-current" : undefined}
                    disabled={!m.firebase_id}
                    onClick={() => { setCurrent(m); setMenuOpen(false); }}>
                    <Icon name={done.has(m._id) ? "done" : m.firebase_id ? "play" : "file"} size={16} className={done.has(m._id) ? "is-done-icon" : undefined} /> {m.module_name}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </aside>
    </main>
  );
}
