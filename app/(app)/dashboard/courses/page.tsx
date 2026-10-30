"use client";
import { useState } from "react";
import { useMyCourses } from "@/lib/useApi";
import { Empty, ErrorBox, MyCourseCard, PageHead, Skeleton } from "@/components/app/ui";

const TABS = ["All", "In progress", "Completed"] as const;

/** Every course the student is enrolled in, with progress. */
export default function MyCoursesPage() {
  const mine = useMyCourses();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const list = (mine.data || []).filter((c) => {
    const p = c.progress?.percentage || 0;
    return tab === "All" || (tab === "Completed" ? p >= 100 : p < 100);
  });

  return (
    <>
      <PageHead title="My courses" sub="Pick up where you left off. Progress is shared with the Excel Academy app." />
      <div className="p-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "is-active" : undefined} onClick={() => setTab(t)}>
            {t}
            {mine.data && <span>{(mine.data || []).filter((c) => t === "All" || (t === "Completed" ? (c.progress?.percentage || 0) >= 100 : (c.progress?.percentage || 0) < 100)).length}</span>}
          </button>
        ))}
      </div>
      {mine.error ? (
        <ErrorBox message={mine.error} onRetry={mine.reload} />
      ) : mine.loading ? (
        <div className="p-grid"><Skeleton h={260} n={4} /></div>
      ) : list.length ? (
        <div className="p-grid">{list.map((c) => <MyCourseCard key={c.id} c={c} />)}</div>
      ) : (
        <Empty
          title={tab === "Completed" ? "No completed courses yet" : tab === "In progress" ? "Nothing in progress" : "You haven't enrolled in a course yet"}
          action={<a className="pill-btn pill-btn--solid" href="/dashboard/explore">Explore courses</a>}
        />
      )}
    </>
  );
}
