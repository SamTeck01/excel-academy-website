"use client";
import { useState } from "react";
import { Icon } from "@/components/Icon";

export type Lesson = { _id: string; lesson_name: string; modules: { _id: string; module_name: string; hasVideo?: boolean }[] };
export type Review = { uid: string; name?: string; rating: number; comment?: string; createdAt?: string };

const WHATSAPP = "2348094579949";

/** Figma tabs under "Course includes": View course details | Reviews | Q&A. */
export function CourseTabs({ lessons, reviews, title }: { lessons: Lesson[]; reviews: Review[]; title: string }) {
  const [tab, setTab] = useState<"details" | "reviews" | "qa">("details");
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="ctabs">
      <div className="ctabs__bar" role="tablist">
        {([["details", "View course details"], ["reviews", "Reviews"], ["qa", "Q&A"]] as const).map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "is-active" : undefined} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </div>

      {tab === "details" && (
        <div className="ctabs__panel" role="tabpanel">
          {!lessons.length && <p className="muted">The lesson list will appear here soon.</p>}
          {lessons.map((l, i) => (
            <div key={l._id || i} className="csec">
              <button className="csec__head" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{l.lesson_name || `Section ${i + 1}`}</span>
                <small>{l.modules.length} lessons</small>
              </button>
              {open === i && (
                <ul>
                  {l.modules.map((m) => (
                    <li key={m._id}>
                      <span className="csec__icon"><Icon name={m.hasVideo === false ? "file" : "play"} size={15} /></span>
                      <span>{m.module_name}</span>
                      <span className="csec__lock" title="Unlocks after enrolling"><Icon name="lock" size={15} /></span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "reviews" && (
        <div className="ctabs__panel" role="tabpanel">
          {reviews.length ? (
            <ul className="reviews">
              {reviews.slice(0, 30).map((r, i) => (
                <li key={r.uid || i}>
                  <strong>{r.name || "Student"}</strong> <span className="stars" aria-label={`${r.rating} out of 5`}>{"★".repeat(Math.round(r.rating))}</span>
                  {r.comment && <p>{r.comment}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No reviews yet. Enrolled students can rate this course after watching it.</p>
          )}
        </div>
      )}

      {tab === "qa" && (
        <div className="ctabs__panel" role="tabpanel">
          <p className="muted">Have a question about this course before you enroll? Our team answers on WhatsApp.</p>
          <a
            className="btn btn--ghost"
            target="_blank"
            rel="noopener"
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hello Excel Academy, I have a question about "${title}".`)}`}>
            Ask a question
          </a>
        </div>
      )}
    </div>
  );
}
