import { useEffect, useRef, useState } from "react";
import ThemeBtn from "../components/ThemeBtn.jsx";

/* ---------- Everything you may want to edit is in DATA ---------- */
const DATA = {
  name: "Phiona Eunice Garcia",
  first: "Phiona",
  school: "Pamantasan ng Lungsod ng Maynila",
  course: "Bachelor of Science in Information Technology",
  section: "BSIT 3-1",
  teacher: "Sean Dyogi",
  photo: "",   // put a file in frontend/public/photos/ and write e.g. "/photos/garcia.jpg" here
  intro: "Third year IT student interested in web development, from the interface people see to the backend that supports it.",
  projects: [
    { title: "CTPR Club Group Portfolio", text: "A group portfolio website with a card landing page, one portfolio per member, and a Spring Boot backend.", stack: "React, Spring Boot, Java, Tailwind CSS" },
    { title: "Student Record System", text: "A database project with create, read, update and delete features and a REST API.", stack: "Java, Spring Data JPA, H2 / MySQL" },
    { title: "Web Development Activities", text: "Forms and interface components built for web development coursework.", stack: "JavaScript, React, CSS" },
  ],
  stack: [
    ["Frontend", "React, JavaScript, HTML, CSS, Tailwind CSS"],
    ["Backend", "Java, Spring Boot, REST APIs"],
    ["Database and tools", "MySQL, H2, Git, GitHub, Vite, VS Code"],
    ["Design", "Figma, wireframing, responsive layout"],
  ],
  about: [
    "I am a third year BSIT student at Pamantasan ng Lungsod ng Maynila. I enjoy building web pages and learning how the backend behind them works.",
    "This portfolio is part of the CTPR Club group portfolio.",
  ],
};

const PAGES = ["Home", "Projects", "Tech Stack", "About Me"];
const SANS = { fontFamily: '"Inter Tight", system-ui, sans-serif' };
const SERIF = { fontFamily: '"Times New Roman", Times, serif' };
const HIDE_BACK = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };
const LETTER_COLORS = ["#f5a623", "#8bc34a", "#4caf50", "#42a5f5", "#ef5350", "#ff9800", "#26c6da", "#66bb6a", "#5c6bc0"];
const EDGE = "border border-[#d2d2d8]";

const CSS = `
@keyframes sheetIn { from { transform: rotateX(-80deg); opacity: .15; } to { transform: rotateX(0); opacity: 1; } }
.sheet { transform-origin: top center; animation: sheetIn .45s ease-out both; }
@media (prefers-reduced-motion: reduce) { .sheet { animation: none; } }
`;

/* red paper fastener, like the photo */
function Pastener() {
  return (
    <div className="relative mx-auto mb-5 h-5 w-28">
      <div className="absolute inset-0 rounded-full border-[3px] border-[#d23b3b]" />
      <div className="absolute inset-x-3 top-1/2 h-[5px] -translate-y-1/2 border-y border-[#cfcfd4] bg-[#e9e9ec]" />
      <div className="absolute -top-[2px] left-[34%] h-6 w-3 border border-[#cfcfd4] bg-white" />
      <div className="absolute -top-[2px] left-[58%] h-6 w-3 border border-[#cfcfd4] bg-white" />
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex items-end gap-2">
      <b className="shrink-0 text-[11px] uppercase">{label}</b>
      <span className="flex-1 border-b border-black pb-px text-center text-[13px]">{value}</span>
    </div>
  );
}

