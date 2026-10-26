import { useState, useEffect, useRef } from "react";

let M = []; // filled from the Spring Boot API (see main.jsx)
export function loadMembers(list) { M = list; }
const DW_TOOLS = [
  { n: "Java", c: "Backend", e: "☕" }, { n: "Spring Boot", c: "Backend", e: "🍃" },
  { n: "React", c: "Frontend", e: "⚛️" }, { n: "Tailwind", c: "Frontend", e: "🌬️" },
  { n: "Git", c: "Tools", e: "🔀" }, { n: "Figma", c: "Tools", e: "🎨" },
];
const clamp = (v) => Math.max(0, Math.min(1, v));
const scTo = (id) => document.getElementById(id).scrollIntoView({ behavior: "smooth" });
const realNames = {
  dwight: "Rieze Andrei Venzon",
  m2: "Althea Lei Santos",
  m3: "Phiona Eunice Garcia",
  m4: "Carlo Timbas",
};
function useRoute() {
  const get = () => { const h = location.hash.replace("#", ""); return M.some((m) => m.id === h) ? h : "home"; };
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
      {dark ? "☀" : "☾"}
    </button>
  );
}

function Flash({ onDone }) {
  return (
    <div className="flash" onClick={onDone} onAnimationEnd={(e) => e.target === e.currentTarget && onDone()}>
      <img src="/sunshine.png" alt="Sunshine meme" />
      <span>Light mode activated. Sorry for your eyes. </span>
    </div>
  );
}

/* ---------- Landing ---------- */
function Stack({ go, onMatch, order, setOrder }) {
  const [dx, setDx] = useState(0);
  const [drag, setDrag] = useState(false);
  const busy = useRef(false), start = useRef(0), moved = useRef(false), act = useRef({});

  const fly = (dir, cb) => {
    if (busy.current) return;
    busy.current = true; setDrag(false); setDx(dir * 560);
    setTimeout(() => { cb(); setDx(0); busy.current = false; }, 280);
  };
  const pass = () => fly(-1, () => setOrder((o) => [...o.slice(1), o[0]]));
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
      if (moved.current) setDx(d);
    },
    onPointerUp: () => {
      if (!drag) return;
      setDrag(false);
      if (dx > 90) look(); else if (dx < -90) pass(); else setDx(0);
    },
    onPointerCancel: () => { setDrag(false); setDx(0); },
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
  return (
    <main className="hero">
      <div className="bar"><span className="mono">CTPR CLUB</span><ThemeBtn dark={dark} toggle={toggle} /></div>
      <div>
        <div className="mono">A VERY SERIOUS CODING COLLECTIVE</div>
        <h1>Find your<br />dev <em>match.</em></h1>
        <p className="sub">Eight charming profiles. Eight real portfolios. Zero awkward coffee chats. Swipe through the people behind the pixels.</p>
        <div className="trust">
          <span className="avs">{M.slice(0, 5).map((m) => <button key={m.id} className="av" title={m.name} style={{ background: m.color, color: m.textColor }} onClick={() => go(m.id)}>{m.photoUrl ? <img src={m.photoUrl} alt="" /> : m.init}</button>)}</span>
          <span className="mono">TRUSTED BY AT LEAST OUR PARENTS</span>
        </div>
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
        <img className="match-image" src="/match-celebration.jpg" alt="Celebrating when the school bell rings" />
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
        : m ? <Portfolio key={m.id} m={m} go={go} dark={dark} toggle={toggle} />
          : <Landing go={go} onMatch={setMatch} order={order} setOrder={setOrder} dark={dark} toggle={toggle} />}
    </>
  );
}
export default App;
