/** @type {import('next').NextConfig} */
export default {
  images: { unoptimized: true },
  // Old WordPress/static addresses keep working.
  async redirects() {
    return [
      { source: "/:page(index|about|contact|blog|terms|privacy-policy|courses).html", destination: "/:page", permanent: true },
      { source: "/index", destination: "/", permanent: true },
      { source: "/courses/:slug*", has: [{ type: "host", value: "courses.excelacademyonline.com" }], destination: "https://excelacademyonline.com/courses", permanent: false },
    ];
  },
};
