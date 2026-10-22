"use client";
import { useEffect, useState } from "react";
import { api, useStore } from "@/lib/client";
import { thumb } from "@/lib/catalogue";

type Mine = { id?: string; _id?: string; title: string; thumbnail: string; progress?: { percentage?: number; lessons_completed?: number; total_lessons?: number } };

/** Figma "My learning": the student's courses with progress. */
export default function MyLearningPage() {
  const { user, ready, requireLogin } = useStore();
  const [list, setList] = useState<Mine[] | null>(null),
    [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      setList((await api<{ AllCourses?: Mine[] }>("/students/my-courses")).AllCourses || []);
    } catch (e) {
      setError((e as Error).message);
    }
  };
  useEffect(() => {
    if (!ready) return;
    if (!user) requireLogin("Log in to see your courses", load);
    else load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user]);

  return (
    <main className="container section">
      <h1 className="section-title">My learning</h1>
      {!user && ready ? (
        <p className="store-empty">Log in to see the courses you're enrolled in.</p>
      ) : error ? (
        <div className="store-error"><p>{error}</p><button className="btn btn--primary" onClick={load}>Try again</button></div>
      ) : !list ? (
        <div className="store-grid">{[0, 1, 2].map((i) => <div key={i} className="sk" />)}</div>
      ) : !list.length ? (
        <p className="store-empty">You haven't enrolled in a course yet. <a href="/courses">Browse courses</a></p>
      ) : (
        <div className="store-grid">
          {list.map((c) => {
            const id = String(c.id || c._id);
            const pct = Math.round(c.progress?.percentage || 0);
            return (
              <a key={id} href={`/learn/${id}`} className="course-card">
                <div className="course-card__img"><img src={thumb(c)} alt="" loading="lazy" /></div>
                <div className="course-card__body">
                  <h3 className="course-card__title">{c.title}</h3>
                  <p className="lms__progress"><span style={{ width: `${pct}%` }} /> {pct}% complete</p>
                  <div className="course-card__foot"><span className="btn btn--primary">{pct ? "Continue" : "Start learning"}</span></div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}
