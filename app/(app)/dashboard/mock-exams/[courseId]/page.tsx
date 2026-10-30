"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/client";
import { ErrorBox, Skeleton } from "@/components/app/ui";
import type { ExamSummary } from "../page";

type Question = { id: string; question: string; options: string[] };
type ReviewItem = { id: string; question: string; options: string[]; answer: number; chosen: number | null; correct: boolean; explanation: string };
type Result = { score: number; correct: number; incorrect: number; omitted: number; total: number; timeSpentSec: number; review: ReviewItem[]; attempts: number };

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, s % 60)).padStart(2, "0")}`;
const LETTERS = "ABCDEFGH";

/** One mock exam: instructions → timed exam (pause/continue) → results and solutions. */
export default function MockExamPage({ params }: { params: { courseId: string } }) {
  const id = params.courseId;
  const [info, setInfo] = useState<(ExamSummary & { owned?: boolean }) | null>(null),
    [stage, setStage] = useState<"intro" | "exam" | "result">("intro"),
    [questions, setQuestions] = useState<Question[]>([]),
    [answers, setAnswers] = useState<Record<string, number>>({}),
    [index, setIndex] = useState(0),
    [left, setLeft] = useState(0),
    [result, setResult] = useState<Result | null>(null),
    [showSolutions, setShowSolutions] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const leftRef = useRef(0);
  const answersRef = useRef<Record<string, number>>({});
  leftRef.current = left;
  answersRef.current = answers;

  const load = useCallback(async () => {
    setError("");
    try {
      const r = await api<{ data: ExamSummary & { owned?: boolean } }>(`/mock-exams/${id}`);
      setInfo(r.data);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const save = useCallback(async () => {
    await api(`/mock-exams/${id}/save`, {
      method: "POST",
      body: JSON.stringify({ answers: answersRef.current, remainingSec: leftRef.current }),
    }).catch(() => {});
  }, [id]);

  const submit = useCallback(async () => {
    setBusy(true);
    try {
      const r = await api<{ data: Result }>(`/mock-exams/${id}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers: answersRef.current, remainingSec: leftRef.current }),
      });
      setResult(r.data);
      setStage("result");
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [id]);

  // Timer; time running out submits. Progress is saved every 30 seconds.
  useEffect(() => {
    if (stage !== "exam") return;
    const tick = setInterval(() => setLeft((s) => s - 1), 1000);
    const autosave = setInterval(save, 30000);
    return () => { clearInterval(tick); clearInterval(autosave); };
  }, [stage, save]);
  useEffect(() => {
    if (stage === "exam" && left <= 0 && questions.length) submit();
  }, [left, stage, questions.length, submit]);

  // Leaving the page mid-exam saves where they were.
  useEffect(() => {
    if (stage !== "exam") return;
    const warn = (e: BeforeUnloadEvent) => { save(); e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [stage, save]);

  const start = async () => {
    setBusy(true);
    setError("");
    try {
      const r = await api<{ data: { questions: Question[]; answers?: Record<string, number>; remainingSec: number } }>(`/mock-exams/${id}/start`, { method: "POST" });
      setQuestions(r.data.questions);
      setAnswers(r.data.answers || {});
      setLeft(r.data.remainingSec);
      setIndex(0);
      setStage("exam");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const viewLast = async () => {
    try {
      const r = await api<{ data: Result }>(`/mock-exams/${id}/result`);
      setResult(r.data);
      setStage("result");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (error && !info) return <ErrorBox message={error} onRetry={load} />;
  if (!info) return <Skeleton h={320} />;

  /* ---------- results ---------- */
  if (stage === "result" && result) {
    const pass = result.score >= 50;
    return (
      <div className="mx">
        <a className="crumb" href="/dashboard/mock-exams">← Mock exams</a>
        <section className={`mx-result${pass ? " is-pass" : ""}`}>
          <div className="mx-ring" style={{ ["--p" as string]: `${result.score}` }}>
            <strong>{result.score}%</strong>
            <span>score</span>
          </div>
          <div>
            <h1>{pass ? "Well done! 🎉" : "Keep practising 💪"}</h1>
            <p className="muted">{info.title}</p>
            <ul className="mx-tally">
              <li className="ok"><strong>{result.correct}</strong> correct</li>
              <li className="bad"><strong>{result.incorrect}</strong> incorrect</li>
              <li><strong>{result.omitted}</strong> not answered</li>
              <li><strong>{clock(result.timeSpentSec)}</strong> time used</li>
            </ul>
            <div className="buy-pair">
              <button className="pill-btn pill-btn--solid" onClick={() => setShowSolutions((v) => !v)}>
                {showSolutions ? "Hide solutions" : "View solutions"}
              </button>
              <button className="pill-btn" disabled={busy} onClick={start}>Retake exam</button>
            </div>
          </div>
        </section>
        {showSolutions && (
          <ol className="mx-review">
            {result.review.map((q, i) => (
              <li key={q.id} className={q.correct ? "is-correct" : q.chosen == null ? "is-skipped" : "is-wrong"}>
                <p className="mx-review__q"><b>{i + 1}.</b> {q.question}</p>
                <ul>
                  {q.options.map((o, k) => (
                    <li key={k} className={k === q.answer ? "is-answer" : k === q.chosen ? "is-chosen" : undefined}>
                      <span>{LETTERS[k]}</span> {o}
                      {k === q.answer && <em>Correct answer</em>}
                      {k === q.chosen && k !== q.answer && <em>Your answer</em>}
                    </li>
                  ))}
                </ul>
                {q.explanation && <p className="mx-review__why"><b>Explanation:</b> {q.explanation}</p>}
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  }

  /* ---------- exam ---------- */
  if (stage === "exam") {
    const q = questions[index];
    const answered = Object.keys(answers).length;
    const low = left <= 60;
    return (
      <div className="mx mx--exam">
        <div className="mx-bar">
          <div>
            <strong>{info.title}</strong>
            <span className="muted">{answered} of {questions.length} answered</span>
          </div>
          <span className={`mx-timer${low ? " is-low" : ""}`} aria-live="polite">⏱ {clock(left)}</span>
          <div className="buy-pair">
            <button className="pill-btn" onClick={async () => { await save(); location.href = "/dashboard/mock-exams"; }}>Pause & exit</button>
            <button className="pill-btn pill-btn--solid" disabled={busy}
              onClick={() => (answered < questions.length && !confirm(`You've answered ${answered} of ${questions.length}. Submit anyway?`) ? null : submit())}>
              {busy ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>

        {q && (
          <section className="mx-q">
            <p className="mx-q__n">Question {index + 1} of {questions.length}</p>
            <h2>{q.question}</h2>
            <div className="mx-options" role="radiogroup" aria-label={`Question ${index + 1}`}>
              {q.options.map((o, k) => (
                <button key={k} role="radio" aria-checked={answers[q.id] === k} className={answers[q.id] === k ? "is-picked" : undefined}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: k }))}>
                  <span>{LETTERS[k]}</span>{o}
                </button>
              ))}
            </div>
            <div className="mx-nav">
              <button className="pill-btn" disabled={index === 0} onClick={() => setIndex(index - 1)}>← Previous</button>
              <button className="pill-btn pill-btn--solid" disabled={index >= questions.length - 1} onClick={() => setIndex(index + 1)}>Next →</button>
            </div>
          </section>
        )}

        <div className="mx-grid" aria-label="Jump to question">
          {questions.map((qq, i) => (
            <button key={qq.id} className={`${i === index ? "is-current " : ""}${answers[qq.id] != null ? "is-done" : ""}`} onClick={() => setIndex(i)}
              aria-label={`Question ${i + 1}${answers[qq.id] != null ? ", answered" : ""}`}>{i + 1}</button>
          ))}
        </div>
        {error && <p className="auth-error">{error}</p>}
      </div>
    );
  }

  /* ---------- instructions ---------- */
  return (
    <div className="mx">
      <a className="crumb" href="/dashboard/mock-exams">← Mock exams</a>
      <section className="mx-intro">
        <span className="p-exam__icon" aria-hidden="true">📝</span>
        <h1>{info.title}</h1>
        <div className="mx-facts">
          <div><strong>{info.questionCount}</strong><span>Questions</span></div>
          <div><strong>{info.minutes}</strong><span>Minutes</span></div>
          <div><strong>{info.bestScore ?? "–"}{info.bestScore != null ? "%" : ""}</strong><span>Best score</span></div>
          <div><strong>{info.attempts}</strong><span>Attempts</span></div>
        </div>
        <ul className="mx-rules">
          <li>The timer starts when you begin and keeps your remaining time if you pause.</li>
          <li>You can move between questions and change answers until you submit.</li>
          <li>When time runs out, the exam is submitted automatically.</li>
          <li>After submitting you'll see your score and the solutions with explanations.</li>
        </ul>
        {info.owned === false ? (
          <p className="auth-error">Enroll in this course to take its mock exam.</p>
        ) : (
          <div className="buy-pair">
            <button className="pill-btn pill-btn--solid" disabled={busy} onClick={start}>
              {busy ? "Loading…" : info.inProgress ? `Continue (${clock(info.remainingSec || 0)} left)` : info.attempts ? "Retake exam" : "Start exam"}
            </button>
            {info.attempts > 0 && <button className="pill-btn" onClick={viewLast}>View last result</button>}
          </div>
        )}
        {error && <p className="auth-error">{error}</p>}
      </section>
    </div>
  );
}