/* the paper stuck on the front of the folder */
function CoverSheet() {
  return (
    <div className="absolute inset-x-[7%] inset-y-[5%] bg-white text-[#111] shadow-[0_1px_3px_rgba(0,0,0,.2)]">
      <div className="absolute inset-[7px] border-2 border-dashed border-black" />
      <div className="relative flex h-full flex-col items-center px-[10%] pb-[9%] pt-[12%]" style={SANS}>
        <div className="flex items-end gap-1">
          <span className="border-b-2 border-[#4a90d9] px-1 text-[26px] font-bold leading-tight text-[#4a90d9]">{DATA.first}</span>
          <span className="text-[34px] font-black leading-none text-[#f28c28]">’s</span>
        </div>

        <div className="mt-3 flex" style={{ fontFamily: '"Arial Rounded MT Bold", "Arial Black", system-ui, sans-serif' }}>
          {"PORTFOLIO".split("").map((c, i) => (
            <span key={i} className="inline-block text-[34px] font-black leading-none" style={{ color: LETTER_COLORS[i], transform: `rotate(${i % 2 ? 2 : -2}deg)` }}>{c}</span>
          ))}
        </div>

        <div className="mt-5 flex aspect-[0.8] w-[36%] items-center justify-center overflow-hidden border-2 border-[#9a9aa0] text-[11px] text-[#777]">
          {DATA.photo ? <img src={DATA.photo} alt={DATA.name} className="h-full w-full object-cover" /> : "Photo"}
        </div>

        <div className="mt-auto w-full space-y-3">
          <Field label="Year & Section:" value={DATA.section} />
          <Field label="Classroom Teacher:" value={DATA.teacher} />
        </div>
      </div>
    </div>
  );
}

const H = "mb-1.5 mt-4 border-b border-black text-[15px] font-bold first:mt-0";
const T = "text-[12.5px] leading-[1.5]";

function PageContent({ i }) {
  if (i === 0) {
    return (
      <>
        <h1 className="text-[22px] font-bold leading-tight">{DATA.name}</h1>
        <p className={T + " mb-2"}>{DATA.intro}</p>
        <h3 className={H}>Student Information</h3>
        <ul className={T + " list-disc pl-5"}>
          <li>School: {DATA.school}</li>
          <li>Course: {DATA.course}</li>
          <li>Year and section: {DATA.section}</li>
        </ul>
      </>
    );
  }
  if (i === 1) {
    return (
      <>
        <h3 className={H}>Projects</h3>
        <ul className={T + " list-disc space-y-2 pl-5"}>
          {DATA.projects.map((p) => (
            <li key={p.title}><b>{p.title}.</b> {p.text} <i>{p.stack}.</i></li>
          ))}
        </ul>
      </>
    );
  }
  if (i === 2) {
    return (
      <>
        <h3 className={H}>Tech Stack</h3>
        <ul className={T + " list-disc space-y-1.5 pl-5"}>
          {DATA.stack.map(([k, v]) => <li key={k}><b>{k}:</b> {v}</li>)}
        </ul>
      </>
    );
  }
  return (
    <>
      <h3 className={H}>About Me</h3>
      {DATA.about.map((p, k) => <p key={k} className={T + " mb-2"}>{p}</p>)}
    </>
  );
}

