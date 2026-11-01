"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, useStore } from "@/lib/client";
import { useApi } from "@/lib/useApi";
import { programme } from "@/lib/catalogue";
import { ErrorBox, PageHead, Skeleton } from "@/components/app/ui";

/** The same game as the app's EXCEL-BEAT-DA-SCORE: same programmes, rules and points. */
const PROGRAMS = ["ICAN", "ACCA", "CITN", "CIMA", "CIS", "ANAN", "CIBN", "CFA", "CPA", "CIPM"];
const SECONDS = 25;
const POINTS = 8;
const MATCH_WAIT = 30;
const LETTERS = "ABCDEFGH";

type Q = { id: string; question: string; options: string[] };
type BotMove = { correct: boolean; atSec: number };
type Opponent = { name: string; points: number; finished: boolean };
type Game = { sessionId?: string; matchId?: string; program: string; questions: Q[]; botPlan: BotMove[]; opponent: string };
type Final = { points: number; correct: number; total: number; opponentName: string; opponentPoints: number; pending: boolean };
type Entry = { rank: number; uid: string; name: string; photo?: string | null; points: number; movedUp?: boolean };
type Period = "daily" | "weekly" | "monthly" | "allTime";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const initial = (n: string) => (n || "?").trim().charAt(0).toUpperCase();

export default function ChallengesPage() {
  const [stage, setStage] = useState<"lobby" | "finding" | "play" | "final">("lobby"),
    [game, setGame] = useState<Game | null>(null),
    [final, setFinal] = useState<Final | null>(null),
    [status, setStatus] = useState(""),
    [error, setError] = useState(""),
    [program, setProgram] = useState(""),
    cancelled = useRef(false),
    openMatch = useRef<string | null>(null);

  const playBot = useCallback(async (p: string, note = "") => {
    setStatus(note || "Loading questions…");
    const r = await api<{ data: { id: string; questions: Q[]; botPlan: BotMove[] } }>("/quiz/session", { method: "POST", body: JSON.stringify({ program: p }) });
    if (cancelled.current) return;
    setGame({ sessionId: r.data.id, program: p, questions: r.data.questions, botPlan: r.data.botPlan || [], opponent: "Excel Bot" });
    setStage("play");
  }, []);

  const start = async (vsReal: boolean) => {
    cancelled.current = false;
    setError("");
    setStage("finding");
    try {
      if (!vsReal) return await playBot(program);
      setStatus("Finding an opponent…");
      type M = { id: string; status: string; questions: Q[]; opponent: { name: string } | null };
      let m = (await api<{ data: M }>("/quiz/match", { method: "POST", body: JSON.stringify({ program }) })).data;
      openMatch.current = m.id;
      const deadline = Date.now() + MATCH_WAIT * 1000;
      while (m.status === "waiting") {
        await wait(2000);
        if (cancelled.current) return;
        if (Date.now() > deadline) {
          await api(`/quiz/match/${m.id}`, { method: "DELETE" }).catch(() => {});
          openMatch.current = null;
          setStatus("No one is free right now. Playing Excel Bot…");
          await wait(1500);
          if (!cancelled.current) await playBot(program, "No one is free right now. Playing Excel Bot…");
          return;
        }
        m = (await api<{ data: M }>(`/quiz/match/${m.id}`).catch(() => ({ data: m }))).data;
      }
      openMatch.current = null;
      setGame({ matchId: m.id, program, questions: m.questions, botPlan: [], opponent: m.opponent?.name || "Opponent" });
      setStage("play");
    } catch (e) {
      if (cancelled.current) return;
      setError((e as Error).message);
      setStage("lobby");
    }
  };

  const stopFinding = () => {
    cancelled.current = true;
    if (openMatch.current) api(`/quiz/match/${openMatch.current}`, { method: "DELETE" }).catch(() => {});
    openMatch.current = null;
    setStage("lobby");
  };

  if (stage === "finding")
    return (
      <section className="gm-wait" role="status">
        <div className="gm-pulse" aria-hidden="true">VS</div>
        <h1>{program}</h1>
        <p>{status}</p>
        <button className="pill-btn" onClick={stopFinding}>Cancel</button>
      </section>
    );
  if (stage === "play" && game)
    return <Play game={game} onQuit={() => setStage("lobby")} onDone={(f) => { setFinal(f); setStage("final"); }} />;
  if (stage === "final" && final && game)
    return <Result final={final} matchId={game.matchId} onAgain={() => setStage("lobby")} />;
  return <Lobby program={program} setProgram={setProgram} error={error} onStart={start} />;
}

