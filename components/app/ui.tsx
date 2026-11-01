"use client";
import type { ReactNode } from "react";
import { thumb } from "@/lib/catalogue";
import type { MyCourse } from "@/lib/useApi";

/** Shimmer placeholders while data loads. */
export function Skeleton({ h = 120, n = 1, className = "" }: { h?: number; n?: number; className?: string }) {
  return <>{Array.from({ length: n }, (_, i) => <div key={i} className={`sk ${className}`} style={{ height: h }} />)}</>;
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="p-error" role="alert">
      <p>{message}</p>
      {onRetry && <button className="pill-btn" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export function Empty({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="p-empty">
      <img src="/img/library-illustration.webp" alt="" width={160} height={120} />
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="p-head">
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Progress({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value || 0)));
  return (
    <div className="p-progress" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${v}%` }} />
    </div>
  );
}

/** A course the student is enrolled in, with progress. */
export function MyCourseCard({ c }: { c: MyCourse }) {
  const pct = Math.round(c.progress?.percentage || 0);
  const done = c.progress?.lessons_completed || 0;
  const total = c.progress?.total_lessons || c.lessonCount || 0;
  return (
    <a href={`/learn/${c.id}`} className="p-ccard">
      <div className="p-ccard__img"><img src={thumb(c)} alt="" loading="lazy" /></div>
      <div className="p-ccard__body">
        <span className="p-ccard__tag">{c.program || "Course"}{c.level ? ` · ${c.level}` : ""}</span>
        <h3>{c.title}</h3>
        <Progress value={pct} />
        <div className="p-ccard__foot">
          <span>{total ? `${done}/${total} lessons` : "Start learning"}</span>
          <strong>{pct >= 100 ? "Completed" : pct ? `${pct}%` : "New"}</strong>
        </div>
      </div>
    </a>
  );
}
