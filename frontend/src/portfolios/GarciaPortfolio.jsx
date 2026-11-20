import { useEffect, useRef, useState } from "react";
import ThemeBtn from "../components/ThemeBtn.jsx";

/* ---------- Everything you may want to edit is in DATA ---------- */
const DATA = {
  name: "Phiona Eunice de Leon Garcia",
  nickname: "Yay",
  section: "BSIT 3-1",
  field: "BSIT Portfolio",   // small label at the top-left of every page
  date: "Nov 2026",          // small label at the top-right of every page
  photo: "",                 // put a file in frontend/public/photos/ and write e.g. "/photos/garcia.jpg" here
  spotifyPlaylist: "",       // paste the playlist ID from your Spotify share link (open.spotify.com/playlist/THIS_PART)

  about: [
    ["Nickname:", "Yay"],
    ["Age:", "21 yrs old"],
    ["Favorite color:", " White"],
    ["Favorite app:", "TikTok "],
    ["Year:", "3rd year BSIT student"],
    ["Learning style:", "Visual learner"],
    ["Why IT:", "I chose IT because of its broad opportunities and the creative world of it."],
  ],

  projects: [
    { title: "CTPR Club Group Portfolio", text: "Group portfolio website." },
    { title: "EaseAccess", text: "Barangay document request system." },
    { title: "ReadAble", text: "Web-based interactive reading comprehension support application for children with autism spectrum disorder (ASD)." },
  ],

  skills: [
    { title: "Adobe Photoshop", text: "Graphic design projects that I used to compete with in collaborative desktop publishing." },
    { title: "InDesign", text: "Desktop publishing and page layout for multi-page print and digital media, that I also used to compete with in collaborative desktop publishing." },
    { title: "SketchUp", text: "3D modelling and visual prototypes like architectural structures and interior designing." },
  ],

  hobbies: [
    { title: "Online shopping" },
    { title: "Matcha hunting" },
    { title: "Pickleball" },
    { title: "Cafe hopping" },
    { title: "Music vibing", spotify: true },
    { title: "Sunset watching" },
  ],

  quests: [
    { title: "GotChew", text: "Selling Dubai chewy cookies." },
    { title: "TikTok Affiliate" },
  ],

  facts: [
    "I love trying on clothes.",
    "I love trying out new food spots.",
    "I love cooking the recipes I see on TikTok or FB reels.",
    "I have a vintage and digital camera collection.",
    "I love anything vintage.",
  ],
};

/* the tabs shown in the table of contents (order = page order) */
const PAGES = ["About Me", "Projects", "Skills", "Hobbies", "Side Quests", "Fun Facts"];

/* palette taken from the template */
const YEL = "#ffc72c";     // folder
const PALE = "#fdf3a7";    // pages
const LAV = "#f0dce8";     // pink paper (cover + cards)
const BROWN = "#5a2008";
const PINK = "#e6128c";
const GOLD = "#e0a92a";
const LINE = "#d9c86a";

