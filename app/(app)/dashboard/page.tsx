"use client";
import { useMemo } from "react";
import { useStore } from "@/lib/client";
import { useApi, useMyCourses, useNotifications } from "@/lib/useApi";
import { type Course, naira, programmeOf, thumb } from "@/lib/catalogue";
import { Empty, ErrorBox, MyCourseCard, Progress, Skeleton } from "@/components/app/ui";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};
const ago = (iso: string) => {
  const m = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (m < 60) return `${Math.max(1, m)}m ago`;
  if (m < 1440) return `${Math.round(m / 60)}h ago`;
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
};

/** The student's home: continue learning, stats, courses, picks for them, news. */
export default function DashboardHome() {
  const { user } = useStore();
  const mine = useMyCourses();
  const notes = useNotifications();
  const stats = useApi<{ totalPoints: number; rank: number | null }>("/quiz/me", (b) => b.data || { totalPoints: 0, rank: null });
  const bonus = useApi<number>("/payment/bonus", (b) => Number(b.data?.balance) || 0);
  const catalogue = useApi<Course[]>("/all-courses", (b) => ((b.AllCourses || []) as Course[]).filter((c) => Number((c as { status?: number }).status ?? 1) === 1));

  const courses = mine.data || [];
  const current = useMemo(() => {
    const going = courses.filter((c) => (c.progress?.percentage || 0) < 100);
    return [...going].sort((a, b) => (b.progress?.percentage || 0) - (a.progress?.percentage || 0))[0] || courses[0];
  }, [courses]);
  const lessonsDone = courses.reduce((n, c) => n + (c.progress?.lessons_completed || 0), 0);
  const completed = courses.filter((c) => (c.progress?.percentage || 0) >= 100).length;

  // Picks: unowned courses from the programmes they study (or popular ones).
  const picks = useMemo(() => {
    const owned = new Set(courses.map((c) => c.id));
    const progs = new Set(courses.map((c) => c.program).filter(Boolean));
    const all = (catalogue.data || []).filter((c) => !owned.has(c.id) && !c.owned);
    const near = all.filter((c) => progs.has(programmeOf(c)));
    return (near.length >= 3 ? near : all).slice(0, 4);
  }, [catalogue.data, courses]);

  const first = (user?.displayName || "").split(" ")[0] || "there";

  return (
    <div className="dash">
      <section className="dash__hello">
        <div>
          <p>{greeting()},</p>
          <h1>{first}</h1>
        </div>
        <a className="pill-btn" href="/dashboard/explore">Explore courses</a>
      </section>

      {mine.error ? (
        <ErrorBox message={mine.error} onRetry={mine.reload} />
      ) : mine.loading ? (
        <Skeleton h={180} />
      ) : current ? (
        <a className="dash__continue" href={`/learn/${current.id}`}>
          <img src={thumb(current)} alt="" />
          <div className="dash__continue-body">
            <span className="dash__eyebrow">{(current.progress?.percentage || 0) > 0 ? "Continue learning" : "Start learning"}</span>
            <h2>{current.title}</h2>
            <Progress value={current.progress?.percentage || 0} />
            <p>
              {current.progress?.lessons_completed || 0} of {current.progress?.total_lessons || 0} lessons ·{" "}
              {Math.round(current.progress?.percentage || 0)}% complete
            </p>
            <span className="pill-btn pill-btn--solid">{(current.progress?.percentage || 0) > 0 ? "Resume" : "Start"} ▶</span>
          </div>
        </a>
      ) : (
        <Empty title="You haven't enrolled in a course yet" action={<a className="pill-btn pill-btn--solid" href="/dashboard/explore">Find your first course</a>}>
          Pick your programme and start learning today. Courses you buy appear here and in the app.
        </Empty>
      )}

      <section className="dash__stats" aria-label="Your progress">
        <div className="stat"><strong>{mine.loading ? "–" : courses.length}</strong><span>Courses enrolled</span></div>
        <div className="stat"><strong>{mine.loading ? "–" : lessonsDone}</strong><span>Lessons completed</span></div>
        <div className="stat"><strong>{stats.loading ? "–" : (stats.data?.totalPoints || 0).toLocaleString()}</strong><span>{stats.data?.rank ? `Points · rank #${stats.data.rank}` : "Challenge points"}</span></div>
        <div className="stat"><strong>{bonus.loading ? "–" : naira(bonus.data || 0)}</strong><span>Gift-box credit</span></div>
      </section>

      {courses.length > 0 && (
        <section>
          <div className="dash__row-head">
            <h2>My courses</h2>
            <a href="/dashboard/courses">See all ({courses.length})</a>
          </div>
          <div className="p-grid">{courses.slice(0, 4).map((c) => <MyCourseCard key={c.id} c={c} />)}</div>
          {completed > 0 && <p className="dash__note">🎉 You've completed {completed} course{completed === 1 ? "" : "s"}.</p>}
        </section>
      )}

      <div className="dash__split">
        <section>
          <div className="dash__row-head">
            <h2>{courses.length ? "Recommended for you" : "Popular courses"}</h2>
            <a href="/dashboard/explore">Explore</a>
          </div>
          {catalogue.loading ? (
            <div className="p-grid p-grid--2"><Skeleton h={90} n={4} /></div>
          ) : (
            <div className="p-picks">
              {picks.map((c) => (
                <a key={c.id} href={`/dashboard/explore/${c.id}`} className="p-pick">
                  <img src={thumb(c)} alt="" loading="lazy" />
                  <div>
                    <span>{programmeOf(c) === "PD" ? "Professional Development" : programmeOf(c)}</span>
                    <strong>{c.title}</strong>
                    <em>{c.isFree ? "Free" : naira(c.price)}</em>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="dash__row-head">
            <h2>Updates</h2>
            <a href="/dashboard/notifications">View all</a>
          </div>
          {notes.loading ? (
            <Skeleton h={64} n={3} />
          ) : (notes.data?.items || []).length ? (
            <ul className="p-feed">
              {(notes.data?.items || []).slice(0, 4).map((n, i) => (
                <li key={n.id || i} className={n.read ? undefined : "is-unread"}>
                  <strong>{n.title}</strong>
                  <p>{n.body}</p>
                  <small>{ago(n.createdAt)}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No updates yet. Announcements and replies show up here.</p>
          )}
        </section>
      </div>
    </div>
  );
}
