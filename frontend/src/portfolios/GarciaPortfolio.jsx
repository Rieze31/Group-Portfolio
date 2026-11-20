import { useEffect, useRef, useState } from "react";
import ThemeBtn from "../components/ThemeBtn.jsx";

/* ---------- Everything you may want to edit is in DATA ---------- */
/* Photos: put the files in frontend/public/photos/ and write just the file name
   WITHOUT the extension (e.g. img: "readable"). The page tries .jpg, .jpeg, .png
   and .webp automatically. Until a photo is found, a placeholder box is shown. */
const DATA = {
  name: "Phiona Eunice De Leon Garcia",
  nickname: "Yay",
  section: "BSIT 3-1",
  teacher: "Sean Dyogi",
  field: "BSIT Portfolio",   // small label at the top-left of every page
  date: "Nov 2026",          // small label at the top-right of every page
  photo: "cover",            // About Me photo (file name without extension)
  photoPos: "50% 30%",       // vertical crop of the About Me photo: raise the 2nd number to move the picture up
  spotifyPlaylist: "https://open.spotify.com/artist/7tYKF4w9nC0nq9CsPZTHyP", // Spotify link (artist or playlist) shown by "Music vibing"

  about: [
    ["Nickname:", "Yay"],
    ["Age:", "21 yrs old"],
    ["Year:", "3rd year BSIT student"],
    ["Why IT:", "I chose IT because of its broad opportunities and the creative world of it."],
  ],

  projects: [
    { title: "CTPR Club Group Portfolio", text: "Group portfolio website." },
    { title: "EaseAccess", text: "Barangay document request system.", img: "easeaccess" },
    { title: "ReadAble", text: "Web-based interactive reading comprehension support application for children with autism spectrum disorder (ASD).", img: "readable" },
    { title: "ResumeFit", img: "resumefit" },
    { title: "Restaurant Picker", text: "A random restaurant picker for people who are having a hard time picking where to eat." },
  ],

  skills: [
    { title: "Adobe Photoshop", text: "Graphic design projects that I used to compete with in collaborative desktop publishing." },
    { title: "InDesign", text: "Desktop publishing and page layout for multi-page print and digital media, that I also used to compete with in collaborative desktop publishing.", img: "adobe" },
    { title: "SketchUp", text: "3D modelling and visual prototypes like architectural structures and interior designing.", img: "sketchup" },
    { title: "MySQL", icon: "🗄️" },
    { title: "Figma", icon: "🎨" },
    { title: "Git", icon: "🔀" },
    { title: "Canva", icon: "✨" },
    { title: "CapCut", icon: "🎬" },
    { title: "CSS", icon: "💅" },
    { title: "HTML", icon: "🌐" },
    { title: "Java", icon: "☕" },
    { title: "C++", icon: "⚙️" },
  ],

  hobbies: [
    { title: "Online shopping" },
    { title: "Matcha hunting" },
    { title: "Pickleball", img: "pickle" },
    { title: "Cafe hopping" },
    { title: "Music vibing", spotify: true },
    { title: "Sunset watching", center: true },
  ],

  quests: [
    { title: "Polli Molli", text: "Anything personalized for events and special occasions.", img: "polli" },
    { title: "GotChew", text: "Selling Dubai chewy cookies.", img: "gotchew" },
    { title: "TikTok Affiliate", text: "Focused on clothes and lifestyle contents.", img: "affiliate" },
  ],

  favorites: [
    ["Favorite color:", "White"],
    ["Favorite app:", "TikTok"],
    ["Learning style:", "Visual learner"],
  ],

  facts: [
    ["Fashion:", "love trying on clothes."],
    ["Food:", "love trying out new food spots."],
    ["Cooking:", "love cooking the recipes I see on TikTok or FB reels."],
    ["Collection:", "have a vintage and digital camera collection."],
  ],
};

/* the tabs shown in the table of contents (order = page order) */
const PAGES = ["About Me", "Projects", "Skills", "Hobbies", "Side Quests", "Fun Facts"];

