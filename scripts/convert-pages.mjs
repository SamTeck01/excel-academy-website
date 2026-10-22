// One-off: converts the static Figma-built pages (../excel_website/*.html)
// into React components - real JSX, not injected HTML.
//   node scripts/convert-pages.mjs
import fs from "node:fs";
import path from "node:path";
import { parse } from "node-html-parser";

const SRC = path.resolve("../excel_website");
const ROUTES = {
  "index.html": "", "about.html": "about", "contact.html": "contact", "blog.html": "blog",
  "privacy-policy.html": "privacy-policy", "terms.html": "terms",
  "blog-case-study-exam-tips.html": "blog/case-study-exam-tips",
  "blog-getting-the-most-from-mock-exams.html": "blog/getting-the-most-from-mock-exams",
  "blog-how-to-prepare-for-ican-exams.html": "blog/how-to-prepare-for-ican-exams",
};

const ATTR = { class: "className", for: "htmlFor", tabindex: "tabIndex", readonly: "readOnly", maxlength: "maxLength",
  minlength: "minLength", autocomplete: "autoComplete", "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin", "fill-rule": "fillRule", "clip-rule": "clipRule", viewbox: "viewBox",
  srcset: "srcSet", crossorigin: "crossOrigin", colspan: "colSpan", rowspan: "rowSpan", frameborder: "frameBorder",
  allowfullscreen: "allowFullScreen", novalidate: "noValidate", enctype: "encType", datetime: "dateTime",
  "accept-charset": "acceptCharset", inputmode: "inputMode", playsinline: "playsInline", autoplay: "autoPlay",
  enterkeyhint: "enterKeyHint", fetchpriority: "fetchPriority", "xlink:href": "xlinkHref", "stop-color": "stopColor" };
const VOID = new Set(["img", "br", "hr", "input", "meta", "link", "source", "area", "col", "wbr", "path", "circle", "rect", "line", "polyline", "polygon", "use", "stop"]);
const BOOL = new Set(["hidden", "disabled", "required", "checked", "selected", "multiple", "open", "async", "defer", "noValidate", "allowFullScreen", "autoPlay", "playsInline", "muted", "loop", "controls", "readOnly"]);

const link = (href) => {
  if (!href) return href;
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
  const [file, hash = ""] = href.split("#");
  const route = ROUTES[file];
  if (route !== undefined) return "/" + route + (hash ? "#" + hash : "");
  if (file === "courses.html") return "/courses" + (hash ? "#" + hash : "");
  if (file.startsWith("assets/img/")) return "/img/" + file.slice(11);
  return href;
};
const esc = (s) => s.replace(/[{}<>]/g, (c) => `{"${c}"}`);
const styleObj = (s) =>
  "{{" + s.split(";").map((d) => d.trim()).filter(Boolean).map((d) => {
    const i = d.indexOf(":"); const k = d.slice(0, i).trim(); const v = d.slice(i + 1).trim();
    const key = k.startsWith("--") ? JSON.stringify(k) : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return `${key}: ${JSON.stringify(v)}`;
  }).join(", ") + "}}";

function jsx(node, depth = 0) {
  const pad = "  ".repeat(depth);
  if (node.nodeType === 3) {
    const t = node.rawText;
    if (!t.trim()) return t.includes("\n") ? "" : " ";
    return pad + esc(t.replace(/\s+/g, " ").trim());
  }
  if (node.nodeType === 8) return "";
  const tag = node.rawTagName;
  if (!tag) return node.childNodes.map((c) => jsx(c, depth)).filter(Boolean).join("\n");
  if (tag === "script") return "";
  const attrs = Object.entries(node.attributes).map(([k, v]) => {
    let name = ATTR[k.toLowerCase()] || k;
    if (name.startsWith("on")) return "";
    if (name === "style") return `style=${styleObj(v)}`;
    if (["href", "src"].includes(name)) v = link(v);
    if (BOOL.has(name) && (v === "" || v === name)) return name;
    if (["rows", "cols", "tabIndex", "colSpan", "rowSpan", "maxLength", "minLength", "size", "span"].includes(name) && /^-?\d+$/.test(v)) return `${name}={${v}}`;
    return `${name}=${JSON.stringify(v)}`;
  }).filter(Boolean).join(" ");
  const open = `${pad}<${tag}${attrs ? " " + attrs : ""}`;
  const kids = node.childNodes.map((c) => jsx(c, depth + 1)).filter((x) => x && x.trim());
  if (!kids.length) return VOID.has(tag) || !node.innerHTML.trim() ? `${open} />` : `${open}></${tag}>`;
  return `${open}>\n${kids.join("\n")}\n${pad}</${tag}>`;
}

const meta = (root) => ({
  title: root.querySelector("title")?.text.trim() || "Excel Academy",
  description: root.querySelector('meta[name="description"]')?.getAttribute("content") || "",
});

fs.mkdirSync("components/site", { recursive: true });
for (const [file, route] of Object.entries(ROUTES)) {
  const root = parse(fs.readFileSync(path.join(SRC, file), "utf8"), { comment: false });
  const main = root.querySelector("main");
  const { title, description } = meta(root);
  const dir = path.join("app", "(site)", route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "page.tsx"),
`import type { Metadata } from "next";

export const metadata: Metadata = { title: ${JSON.stringify(title)}, description: ${JSON.stringify(description)} };

export default function Page() {
  return (
    <main>
${main.childNodes.map((c) => jsx(c, 3)).filter((x) => x && x.trim()).join("\n")}
    </main>
  );
}
`);
  console.log("page", "/" + route);
}

// Shared footer (from index.html).
const index = parse(fs.readFileSync(path.join(SRC, "index.html"), "utf8"));
fs.writeFileSync("components/site/Footer.tsx",
`export function Footer() {
  return (
${jsx(index.querySelector("footer"), 2)}
  );
}
`);
console.log("footer");
