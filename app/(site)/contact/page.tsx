import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact us | Excel Academy", description: "Get in touch with Excel Academy about live classes, courses, or anything else on ICAN and ACCA." };

export default function Page() {
  return (
    <main>
      <section className="contact-page">
        <div className="container contact-page__inner">
          <div className="contact-page__info">
            <h1>
              Contact Us
            </h1>
            <p className="contact-page__lead">
              Wish to enquire about live classes, courses, or anything else on ICAN and ACCA?
              <br />
              You can walk in during office hours, give us a call or simply submit the form here.
            </p>
            <ul className="contact-details">
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                </svg>
                <div>
                  <span>
                    Address
                  </span>
                  <strong>
                    University of Lagos, Akoka, Lagos state.
                  </strong>
                </div>
              </li>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1Z" />
                </svg>
                <div>
                  <span>
                    Phone
                  </span>
                  <a href="tel:+2348094579949">
                    <strong>
                      (+234) 8094579949
                    </strong>
                  </a>
                </div>
              </li>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5Z" />
                </svg>
                <div>
                  <span>
                    Mail
                  </span>
                  <a href="mailto:info@excelacademyonline.com">
                    <strong>
                      info@excelacademyonline.com
                    </strong>
                  </a>
                </div>
              </li>
            </ul>
          </div>
          <form className="contact__form contact-page__form" data-whatsapp="2348094579949" noValidate>
            <div className="contact__fields">
              <h2>
                Send us a message
              </h2>
              <label className="field">
                <span className="sr-only">
                  Full name
                </span>
                <input type="text" name="fullName" autoComplete="name" required placeholder=" " />
                <span className="field__ph" aria-hidden="true">
                  Full name
                </span>
              </label>
              <label className="field">
                <span className="sr-only">
                  Email address
                </span>
                <input type="email" name="email" autoComplete="email" required placeholder=" " />
                <span className="field__ph" aria-hidden="true">
                  Email address
                </span>
              </label>
              <label className="field">
                <span className="sr-only">
                  Subject
                </span>
                <input type="text" name="subject" required placeholder=" " />
                <span className="field__ph" aria-hidden="true">
                  Subject
                </span>
              </label>
              <label className="field field--area">
                <span className="sr-only">
                  Message
                </span>
                <textarea name="message" rows={5} required placeholder=" " />
                <span className="field__ph" aria-hidden="true">
                  Message
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
