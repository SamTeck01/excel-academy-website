import type { Metadata } from "next";

export const metadata: Metadata = { title: "How to prepare for your ICAN exams: a practical study plan | Excel Academy", description: "A simple, week-by-week approach to covering the syllabus, practising questions and walking into the exam hall confident." };

export default function Page() {
  return (
    <main>
      <article className="prose-page">
        <div className="container prose">
          <p className="prose__eyebrow">
            <a href="/blog">
              ← Blog
            </a>
            · Study tips · 4 min read
          </p>
          <h1>
            How to prepare for your ICAN exams: a practical study plan
          </h1>
          <p>
            Passing an ICAN paper is less about studying for long hours and more about studying in the right order. Here is a plan you can adapt to your own diet.
          </p>
          <h2>
            1. Start with the syllabus, not the textbook
          </h2>
          <p>
            Download the current syllabus for each paper and list every topic. This becomes your checklist. It also shows you which areas carry the most weight, so you can give them more time.
          </p>
          <h2>
            2. Build a weekly timetable you can keep
          </h2>
          <p>
            Divide the weeks before your exam into three phases: learning the topics, practising questions, and revision with full mock exams. A realistic plan of one to two focused hours a day beats an ambitious plan you abandon after a week.
          </p>
          <h2>
            3. Learn, then practise immediately
          </h2>
          <p>
            After each lecture or set of notes, attempt practice questions on that topic the same day. Answering questions is what turns understanding into marks.
          </p>
          <h2>
            4. Use past questions early
          </h2>
          <p>
            Past questions show you how examiners think: the wording they use, how marks are split and which topics come up often. Don't save them for the last week.
          </p>
          <h2>
            5. Sit full mock exams under exam conditions
          </h2>
          <p>
            Time yourself, put your phone away and write complete answers. Then review your script honestly or have it marked. Every mistake you find in a mock is one you won't make in the real exam.
          </p>
          <h2>
            6. Ask for help when you get stuck
          </h2>
          <p>
            Don't spend days stuck on one topic. A short explanation from a tutor can save you hours. At Excel Academy, our tutors and mock marking are there exactly for this.
          </p>
          <div className="prose__cta">
            <p>
              Ready to start preparing with expert tutors, notes and mock exams?
            </p>
            <a href="/courses" className="btn btn--primary">
              Explore courses
            </a>
          </div>
        </div>
      </article>
    </main>
  );
}
