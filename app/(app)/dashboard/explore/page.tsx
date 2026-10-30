"use client";
import { useEffect, useMemo, useState } from "react";
import { useApi } from "@/lib/useApi";
import { type Course, PROGRAMMES, programme, programmeOf } from "@/lib/catalogue";
import { CourseCard, ProgrammeCourses } from "@/components/ProgrammeCourses";
import { ErrorBox, PageHead, Skeleton } from "@/components/app/ui";

/** The full catalogue inside the app: programme chips, levels, search. */
export default function ExplorePage() {
  const cat = useApi<Course[]>("/all-courses", (b) => ((b.AllCourses || []) as Course[]).filter((c) => Number((c as { status?: number }).status ?? 1) === 1));
  const [code, setCode] = useState("ICAN"),
    [q, setQ] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (p.get("q")) setQ(p.get("q") || "");
    if (p.get("program") && programme(p.get("program") || "")) setCode((p.get("program") || "").toUpperCase());
  }, []);

  const all = cat.data || [];
  const present = PROGRAMMES.filter((p) => all.some((c) => programmeOf(c) === p.code));
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? all.filter((c) => c.title.toLowerCase().includes(s) || (c.description || "").toLowerCase().includes(s)) : [];
  }, [all, q]);
  const prog = programme(code) || PROGRAMMES[0];

  return (
    <>
      <PageHead title="Explore courses" sub="Every programme and level, the same as in the app." />
      <input className="p-searchbar" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search all courses, e.g. Financial Reporting" aria-label="Search courses" />
      {cat.error ? (
        <ErrorBox message={cat.error} onRetry={cat.reload} />
      ) : cat.loading ? (
        <div className="fgrid"><Skeleton h={260} n={8} /></div>
      ) : q.trim() ? (
        <>
          <h2 className="p-sub">{results.length} result{results.length === 1 ? "" : "s"} for “{q.trim()}”</h2>
          <div className="fgrid">{results.map((c) => <CourseCard key={c.id} c={c} programme={programmeOf(c) === "PD" ? "Professional Development" : programmeOf(c)} />)}</div>
        </>
      ) : (
        <>
          <div className="p-chips" role="tablist" aria-label="Programmes">
            {present.map((p) => (
              <button key={p.code} role="tab" aria-selected={p.code === code} className={p.code === code ? "is-active" : undefined}
                onClick={() => { setCode(p.code); history.replaceState(null, "", `?program=${p.code}`); }}>
                {p.code === "PD" ? "Professional Development" : p.code}
              </button>
            ))}
          </div>
          <h2 className="p-sub">{prog.name}</h2>
          <ProgrammeCourses code={prog.code} levels={prog.levels} courses={all.filter((c) => programmeOf(c) === prog.code)} />
        </>
      )}
    </>
  );
}
