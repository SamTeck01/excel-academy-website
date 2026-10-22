import type { Metadata } from "next";

export const metadata: Metadata = { title: "About us | Excel Academy", description: "Excel Academy is the leading online tuition provider for ICAN, ACCA, CIMA, CITN and other Accounting & Finance professional programs." };

export default function Page() {
  return (
    <main>
      <section className="hero hero--about">
        <div className="container hero__top">
          <h1 className="hero__title">
            What you need to know
            <span className="hero__underline">
              about us
              <img src="/img/underline.svg" alt="" aria-hidden="true" />
            </span>
            <span className="hero__medal" aria-hidden="true">
              📝
            </span>
          </h1>
          <div className="hero__copy">
            <p>
              Excel Academy is the leading online tuition provider for professional programs which includes ICAN, ACCA, CIMA, CITN, etc. We deliver premium lectures for Accounting and Finance Professional programs at a low-cost and we work with prize-winning tutors with proven track record.
            </p>
            <p>
              Excel Academy has achieved this combination of premium lectures and low-cost by combining streamlined online delivery with a small core team of dedicated experts. This has allowed us to scale premium lectures and enable cost savings to the students.
            </p>
          </div>
        </div>
        <div className="hero__media">
          <img className="about__banner" src="/img/about-illustration.webp" alt="" aria-hidden="true" width="2400" height="802" />
        </div>
      </section>
      <section className="section staff">
        <div className="container staff__inner">
          <img className="staff__photo" src="/img/about-portrait.webp" alt="Excel Academy staff member" width="381" height="381" loading="lazy" />
          <blockquote className="staff__quote">
            Everyday at Excel Academy is a blessing with the active learners and talented staff members around.
          </blockquote>
        </div>
      </section>
      <section className="section track">
        <div className="container">
          <h2 className="track__title">
            Our track record at a glance
          </h2>
          <div className="track__card">
            <dl className="track__stats">
              <div>
                <dt>
                  500+
                </dt>
                <dd>
                  Current Enrollments
                </dd>
              </div>
              <div>
                <dt>
                  15+
                </dt>
                <dd>
                  Qualified and Certified Tutors
                </dd>
              </div>
              <div>
                <dt>
                  2k+
                </dt>
                <dd>
                  Alumni
                </dd>
              </div>
              <div>
                <dt>
                  4.9/5.0
                </dt>
                <dd>
                  Student Reviews
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      <section className="section values">
        <h2 className="values__title">
          What we stand by
        </h2>
        <dl className="values__list">
          <div className="values__item">
            <div className="container">
              <dt>
                Our Motto
              </dt>
              <dd>
                Achieving Success.
              </dd>
            </div>
          </div>
          <div className="values__item">
            <div className="container">
              <dt>
                Our Mission
              </dt>
              <dd>
                We inspire students to achieve over and beyond their potential by offering high quality lectures and guidance.
              </dd>
            </div>
          </div>
          <div className="values__item">
            <div className="container">
              <dt>
                Our Vision
              </dt>
              <dd>
                To become the most resourceful and No 1 Tuition provider for Accounting and Finance professional programs.
              </dd>
            </div>
          </div>
        </dl>
      </section>
    </main>
  );
}
