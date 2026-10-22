import type { Metadata } from "next";

export const metadata: Metadata = { title: "Case Study exam tips: making the most of the pre-seen | Excel Academy", description: "The Case Study is different from every other paper. Here's how to analyse the pre-seen and structure a report that scores." };

export default function Page() {
  return (
    <main>
      <article className="prose-page">
        <div className="container prose">
          <p className="prose__eyebrow">
            <a href="/blog">
              ← Blog
            </a>
            · Case Study · 4 min read
          </p>
          <h1>
            Case Study exam tips: making the most of the pre-seen
          </h1>
          <p>
            Many students find the Case Study the hardest step to qualification, often because they prepare for it like any other paper. It rewards a different approach.
          </p>
          <h2>
            1. Know the pre-seen inside out
          </h2>
          <p>
            Read the pre-seen material several times. Summarise the business, its industry, its key people and its numbers. Work out the main risks and opportunities before you ever see the exam requirements.
          </p>
          <h2>
            2. Practise the report format until it's automatic
          </h2>
          <p>
            Marks are given for a clear, professional report. Practise the structure — terms of reference, executive summary, main body with headings, conclusions and recommendations — so you don't waste exam time thinking about layout.
          </p>
          <h2>
            3. Apply, don't just repeat
          </h2>
          <p>
            Examiners want you to use the facts in the case. Every point should link a piece of information from the scenario to an analysis and a recommendation.
          </p>
          <h2>
            4. Manage your time
          </h2>
          <p>
            Plan your time per requirement before you start writing and stick to it. A complete report with reasonable points scores better than a brilliant but unfinished one.
          </p>
          <h2>
            5. Get your practice reports reviewed
          </h2>
          <p>
            Feedback is the fastest way to improve. Having a tutor review your practice reports shows you exactly where marks are being lost.
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