/* ---------------------------------------------------------- lobby */

function Lobby({ program, setProgram, error, onStart }: { program: string; setProgram: (p: string) => void; error: string; onStart: (real: boolean) => void }) {
  const stats = useApi<{ games: number; bestScore: number; totalPoints: number; rank: number | null }>("/quiz/me", (b) => b.data);
  return (
    <>
      <PageHead title="Challenges" sub="Beat Da Score: answer against the clock, earn points and climb the leaderboard." />
      <div className="gm-stats">
        {([["Points", stats.data?.totalPoints], ["Rank", stats.data?.rank ? `#${stats.data.rank}` : "–"], ["Games", stats.data?.games], ["Best score", stats.data?.bestScore]] as const).map(([k, v]) => (
          <div key={k}><strong>{stats.loading ? "–" : (v ?? 0).toLocaleString()}</strong><span>{k}</span></div>
        ))}
      </div>

      <h2 className="gm-h2">1. Choose your programme</h2>
      <div className="gm-programs">
        {PROGRAMS.map((p) => (
          <button key={p} className={program === p ? "is-picked" : undefined} aria-pressed={program === p} onClick={() => setProgram(p)}>
            {programme(p)?.logo ? <img src={programme(p)!.logo} alt="" width={36} height={36} /> : <span className="gm-initial" aria-hidden="true">{p[0]}</span>}
            {p}
          </button>
        ))}
      </div>

      <h2 className="gm-h2">2. Pick your opponent</h2>
      <div className="gm-versus">
        <button disabled={!program} onClick={() => onStart(false)}>
          <strong>Play Excel Bot</strong>
          <span>Starts right away</span>
        </button>
        <button disabled={!program} onClick={() => onStart(true)}>
          <strong>Play a real student</strong>
          <span>Web or app. If no one joins in {MATCH_WAIT} seconds, you play Excel Bot</span>
        </button>
      </div>
      {!program && <p className="muted gm-hint">Choose a programme first.</p>}
      {error && <p className="auth-error">{error}</p>}
      <p className="muted gm-hint">10 questions, {SECONDS} seconds each, {POINTS} points per right answer. Your first tap is final.</p>

      <Leaderboard />
    </>
  );
}

/* ------------------------------------------------------ leaderboard */

function Leaderboard() {
  const { user } = useStore();
  const [period, setPeriod] = useState<Period>("weekly");
  const board = useApi<{ entries: Entry[]; me: Entry | null }>(`/quiz/leaderboard?period=${period}`, (b) => ({ entries: b.data?.entries || [], me: b.data?.me || null }));
  const entries = board.data?.entries || [];
  const me = board.data?.me;
  const row = (e: Entry) => (
    <li key={e.uid} className={e.uid === user?.uid ? "is-me" : undefined}>
      <b>{e.rank}</b>
      {e.photo ? <img src={e.photo} alt="" width={36} height={36} /> : <span className="gm-initial" aria-hidden="true">{initial(e.name)}</span>}
      <span className="gm-name">{e.name}{e.uid === user?.uid ? " (you)" : ""}</span>
      <strong>{e.points.toLocaleString()}</strong>
    </li>
  );
  return (
    <section className="gm-board">
      <h2 className="gm-h2">Leaderboard</h2>
      <div className="p-chips">
        {([["daily", "Today"], ["weekly", "This week"], ["monthly", "This month"], ["allTime", "All time"]] as const).map(([k, l]) => (
          <button key={k} className={period === k ? "is-active" : undefined} onClick={() => setPeriod(k)}>{l}</button>
        ))}
      </div>
      {board.error ? (
        <ErrorBox message={board.error} onRetry={board.reload} />
      ) : board.loading ? (
        <Skeleton h={56} n={4} />
      ) : entries.length ? (
        <ol>
          {entries.map(row)}
          {me && !entries.some((e) => e.uid === me.uid) && row(me)}
        </ol>
      ) : (
        <p className="muted">No one has played in this period yet. Be the first!</p>
      )}
    </section>
  );
}

