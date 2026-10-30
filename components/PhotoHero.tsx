import type { ReactNode } from "react";

/** Figma hero on Courses / programme pages: copy left, student photo right with the "15+ tutors" badge. */
export function PhotoHero({ children }: { children: ReactNode }) {
  return (
    <section className="photo-hero">
      <div className="container photo-hero__inner">
        <div className="photo-hero__copy">{children}</div>
        <div className="photo-hero__media">
          <img src="/img/figma/hero-student.webp" alt="A student learning online with Excel Academy" width={583} height={388} />
          <div className="photo-hero__badge">
            <span className="photo-hero__dot" aria-hidden="true" />
            <div>
              <strong>15+</strong>
              <span>Qualified and Certified Tutors</span>
            </div>
            <img src="/img/tutor-1.webp" alt="" width={28} height={28} />
          </div>
        </div>
      </div>
    </section>
  );
}
