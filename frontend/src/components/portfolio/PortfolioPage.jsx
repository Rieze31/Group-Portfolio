import { useEffect, useState } from "react";
import Cursor from "./Cursor.jsx";
import Peek from "./Peek.jsx";
import Carousel from "./Carousel.jsx";
import ToolGrid from "./ToolGrid.jsx";
import ThemeBtn from "../ThemeBtn.jsx";

const scTo = (id) => document.getElementById(id).scrollIntoView({ behavior: "smooth" });

/*
  Shared layout used by every portfolio file.
  data = { name, role, color, onAcc?, bio, projects: [{title, description, gradient, tags}], tools, slides, headFolder? }
*/
export default function PortfolioPage({ data, member, next, go, dark, toggle }) {
  const parts = data.name.split(" ");
  const init = parts[0][0] + parts[parts.length - 1][0];
  const accStyle = { "--acc": data.color, "--on-acc": data.onAcc || "#151515" };
  const [menuOpen, setMenuOpen] = useState(false);

  const isVenzon = Boolean(data.portrait);
  const isAlthea = data.name === "Althea Lei Santos";
  const hasReveal = isVenzon || isAlthea;
  const navLinks = ["projects", "stack", "about"];

  useEffect(() => {
    if (!hasReveal) return;
    const nodes = document.querySelectorAll(".portfolio-reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [hasReveal, data.projects]);

  return (
    <div className={`${isVenzon ? "venzon-page " : ""}${isAlthea ? "althea-portfolio " : ""}cohesive-portfolio`} style={accStyle}>
      <Peek portrait={data.portrait} />

      {/* ── Sticky nav ── */}
      <nav className="portfolio-bumble-nav sticky top-[env(safe-area-inset-top,0px)] z-20 bg-[var(--bg)] border-b border-[var(--line)]">
        <div className="portfolio-nav-inner max-w-[960px] mx-auto px-5 flex justify-between items-center h-[58px]">
          {/* Back button */}
          <button
            onClick={() => go("deck")}
            className="bg-transparent border-0 text-[var(--ink)] font-medium text-sm cursor-pointer px-2 py-1.5 hover:text-[var(--acc)] transition-colors shrink-0"
            style={{ fontFamily: "var(--sans)" }}
          >
            ← CTPR Club
          </button>

          {/* Desktop nav links */}
          <div className="portfolio-nav-links hidden sm:flex items-center gap-1">
            {navLinks.map((s) => (
              <button
                key={s}
                onClick={() => scTo(s)}
                className="bg-transparent border-0 text-[var(--ink)] font-medium text-sm cursor-pointer px-2.5 py-1.5 hover:text-[var(--acc)] transition-colors"
                style={{ fontFamily: "var(--sans)" }}
              >
                {s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
            <ThemeBtn dark={dark} toggle={toggle} compact />
          </div>

          {/* Mobile: theme btn + hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeBtn dark={dark} toggle={toggle} compact />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="bg-transparent border border-[var(--line)] text-[var(--ink)] rounded-lg p-1.5 cursor-pointer leading-none text-lg hover:border-[var(--acc)] transition-colors"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="sm:hidden border-t border-[var(--line)] bg-[var(--bg)] px-5 pb-3 flex flex-col gap-1">
            {navLinks.map((s) => (
              <button
                key={s}
                onClick={() => { scTo(s); setMenuOpen(false); }}
                className="bg-transparent border-0 text-[var(--ink)] font-medium text-sm cursor-pointer px-2 py-2.5 text-left hover:text-[var(--acc)] transition-colors"
                style={{ fontFamily: "var(--sans)" }}
              >
                {s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── Page content ── */}
      <div className={`${isVenzon ? "max-w-[1152px]" : "max-w-[960px]"} mx-auto px-5 sm:px-6`}>

        {/* ── Hero / intro section ── */}
        <section id={isVenzon ? "home" : undefined} className={`py-14 sm:py-[72px] flex flex-col sm:flex-row gap-10 sm:gap-14 items-center${isVenzon ? " venzon-section" : ""}`}>
          {/* Headshot — interactive mouse-following Cursor widget */}
          {data.headFolder ? (
            <div className="flex-none self-center sm:self-auto">
              <Cursor folder={data.headFolder} alt={data.name} backText={data.headBackText} interactive={Boolean(data.portrait)} />
            </div>
          ) : (
            <div
              className="w-[220px] h-[270px] rounded-3xl grid place-items-center flex-none"
              style={{ background: `linear-gradient(155deg,${data.color},#2b2622)` }}
            >
              <b className="text-[96px] leading-none font-light tracking-tight text-white/90"
                 style={{ fontFamily: "var(--sans)" }}>{init}</b>
            </div>
          )}

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="text-[11px] tracking-widest text-[var(--acc)]" style={{ fontFamily: "var(--mono)" }}>
              ~/HOME · {data.role}
            </div>
            <h1
              className="font-medium mt-3 mb-0 tracking-tight leading-[.92]"
              style={{ fontSize: "clamp(32px,6vw,72px)", fontFamily: "var(--sans)" }}
            >
              Hi, I'm <em>{data.name}</em>
            </h1>
            <p className="mt-4 text-[var(--mute)] leading-relaxed text-[15px] mb-4">{data.bio}</p>
            <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
              <button
                onClick={() => scTo("projects")}
                className="border rounded-full px-5 py-2.5 text-sm font-bold cursor-pointer transition-opacity hover:opacity-80"
                style={{ background: "var(--portfolio-accent)", borderColor: "var(--portfolio-accent)", color: "var(--portfolio-button-ink)", fontFamily: "var(--sans)" }}
              >
                View projects
              </button>
              <button
                onClick={() => go("deck")}
                className="bg-transparent border border-[var(--ink)] text-[var(--ink)] rounded-full px-5 py-2.5 text-sm font-bold cursor-pointer hover:opacity-70 transition-opacity"
                style={{ fontFamily: "var(--sans)" }}
              >
                Back to the club
              </button>
            </div>
          </div>
        </section>

        {/* ── Projects ── */}
        <section className={`py-14 sm:py-[72px]${isVenzon ? " venzon-section" : ""}`} id="projects">
          <div className="text-[11px] tracking-widest text-[var(--acc)]" style={{ fontFamily: "var(--mono)" }}>~/PROJECTS</div>
          <h2
            className="font-medium mt-2 mb-2.5 tracking-tight leading-none"
            style={{ fontSize: "clamp(26px,4.5vw,44px)", fontFamily: "var(--sans)" }}
          >
            Things I've <em>built.</em>
          </h2>
          <p className="text-[var(--mute)] leading-relaxed mb-0 text-[15px]">A collection of projects, each with its own stack.</p>

          {data.projects.map((p, k) => (
            <div
              key={p.title}
              className={`flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center my-8 ${k % 2 ? "sm:flex-row-reverse" : ""}${hasReveal ? " portfolio-reveal" : ""}${isVenzon ? " venzon-reveal" : ""}${isAlthea ? " althea-project-row" : ""}`}
            >
              <div
                className={`relative w-full sm:flex-[1_1_280px] h-[180px] sm:h-[200px] rounded-[18px] overflow-hidden grid place-items-center text-white text-xs${isVenzon ? " venzon-project-image" : ""}`}
                style={{ background: p.gradient, fontFamily: "var(--mono)" }}
              >
                {p.image ? (
                  <img src={p.image} alt={`${p.title} project screenshot`} loading="lazy" className="absolute inset-0 block h-full w-full object-cover" style={{ objectPosition: p.imagePosition || "center" }} />
                ) : <div className="absolute inset-0 grid place-items-center text-white text-xs">PREVIEW IMAGE</div>}
              </div>
              <div className={`w-full sm:flex-[1_1_260px]${isVenzon ? " venzon-project-copy" : ""}`}>
                <div className="text-[11px] tracking-widest text-[var(--acc)]" style={{ fontFamily: "var(--mono)" }}>
                  0{k + 1} / PROJECT
                </div>
                <h2 className="font-medium mt-2 mb-2 tracking-tight" style={{ fontSize: 20, fontFamily: "var(--sans)" }}>{p.title}</h2>
                <p className="text-[var(--mute)] leading-relaxed mb-3 text-[15px]">{p.description}</p>
                {(p.tags || []).map((t) => (
                  <span
                    key={t}
                    className="inline-block text-xs border border-[var(--line)] text-[var(--mute)] px-3 py-0.5 rounded-full mr-1.5 mb-2"
                  >{t}</span>
                ))}
                {isVenzon && p.action && (p.action.url ? (
                  <a className="venzon-project-action" href={p.action.url} target="_blank" rel="noreferrer">
                    {p.action.label === "PRIVATE" ? <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></svg>}
                    {p.action.label}
                  </a>
                ) : (
                  <span className="venzon-project-action is-disabled" aria-label={`${p.action.label} link not provided`}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></svg>{p.action.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ── Stack ── */}
        <section className={`py-14 sm:py-[72px]${isVenzon ? " venzon-section" : ""}`} id="stack">
          <div className="text-[11px] tracking-widest text-[var(--acc)]" style={{ fontFamily: "var(--mono)" }}>~/STACK</div>
          <h2
            className="font-medium mt-2 mb-2.5 tracking-tight leading-none"
            style={{ fontSize: "clamp(26px,4.5vw,44px)", fontFamily: "var(--sans)" }}
          >
            The tools I <em>reach for.</em>
          </h2>
          <p className="text-[var(--mute)] leading-relaxed mb-0 text-[15px]">The languages and frameworks in my toolkit.</p>
          <ToolGrid tools={data.tools} categories={data.portrait ? ["Frontend", "Backend", "Languages", "Databases", "Tools", "Game Dev"] : undefined} brandedIcons={Boolean(data.portrait)} />
        </section>

        {/* ── About ── */}
        <section className={`py-14 sm:py-[72px] flex flex-col sm:flex-row gap-10 sm:gap-14 items-start${isVenzon ? " venzon-section" : ""}`} id="about">
          <div className="flex-1 min-w-0">
            <div className="text-[11px] tracking-widest text-[var(--acc)]" style={{ fontFamily: "var(--mono)" }}>~/ABOUT</div>
            <h2
              className="font-medium mt-2 mb-2.5 tracking-tight leading-none"
              style={{ fontSize: "clamp(26px,4.5vw,44px)", fontFamily: "var(--sans)" }}
            >
              A bit about <em>me.</em>
            </h2>
            {(data.about || [data.bio]).map((paragraph) => <p key={paragraph} className="text-[var(--mute)] leading-relaxed text-[15px]">{paragraph}</p>)}
          </div>
          <div className="w-full sm:flex-[1_1_280px]">
            {isVenzon && data.aboutImage ? (
              <img className="venzon-about-image" src={data.aboutImage} alt="Rieze Andrei Venzon" loading="lazy" />
            ) : <Carousel slides={data.slides} />}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="portfolio-next-footer border-t border-[var(--line)] py-6 flex flex-wrap justify-between gap-2.5">
          <button
            onClick={() => go("deck")}
            className="bg-transparent border-0 text-[var(--ink)] font-medium text-sm cursor-pointer px-2.5 py-1.5 hover:text-[var(--acc)] transition-colors"
            style={{ fontFamily: "var(--sans)" }}
          >
            ← Back to the club
          </button>
          {next && (
            <button
              onClick={() => go(next.id)}
              className="bg-transparent border-0 text-[var(--ink)] font-medium text-sm cursor-pointer px-2.5 py-1.5 hover:text-[var(--acc)] transition-colors"
              style={{ fontFamily: "var(--sans)" }}
            >
              Next: {next.name} →
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