export default function GarciaPortfolio({ go, dark, toggle }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const touchX = useRef(null);
  const last = PAGES.length - 1;
  const step = (d) => setPage((p) => Math.max(0, Math.min(last, p + d)));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (!open) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  const openFolder = () => setOpen(true);
  const linkBtn = "cursor-pointer border-0 bg-transparent p-0 text-sm underline underline-offset-4 disabled:cursor-default disabled:no-underline disabled:opacity-30";

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[var(--bg)] text-[var(--ink)]" style={SANS}>
      <style>{CSS}</style>

      <nav className="sticky top-[env(safe-area-inset-top,0px)] z-30 border-b border-[var(--line)] bg-[var(--bg)]">
        <div className="mx-auto flex h-[58px] max-w-[960px] items-center justify-between px-5">
          <button onClick={() => go("home")} className="cursor-pointer border-0 bg-transparent px-2 py-1.5 text-sm font-medium text-[var(--ink)] hover:underline">
            Back to CTPR Club
          </button>
          <ThemeBtn dark={dark} toggle={toggle} />
        </div>
      </nav>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-10">
        <div className="[perspective:1800px]">
          {/* the folder: closed it is centered, open it slides right so the whole spread is centered */}
          <div
            className={
              "relative aspect-[0.64] w-[var(--w)] [--w:min(360px,88vw)] md:[--w:min(380px,40vw)] transition-transform duration-[900ms] ease-in-out motion-reduce:transition-none " +
              (open ? "md:translate-x-[calc(var(--w)/2)]" : "")
            }
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* back of the folder + the paper inside it */}
            <div className={"absolute inset-0 bg-[#efeff2] " + EDGE}>
              <div className={"absolute -right-[13px] top-[4%] h-[38%] w-[13px] rounded-r-md border-l-0 bg-[#e6e6ea] " + EDGE} />
              <div className="absolute inset-x-[4%] bottom-[2.5%] top-[2.5%] [perspective:1200px]">
                <div
                  key={open + "-" + page}
                  className="sheet h-full overflow-y-auto bg-white px-6 pb-6 pt-3 text-[#111] shadow-[0_1px_0_#d9d9de,0_2px_0_#fff,0_3px_0_#d9d9de]"
                  style={SERIF}
                  onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
                  onTouchEnd={(e) => {
                    const d = e.changedTouches[0].clientX - touchX.current;
                    if (d < -50) step(1); else if (d > 50) step(-1);
                  }}
                >
                  <Pastener />
                  <PageContent i={page} />
                </div>
              </div>
            </div>

            {/* the cover: swings open from its left edge */}
            <div
              className="absolute inset-0 origin-left transition-transform duration-[1000ms] ease-in-out motion-reduce:transition-none"
              style={{ transformStyle: "preserve-3d", transform: open ? "rotateY(-180deg)" : "rotateY(0deg)" }}
            >
              {/* outside of the cover */}
              <div
                role="button"
                tabIndex={open ? -1 : 0}
                aria-label="Open the folder"
                onClick={openFolder}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openFolder()}
                className={"absolute inset-0 bg-[#f7f7f9] shadow-[0_8px_24px_rgba(0,0,0,.18)] " + EDGE + (open ? "" : " cursor-pointer")}
                style={HIDE_BACK}
              >
                <div className="absolute inset-y-0 left-[5%] w-px bg-[#dcdce2]" />
                <div className="absolute inset-y-0 left-[6.5%] w-px bg-[#dcdce2]" />
                <CoverSheet />
              </div>

              {/* inside of the cover: contents */}
              <div className={"absolute inset-0 bg-[#f7f7f9] p-6 text-[#111] " + EDGE} style={{ ...HIDE_BACK, transform: "rotateY(180deg)" }}>
                <div className="absolute inset-y-0 right-[5%] w-px bg-[#dcdce2]" />
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#555]">Contents</div>
                <h2 className="mt-2 text-xl font-bold leading-tight">{DATA.name}</h2>
                <ol className="mt-8 list-none p-0">
                  {PAGES.map((p, i) => (
                    <li key={p}>
                      <button
                        onClick={() => setPage(i)}
                        className="flex w-full cursor-pointer items-baseline gap-2 border-0 border-b border-dotted border-[#999] bg-transparent py-2 text-left text-sm text-[#111]"
                      >
                        <span className={page === i ? "font-bold" : ""}>{p}</span>
                        <span className="ml-auto font-mono text-xs">{i + 1}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* controls under the folder */}
        <div className="flex min-h-[64px] flex-col items-center gap-3">
          {!open ? (
            <p className="m-0 text-sm text-[var(--mute)]">Click the folder to open it.</p>
          ) : (
            <>
              <div className="flex items-center gap-5">
                <button className={linkBtn} disabled={page === 0} onClick={() => step(-1)}>Previous</button>
                <span className="font-mono text-xs">{PAGES[page]} ({page + 1} of {PAGES.length})</span>
                <button className={linkBtn} disabled={page === last} onClick={() => step(1)}>Next</button>
                <button className={linkBtn} onClick={() => setOpen(false)}>Close folder</button>
              </div>
              <div className="flex flex-wrap justify-center gap-4 md:hidden">
                {PAGES.map((p, i) => (
                  <button key={p} onClick={() => setPage(i)} className={linkBtn + (page === i ? " font-bold" : "")}>{p}</button>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}