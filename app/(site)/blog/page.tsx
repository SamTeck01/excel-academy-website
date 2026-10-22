import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog | Excel Academy", description: "Study tips, exam technique and updates from Excel Academy." };

export default function Page() {
  return (
    <main>
      <section className="prose-page">
        <div className="container">
          <div className="section-head blog-head">
            <h1>
              Excel Academy Blog
            </h1>
            <p>
              Study tips, exam technique and guidance to help you prepare for your professional exams.
            </p>
          </div>
          <div className="blog-grid">
            <article className="blog-card">
              <p className="blog-card__meta">
                Study tips · 4 min read
              </p>
              <h2>
                <a href="/blog/how-to-prepare-for-ican-exams">
                  How to prepare for your ICAN exams: a practical study plan
                </a>
              </h2>
              <p>
                A simple, week-by-week approach to covering the syllabus, practising questions and walking into the exam hall confident.
              </p>
              <a href="/blog/how-to-prepare-for-ican-exams" className="blog-card__link">
                Read article →
              </a>
            </article>
            <article className="blog-card">
              <p className="blog-card__meta">
                Case Study · 4 min read
              </p>
              <h2>
                <a href="/blog/case-study-exam-tips">
                  Case Study exam tips: making the most of the pre-seen
                </a>
              </h2>
              <p>
                The Case Study is different from every other paper. Here's how to analyse the pre-seen and structure a report that scores.
              </p>
              <a href="/blog/case-study-exam-tips" className="blog-card__link">
                Read article →
              </a>
            </article>
            <article className="blog-card">
              <p className="blog-card__meta">
                Exam technique · 3 min read
              </p>
              <h2>
                <a href="/blog/getting-the-most-from-mock-exams">
                  Getting the most from mock exams
                </a>
              </h2>
              <p>
                Mock exams are your best rehearsal for the real thing — if you use them properly. Here's how.
              </p>
              <a href="/blog/getting-the-most-from-mock-exams" className="blog-card__link">
                Read article →
              </a>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