const PHOTO_DIR = "/photos/phio";
const PHOTO_EXTS = ["jpg", "jpeg", "png", "webp"];

/* how much the right-hand page is magnified when the folder is open (1 = normal) */
const PAGE_ZOOM = 1.25;

const YEL = "#efdeae";     // folder
const PALE = "#fdf3a7";    // pages
const LAV = "#f0dce8";     // pink paper (cover + cards)
const BROWN = "#5a2008";
const PINK = "#e6128c";
const GOLD = "#d8b258";
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

/* a photo slot: shows the picture when the file exists, otherwise a placeholder box.
   name = file name without extension ("readable"), or a full path ("/photos/me.jpg")
   pos  = CSS object-position for the crop ("50% 0%" = top of the picture) */
function Pic({ name, alt = "", className = "", pos = "50% 0%" }) {
  const [tryIdx, setTryIdx] = useState(0);
  const isPath = !!name && (name.startsWith("/") || name.includes("."));
  const src = !name ? null : isPath ? name : tryIdx < PHOTO_EXTS.length ? `${PHOTO_DIR}/${name}.${PHOTO_EXTS[tryIdx]}` : null;

  return (
    <div className={"overflow-hidden border " + className} style={{ borderColor: PINK, background: LAV }}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => !isPath && setTryIdx((n) => n + 1)}
          className="block h-full w-full object-cover"
          style={{ objectPosition: pos }}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 p-1 text-center text-[9px] leading-tight" style={{ color: PINK }}>
          <span>Photo</span>
          {name && <span className="opacity-70">{name}</span>}
        </div>
      )}
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

/* pink-bordered card used for projects and side quests.
   layout "top": photo above the text (wide screenshots)
   layout "side": photo on the left, text on the right (portrait photos) */