const SANS = { fontFamily: '"Inter Tight", system-ui, sans-serif' };
const MONO = { fontFamily: '"Space Mono", ui-monospace, Menlo, monospace' };
const SCRIPT = { fontFamily: '"Yellowtail", "Brush Script MT", cursive' };
const DISPLAY = {
  fontFamily: '"Bagel Fat One", "Arial Black", system-ui, sans-serif',
  color: BROWN,
  WebkitTextStroke: `4px ${GOLD}`,
  paintOrder: "stroke fill",
  lineHeight: 0.98,
};
const HIDE_BACK = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };
const EDGE = "border border-[#d9a521]";

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Space+Mono:wght@400;700&family=Yellowtail&display=swap");
@keyframes sheetIn { from { transform: rotateX(-80deg); opacity: .15; } to { transform: rotateX(0); opacity: 1; } }
.sheet { transform-origin: top center; animation: sheetIn .45s ease-out both; }
@media (prefers-reduced-motion: reduce) { .sheet { animation: none; } }
`;

/* ---------- small building blocks ---------- */

function Star({ size = 26, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <g stroke={PINK} strokeWidth="4.5" strokeLinecap="round">
        <path d="M12 3v18" />
        <path d="M4.2 7.5l15.6 9" />
        <path d="M4.2 16.5l15.6-9" />
      </g>
    </svg>
  );
}

function Title({ children, size = 30 }) {
  return (
    <div className="relative mb-4 pr-8">
      <h2 className="m-0 font-normal" style={{ ...DISPLAY, fontSize: size }}>{children}</h2>
      <Star className="absolute right-0 top-0" />
    </div>
  );
}

/* header and footer shared by every page, like the template slides */
function Frame({ n, children }) {
  return (
    <div className="flex min-h-full flex-col" style={{ ...MONO, color: BROWN }}>
      <div className="flex items-center justify-between text-[8.5px]" style={{ color: PINK }}>
        <span>{DATA.field}</span>
        <span style={{ ...SCRIPT, fontSize: 17 }}>{DATA.first}</span>
        <span>{DATA.date}</span>
      </div>
      <div className="mt-4 flex-1">{children}</div>
      <div className="mt-5 flex items-center justify-between text-[8.5px]" style={{ color: PINK }}>
        <span>{DATA.section}</span>
        <span>{n} / {PAGES.length}</span>
        <span>CTPR Club</span>
      </div>
    </div>
  );
}

/* pink-bordered card used for projects and side quests */
function Card({ label, title, text }) {
  return (
    <div className="border-2 bg-[#fffbd6] p-2.5" style={{ borderColor: PINK }}>
      <div className="flex items-baseline gap-2">
        <span className="text-[9px]" style={{ color: PINK }}>{label}</span>
        <b className="text-[13px] leading-tight" style={{ ...SANS, fontWeight: 800 }}>{title}</b>
      </div>
      {text && <p className="m-0 mt-1 text-[9.5px] leading-[1.55]">{text}</p>}
    </div>
  );
}

/* ---------- the cover (front of the folder) ---------- */

function CoverSheet() {
  return (
    <div className="absolute inset-x-[6%] inset-y-[4%] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,.2)]" style={{ background: LAV }}>
      <div className="absolute inset-[7px] rounded-lg border-2 border-dashed" style={{ borderColor: BROWN }} />
      <div className="relative flex h-full flex-col px-[9%] py-[8%]" style={MONO}>
        <div className="flex justify-between text-[10px]" style={{ color: PINK }}>
          <span>{DATA.field}</span>
          <span>{DATA.date}</span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div style={{ ...DISPLAY, fontSize: 55, WebkitTextStroke: `6px ${GOLD}` }}>
            <br />Portfolio
          </div>
          <div className="mt-3 -rotate-2" style={{ ...SCRIPT, color: PINK, fontSize: 38, lineHeight: 1.05 }}>
            {DATA.first}
          </div>
        </div>

        <div className="flex justify-between text-[10px]" style={{ color: PINK }}>
          <span>{DATA.section}</span>
          <span> {DATA.teacher}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- the pages inside the folder ---------- */

function PageContent({ i }) {
  /* About Me */
  if (i === 0) {
    return (
      <Frame n={1}>
        <Title>{PAGES[0]}</Title>
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1 text-[10px] leading-[1.55]">
            <p className="m-0" style={{ color: PINK }}>Hello!</p>
            <p className="m-0 mb-2 font-bold" style={{ color: PINK }}>I’m {DATA.nickname}</p>
            <p className="m-0">Full name: {DATA.name}</p>
          </div>
          <div className="aspect-[0.78] w-[40%] shrink-0 border-2 p-1.5" style={{ background: "#f2c230", borderColor: PINK }}>
            <div className="flex h-full w-full items-center justify-center overflow-hidden text-[10px]" style={{ background: LAV, color: PINK }}>
              {DATA.photo ? <img src={DATA.photo} alt={DATA.name} className="h-full w-full object-cover" /> : "Photo"}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border-2 border-dashed px-3 py-1.5" style={{ borderColor: BROWN, background: LAV }}>
          {DATA.about.map(([k, v]) => (
            <div key={k} className="flex gap-2 border-b border-dotted py-1.5 text-[10px] leading-[1.5] last:border-b-0" style={{ borderColor: "#b08a9c" }}>
              <b className="w-[84px] shrink-0" style={{ color: PINK }}>{k}</b>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </Frame>
    );
  }

  /* Projects */
  if (i === 1) {
    return (
      <Frame n={2}>
        <Title>{PAGES[1]}</Title>
        <div className="space-y-3">
          {DATA.projects.map((p, k) => (
            <Card key={p.title} label={String(k + 1).padStart(2, "0")} title={p.title} text={p.text} />
          ))}
        </div>
      </Frame>
    );
  }

  /* Skills */
  if (i === 2) {
    return (
      <Frame n={3}>
        <Title>{PAGES[2]}</Title>
        <div>
          {DATA.skills.map((s, k) => (
            <div key={s.title} className="flex gap-3 border-b py-3 first:pt-0" style={{ borderColor: LINE }}>
              <span className="w-3 shrink-0 text-[10px]" style={{ color: PINK }}>{k + 1}</span>
              <div className="min-w-0">
                <b className="block text-[14px] leading-tight" style={{ ...SANS, fontWeight: 800 }}>{s.title}</b>
                <p className="m-0 mt-1 text-[9.5px] leading-[1.6]">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    );
  }

  /* Hobbies: dashed cards like the "Let's work together" card */
  if (i === 3) {
    return (
      <Frame n={4}>
        <Title>{PAGES[3]}</Title>
        <div className="grid grid-cols-2 gap-2.5">
          {DATA.hobbies.map((h) => (
            <div
              key={h.title}
              className={"flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-2 py-3 text-center " + (h.spotify ? "col-span-2" : "")}
              style={{ borderColor: BROWN, background: LAV }}
            >
              <div style={{ ...SCRIPT, color: PINK, fontSize: 24, lineHeight: 1.1 }}>{h.title}</div>
              {h.spotify && DATA.spotifyPlaylist && (
                <iframe
                  title="Top Spotify playlist"
                  src={`https://open.spotify.com/embed/playlist/${DATA.spotifyPlaylist}?theme=0`}
                  width="100%"
                  height="152"
                  loading="lazy"
                  allow="encrypted-media"
                  className="mt-2 rounded-xl border-0"
                />
              )}
            </div>
          ))}
        </div>
      </Frame>
    );
  }

  /* Side Quests */
  if (i === 4) {
    return (
      <Frame n={5}>
        <Title>{PAGES[4]}</Title>
        <div className="space-y-3">
          {DATA.quests.map((q, k) => (
            <Card key={q.title} label={`Quest ${String(k + 1).padStart(2, "0")}`} title={q.title} text={q.text} />
          ))}
        </div>
      </Frame>
    );
  }

  /* Fun Facts */
  return (
    <Frame n={6}>
      <Title>{PAGES[5]}</Title>
      <div>
        {DATA.facts.map((f) => (
          <div key={f} className="flex items-start gap-2.5 border-b py-2.5 first:pt-0" style={{ borderColor: LINE }}>
            <Star size={13} className="mt-[2px] shrink-0" />
            <p className="m-0 text-[10.5px] leading-[1.6]">{f}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

export default function GarciaPortfolio({ next, go, dark, toggle }) {
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
    <div className="cohesive-portfolio flex min-h-screen flex-col overflow-x-hidden bg-[var(--bg)] text-[var(--ink)]" style={SANS}>
      <style>{CSS}</style>

      <nav className="sticky top-[env(safe-area-inset-top,0px)] z-30 border-b border-[var(--line)] bg-[var(--bg)]">
        <div className="mx-auto flex h-[58px] max-w-[960px] items-center justify-between px-5">
          <button onClick={() => go("deck")} className="cursor-pointer border-0 bg-transparent px-2 py-1.5 text-sm font-medium text-[var(--ink)] hover:underline">
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
            <div className={"absolute inset-0 " + EDGE} style={{ background: YEL }}>
              <div className={"absolute -right-[13px] top-[4%] h-[38%] w-[13px] rounded-r-md border-l-0 bg-[#f2b51c] " + EDGE} />
              <div className="absolute inset-x-[4%] bottom-[2.5%] top-[2.5%] [perspective:1200px]">
                <div
                  key={open + "-" + page}
                  className="sheet h-full overflow-y-auto px-4 pb-4 pt-3.5 shadow-[0_1px_0_#e6d77a,0_2px_0_#fff8c4,0_3px_0_#e6d77a]"
                  style={{ ...SANS, background: PALE, color: BROWN }}
                  onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
                  onTouchEnd={(e) => {
                    const d = e.changedTouches[0].clientX - touchX.current;
                    if (d < -50) step(1); else if (d > 50) step(-1);
                  }}
                >
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
                className={"absolute inset-0 shadow-[0_8px_24px_rgba(0,0,0,.18)] " + EDGE + (open ? "" : " cursor-pointer")}
                style={{ ...HIDE_BACK, background: YEL }}
              >
                <div className="absolute inset-y-0 left-[3%] w-px" style={{ background: GOLD }} />
                <div className="absolute inset-y-0 left-[4.2%] w-px" style={{ background: GOLD }} />
                <CoverSheet />
              </div>

              {/* inside of the cover: table of contents */}
              <div className={"absolute inset-0 p-6 " + EDGE} style={{ ...HIDE_BACK, transform: "rotateY(180deg)", background: PALE, color: BROWN }}>
                <div className="absolute inset-y-0 right-[5%] w-px" style={{ background: "#e6d77a" }} />
                <Star size={34} />
                <h2 className="mb-6 mt-2 font-normal" style={{ ...DISPLAY, fontSize: 34 }}>Table of<br />Contents</h2>
                <ol className="m-0 list-none p-0" style={MONO}>
                  {PAGES.map((p, k) => (
                    <li key={p}>
                      <button
                        onClick={() => setPage(k)}
                        className="flex w-full cursor-pointer items-baseline gap-4 border-0 border-b bg-transparent py-2.5 text-left text-[13px]"
                        style={{ borderColor: LINE, color: BROWN }}
                      >
                        <span className="w-3 text-[11px]" style={{ color: PINK }}>{k + 1}</span>
                        <span className={page === k ? "font-bold" : ""}>{p}</span>
                      </button>
                    </li>
                  ))}
                </ol>
                <div className="absolute inset-x-6 bottom-5 flex justify-between text-[9px]" style={{ ...MONO, color: PINK }}>
                  <span>{DATA.field}</span>
                  <span style={{ ...SCRIPT, fontSize: 16 }}>{DATA.first}</span>
                  <span>{DATA.date}</span>
                </div>
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
                {PAGES.map((p, k) => (
                  <button key={p} onClick={() => setPage(k)} className={linkBtn + (page === k ? " font-bold" : "")}>{p}</button>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
