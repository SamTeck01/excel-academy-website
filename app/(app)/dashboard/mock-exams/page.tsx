"use client";
import { useApi } from "@/lib/useApi";
import { Empty, ErrorBox, PageHead, Skeleton } from "@/components/app/ui";

export type ExamSummary = {
  courseId: string;
  title: string;
  level: string;
  minutes: number;
  questionCount: number;
  inProgress: boolean;
  remainingSec: number | null;
  answered: number;
  attempts: number;
  lastScore: number | null;
  bestScore: number | null;
  lastAt: string | null;
};

/** Mock exams for the courses the student owns. */
export default function MockExamsPage() {
  const list = useApi<ExamSummary[]>("/mock-exams", (b) => b.data || []);
  return (
    <>
      <PageHead title="Mock exams" sub="Timed practice in real exam conditions. Pause any time and continue later." />
      {list.error ? (
        <ErrorBox message={list.error} onRetry={list.reload} />
      ) : list.loading ? (
        <div className="p-grid"><Skeleton h={180} n={3} /></div>
      ) : list.data?.length ? (
        <div className="p-grid">
          {list.data.map((e) => (
            <a key={e.courseId} href={`/dashboard/mock-exams/${e.courseId}`} className="p-exam">
              <div className="p-exam__top">
                <span className="p-exam__icon" aria-hidden="true">📝</span>
                {e.inProgress ? (
                  <span className="p-chip p-chip--warn">In progress</span>
                ) : e.attempts ? (
                  <span className="p-chip p-chip--ok">Best {e.bestScore}%</span>
                ) : (
                  <span className="p-chip">Not started</span>
                )}
              </div>
              <h3>{e.title}</h3>
              <p className="muted">
                {e.questionCount} questions · {e.minutes} minutes{e.level ? ` · ${e.level}` : ""}
              </p>
              <div className="p-exam__foot">
                <span>{e.attempts ? `${e.attempts} attempt${e.attempts === 1 ? "" : "s"} · last ${e.lastScore}%` : "Ready when you are"}</span>
                <strong>{e.inProgress ? "Continue →" : e.attempts ? "Retake →" : "Start →"}</strong>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <Empty title="No mock exams yet" action={<a className="pill-btn pill-btn--solid" href="/dashboard/explore">Explore courses</a>}>
          Every course comes with a mock exam. Enroll in a course and its mock exam appears here.
        </Empty>
      )}
    </>
  );
}