function Card({ label, title, text, img, layout = "top" }) {
  const head = (
    <>
      <div className="flex items-baseline gap-2">
        <span className="text-[9px]" style={{ color: PINK }}>{label}</span>
        <b className="text-[13px] leading-tight" style={{ ...SANS, fontWeight: 800 }}>{title}</b>
      </div>
      {text && <p className="m-0 mt-1 text-[9.5px] leading-[1.55]">{text}</p>}
    </>
  );

  if (layout === "side") {
    return (
      <div className="flex items-start gap-2.5 border-2 bg-[#fffbd6] p-2.5" style={{ borderColor: PINK }}>
        <Pic name={img} alt={title} pos="50% 0%" className="aspect-[3/4] w-[38%] shrink-0" />
        <div className="min-w-0 flex-1">{head}</div>
      </div>
    );
  }

  return (
    <div className="border-2 bg-[#fffbd6] p-2.5" style={{ borderColor: PINK }}>
      {img && <Pic name={img} alt={title} className="mb-2 aspect-[16/9] w-full" />}
      {head}
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

/* "Music vibing" card: click the title to show or hide the Spotify playlist.
   Accepts a full share link or just the playlist ID. */
function spotifyRef(v) {
  const str = String(v || "");
  const m = str.match(/(playlist|artist|album|track)\/([A-Za-z0-9]+)/);
  if (m) return { type: m[1], id: m[2] };
  const id = str.trim();
  return id ? { type: "playlist", id } : null;
}

function MusicCard({ title }) {
  const [show, setShow] = useState(false);
  const ref = spotifyRef(DATA.spotifyPlaylist);

  return (
    <div className="col-span-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-2 py-3 text-center" style={{ borderColor: BROWN, background: LAV }}>
      <button
        onClick={() => setShow((v) => !v)}
        aria-expanded={show}
        className="cursor-pointer border-0 bg-transparent p-0 underline underline-offset-4"
        style={{ ...SCRIPT, color: PINK, fontSize: 24, lineHeight: 1.1 }}
      >
        {title}
      </button>
      <span className="mt-1 text-[8.5px]" style={{ color: PINK }}>
        {show ? "Click again to hide" : "Click to hear my SZA picks"}
      </span>

      {show && (ref ? (
        <>
          <iframe
            title="SZA on Spotify"
            src={`https://open.spotify.com/embed/${ref.type}/${ref.id}?theme=0`}
            width="100%"
            height="352"
            loading="lazy"
            allow="encrypted-media"
            className="mt-2 rounded-xl border-0"
          />
          <a href={`https://open.spotify.com/${ref.type}/${ref.id}`} target="_blank" rel="noreferrer" className="mt-2 text-[10px] underline underline-offset-2" style={{ color: PINK }}>
            Open in Spotify
          </a>
        </>
      ) : (
        <p className="m-0 mt-2 text-[10px]">Music coming soon.</p>
      ))}
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
            <div className="mt-1" style={{ ...DISPLAY, fontSize: 25, WebkitTextStroke: `3px ${GOLD}` }}>{DATA.name}</div>
          </div>
          <div className="aspect-[0.78] w-[40%] shrink-0 border-2 p-1.5" style={{ background: "#f2c230", borderColor: PINK }}>
            <Pic name={DATA.photo} alt={DATA.name} pos={DATA.photoPos} className="h-full w-full border-0" />
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
            <Card key={p.title} label={String(k + 1).padStart(2, "0")} title={p.title} text={p.text} img={p.img} />
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
              <div className="min-w-0 flex-1">
                <b className="block text-[14px] leading-tight" style={{ ...SANS, fontWeight: 800 }}>{s.icon && <span className="mr-1.5" aria-hidden="true">{s.icon}</span>}{s.title}</b>
                {s.text && <p className="m-0 mt-1 text-[9.5px] leading-[1.6]">{s.text}</p>}
                {s.img && <Pic name={s.img} alt={s.title} className="mt-2 h-28 w-full" />}
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
          {DATA.hobbies.map((h) =>
            h.spotify ? (
              <MusicCard key={h.title} title={h.title} />
            ) : (
              <div
                key={h.title}
                className={"flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-2 py-3 text-center " + (h.center ? "col-span-2 w-[calc(50%-5px)] justify-self-center" : "")}
                style={{ borderColor: BROWN, background: LAV }}
              >
                {h.img && <Pic name={h.img} alt={h.title} className="mb-2 aspect-[4/5] w-full" />}
                <div style={{ ...SCRIPT, color: PINK, fontSize: 24, lineHeight: 1.1 }}>{h.title}</div>
              </div>
            )
          )}
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
            <Card key={q.title} layout="side" label={`Quest ${String(k + 1).padStart(2, "0")}`} title={q.title} text={q.text} img={q.img} />
          ))}
        </div>
      </Frame>
    );
  }

  /* Fun Facts: same dashed box and rows as About Me */
  const rowCls = "flex gap-2 border-b border-dotted py-1.5 text-[10px] leading-[1.5] last:border-b-0";
  return (
    <Frame n={6}>
      <Title>{PAGES[5]}</Title>
      <div className="rounded-lg border-2 border-dashed px-3 py-1.5" style={{ borderColor: BROWN, background: LAV }}>
        {DATA.favorites.map(([k, v]) => (
          <div key={k} className={rowCls} style={{ borderColor: "#b08a9c" }}>
            <b className="w-[84px] shrink-0" style={{ color: PINK }}>{k}</b>
            <span>{v}</span>
          </div>
        ))}
        {DATA.facts.map(([k, v]) => (
          <div key={k} className={rowCls} style={{ borderColor: "#b08a9c" }}>
            <b className="w-[84px] shrink-0" style={{ color: PINK }}>{k}</b>
            <span>{v}</span>
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
              "relative aspect-[0.64] w-[var(--w)] [--w:min(420px,92vw)] md:[--w:min(520px,44vw)] transition-transform duration-[900ms] ease-in-out motion-reduce:transition-none " +
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
                  {/* zoomed in so the right-hand page is easier to read */}
                  <div style={{ zoom: PAGE_ZOOM }}>
                    <PageContent i={page} />
                  </div>
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
                <Star size={34} className="mb-6 mt-2 block" />
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