/* ------------------------------------------------------------- game */

function Play({ game, onDone, onQuit }: { game: Game; onDone: (f: Final) => void; onQuit: () => void }) {
  const [index, setIndex] = useState(0),
    [left, setLeft] = useState(SECONDS),
    [picked, setPicked] = useState<number | null>(null),
    [checking, setChecking] = useState(false),
    [revealed, setRevealed] = useState<number[] | null>(null),
    [points, setPoints] = useState(0),
    [theirs, setTheirs] = useState(0),
    [finishing, setFinishing] = useState(false),
    [error, setError] = useState(""),
    [reporting, setReporting] = useState(false),
    [reason, setReason] = useState(""),
    [reportNote, setReportNote] = useState(""),
    botDone = useRef(new Set<number>());

  const q = game.questions[index];
  const last = index >= game.questions.length - 1;
  const answerPath = game.matchId ? `/quiz/match/${game.matchId}/answer` : `/quiz/session/${game.sessionId}/answer`;

  const botAnswer = useCallback((i: number) => {
    if (game.matchId || i >= game.botPlan.length || botDone.current.has(i)) return;
    botDone.current.add(i);
    if (game.botPlan[i].correct) setTheirs((t) => t + POINTS);
  }, [game]);

  const answer = useCallback(async (choice: number | null) => {
    setChecking(true);
    setPicked(choice);
    setError("");
    try {
      const r = await api<{ data: { correct: boolean; correctOptions: number[]; match?: { opponent?: Opponent | null } } }>(answerPath, {
        method: "POST",
        body: JSON.stringify({ questionId: q.id, choice }),
      });
      setRevealed(r.data.correctOptions || []);
      if (r.data.correct) setPoints((p) => p + POINTS);
      if (r.data.match?.opponent) setTheirs(r.data.match.opponent.points);
    } catch {
      setRevealed([]);
      setError("Could not check that answer. Check your connection.");
    } finally {
      setChecking(false);
    }
  }, [answerPath, q]);

  // The clock for each question; Excel Bot answers at its planned moment.
  useEffect(() => {
    if (revealed || checking) return;
    const t = setInterval(() => {
      setLeft((s) => {
        if (SECONDS - s + 1 >= (game.botPlan[index]?.atSec ?? Infinity)) botAnswer(index);
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [revealed, checking, index, game, botAnswer]);
  useEffect(() => {
    if (left <= 0 && !revealed && !checking) answer(null);
  }, [left, revealed, checking, answer]);

  // A real opponent's score, live.
  useEffect(() => {
    if (!game.matchId) return;
    const t = setInterval(() => {
      api<{ data: { opponent?: Opponent | null } }>(`/quiz/match/${game.matchId}`)
        .then((r) => r.data.opponent && setTheirs(r.data.opponent.points))
        .catch(() => {});
    }, 2000);
    return () => clearInterval(t);
  }, [game.matchId]);

  // Stops a stray refresh from throwing the game away.
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  const next = async () => {
    botAnswer(index);
    if (!last) {
      setIndex(index + 1);
      setLeft(SECONDS);
      setPicked(null);
      setRevealed(null);
      setReportNote("");
      setError("");
      return;
    }
    setFinishing(true);
    try {
      const r = await api<{ data: Final }>("/quiz/results", {
        method: "POST",
        body: JSON.stringify(game.matchId ? { matchId: game.matchId } : { sessionId: game.sessionId }),
      });
      onDone(r.data);
    } catch (e) {
      setError((e as Error).message);
      setFinishing(false);
    }
  };

  const sendReport = async () => {
    try {
      await api("/quiz/report", { method: "POST", body: JSON.stringify({ questionId: q.id, reason }) });
      setReportNote("Thanks, we'll review this question.");
    } catch (e) {
      setReportNote((e as Error).message);
    }
    setReporting(false);
    setReason("");
  };

  if (!q) return <ErrorBox message="This game has no questions." onRetry={onQuit} />;
  const low = left <= 5;
  return (
    <div className="gm-play">
      <div className="gm-score">
        <div><span>You</span><strong>{points}</strong></div>
        <div className={`gm-clock${low ? " is-low" : ""}`} style={{ ["--p" as string]: `${(left / SECONDS) * 100}` }} role="timer" aria-label={`${left} seconds left`}>
          <b>{Math.max(left, 0)}</b>
        </div>
        <div className="gm-them"><span>{game.opponent}</span><strong>{theirs}</strong></div>
      </div>
      <p className="gm-count">{game.program} · Question {index + 1} of {game.questions.length}</p>
      <div className="gm-bar" aria-hidden="true"><span style={{ width: `${((index + (revealed ? 1 : 0)) / game.questions.length) * 100}%` }} /></div>

      <section className="gm-card">
        <h2>{q.question}</h2>
        <div className="gm-options">
          {q.options.map((o, k) => {
            const right = revealed?.includes(k);
            const wrong = revealed && picked === k && !right;
            return (
              <button key={k} disabled={checking || !!revealed} className={right ? "is-right" : wrong ? "is-wrong" : picked === k ? "is-picked" : undefined} onClick={() => answer(k)}>
                <span>{LETTERS[k]}</span>{o}
              </button>
            );
          })}
        </div>
        {revealed && (
          <p className={`gm-verdict${picked !== null && revealed.includes(picked) ? " is-right" : ""}`} role="status">
            {picked === null ? (left > 0 ? "Skipped." : "Time's up!") : revealed.includes(picked) ? `Correct! +${POINTS} points` : "Not this time."}
          </p>
        )}
        {error && <p className="auth-error">{error}</p>}
        <div className="gm-actions">
          <button className="gm-link" onClick={() => setReporting(true)}>Report question</button>
          {!revealed ? (
            <button className="pill-btn" disabled={checking} onClick={() => answer(null)}>Skip</button>
          ) : (
            <button className="pill-btn pill-btn--solid" disabled={finishing} onClick={next}>
              {finishing ? "Finishing…" : last ? "See my score" : "Next question"}
            </button>
          )}
        </div>
        {reportNote && <p className="muted" role="status">{reportNote}</p>}
        {reporting && (
          <div className="gm-report">
            <label htmlFor="gm-reason">What is wrong with this question?</label>
            <textarea id="gm-reason" rows={3} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. the marked answer is incorrect" />
            <div className="gm-actions">
              <button className="gm-link" onClick={() => setReporting(false)}>Cancel</button>
              <button className="pill-btn" onClick={sendReport}>Send report</button>
            </div>
          </div>
        )}
      </section>
      <button className="gm-link gm-quit" onClick={() => confirm("Leave this game? It won't count towards your points.") && onQuit()}>Leave game</button>
    </div>
  );
}

/* ----------------------------------------------------------- result */

function Result({ final, matchId, onAgain }: { final: Final; matchId?: string; onAgain: () => void }) {
  const [theirs, setTheirs] = useState(final.opponentPoints),
    [pending, setPending] = useState(final.pending);

  // The other player may still be answering; wait up to 90 seconds, as the app does.
  useEffect(() => {
    if (!pending || !matchId) return;
    let live = true;
    (async () => {
      const deadline = Date.now() + 90000;
      while (live && Date.now() < deadline) {
        await wait(2000);
        const r = await api<{ data: { opponent?: Opponent | null } }>(`/quiz/match/${matchId}`).catch(() => null);
        if (r?.data.opponent?.finished) {
          if (live) {
            setTheirs(r.data.opponent.points);
            setPending(false);
          }
          return;
        }
      }
    })();
    return () => { live = false; };
  }, [pending, matchId]);

  const headline = pending ? "Nice game!" : final.points > theirs ? "You won!" : final.points === theirs ? "It's a draw!" : "Good try!";
  return (
    <section className="gm-result">
      <h1>{headline}</h1>
      <div className="gm-final">
        <div className="is-you"><span>You</span><strong>{final.points}</strong></div>
        <em>vs</em>
        <div><span>{final.opponentName}</span><strong>{pending ? "…" : theirs}</strong></div>
      </div>
      <p className="muted" role="status">
        {pending ? `Waiting for ${final.opponentName} to finish. We'll also notify you when the result is in.` : `You got ${final.correct} of ${final.total} right. Your points now count on the leaderboard.`}
      </p>
      <button className="pill-btn pill-btn--solid" onClick={onAgain}>Play again</button>
    </section>
  );
}
