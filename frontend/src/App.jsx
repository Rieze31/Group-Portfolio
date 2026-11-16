import { useState, useEffect, useRef } from "react";
import VenzonPortfolio from "./portfolios/VenzonPortfolio.jsx";
import GarciaPortfolio from "./portfolios/GarciaPortfolio.jsx";
import SantosPortfolio from "./portfolios/SantosPortfolio.jsx";
import TimbasPortfolio from "./portfolios/TimbasPortfolio.jsx";

let M = []; // filled from the Spring Boot API (see main.jsx)
export function loadMembers(list) { M = list; }
const DW_TOOLS = [
  { n: "Java", c: "Backend", e: "☕" }, { n: "Spring Boot", c: "Backend", e: "🍃" },
  { n: "React", c: "Frontend", e: "⚛️" }, { n: "Tailwind", c: "Frontend", e: "🌬️" },
  { n: "Git", c: "Tools", e: "🔀" }, { n: "Figma", c: "Tools", e: "🎨" },
];
const PROFILE_STATS = {
  venzon: [
    ["📍", "Pamantasan ng Lungsod ng Maynila"],
    ["💻", "3rd Year BSIT"],
    ["☕", "99% Coffee Dependent"],
    ["🚩", "Consistently forgets to close tags"],
  ],
  dwight: [
    ["📍", "Pamantasan ng Lungsod ng Maynila"],
    ["💻", "3rd Year BSIT"],
    ["☕", "99% Coffee Dependent"],
    ["🚩", "Consistently forgets to close tags"],
  ],
  santos: [
    ["📍", "Pamantasan ng Lungsod ng Maynila"],
    ["💻", "3rd Year BSIT"],
    ["🎨", "Figma is the love language"],
    ["🚩", "Will nudge it one pixel to the left"],
  ],
  liza: [
    ["📍", "Pamantasan ng Lungsod ng Maynila"],
    ["💻", "3rd Year BSIT"],
    ["🎨", "Figma is the love language"],
    ["🚩", "Will nudge it one pixel to the left"],
  ],
  garcia: [
    ["📍", "Pamantasan ng Lungsod ng Maynila"],
    ["💻", "3rd Year BSIT"],
    ["☕", "Coffee-powered creative"],
    ["🚩", "Calls it a quick UI tweak"],
  ],
  bella: [
    ["📍", "Pamantasan ng Lungsod ng Maynila"],
    ["💻", "3rd Year BSIT"],
    ["☕", "Coffee-powered creative"],
    ["🚩", "Calls it a quick UI tweak"],
  ],
  timbas: [
    ["📍", "Pamantasan ng Lungsod ng Maynila"],
    ["💻", "3rd Year BSIT"],
    ["⚙️", "API-first thinker"],
    ["🚩", "Treats “works locally” as QA"],
  ],
  donny: [
    ["📍", "Pamantasan ng Lungsod ng Maynila"],
    ["💻", "3rd Year BSIT"],
    ["⚙️", "API-first thinker"],
    ["🚩", "Treats “works locally” as QA"],
  ],
};
const clamp = (v) => Math.max(0, Math.min(1, v));
const scTo = (id) => document.getElementById(id).scrollIntoView({ behavior: "smooth" });
const realNames = {
  venzon: "Rieze Andrei Venzon",
  dwight: "Rieze Andrei Venzon",
  garcia: "Phiona Eunice Garcia",
  bella: "Phiona Eunice Garcia",
  santos: "Althea Lei Santos",
  liza: "Althea Lei Santos",
  timbas: "Carlo Timbas",
  donny: "Carlo Timbas",
  m2: "Althea Lei Santos",
  m3: "Phiona Eunice Garcia",
  m4: "Carlo Timbas",
};
const HEARTS = [
  [-46, -250, 22, 0.24, 0.9], [104, -208, 17, 0.29, 1.2], [-270, -145, 14, 0.33, 1.5],
  [290, -112, 19, 0.38, 1.7], [-385, -8, 24, 0.27, 1.1], [382, 34, 15, 0.36, 1.9],
  [-320, 145, 18, 0.32, 1.3], [336, 188, 23, 0.36, 1.6], [-196, 275, 14, 0.29, 2],
  [192, 286, 18, 0.34, 1.4], [-490, 250, 12, 0.38, 2.2], [472, -236, 13, 0.36, 2.1],
  [-525, -275, 18, 0.33, 1.8], [530, 160, 16, 0.32, 2.3], [-95, 360, 20, 0.29, 1.7],
  [82, 362, 14, 0.36, 2.4], [-610, 42, 15, 0.33, 2.5], [612, -44, 21, 0.29, 2.6],
  [-245, -330, 13, 0.36, 2.1], [246, -330, 16, 0.34, 2.2], [-430, 365, 18, 0.32, 2.7],
  [438, 350, 13, 0.37, 2.8], [-570, -370, 12, 0.38, 2.9], [575, 340, 17, 0.33, 3],
  [-150, -420, 15, 0.3, 1.5], [155, -420, 19, 0.28, 1.8], [-675, -170, 16, 0.31, 2.4],
  [680, 205, 18, 0.29, 2.6], [-690, 390, 14, 0.33, 3.1], [690, -385, 15, 0.32, 3.2],
  [-350, 430, 17, 0.3, 3.4], [345, 440, 14, 0.34, 3.5],
  [-760, -310, 18, 0.31, 2.7], [760, 330, 16, 0.3, 2.9], [-760, 80, 13, 0.34, 3.3],
  [755, -95, 20, 0.29, 3.6], [-585, 470, 15, 0.32, 3.8], [580, 475, 18, 0.3, 4],
  [-120, 500, 14, 0.35, 4.2], [125, 500, 17, 0.31, 4.4], [-820, 470, 15, 0.3, 4.6],
  [820, -450, 16, 0.33, 4.8],
];
const LAUNCH_HEARTS = [
  [-310, -250, 34, 0], [-230, -350, 24, 70], [-125, -275, 40, 35],
  [-35, -410, 28, 110], [80, -320, 36, 20], [205, -380, 26, 90],
  [315, -245, 42, 55], [405, -130, 24, 125], [-390, -80, 26, 100],
  [-330, 100, 40, 30], [-235, 250, 27, 140], [-145, 160, 35, 75],
  [-50, 340, 25, 115], [65, 250, 42, 15], [170, 360, 28, 100],
  [270, 210, 36, 50], [390, 120, 25, 130], [-430, 20, 32, 65],
  [-280, -5, 23, 160], [330, -25, 30, 145], [-175, -440, 22, 180],
  [145, -470, 32, 155], [-80, 430, 28, 190], [450, 270, 34, 175],
];
function useRoute() {
  const get = () => { const h = location.hash.replace("#", ""); return h === "deck" || M.some((m) => m.id === h) ? h : "home"; };
  const [r, setR] = useState(get);
  useEffect(() => {
    const f = () => { setR(get()); scrollTo(0, 0); };
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);
  const go = (to) => { setR(to); scrollTo(0, 0); try { location.hash = to; } catch (e) {} };
  return [r, go];
}

function ThemeBtn({ dark, toggle }) {
  return (
    <button className="tb" onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
      <span className={dark ? "tb-icon" : "tb-icon moon"}>{dark ? "☀" : "☾"}</span>
    </button>
  );
}

function Flash({ onDone }) {
  return (
    <div className="flash" onClick={onDone} onAnimationEnd={(e) => e.target === e.currentTarget && onDone()}>
      <img src="./sunshine.png" alt="Sunshine meme" />
      <span>Light mode activated. Sorry for your eyes. </span>
    </div>
  );
}

function HeartShape({ className = "", size = 24, style }) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}

