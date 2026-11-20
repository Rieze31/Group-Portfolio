import { useState, useEffect, useRef, useCallback } from "react";
import VenzonPortfolio from "./portfolios/VenzonPortfolio.jsx";
import GarciaPortfolio from "./portfolios/GarciaPortfolio.jsx";
import SantosPortfolio from "./portfolios/SantosPortfolio.jsx";
import TimbasPortfolio from "./portfolios/TimbasPortfolio.jsx";
import DateMePrank from "./components/DateMePrank.jsx";
import Flash from "./components/Flash.jsx";
import CardFan from "./components/CardFan.jsx";

let M = []; // filled from the Spring Boot API (see main.jsx)
let D = [];
const DISPLAY_MEMBER_IDS = ["dwight", "liza", "bella", "donny"];
export function loadMembers(list) {
  M = list;
  D = DISPLAY_MEMBER_IDS.map((id) => list.find((member) => member.id === id)).filter(Boolean);
}
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

/* ---------- Landing ---------- */
function Stack({ go, onMatch, order, setOrder, members, acceptSoundRef }) {
  const [dx, setDx] = useState(0);
  const [drag, setDrag] = useState(false);
  const busy = useRef(false), start = useRef(0), moved = useRef(false), act = useRef({});
  const passSound = useRef(null);

  useEffect(() => {
    const passAudio = new Audio("./OH%20HELL%20NAH%20-%20Sound%20Effect.mp3");
    const resetPassAudio = () => { passAudio.currentTime = 0; };
    passAudio.addEventListener("ended", resetPassAudio);
    passSound.current = passAudio;
    return () => {
      passAudio.removeEventListener("ended", resetPassAudio);
      passAudio.pause();
      passAudio.currentTime = 0;
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
  const startAcceptSound = () => {
    const audio = acceptSoundRef.current;
    if (!audio || !audio.paused) return;
    audio.loop = true;
    audio.play().catch((error) => console.warn("Unable to play accept sound:", error));
  };
  const stopAcceptSound = () => {
    const audio = acceptSoundRef.current;
    if (!audio) return;
    audio.loop = false;
    audio.pause();
    audio.currentTime = 0;
  };
  const finishAcceptSound = () => {
    const audio = acceptSoundRef.current;
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
      else finishAcceptSound();
    }, 280);
  };
  const pass = () => {
    if (busy.current) return;
    startPassSound();
    fly(-1, () => setOrder((o) => [...o.slice(1), o[0]]));
  };
  const look = () => {
    if (busy.current) return;
    startAcceptSound();
    fly(1, () => onMatch(members[order[0]]));
  };
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
        if (d < 0) {
          startPassSound();
          stopAcceptSound();
        } else if (d > 0) {
          stopPassSound();
          startAcceptSound();
        } else {
          stopPassSound();
          stopAcceptSound();
        }
        setDx(d);
      }
    },
    onPointerUp: () => {
      if (!drag) return;
      setDrag(false);
      if (dx > 90) look(); else if (dx < -90) pass(); else setDx(0);
      if (dx >= -90) stopPassSound();
      if (dx <= 90) stopAcceptSound();
    },
    onPointerCancel: () => { setDrag(false); setDx(0); stopPassSound(); stopAcceptSound(); },
  };
  const BACK = [null, "translateX(-50%) translate(150px,22px) rotate(7deg) scale(.96)", "translateX(-50%) translate(250px,52px) rotate(13deg) scale(.91)"];

  return (
    <div className={`sw${drag && dx < 0 ? " drag-left" : ""}${drag && dx > 0 ? " drag-right" : ""}`}>
      <div className="cnt"><b>{String(order[0] + 1).padStart(2, "0")}</b> / {String(members.length).padStart(2, "0")}</div>
      <div className="stack">
        {order.slice(0, 3).map((idx, i) => {
          const m = members[idx], t = i === 0;
          return (
            <div key={idx} className={"card" + (t ? " t" : "")} {...(t ? h : {})}
              style={{ background: m.color, color: m.textColor, zIndex: 10 - i, transition: t && drag ? "none" : undefined,
                transform: t ? `translateX(calc(-50% + ${dx}px)) rotate(${dx / 22}deg)` : BACK[i] }}>
              {t && (
                <>
                  <div className="photo" style={{ background: `linear-gradient(155deg,${m.color}cc,#001B2B)` }}>
                    {m.photoUrl ? <img src={m.photoUrl} alt={m.name} draggable={false} /> : <b>{m.init}</b>}
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
                    <button className="view" onClick={look}>View portfolio</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <p className="hint">DRAG THE CARD TO SWIPE</p>
      <div className="acts">
        <button className="act" onClick={pass} aria-label="Pass on this member"><i style={{ background: "#331A04", color: "#F8E964" }}>✕</i>OH HELL NAHHH</button>
        <button className="act" onClick={look} aria-label="Accept this member"><i style={{ background: "#EEA233", color: "#331A04" }}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></i>ALAM MO HAAA</button>
      </div>
    </div>
  );
}

const WORDMARK = "CTPR";

function Landing({ go, dark, toggle, members }) {
  const showcaseRef = useRef(null);
  const introRef = useRef(null);
  const storyRef = useRef(null);
  const [showcaseVisible, setShowcaseVisible] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);

  useEffect(() => {
    const section = showcaseRef.current;
    if (!section) return undefined;
    if (!("IntersectionObserver" in window)) {
      setShowcaseVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setShowcaseVisible(entry.isIntersecting && entry.intersectionRatio >= 0.5);
    }, { threshold: 0.5 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = storyRef.current;
    if (!section) return undefined;
    if (!("IntersectionObserver" in window)) {
      setStoryVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStoryVisible(true);
        observer.unobserve(section);
      }
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = introRef.current;
    if (!section) return undefined;
    if (!("IntersectionObserver" in window)) {
      setIntroVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntroVisible(true);
        observer.unobserve(section);
      }
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <main
      className="landing-showcase dating-theme"
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false);
      }}
    >
      <header className="landing-bar">
        <span className="landing-brand mono">CTPR CLUB</span>
        <nav className="dating-nav" aria-label="Primary navigation">
          <a href="#home">Home</a>
          <a href="#deck">Meet the club</a>
        </nav>
        <ThemeBtn dark={dark} toggle={toggle} />
      </header>
      <section
        className="landing-showcase-stage"
        id="home"
        ref={showcaseRef}
        aria-label="CTPR Club member showcase"
      >
        <div className="landing-wordmark" aria-hidden="true">{WORDMARK}</div>
        <CardFan
          members={members}
          variant="showcase"
          sectionVisible={showcaseVisible}
          focusPaused={focusPaused}
        />
      </section>
      <section className="landing-intro" ref={introRef}>
        <div className={`landing-intro-grid${introVisible ? " is-visible" : ""}`}>
          <div className="landing-intro-copy">
            <h1>Find your dev match.</h1>
            <p>Skip the "what are we?" stage and go straight to production. Swipe through the people behind the pixels.</p>
            <button className="landing-find-match" onClick={() => go("deck")}>
              Find Your Match
            </button>
          </div>
          <CardFan members={members} variant="hero" />
        </div>
      </section>
      <section className={`landing-story${storyVisible ? " is-visible" : ""}`} ref={storyRef} aria-label="Baby and Bebu coding story">
        <div className="landing-story-copy">
          <span className="landing-story-mark" aria-hidden="true">"</span>
          <blockquote>
            We make a great pair: one writes the code, the other finds the bugs—and somehow, we still call it teamwork.
          </blockquote>
          <p>Baby &amp; Bebu, coding since 2024</p>
        </div>
        <div className="landing-story-image">
          <img src="/baby-bebu.jpg" alt="Baby and Bebu smiling together" loading="lazy" />
        </div>
      </section>
    </main>
  );
}

function Deck({ go, onMatch, order, setOrder, dark, toggle, members, acceptSoundRef }) {
  return (
    <main className="deck-screen dating-theme">
      <div className="deck-bar">
        <nav className="dating-nav" aria-label="Primary navigation">
          <a href="#home">Home</a>
          <a href="#deck">Meet the club</a>
        </nav>
        <ThemeBtn dark={dark} toggle={toggle} />
      </div>
      <Stack go={go} onMatch={onMatch} order={order} setOrder={setOrder} members={members} acceptSoundRef={acceptSoundRef} />
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
    <div className="cohesive-portfolio">
      <Cursor /><Peek />
      <nav className="pn"><div className="w">
        <button className="back" onClick={() => go("deck")}>← CTPR Club</button>
        <div className="links">
          {["projects", "stack", "about"].map((s) => <button key={s} onClick={() => scTo(s)}>{s[0].toUpperCase() + s.slice(1)}</button>)}
          <ThemeBtn dark={dark} toggle={toggle} compact />
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
            <button className="btn o" onClick={() => go("deck")}>← Back to the club</button>
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
          <button className="back" onClick={() => go("deck")}>← Back to the club</button>
          <button className="back" onClick={() => go(nx.id)}>Next: {nx.name} →</button>
        </footer>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
function MatchScreen({ member }) {
  return (
    <main className="match-screen dating-theme">
      <div className="match-sparkles" aria-hidden="true">♡　✦　♡　✦　♡</div>
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
  const [order, setOrder] = useState(D.map((_, i) => i));
  const [match, setMatch] = useState(null);
  const [prank, setPrank] = useState(null);
  const swipeAcceptSoundRef = useRef(null);
  const profileMusicRef = useRef(null);
  const visitedMusicPortfolio = useRef(false);
  const [dark, setDark] = useState(() => matchMedia("(prefers-color-scheme: dark)").matches);
  const [fk, setFk] = useState(0);
  const [flashType, setFlashType] = useState("light");
  useEffect(() => { document.documentElement.setAttribute("data-theme", dark ? "dark" : "light"); }, [dark]);
  useEffect(() => {
    const audio = new Audio("./Closer%20-%20GEHLEE%20(Lyrics).mp3");
    const resetAfterPlayback = () => { audio.currentTime = 0; };
    audio.addEventListener("ended", resetAfterPlayback);
    swipeAcceptSoundRef.current = audio;
    return () => {
      audio.removeEventListener("ended", resetAfterPlayback);
      audio.pause();
      audio.currentTime = 0;
      swipeAcceptSoundRef.current = null;
    };
  }, []);
  const stopCardTwoMusic = useCallback(() => {
    const audio = profileMusicRef.current;
    if (audio) audio.pause();
    profileMusicRef.current = null;
    visitedMusicPortfolio.current = false;
  }, []);
  const startCardTwoMusic = useCallback(() => {
    stopCardTwoMusic();
    const audio = new Audio("/Gusto%20Ko%20Sakin%20Ka%20Lang%20-%20Robledo%20Timido%20(Lyrics).mp3");
    audio.loop = true;
    profileMusicRef.current = audio;
    return audio.play().catch((error) => {
      if (profileMusicRef.current === audio) stopCardTwoMusic();
      throw error;
    });
  }, [stopCardTwoMusic]);
  const leaveCardTwoPortfolio = (to) => {
    if (to === "deck" || to === "home") stopCardTwoMusic();
    go(to);
  };
  useEffect(() => {
    if (!profileMusicRef.current) return;
    if (route === "santos" && !prank) {
      visitedMusicPortfolio.current = true;
    } else if (visitedMusicPortfolio.current && route !== "santos") {
      stopCardTwoMusic();
    }
  }, [route, prank, stopCardTwoMusic]);
  useEffect(() => () => stopCardTwoMusic(), [stopCardTwoMusic]);
  useEffect(() => {
    if (!match) return undefined;
    const timeout = window.setTimeout(() => {
      go(match.id);
      setMatch(null);
    }, 3600);
    return () => window.clearTimeout(timeout);
  }, [match]);
  const acceptMember = (member) => {
    if (member.portfolio === "santos" || member.id === "santos" || member.id === "liza" || member.id === "m2") setPrank(member);
    else setMatch(member);
  };
  const toggle = () => {
    if (dark) {
      setDark(false);
      setFlashType("light");
      setFk((k) => k + 1);
    } else setDark(true);
  };
  const m = M.find((x) => x.id === route);
  return (
    <>
      {fk > 0 && <Flash key={fk} type={flashType} onDone={() => setFk(0)} />}
      {prank ? <DateMePrank
        member={prank}
        onStartMusic={prank.id === "liza" ? startCardTwoMusic : undefined}
        onOpenPortfolio={() => {
        go(prank.id);
        setPrank(null);
        setFlashType("portfolio");
        setFk((k) => k + 1);
      }} />
        : match ? <MatchScreen member={match} />
        : m ? m.portfolio === "venzon" || m.id === "dwight"
          ? <VenzonPortfolio key={m.id} member={m} next={M[(M.indexOf(m) + 1) % M.length]} go={go} dark={dark} toggle={toggle} />
          : m.portfolio === "garcia" || m.id === "garcia" || m.id === "bella" || m.id === "m3"
            ? <GarciaPortfolio key={m.id} go={go} dark={dark} toggle={toggle} />
            : m.portfolio === "santos" || m.id === "santos" || m.id === "liza" || m.id === "m2"
              ? <SantosPortfolio key={m.id} member={m} next={M[(M.indexOf(m) + 1) % M.length]} go={leaveCardTwoPortfolio} dark={dark} toggle={toggle} />
              : m.portfolio === "timbas" || m.id === "timbas" || m.id === "donny" || m.id === "m4"
                ? <TimbasPortfolio key={m.id} member={m} next={M[(M.indexOf(m) + 1) % M.length]} go={go} dark={dark} toggle={toggle} />
                : <Portfolio key={m.id} m={m} go={go} dark={dark} toggle={toggle} />
          : route === "deck"
            ? <Deck go={go} onMatch={acceptMember} order={order} setOrder={setOrder} dark={dark} toggle={toggle} members={D} acceptSoundRef={swipeAcceptSoundRef} />
            : <Landing go={go} dark={dark} toggle={toggle} members={D} />}
    </>
  );
}
export default App;
