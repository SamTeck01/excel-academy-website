import { CtaLink } from "@/components/CtaLink";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Excel Academy | Pass your Accounting & Finance exams", description: "Everything you need to pass your ICAN, ACCA and other Accounting & Finance exams. Lectures, summary notes, mock exams and tutor support from Excel Academy." };

export default function Page() {
  return (
    <main>
      <section className="hero">
        <div className="container hero__top">
          <h1 className="hero__title">
            It's time to gear up your
            <span className="hero__underline">
              preparation
              <img src="/img/underline.svg" alt="" aria-hidden="true" />
            </span>
            <span className="hero__medal" aria-hidden="true">
              🥇
            </span>
          </h1>
          <CtaLink href="/courses" className="btn btn--primary btn--lg hero__cta">
            Let’s get started
          </CtaLink>
          <div className="hero__copy">
            <p>
              Everything you need to pass your Accounting &amp; Finance exams is here! Over 5,000+ students have chosen Excel Academy as their trusted online study partner.
            </p>
            <ul className="checklist">
              <li>
                Complex topics made simple by prizewinning tutors
              </li>
              <li>
                Huge bank of questions &amp; mocks modelled on real exams
              </li>
              <li>
                When you get stuck, our team of experts is here to help
              </li>
            </ul>
          </div>
        </div>
        <div className="hero__media">
          <img className="hero__img" src="/img/hero.webp" alt="Smiling student with a headset studying on her laptop" width="2048" height="1365" />
          <img className="hero__badge" src="/img/hero-badge.svg" alt="" aria-hidden="true" />
          <div className="stat-pills" tabIndex={0} aria-label="Excel Academy at a glance">
            <div className="stat-pill stat-pill--dark stat-pill--blue">
              <span className="stat-pill__icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.5 13 17 22l-5-3-5 3 1.5-9" />
                </svg>
              </span>
              <strong>
                2000+
              </strong>
              <span className="stat-pill__label">
                Alumni
              </span>
            </div>
            <div className="stat-pill stat-pill--dark stat-pill--purple">
              <span className="stat-pill__icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 19V5a2 2 0 0 1 2-2h12v14H6a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12" />
                </svg>
              </span>
              <strong>
                500+
              </strong>
              <span className="stat-pill__label">
                Current enrollments
              </span>
            </div>
            <div className="stat-pill stat-pill--light">
              <span className="stat-pill__icon stat-pill__icon--moon" />
              <strong>
                15+
              </strong>
              <span className="stat-pill__avatars" aria-hidden="true">
                <img src="/img/tutor-1.webp" alt="" />
                <img src="/img/tutor-2.webp" alt="" />
                <img src="/img/tutor-3.webp" alt="" />
              </span>
              <span className="stat-pill__label">
                Qualified and Certified Tutors
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="section why">
        <div className="container">
          <div className="section-head">
            <h2>
              Why choose Excel Academy?
            </h2>
            <p>
              With our programs, you will receive comprehensive class notes for each topic, as well as opportunities for practice through provided questions, past exam questions, and video lectures.
            </p>
            <a href="/about" className="btn btn--primary">
              Know more about us
            </a>
          </div>
          <div className="why__grid">
            <article className="feature-card">
              <span className="feature-card__icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                </svg>
              </span>
              <h3>
                Simplified Learning
              </h3>
              <p>
                We offer structured learning plan and self paced online courses which are available at anytime and accessible anywhere.
              </p>
            </article>
            <article className="feature-card">
              <span className="feature-card__icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="9" r="6" />
                  <path d="m8.2 13.6-1.2 7.4 5-3 5 3-1.2-7.4" />
                  <circle cx="12" cy="9" r="2" />
                </svg>
              </span>
              <h3>
                Excellent Study Support
              </h3>
              <p>
                We offer personalised support in the form of mock markings, calls with tutors, 1 on 1 mentorship and personal coaching with quality lecture contents.
              </p>
            </article>
            <article className="feature-card feature-card--wide">
              <div className="feature-card__body">
                <span className="feature-card__icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                  </svg>
                </span>
                <h3>
                  Loaded library of on&#8209;demand lecture contents
                </h3>
                <p>
                  With us, you get class notes on each topic, practice questions, past questions and video lectures across all our programs.
                </p>
              </div>
              <div className="feature-card__art">
                <img src="/img/library-illustration.webp" alt="" aria-hidden="true" loading="lazy" />
              </div>
            </article>
          </div>
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
      <section className="section courses">
        <div className="container">
          <div className="section-head">
            <h2>
              Explore our courses
            </h2>
            <p>
              Make learning simple and affordable by studying with us at Excel Academy.
            </p>
            <CtaLink href="/courses" className="btn btn--primary">
              Explore courses
            </CtaLink>
          </div>
          <div className="segmented" role="tablist" aria-label="Course categories">
            <button role="tab" id="tab-af" aria-selected="true" aria-controls="panel-af">
              Accounting &amp; Finance
            </button>
            <button role="tab" id="tab-pd" aria-selected="false" aria-controls="panel-pd" tabIndex={-1}>
              Professional Development
            </button>
          </div>
          <div className="course-panel" id="panel-af" role="tabpanel" aria-labelledby="tab-af">
            <article className="course-row">
              <div className="course-row__text">
                <img className="course-row__logo" src="/img/ican-logo.webp" alt="ICAN logo" width="50" height="50" loading="lazy" />
                <h3>
                  Institute of Chartered Accountants of Nigeria (ICAN)
                </h3>
                <p>
                  Utilize the most comprehensive and current study tools available, including lectures, summary notes, mock examinations, tutor support, and more, to be fully prepared for your ICAN exams.
                </p>
                <CtaLink href="/courses" className="btn btn--primary">
                  View Courses
                </CtaLink>
              </div>
              <img className="course-row__img" src="/img/ican-photo.webp" alt="Student taking notes at a computer desk" loading="lazy" />
            </article>
            <article className="course-row course-row--reverse">
              <div className="course-row__text">
                <img className="course-row__logo" src="/img/acca-logo.webp" alt="ACCA logo" width="50" height="50" loading="lazy" />
                <h3>
                  Association of Chartered Certified Accountants (ACCA)
                </h3>
                <p>
                  Utilize the most comprehensive and current study tools available, including lectures, summary notes, mock examinations, tutor support, and more, to be fully prepared for your ACCA exams.
                </p>
                <CtaLink href="/courses" className="btn btn--primary">
                  View Courses
                </CtaLink>
              </div>
              <img className="course-row__img" src="/img/acca-photo.webp" alt="Student studying on a laptop at home" loading="lazy" />
            </article>
          </div>
          <div className="course-panel" id="panel-pd" role="tabpanel" aria-labelledby="tab-pd" hidden>
            <div className="pd-grid">
              <article className="pd-card">
                <h3>
                  Microsoft Excel
                </h3>
                <p>
                  Build practical spreadsheet skills, from formulas and functions to data analysis and reporting.
                </p>
                <CtaLink href="/courses" className="btn btn--primary">
                  View Courses
                </CtaLink>
              </article>
              <article className="pd-card">
                <h3>
                  QuickBooks
                </h3>
                <p>
                  Learn to manage bookkeeping, invoicing, payroll and financial reports with QuickBooks.
                </p>
                <CtaLink href="/courses" className="btn btn--primary">
                  View Courses
                </CtaLink>
              </article>
            </div>
          </div>
        </div>
      </section>
      <section className="section testimonials">
        <div className="container container--wide">
          <div className="section-head">
            <h2>
              Our Students' Testimonies
            </h2>
            <p>
              Join thousands of students who have transformed their careers with Excel Academy! You’ll be in good company at Excel Academy!
            </p>
          </div>
          <div className="carousel">
            <button className="carousel__btn carousel__btn--prev" aria-label="Previous testimonials">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <div className="carousel__track" tabIndex={0}>
              <figure className="testimonial">
                <blockquote>
                  I appreciate Excel Academy for the wonderful support. I passed my papers. Your lectures and guidance were so helpful Mr Ahmed. We move to the next steps.
                </blockquote>
                <figcaption>
                  <span className="testimonial__avatar" aria-hidden="true">
                    AO
                  </span>
                  <span>
                    Abdul-Hameed Oladeji, ACA
                    <small>
                      May 2022 Batch
                    </small>
                  </span>
                </figcaption>
              </figure>
              <figure className="testimonial">
                <blockquote>
                  Thank you very much Excel Academy for your help in Case Study. After Mr Ahmed explained what case study was about and gave me the format on how to write a report, all I did was study the format and the pre-seen analysis. Thank you for helping me pass Case Study at first sitting.
                </blockquote>
                <figcaption>
                  <span className="testimonial__avatar" aria-hidden="true">
                    OT
                  </span>
                  <span>
                    Onipede Toluwalase, ACA
                    <small>
                      November 2021 Batch
                    </small>
                  </span>
                </figcaption>
              </figure>
              <figure className="testimonial">
                <blockquote>
                  I finally passed Advanced Taxation after 2 attempts. I registered with Excel Academy on my 3rd attempt, I was really encouraged and tutored accordingly. I recommend Excel Academy to anyone preparing for ICAN Examinations.
                </blockquote>
                <figcaption>
                  <span className="testimonial__avatar" aria-hidden="true">
                    LO
                  </span>
                  <span>
                    Lucy Peter Ojemen, ACA
                    <small>
                      November 2021 Batch
                    </small>
                  </span>
                </figcaption>
              </figure>
              <figure className="testimonial">
                <blockquote>
                  I want to say a big thank you to the tutors of Excel Academy for their energetic efforts in preparing us for the exam. The online lectures, extra classes, mock exams and private sessions really went a long way in ensuring our success.
                </blockquote>
                <figcaption>
                  <span className="testimonial__avatar" aria-hidden="true">
                    AA
                  </span>
                  <span>
                    Adedeji Adedamola, AAT, ACA
                    <small>
                      March 2021 Batch
                    </small>
                  </span>
                </figcaption>
              </figure>
              <figure className="testimonial">
                <blockquote>
                  Ahmed, I passed. Thank you so much. Your suggested solution to the Case Study pre-seen really went a long way. I was really wowed by your analysis of the pre-seen.
                </blockquote>
                <figcaption>
                  <span className="testimonial__avatar" aria-hidden="true">
                    PO
                  </span>
                  <span>
                    Placidus Obi, ACA
                    <small>
                      May 2022 Batch
                    </small>
                  </span>
                </figcaption>
              </figure>
              <figure className="testimonial">
                <blockquote>
                  Many thanks to you my teacher. I have been writing only Case Study since 2019. May Almighty God bless you greatly. I am now qualified.
                </blockquote>
                <figcaption>
                  <span className="testimonial__avatar" aria-hidden="true">
                    NU
                  </span>
                  <span>
                    Nse Umoh-Daniel, ACA
                    <small>
                      May 2022 Batch
                    </small>
                  </span>
                </figcaption>
              </figure>
              <figure className="testimonial">
                <blockquote>
                  My investment of 10k was worth it, I aced Case Study. I attempted it for the first time and I passed with God’s help through Mr Ahmed. Thank you very much.
                </blockquote>
                <figcaption>
                  <span className="testimonial__avatar" aria-hidden="true">
                    LR
                  </span>
                  <span>
                    Lasisi Rasheedat, ACA
                    <small>
                      May 2022 Batch
                    </small>
                  </span>
                </figcaption>
              </figure>
              <figure className="testimonial">
                <blockquote>
                  Thank you so much for the online coaching and exam guide. I passed Case Study and I’m now a qualified Chartered Accountant. Thank you so much Mr Ahmed.
                </blockquote>
                <figcaption>
                  <span className="testimonial__avatar" aria-hidden="true">
                    MO
                  </span>
                  <span>
                    Muyiwa Olubo, ACA
                    <small>
                      May 2022 Batch
                    </small>
                  </span>
                </figcaption>
              </figure>
            </div>
            <button className="carousel__btn carousel__btn--next" aria-label="Next testimonials">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      <section className="section mission">
        <div className="container">
          <figure className="mission__quote">
            <img className="mission__mark" src="/img/quote-open.svg" alt="" aria-hidden="true" />
            <blockquote>
              We aim at inspiring our students to dream more, learn more, do more, and become more in their respective journeys of life.
            </blockquote>
            <img className="mission__mark mission__mark--end" src="/img/quote-close.svg" alt="" aria-hidden="true" />
          </figure>
        </div>
      </section>
      <section className="section faq" id="faq">
        <div className="container">
          <div className="section-head">
            <h2>
              Frequently asked questions
            </h2>
            <p>
              All your questions answered.
            </p>
          </div>
          <div className="faq__list">
            <details className="faq__item">
              <summary>
                Can I pass my exams using just Excel Academy?
              </summary>
              <div className="faq__answer">
                <p>
                  Absolutely! Excel Academy provides the learning resources and support you need to prepare effectively for your professional examinations. Our courses include comprehensive lecture notes, video lectures, practice questions, past examination questions and mock examinations designed to help you understand key concepts and become familiar with the exam format.
                </p>
                <p>
                  You can also benefit from tutor support, mock marking and personalised guidance to help you identify areas for improvement. Your success, however, depends on your consistency, commitment and how effectively you use these resources. We provide the tools and guidance; your dedication turns them into results.
                </p>
              </div>
            </details>
            <details className="faq__item">
              <summary>
                Do you offer textbooks, or do I need to buy any additional textbooks to use with your material or is your material enough?
              </summary>
              <div className="faq__answer">
                <p>
                  Our courses are designed to provide you with comprehensive study materials, including lecture notes, video lessons, practice questions and past examination questions to support your preparation. For many students, these resources provide a strong foundation for understanding the syllabus and preparing for examinations.
                </p>
                <p>
                  However, whether you need additional textbooks depends on your programme, examination level and personal learning needs. We recommend following the relevant examination syllabus and any recommended study texts for your qualification. Where additional reading is necessary, you can use it to complement our materials and deepen your understanding.
                </p>
                <p>
                  Our goal is to make your preparation simpler, more focused and more affordable without compromising the quality of your learning.
                </p>
              </div>
            </details>
            <details className="faq__item">
              <summary>
                What is the pass rate of Excel Academy?
              </summary>
              <div className="faq__answer">
                <p>
                  At Excel Academy, our focus is on helping students develop the knowledge, confidence and examination skills needed to succeed. We are proud of our learning community and the positive experiences students have shared about their progress with us.
                </p>
                <p>
                  Our platform offers structured courses, experienced tutors, practice questions, mock examinations and personalised study support to help you prepare effectively. Examination results vary from one student to another, depending on factors such as preparation time, consistency, prior knowledge and individual effort. We are committed to continually improving our learning resources and support to help our students achieve their goals.
                </p>
              </div>
            </details>
            <details className="faq__item">
              <summary>
                How is this course so cheap? I see other tuition providers charging thousands for single courses.
              </summary>
              <div className="faq__answer">
                <p>
                  We believe quality professional education should be accessible and affordable. At Excel Academy, we keep our costs low by leveraging online learning, streamlined course delivery and a dedicated team of experts. This allows us to reach more students and provide quality lectures and study resources without the high overhead costs associated with traditional classroom-based tuition.
                </p>
                <p>
                  Our affordable pricing does not mean we compromise on the value of your learning. We remain committed to providing well-structured lectures, comprehensive study materials, practice opportunities and relevant tutor support to help you prepare for your examinations.
                </p>
                <p>
                  Our goal is simple: to make quality professional education accessible to more aspiring accountants and finance professionals, so that cost does not become an unnecessary barrier to achieving their career ambitions.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>
      <section className="contact" id="contact">
        <div className="container">
          <div className="section-head section-head--light">
            <h2>
              Wish to know more about our programs?
            </h2>
            <p>
              Subscribe now and get regular updates on our programs
            </p>
          </div>
          <form className="contact__form" data-whatsapp="2348094579949" noValidate>
            <fieldset className="contact__interests">
              <legend>
                I’m interested in
              </legend>
              <label>
                <input type="checkbox" name="interests" value="ICAN" />
                ICAN
              </label>
              <label>
                <input type="checkbox" name="interests" value="CITN" />
                CITN
              </label>
              <label>
                <input type="checkbox" name="interests" value="CIBN" />
                CIBN
              </label>
              <label>
                <input type="checkbox" name="interests" value="ANAN" />
                ANAN
              </label>
              <label>
                <input type="checkbox" name="interests" value="ACCA" />
                ACCA
              </label>
              <label>
                <input type="checkbox" name="interests" value="CIMA" />
                CIMA
              </label>
              <label>
                <input type="checkbox" name="interests" value="CFA" />
                CFA
              </label>
              <label>
                <input type="checkbox" name="interests" value="CPA" />
                CPA
              </label>
              <label>
                <input type="checkbox" name="interests" value="Professional Development" />
                Professional Development
              </label>
            </fieldset>
            <div className="contact__fields">
              <h3>
                Send us a message
              </h3>
              <label className="field">
                <span className="sr-only">
                  First name
                </span>
                <input type="text" name="firstName" autoComplete="given-name" required placeholder=" " />
                <span className="field__ph" aria-hidden="true">
                  First name
                  <b>
                    *
                  </b>
                </span>
              </label>
              <label className="field">
                <span className="sr-only">
                  Last name
                </span>
                <input type="text" name="lastName" autoComplete="family-name" required placeholder=" " />
                <span className="field__ph" aria-hidden="true">
                  Last name
                  <b>
                    *
                  </b>
                </span>
              </label>
              <label className="field">
                <span className="sr-only">
                  Email address
                </span>
                <input type="email" name="email" autoComplete="email" required placeholder=" " />
                <span className="field__ph" aria-hidden="true">
                  Email address
                  <b>
                    *
                  </b>
                </span>
              </label>
              <label className="field">
                <span className="sr-only">
                  WhatsApp number
                </span>
                <input type="tel" name="whatsapp" autoComplete="tel" required placeholder=" " />
                <span className="field__ph" aria-hidden="true">
                  WhatsApp number
                  <b>
                    *
                  </b>
                </span>
              </label>
              <button type="submit" className="btn btn--primary btn--submit">
                Submit
              </button>
              <p className="contact__status" role="status" aria-live="polite" />
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