function HeartField() {
  return (
    <div className="heart-field" aria-hidden="true">
      <svg className="heart-defs" width="0" height="0">
        <defs>
          <linearGradient id="heart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F2BA49" />
            <stop offset="48%" stopColor="#E5A93C" />
            <stop offset="100%" stopColor="#E5A93C" stopOpacity=".14" />
          </linearGradient>
        </defs>
      </svg>
      <span className="heart-burst-ring" />
      <HeartShape className="heart-origin" size={124} />
      {HEARTS.map(([x, y, size, opacity, delay], index) => (
        <HeartShape
          key={index}
          className="ambient-heart"
          size={Math.round(size * 1.7)}
          style={{
            "--heart-x": `${x}px`,
            "--heart-y": `${y}px`,
            "--heart-opacity": opacity,
            "--heart-delay": `${delay}s`,
            "--heart-duration": `${5.6 + (index % 4) * .8}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Landing ---------- */
function Stack({ go, onMatch, order, setOrder }) {
  const [dx, setDx] = useState(0);
  const [drag, setDrag] = useState(false);
  const busy = useRef(false), start = useRef(0), moved = useRef(false), act = useRef({});
  const passSound = useRef(null);

  useEffect(() => {
    const audio = new Audio("./OH%20HELL%20NAH%20-%20Sound%20Effect.mp3");
    const resetAfterPlayback = () => { audio.currentTime = 0; };
    audio.addEventListener("ended", resetAfterPlayback);
    passSound.current = audio;
    return () => {
      audio.removeEventListener("ended", resetAfterPlayback);
      audio.pause();
      audio.currentTime = 0;
      passSound.current = null;
    };
  }, []);

  const startPassSound = () => {
    const audio = passSound.current;
    if (!audio || !audio.paused) return;
    audio.loop = true;
    audio.play().catch((error) => console.warn("Unable to play pass sound:", error));
  };
  const stopPassSound = () => {
    const audio = passSound.current;
    if (!audio) return;
    audio.loop = false;
    audio.pause();
    audio.currentTime = 0;
  };
  const finishPassSound = () => {
    const audio = passSound.current;
    if (audio) audio.loop = false;
  };

  const fly = (dir, cb) => {
    if (busy.current) return;
    busy.current = true; setDrag(false); setDx(dir * 560);
    setTimeout(() => {
      cb();
      setDx(0);
      busy.current = false;
      if (dir < 0) finishPassSound();
    }, 280);
  };
  const pass = () => {
    if (busy.current) return;
    startPassSound();
    fly(-1, () => setOrder((o) => [...o.slice(1), o[0]]));
  };
  const look = () => fly(1, () => onMatch(M[order[0]]));
  act.current = { pass, look };

  useEffect(() => {
    const k = (e) => { if (e.key === "ArrowRight") act.current.look(); if (e.key === "ArrowLeft") act.current.pass(); };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);

  const h = {
    onPointerDown: (e) => { if (busy.current) return; start.current = e.clientX; moved.current = false; setDrag(true); },
    onPointerMove: (e) => {
      if (!drag) return;
      const d = e.clientX - start.current;
      if (Math.abs(d) > 5 && !moved.current) { moved.current = true; e.currentTarget.setPointerCapture(e.pointerId); }
      if (moved.current) {
        if (d < 0) startPassSound(); else stopPassSound();
        setDx(d);
      }
    },
    onPointerUp: () => {
      if (!drag) return;
      setDrag(false);
      if (dx > 90) look(); else if (dx < -90) pass(); else setDx(0);
      if (dx >= -90) stopPassSound();
    },
    onPointerCancel: () => { setDrag(false); setDx(0); stopPassSound(); },
  };
  const BACK = [null, "translate(10px,12px) rotate(3deg)", "translate(-8px,22px) rotate(-3deg)"];

  return (
    <div className="sw">
      <div className="cnt"><b>{String(order[0] + 1).padStart(2, "0")}</b> / {String(M.length).padStart(2, "0")}</div>
      <div className="stack">
        {order.slice(0, 3).map((idx, i) => {
          const m = M[idx], t = i === 0;
          return (
            <div key={idx} className={"card" + (t ? " t" : "")} {...(t ? h : {})}
              style={{ background: m.color, color: m.textColor, zIndex: 10 - i, transition: t && drag ? "none" : undefined,
                transform: t ? `translateX(${dx}px) rotate(${dx / 22}deg)` : BACK[i] }}>
              {t && (
                <>
                  <div className="photo" style={{ background: `linear-gradient(155deg,${m.color}cc,#001B2B)` }}>
                    {m.photoUrl ? <img src={m.photoUrl} alt={m.name} /> : <b>{m.init}</b>}
                    <span className="badge">{m.match}% YOUR TYPE</span>
                    <span className="cap">{m.cap}</span>
                    <span className="stamp" style={{ opacity: clamp(Math.abs(dx) / 90), transform: dx < 0 ? "rotate(10deg)" : undefined,
                      left: dx < 0 ? "auto" : 20, right: dx < 0 ? 20 : "auto" }}>{dx < 0 ? "OH HELL NAHHH" : "ALAM MO HAAA"}</span>
                  </div>
                  <div className="info">
                    <div className="role">{m.role}</div>
                    <div><div className="name">{m.name}</div><div className="loc">{m.loc}</div></div>
                    <div className="quote">{m.quote}</div>
                    <div className="tags">{m.tags.map((x) => <span key={x}>{x}</span>)}</div>
                    <button className="view" onClick={look}>View portfolio <span>→</span></button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <p className="hint">DRAG THE CARD OR USE YOUR ARROW KEYS</p>
      <div className="acts">
        <button className="act" onClick={pass}><i style={{ background: "#331A04", color: "#F8E964" }}>✕</i>OH HELL NAHHH</button>
        <button className="act" onClick={look}><i style={{ background: "#EEA233", color: "#331A04" }}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></i>ALAM MO HAAA</button>
      </div>
    </div>
  );
}

function Landing({ go, onMatch, order, setOrder, dark, toggle }) {
  const [launching, setLaunching] = useState(false);
  const launchTimer = useRef(null);
  useEffect(() => () => window.clearTimeout(launchTimer.current), []);
  const launch = () => {
    if (launching) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      go("deck");
      return;
    }
    setLaunching(true);
    launchTimer.current = window.setTimeout(() => go("deck"), 850);
  };

  return (
    <main className="home-screen">
      <HeartField />
      <div className="bar"><span className="mono">CTPR CLUB</span><ThemeBtn dark={dark} toggle={toggle} /></div>
      <div className="home-content">
        <div className="mono">A VERY SERIOUS CODING COLLECTIVE LOL</div>
        <h1>Find your<br />dev <em>match.</em></h1>
        <p className="sub">Skip the "what are we?" stage and go straight to production. Swipe through the people behind the pixels.</p>
        <div className="trust">
          <span className="avs">{M.slice(0, 5).map((m) => <button key={m.id} className="av" title={m.name} style={{ background: m.color, color: m.textColor }} onClick={() => go(m.id)}>{m.photoUrl ? <img src={m.photoUrl} alt="" /> : m.init}</button>)}</span>
          <span className="mono">TRUSTED BY AT LEAST OUR PARENTS</span>
        </div>
        <div className={`match-launch${launching ? " is-bursting" : ""}`}>
          {launching && (
            <span className="launch-burst" aria-hidden="true">
              {LAUNCH_HEARTS.map(([x, y, size, delay], index) => (
                <HeartShape
                  key={index}
                  className="launch-heart"
                  size={size}
                  style={{
                    "--launch-x": `${x}px`,
                    "--launch-y": `${y}px`,
                    "--launch-delay": `${delay}ms`,
                  }}
                />
              ))}
            </span>
          )}
          <button className="find-match" onClick={launch} disabled={launching}>
            Find Your Match <span>→</span>
          </button>
        </div>
      </div>
    </main>
  );
}

function Deck({ go, onMatch, order, setOrder, dark, toggle }) {
  return (
    <main className="deck-screen">
      <div className="deck-bar">
        <button className="back-home" onClick={() => go("home")}>← Back to Home</button>
        <ThemeBtn dark={dark} toggle={toggle} />
      </div>
      <Stack go={go} onMatch={onMatch} order={order} setOrder={setOrder} />
    </main>
  );
}

/* ---------- Portfolio ---------- */
function Cursor() {
  const el = useRef(null);
  useEffect(() => {
    let tx = 0, ty = 0, x = 0, y = 0, raf;
    const mv = (e) => { tx = e.clientX; ty = e.clientY; };
    const loop = () => { x += (tx - x) * 0.15; y += (ty - y) * 0.15; if (el.current) el.current.style.transform = `translate(${x - 11}px,${y - 11}px)`; raf = requestAnimationFrame(loop); };
    addEventListener("mousemove", mv); loop();
    return () => { removeEventListener("mousemove", mv); cancelAnimationFrame(raf); };
  }, []);
  return <div className="cur" ref={el} />;
}

function Peek() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const f = () => { const mx = document.body.scrollHeight - innerHeight; setP(mx > 0 ? scrollY / mx : 0); };
    addEventListener("scroll", f); f();
    return () => removeEventListener("scroll", f);
  }, []);
  return <div className="peek" style={{ transform: `translateX(${140 - clamp(p * 1.4) * 90}px)` }}>peeking…</div>;
}

function Carousel({ slides }) {
  const [i, setI] = useState(0);
  const n = slides.length, s = slides[i];
  return (
    <div>
      <div className="car">
        <div className="slide" style={{ background: s.g }}>{s.t}</div>
        <button className="ar l" aria-label="Previous" onClick={() => setI((v) => (v + n - 1) % n)}>‹</button>
        <button className="ar r" aria-label="Next" onClick={() => setI((v) => (v + 1) % n)}>›</button>
      </div>
      <div className="dots">{slides.map((_, k) => <b key={k} className={k === i ? "on" : ""} />)}</div>
      <p className="p capt">{s.d}</p>
    </div>
  );
}

function Stack2({ tools }) {
  const [f, setF] = useState("All");
  return (
    <>
      <div className="tabs">{["All", "Frontend", "Backend", "Tools"].map((c) => <button key={c} className={"tab" + (f === c ? " on" : "")} onClick={() => setF(c)}>{c}</button>)}</div>
      <div className="grid">{tools.filter((t) => f === "All" || t.c === f).map((t) => <div className="tool" key={t.n}><i>{t.e}</i>{t.n}</div>)}</div>
    </>
  );
}

function Portfolio({ m, go, dark, toggle }) {
  const i = M.indexOf(m), nx = M[(i + 1) % M.length], isD = m.id === "dwight";
  const tools = isD ? DW_TOOLS : m.tags.map((t) => ({ n: t, c: "Tools", e: "✦" }));
  const bio = m.bio;
  const slides = m.slides;
  return (
    <div>
      <Cursor /><Peek />
      <nav className="pn"><div className="w">
        <button className="back" onClick={() => go("home")}>← CTPR Club</button>
        <div className="links">
          {["projects", "stack", "about"].map((s) => <button key={s} onClick={() => scTo(s)}>{s[0].toUpperCase() + s.slice(1)}</button>)}
          <ThemeBtn dark={dark} toggle={toggle} />
        </div>
      </div></nav>
      <div className="w">
        <section className="sec ph">
          <div className="pp" style={{ background: `linear-gradient(155deg,${m.color},#001B2B)` }}>
            {m.photoUrl ? <img src={m.photoUrl} alt={m.name} /> : <b>{m.init}</b>}
          </div>
          <div style={{ flex: "1 1 300px" }}>
            <div className="tag">~/HOME · {m.role}</div>
            <h1 style={{ fontSize: "clamp(40px,7vw,76px)" }}>Hi, I’m <em>{m.name}</em></h1>
            <ul className="profile-stats" aria-label={`${m.name} profile details`}>
              {PROFILE_STATS[m.id].map(([icon, text]) => (
                <li key={text}><span aria-hidden="true">{icon}</span>{text}</li>
              ))}
            </ul>
            <p className="p">{bio}</p>
            <button className="btn" onClick={() => scTo("projects")}>View projects</button>
            <button className="btn o" onClick={() => go("home")}>← Back to the club</button>
          </div>
        </section>
        <section className="sec" id="projects">
          <div className="tag">~/PROJECTS</div>
          <h2>Things I’ve <em>built.</em></h2>
          <p className="p">A collection of projects, each with its own stack.</p>
          {m.projects.map((p, k) => (
            <div className={"proj" + (k ? " r" : "")} key={p.title}>
              <div className="pi" style={{ background: p.gradient }}>PREVIEW IMAGE</div>
              <div className="pt">
                <div className="tag">0{k + 1} / {k ? "FULL-STACK" : "PROJECT"}</div>
                <h2 style={{ fontSize: 28 }}>{p.title}</h2>
                <p className="p">{p.description}</p>
                {m.tags.slice(0, 2).map((t) => <span className="chip" key={t}>{t}</span>)}
              </div>
            </div>
          ))}
        </section>
        <section className="sec" id="stack">
          <div className="tag">~/STACK</div>
          <h2>The tools I <em>reach for.</em></h2>
          <p className="p">The languages and frameworks in my toolkit.</p>
          <Stack2 tools={tools} />
        </section>
        <section className="sec ab" id="about">
          <div>
            <div className="tag">~/ABOUT</div>
            <h2>A bit about <em>me.</em></h2>
            <p className="p">{bio}</p>
          </div>
          <div><Carousel slides={slides} key={m.id} /></div>
        </section>
        <footer className="pf">
          <button className="back" onClick={() => go("home")}>← Back to the club</button>
          <button className="back" onClick={() => go(nx.id)}>Next: {nx.name} →</button>
        </footer>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
function MatchScreen({ member }) {
  return (
    <main className="match-screen">
      <section className="match-card" role="dialog" aria-modal="true" aria-labelledby="match-title">
        <p className="match-kicker mono">A PROMISING TEAM-UP</p>
        <h1 id="match-title">It’s a <em>match!</em></h1>
        <img
          className="match-image"
          src={member.id === "m4" || member.id === "timbas" || member.id === "donny" ? "./empoy.jpg" : "./match-celebration.jpg"}
          alt={member.id === "m4" || member.id === "timbas" || member.id === "donny" ? "Empoy with Piolo Pascual" : "Celebrating when the school bell rings"}
        />
        <p className="match-copy">
          You and <strong>{member.name}</strong> (well, sort of... it’s actually {realNames[member.id]}) look like a great match for your next project.
          Your teacher might call it teamwork. We call it excellent timing.
        </p>
      </section>
    </main>
  );
}

function App() {
  const [route, go] = useRoute();
  const [order, setOrder] = useState(M.map((_, i) => i));
  const [match, setMatch] = useState(null);
  const [dark, setDark] = useState(() => matchMedia("(prefers-color-scheme: dark)").matches);
  const [fk, setFk] = useState(0);
  useEffect(() => { document.documentElement.setAttribute("data-theme", dark ? "dark" : "light"); }, [dark]);
  useEffect(() => {
    if (!match) return undefined;
    const timeout = window.setTimeout(() => {
      go(match.id);
      setMatch(null);
    }, 3600);
    return () => window.clearTimeout(timeout);
  }, [match]);
  const toggle = () => { if (dark) { setDark(false); setFk((k) => k + 1); } else setDark(true); };
  const m = M.find((x) => x.id === route);
  return (
    <>
      {fk > 0 && <Flash key={fk} onDone={() => setFk(0)} />}
      {match ? <MatchScreen member={match} />
        : m ? m.portfolio === "venzon" || m.id === "dwight"
          ? <VenzonPortfolio key={m.id} member={m} next={M[(M.indexOf(m) + 1) % M.length]} go={go} dark={dark} toggle={toggle} />
          : m.portfolio === "garcia" || m.id === "garcia" || m.id === "bella" || m.id === "m3"
            ? <GarciaPortfolio key={m.id} go={go} dark={dark} toggle={toggle} />
            : m.portfolio === "santos" || m.id === "santos" || m.id === "liza" || m.id === "m2"
              ? <SantosPortfolio key={m.id} member={m} next={M[(M.indexOf(m) + 1) % M.length]} go={go} dark={dark} toggle={toggle} />
              : m.portfolio === "timbas" || m.id === "timbas" || m.id === "donny" || m.id === "m4"
                ? <TimbasPortfolio key={m.id} member={m} next={M[(M.indexOf(m) + 1) % M.length]} go={go} dark={dark} toggle={toggle} />
                : <Portfolio key={m.id} m={m} go={go} dark={dark} toggle={toggle} />
          : route === "deck"
            ? <Deck go={go} onMatch={setMatch} order={order} setOrder={setOrder} dark={dark} toggle={toggle} />
            : <Landing go={go} onMatch={setMatch} order={order} setOrder={setOrder} dark={dark} toggle={toggle} />}
    </>
  );
}
export default App;
