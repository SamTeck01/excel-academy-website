import type { Metadata } from "next";

export const metadata: Metadata = { title: "Getting the most from mock exams | Excel Academy", description: "Mock exams are your best rehearsal for the real thing — if you use them properly. Here's how." };

export default function Page() {
  return (
    <main>
      <article className="prose-page">
        <div className="container prose">
          <p className="prose__eyebrow">
            <a href="/blog">
              ← Blog
            </a>
            · Exam technique · 3 min read
          </p>
          <h1>
            Getting the most from mock exams
          </h1>
          <p>
            A mock exam is not just a test of what you know. It is a rehearsal of exam day, and the way you use it decides how much it helps.
          </p>
          <h2>
            1. Treat it like the real exam
          </h2>
          <p>
            Sit it in one go, in the time allowed, without notes. This builds the stamina and time management you'll need on the day.
          </p>
          <h2>
            2. Review every answer, not just your score
          </h2>
          <p>
            Go through each question and ask why you lost marks. Was it a knowledge gap, poor time management, or not answering the actual requirement?
          </p>
          <h2>
            3. Keep an error log
          </h2>
          <p>
            Write down each mistake and the correct approach. Read this log in the final days before your exam — it is a revision guide built around your own weak spots.
          </p>
          <h2>
            4. Re-attempt weak questions
          </h2>
          <p>
            A week later, try the questions you got wrong again without looking at the solution. If you can now answer them, the learning has stuck.
          </p>
          <h2>
            5. Use marking and feedback
          </h2>
          <p>
            Where mock marking is available, use it. An experienced marker can see things in your answers that you can't.
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
