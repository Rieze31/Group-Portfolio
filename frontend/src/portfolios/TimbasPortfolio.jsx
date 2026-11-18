import { useEffect, useRef, useState } from "react";
import "@google/model-viewer";

const ACCENT = "#3fb0a6";
const HERO_STILL = "/photos/timbas/carlo-reference.png";
const HERO_FRAME_COUNT = 480;
const ASSET = "/photos/timbas/";
const STORIES = [
  { title: "Make the repeatable automatic.", text: "Good automation gives people more room to focus on the work that needs them.", image: "workflow-node.webp", side: "left" },
  { title: "Let useful agents do the busywork.", text: "AI can move routine tasks forward while people stay in control of the decisions.", image: "automation-orb.png", side: "left" },
  { title: "Connect the steps between tools.", text: "A thoughtful workflow keeps information moving without the manual handoffs.", image: "connected-pipeline.png", side: "left" },
  { title: "Build systems that work together.", text: "Small, clear connections can make a whole process feel simpler.", image: "tiles.webp", side: "left" },
];
const CASES = [
  { n: "01", title: "Lead follow-up flow", client: "LEAD MANAGEMENT", problem: "A new inquiry needs a quick, consistent handoff.", solution: "Capture a form entry, organize the lead, and prepare a follow-up draft for review.", result: "Review-first follow-up concept" },
  { n: "02", title: "Support question triage", client: "CUSTOMER SUPPORT", problem: "Incoming questions need a useful first pass without losing human judgement.", solution: "Group requests, suggest a response, and route uncertain cases to a person.", result: "Human-in-the-loop assistant concept" },
  { n: "03", title: "Cross-tool status sync", client: "TEAM OPERATIONS", problem: "Project updates can get scattered across the tools a team uses.", solution: "Connect status changes and surface the latest update in one clear place.", result: "Connected workflow concept" },
];
const STACK = [
  ["Frontend", "React · JavaScript"],
  ["Backend", "Java · Spring Boot"],
  ["Workflow design", "APIs · Integrations · Process mapping"],
  ["Tools", "Git · GitHub · Vite"],
];
const SERVICES = ["Workflow automation", "AI agents and chatbots", "CRM and app integrations", "Process audits and RPA"];

const CAMERA_ZOOM = [[0,1.02],[2,1.02],[4.2,1.02],[6.8,1.02],[8,1.02],[10.4,1.02],[11.6,1.02],[13.6,1.02],[17.2,1.02],[19,1.02],[20.04,1.02]];
const CAMERA_X = [[0,.42],[4,.47],[7,.55],[11,.46],[14,.57],[15,.47],[20.04,.42]];
const CAMERA_Y = [[0,.46],[2,.46],[4.2,.34],[6.8,.34],[8,.62],[10.4,.62],[11.6,.36],[13.6,.36],[17.2,.62],[19,.62],[20.04,.46]];
function sampleTrack(track, time) {
  if (time <= track[0][0]) return track[0][1];
  for (let i = 1; i < track.length; i += 1) {
    const [end, value] = track[i];
    if (time <= end) {
      const [start, from] = track[i - 1];
      const t = (time - start) / (end - start);
      return from + (value - from) * t;
    }
  }
  return track[track.length - 1][1];
}
function applyHeroCamera(media, progress, reducedMotion) {
  if (!media) return;
  const time = Math.max(0, Math.min(1, progress)) * 20.04;
  const zoom = sampleTrack(CAMERA_ZOOM, time);
  const focusX = 50;
  const focusY = sampleTrack(CAMERA_Y, time) * 100;
  const panX = (sampleTrack(CAMERA_X, time) - .5) * (reducedMotion ? 42 : 90);
  media.style.setProperty("--tb-camera-zoom", zoom.toFixed(3));
  media.style.setProperty("--tb-camera-pan-x", panX.toFixed(2) + "vw");
  media.style.setProperty("--tb-camera-focus-x", focusX.toFixed(2) + "%");
  media.style.setProperty("--tb-camera-focus-y", focusY.toFixed(2) + "%");
}
function paintFrame(ctx, image, width, height) {
  if (!ctx || !image || !width || !height) return;
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

const CSS = `
.timbas-page{--tb-accent:${ACCENT};--tb-bg:#101614;--tb-panel:#151e1b;--tb-ink:#f5f5ef;--tb-muted:#aab4ad;--tb-line:rgba(212,236,224,.14);min-height:100vh;background:var(--tb-bg);color:var(--tb-ink);font-family:var(--sans,Georgia,serif);overflow:clip}
.timbas-page *{box-sizing:border-box}.tb-sans{font-family:var(--sans,Georgia,serif)}.tb-mono{font-family:var(--mono,Arial,sans-serif)}
.tb-nav{position:fixed;inset:0 0 auto;z-index:50;padding:10px clamp(18px,5vw,72px);background:linear-gradient(180deg,rgba(9,14,12,.72),rgba(9,14,12,.16));backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.08)}
.tb-nav-inner{max-width:1440px;margin:auto;min-height:56px;display:flex;align-items:center;justify-content:space-between;gap:20px}.tb-logo{font-size:20px;color:#fff;text-decoration:none;font-weight:600;letter-spacing:-.02em}.tb-logo span{color:var(--tb-accent)}.tb-links{display:flex;align-items:center;gap:clamp(12px,2.2vw,32px)}.tb-links a,.tb-menu a{font:500 13px var(--mono,Arial,sans-serif);letter-spacing:.03em;color:rgba(255,255,255,.8);text-decoration:none;transition:color .2s}.tb-links a:hover,.tb-menu a:hover{color:#9be3d3}.tb-menu-btn{display:none;color:white;border:1px solid var(--tb-line);background:rgba(10,15,13,.5);border-radius:999px;padding:9px 13px}.tb-menu{display:none}
.tb-home-track{height:760vh;position:relative;background:#0d1210}.tb-home-sticky{height:100vh;height:100svh;position:sticky;top:0;overflow:hidden;isolation:isolate;background:#0d1210}.tb-hero-media{--tb-hero-base-y:clamp(96px,10vh,124px);position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:78% center;transform:translate3d(var(--tb-camera-pan-x,0vw),var(--tb-hero-base-y),0) scale(var(--tb-camera-zoom,1.02));transform-origin:var(--tb-camera-focus-x,78%) var(--tb-camera-focus-y,50%);filter:saturate(.8);will-change:transform;transition:none}.tb-hero-canvas{pointer-events:none}.tb-hero-tint{position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,10,8,.70) 0%,rgba(5,10,8,.40) 45%,rgba(5,10,8,.14) 100%),linear-gradient(0deg,rgba(5,10,8,.7),transparent 48%,rgba(5,10,8,.18));z-index:1}.tb-hero-grain{position:absolute;inset:0;z-index:2;pointer-events:none;opacity:.12;background-image:radial-gradient(rgba(255,255,255,.3) .5px,transparent .8px);background-size:5px 5px;mix-blend-mode:overlay}
.tb-hero-intro{position:absolute;z-index:3;top:17vh;left:clamp(24px,8vw,120px);max-width:min(680px,70vw);transition:opacity .4s,filter .4s,transform .5s;transform:translateY(var(--tb-intro-y,0px))}.tb-eyebrow{font:600 10px var(--mono,Arial,sans-serif);letter-spacing:.22em;text-transform:uppercase;color:#9be3d3}.tb-hero-title{margin:.18em 0 0;font:500 clamp(56px,12vw,172px)/.82 var(--sans,Georgia,serif);letter-spacing:-.065em;color:#f7f8f3}.tb-hero-title em{font-weight:400;color:#9be3d3}.tb-hero-copy{max-width:460px;margin:25px 0 0;color:rgba(244,247,242,.78);font:16px/1.65 var(--sans,Georgia,serif)}.tb-hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}.tb-button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 19px;border:1px solid rgba(240,255,250,.48);border-radius:999px;color:white;text-decoration:none;background:rgba(12,18,15,.32);font:500 12px var(--mono,Arial,sans-serif);letter-spacing:.04em;transition:transform .2s,background .2s,border-color .2s}.tb-button:hover{transform:translateY(-2px);background:rgba(63,176,166,.22);border-color:#9be3d3}.tb-button.primary{background:var(--tb-accent);border-color:var(--tb-accent);color:#07110f}.tb-scroll-hint{position:absolute;z-index:3;bottom:26px;left:clamp(24px,8vw,120px);display:flex;align-items:center;gap:12px;color:rgba(255,255,255,.68);font:10px var(--mono,Arial,sans-serif);letter-spacing:.14em;text-transform:uppercase}.tb-scroll-line{width:54px;height:1px;background:#9be3d3;transform-origin:left;animation:tb-pulse 1.8s ease-in-out infinite}@keyframes tb-pulse{50%{transform:scaleX(.42);opacity:.5}}
.tb-story{position:absolute;z-index:4;left:clamp(24px,8vw,120px);bottom:15vh;width:min(400px,42vw);display:grid;grid-template-columns:94px 1fr;gap:22px;align-items:center;opacity:0;transform:translateY(14px);transition:opacity .65s,transform .65s;pointer-events:none}.tb-story.active{opacity:1;transform:translateY(0)}.tb-story-img{width:94px;height:94px;object-fit:contain;filter:drop-shadow(0 16px 36px rgba(0,0,0,.5)) hue-rotate(-16deg) saturate(.78)}.tb-story h2{font:500 clamp(23px,3vw,34px)/1.03 var(--sans,Georgia,serif);margin:0 0 8px}.tb-story p{font:14px/1.5 var(--sans,Georgia,serif);color:rgba(244,247,242,.72);margin:0}.tb-story-count{font:10px var(--mono,Arial,sans-serif);color:#9be3d3;letter-spacing:.15em;margin-bottom:8px}
.tb-section{position:relative;z-index:2;padding:clamp(82px,11vw,148px) clamp(22px,7vw,104px);scroll-margin-top:74px;background:transparent}.tb-section-inner{position:relative;z-index:2;max-width:1280px;margin:0 auto}.tb-section-kicker{font:600 10px var(--mono,Arial,sans-serif);text-transform:uppercase;letter-spacing:.22em;color:#9be3d3}.tb-section-title{font:500 clamp(38px,7vw,84px)/.92 var(--sans,Georgia,serif);letter-spacing:-.045em;margin:14px 0 18px}.tb-section-lede{font:17px/1.6 var(--sans,Georgia,serif);color:var(--tb-muted);max-width:640px;margin:0 0 42px}.tb-projects{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.tb-project{padding:24px 22px 26px;background:linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.015));border:1px solid var(--tb-line);border-radius:16px;min-height:310px;display:flex;flex-direction:column}.tb-project-top{display:flex;justify-content:space-between;align-items:center;color:#9be3d3;font:10px var(--mono,Arial,sans-serif);letter-spacing:.12em;text-transform:uppercase}.tb-project-art{height:102px;margin:10px 0 13px;display:flex;align-items:center;justify-content:center;border-bottom:1px solid var(--tb-line)}.tb-project-art img{width:88px;height:88px;object-fit:contain;filter:hue-rotate(-18deg) saturate(.75);opacity:.9}.tb-project h3{font:500 27px/1.04 var(--sans,Georgia,serif);margin:0 0 16px}.tb-project dl{margin:0;display:grid;gap:11px}.tb-project dt{font:600 9px var(--mono,Arial,sans-serif);letter-spacing:.15em;text-transform:uppercase;color:#9be3d3;margin-bottom:3px}.tb-project dd{font:13px/1.45 var(--sans,Georgia,serif);color:var(--tb-muted);margin:0}.tb-project .metric{font-size:17px;color:#eff9f2}
.tb-stack-layout{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(28px,7vw,110px);align-items:start}.tb-stack-grid{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--tb-line)}.tb-stack-item{padding:19px 14px 19px 0;border-bottom:1px solid var(--tb-line)}.tb-stack-item small{display:block;color:#9be3d3;font:10px var(--mono,Arial,sans-serif);letter-spacing:.12em;text-transform:uppercase;margin-bottom:7px}.tb-stack-item strong{font:500 20px var(--sans,Georgia,serif)}.tb-services{border-top:1px solid var(--tb-line)}.tb-service{display:flex;justify-content:space-between;gap:14px;align-items:center;padding:15px 0;border-bottom:1px solid var(--tb-line);font:18px var(--sans,Georgia,serif)}.tb-service span{font:10px var(--mono,Arial,sans-serif);color:#9be3d3}
.tb-about-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,7vw,110px);align-items:center}.tb-about-copy{max-width:560px}.tb-about-copy p{color:var(--tb-muted);font:17px/1.72 var(--sans,Georgia,serif)}.tb-about-note{margin-top:28px;padding-top:18px;border-top:1px solid var(--tb-line);color:#c1d0c7;font:12px/1.6 var(--mono,Arial,sans-serif)}.tb-about-art{min-height:380px;display:grid;place-items:center;perspective:900px}.tb-core{position:relative;width:min(390px,82vw);aspect-ratio:1;transform-style:preserve-3d;transition:transform .9s cubic-bezier(.2,.7,.2,1);filter:drop-shadow(0 24px 55px rgba(0,0,0,.4))}.tb-core img{position:absolute;inset:8%;width:84%;height:84%;object-fit:contain;mix-blend-mode:screen;filter:hue-rotate(-18deg) saturate(.78);animation:tb-core-float 8s ease-in-out infinite}.tb-core:before,.tb-core:after{content:"";position:absolute;inset:13%;border:1px solid rgba(131,227,204,.45);border-radius:34%;transform:rotateX(65deg) rotateZ(18deg);box-shadow:0 0 38px rgba(63,176,166,.12);animation:tb-orbit 16s linear infinite}.tb-core:after{inset:18%;border-color:rgba(235,246,239,.28);transform:rotateY(66deg) rotateZ(-22deg);animation-duration:21s;animation-direction:reverse}@keyframes tb-orbit{to{rotate:0 0 1 360deg}}@keyframes tb-core-float{50%{transform:translateY(-8px) rotateY(8deg)}}
.tb-core-float{position:fixed;z-index:1;pointer-events:none;top:50%;width:min(32vw,390px);aspect-ratio:1;perspective:900px;transition:left .9s cubic-bezier(.2,.7,.2,1),opacity .5s;transform:translateY(-50%);filter:drop-shadow(0 24px 55px rgba(0,0,0,.4))}.tb-core-float .tb-core{width:100%;height:100%;transform-style:preserve-3d;transition:transform .9s cubic-bezier(.2,.7,.2,1)}.tb-core-float .tb-core img{position:absolute;inset:8%;width:84%;height:84%;object-fit:contain;mix-blend-mode:screen;filter:hue-rotate(-18deg) saturate(.78);animation:tb-core-float 8s ease-in-out infinite}.tb-core-float .tb-core:before,.tb-core-float .tb-core:after{content:"";position:absolute;inset:13%;border:1px solid rgba(131,227,204,.45);border-radius:34%;transform:rotateX(65deg) rotateZ(18deg);box-shadow:0 0 38px rgba(63,176,166,.12);animation:tb-orbit 16s linear infinite}.tb-core-float .tb-core:after{inset:18%;border-color:rgba(235,246,239,.28);transform:rotateY(66deg) rotateZ(-22deg);animation-duration:21s;animation-direction:reverse}
.tb-final-cta{margin-top:clamp(46px,8vw,100px);padding:clamp(26px,5vw,54px);border:1px solid rgba(155,227,211,.38);border-radius:20px;background:radial-gradient(ellipse at 90% 0%,rgba(63,176,166,.14),transparent 55%),#121a17;display:flex;align-items:center;justify-content:space-between;gap:24px}.tb-final-cta h3{font:500 clamp(30px,5vw,55px)/.98 var(--sans,Georgia,serif);margin:0}.tb-final-cta p{font:14px/1.5 var(--sans,Georgia,serif);color:var(--tb-muted);margin:11px 0 0}.tb-footer{position:relative;z-index:2;padding:24px clamp(22px,7vw,104px);border-top:1px solid var(--tb-line);display:flex;justify-content:space-between;gap:16px;align-items:center;color:var(--tb-muted);font:10px var(--mono,Arial,sans-serif);letter-spacing:.08em}.tb-footer button{background:none;border:0;color:var(--tb-muted);cursor:pointer;font:inherit}.tb-mobile-note{display:none}
@media(max-width:850px){.tb-core-float{width:min(38vw,270px);opacity:.28!important}.tb-projects{grid-template-columns:1fr}.tb-project{min-height:auto}.tb-project-art{height:82px}.tb-stack-layout,.tb-about-grid{grid-template-columns:1fr}.tb-about-art{min-height:270px}.tb-story{width:min(420px,75vw);bottom:10vh}.tb-section{padding-top:78px;padding-bottom:78px}}
@media(max-width:640px){.tb-core-float{width:170px;top:34%;left:auto!important;right:-38px!important;opacity:.22!important}.tb-links{display:none}.tb-menu-btn{display:block}.tb-menu.open{display:flex;position:absolute;top:calc(100% + 1px);left:0;right:0;padding:16px 22px 20px;background:rgba(13,18,16,.96);border-bottom:1px solid var(--tb-line);flex-direction:column;align-items:flex-start;gap:18px}.tb-hero-intro{top:18vh;left:22px;max-width:calc(100vw - 44px)}.tb-hero-title{font-size:clamp(58px,19vw,104px)}.tb-hero-copy{max-width:310px;font-size:15px}.tb-hero-media{--tb-hero-base-y:clamp(82px,10vh,100px);object-position:center center}.tb-hero-tint{background:linear-gradient(90deg,rgba(5,10,8,.72),rgba(5,10,8,.24)),linear-gradient(0deg,rgba(5,10,8,.78),transparent 70%)}.tb-story{left:22px;bottom:10vh;width:calc(100vw - 44px);grid-template-columns:68px 1fr;gap:15px}.tb-story-img{width:68px;height:68px}.tb-story h2{font-size:24px}.tb-story p{font-size:13px}.tb-scroll-hint{left:22px;bottom:22px}.tb-section{padding-left:22px;padding-right:22px}.tb-section-title{font-size:clamp(42px,13vw,62px)}.tb-stack-grid{grid-template-columns:1fr 1fr}.tb-stack-item strong{font-size:17px}.tb-final-cta{align-items:flex-start;flex-direction:column}.tb-footer{padding:20px 22px;flex-wrap:wrap}.tb-about-art{min-height:240px}.tb-mobile-note{display:block;color:var(--tb-muted);font:10px/1.5 var(--mono,Arial,sans-serif);letter-spacing:.1em;text-transform:uppercase}}
@media(prefers-reduced-motion:reduce){.tb-scroll-line,.tb-core img,.tb-core:before,.tb-core:after{animation:none}.tb-button{transition:none}.tb-hero-intro{transition:none}.tb-story{transition:opacity .2s}}
.tb-core-float .tb-core>model-viewer{position:absolute;inset:0;width:100%;height:100%;background:transparent;--poster-color:transparent}
`;

export default function TimbasPortfolio({ member, next, go }) {
  const pageRef = useRef(null);
  const homeRef = useRef(null);
  const stillRef = useRef(null);
  const canvasRef = useRef(null);
  const frameImages = useRef([]);
  const renderedFrame = useRef(-1);
  const [progress, setProgress] = useState(0);
  const [motionReduced, setMotionReduced] = useState(false);
  const [storyIndex, setStoryIndex] = useState(-1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [coreView, setCoreView] = useState({ side: "right", rotate: -7, visible: false });
  const reducedMotion = useRef(false);
  const progressTarget = useRef(0);
  const progressSmooth = useRef(0);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMotionReduced(reducedMotion.current);
    let raf = 0;
    const requested = new Uint8Array(HERO_FRAME_COUNT);
    const queue = [];
    const cache = new Array(HERO_FRAME_COUNT);
    frameImages.current = cache;
    renderedFrame.current = -1;
    for (let i = 0; i < Math.min(24, HERO_FRAME_COUNT); i += 1) queue.push(i);
    for (const stride of [32, 16, 8, 4, 2, 1]) {
      for (let i = 0; i < HERO_FRAME_COUNT; i += stride) {
        if (!queue.includes(i)) queue.push(i);
      }
    }
    let activeLoads = 0;
    let disposed = false;
    const loadFrames = () => {
      while (!disposed && activeLoads < 8 && queue.length) {
        const index = queue.shift();
        if (requested[index]) continue;
        requested[index] = 1;
        activeLoads += 1;
        const image = new Image();
        image.decoding = "async";
        image.onload = () => { cache[index] = image; activeLoads -= 1; loadFrames(); };
        image.onerror = () => { activeLoads -= 1; loadFrames(); };
        image.src = `${ASSET}hero-frames/frame-${String(index).padStart(4, "0")}.webp`;
      }
    };
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      renderedFrame.current = -1;
    };
    resizeCanvas();
    loadFrames();
    const readScroll = () => {
      const track = homeRef.current;
      const vh = window.innerHeight || 1;
      if (track) {
        const rect = track.getBoundingClientRect();
        const range = Math.max(1, rect.height - vh);
        const p = Math.max(0, Math.min(1, -rect.top / range));
        progressTarget.current = p;
        setProgress(p);
        setStoryIndex(p < .1 ? -1 : Math.min(STORIES.length - 1, Math.floor((p - .1) / .9 * STORIES.length)));
      }
      const sections = ["projects", "stack", "about"].map((id) => document.getElementById(id));
      const active = sections.find((section) => {
        if (!section) return false;
        const r = section.getBoundingClientRect();
        return r.top < vh * .72 && r.bottom > vh * .28;
      });
      if (active) {
        const idx = ["projects", "stack", "about"].indexOf(active.id);
        setCoreView({ side: idx === 1 ? "left" : "right", rotate: [-7, 8, -4][idx], visible: true });
        if (active.id === "about" && active.getBoundingClientRect().bottom < vh * .68) setCoreView((v) => ({ ...v, visible: false }));
      } else setCoreView((v) => v.visible ? { ...v, visible: false } : v);
    };
    const tick = () => {
      const target = progressTarget.current;
      progressSmooth.current += (target - progressSmooth.current) * (reducedMotion.current ? 1 : .12);
      const still = stillRef.current;
      const canvas = canvasRef.current;
      applyHeroCamera(still, progressSmooth.current, reducedMotion.current);
      applyHeroCamera(canvas, progressSmooth.current, reducedMotion.current);
      const targetFrame = Math.round(progressSmooth.current * (HERO_FRAME_COUNT - 1));
      let frame = targetFrame;
      while (frame >= 0 && !cache[frame]) frame -= 1;
      if (frame < 0) {
        frame = targetFrame + 1;
        while (frame < HERO_FRAME_COUNT && !cache[frame]) frame += 1;
      }
      if (canvas && frame >= 0 && frame < HERO_FRAME_COUNT && renderedFrame.current !== frame) {
        paintFrame(canvas.getContext("2d"), cache[frame], canvas.width, canvas.height);
        canvas.style.opacity = "1";
        renderedFrame.current = frame;
      }
      raf = requestAnimationFrame(tick);
    };
    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);
    window.addEventListener("resize", resizeCanvas);
    raf = requestAnimationFrame(tick);
    return () => { disposed = true; cancelAnimationFrame(raf); window.removeEventListener("scroll", readScroll); window.removeEventListener("resize", readScroll); window.removeEventListener("resize", resizeCanvas); };
  }, []);

  const jumpTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion.current ? "auto" : "smooth" });
  };
  const introOpacity = Math.max(0, 1 - progress * 5.8);
  const coreModel = "/models/timbas-automation-core.glb";

  return (
    <div className="timbas-page" ref={pageRef}>
      <style>{CSS}</style>
      <header className="tb-nav">
        <div className="tb-nav-inner">
          <a className="tb-logo" href="#home" onClick={(e) => { e.preventDefault(); jumpTo("home"); }}>Carlo <span>Timbas</span></a>
          <nav className="tb-links" aria-label="Main navigation">
            {[ ["home","Home"],["projects","Projects"],["stack","Tech Stack"],["about","About"] ].map(([id,label]) => <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); jumpTo(id); }}>{label}</a>)}
          </nav>
          <button className="tb-menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} aria-label="Toggle navigation">{menuOpen ? "Close" : "Menu"}</button>
          <nav className={`tb-menu ${menuOpen ? "open" : ""}`} aria-label="Mobile navigation">
            {[ ["home","Home"],["projects","Projects"],["stack","Tech Stack"],["about","About"] ].map(([id,label]) => <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); jumpTo(id); }}>{label}</a>)}
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="tb-home-track" ref={homeRef} aria-label="Home">
          <div className="tb-home-sticky">
            <img ref={stillRef} className="tb-hero-media tb-hero-still" src="/photos/timbas/carlo-hero-poster.webp" alt="Carlo Timbas" />
            <canvas ref={canvasRef} className="tb-hero-media tb-hero-canvas" aria-hidden="true" />
            <div className="tb-hero-tint" /><div className="tb-hero-grain" />
            <div className="tb-hero-intro" style={{ opacity: introOpacity, filter: `blur(${progress * 8}px)`, "--tb-intro-y": `${progress * -12}px` }}>
              <div className="tb-eyebrow">Full-stack developer · Manila, PH</div>
              <h1 className="tb-hero-title">Build with<br /><em>intention.</em></h1>
              <p className="tb-hero-copy">I’m Carlo Timbas. I build thoughtful digital experiences and explore how automation can make everyday work flow better.</p>
              <div className="tb-hero-actions">
                <a className="tb-button primary" href="#projects" onClick={(e) => { e.preventDefault(); jumpTo("projects"); }}>View projects</a>
                <a className="tb-button" href="#about" onClick={(e) => { e.preventDefault(); jumpTo("about"); }}>About Carlo</a>
              </div>
            </div>
            {STORIES.map((story, i) => <div key={story.title} className={`tb-story ${storyIndex === i ? "active" : ""}`} aria-hidden={storyIndex !== i}>
              <img className="tb-story-img" src={`${ASSET}${story.image}`} alt="" />
              <div><div className="tb-story-count">0{i + 1} / 04</div><h2>{story.title}</h2><p>{story.text}</p></div>
            </div>)}
            <div className="tb-scroll-hint"><span className="tb-scroll-line" /> Scroll to explore</div>
          </div>
        </section>

        <section className="tb-section" id="projects">
          <div className="tb-section-inner">
            <div className="tb-section-kicker">~/PROJECTS · CASE STUDIES</div>
            <h2 className="tb-section-title">Work in<br /><em>progress.</em></h2>
            <p className="tb-section-lede">Three demonstration concepts show how connected workflows could reduce repetitive handoffs. These are illustrative ideas, not client case studies.</p>
            <div className="tb-projects">{CASES.map((c, i) => <article className="tb-project" key={c.n}>
              <div className="tb-project-top"><span>{c.n} / DEMO CONCEPT</span><span>WORKFLOW STUDY</span></div>
              <div className="tb-project-art"><img src={`${ASSET}${["core-detail.png","automation-orb.png","connected-pipeline.png"][i]}`} alt="" /></div>
              <h3>{c.title}</h3>
              <dl>
                <div><dt>Scenario</dt><dd>{c.client}</dd></div>
                <div><dt>Problem</dt><dd>{c.problem}</dd></div>
                <div><dt>Approach</dt><dd>{c.solution}</dd></div>
                <div><dt>Intended outcome</dt><dd className="metric">{c.result}</dd></div>
              </dl>
            </article>)}</div>
          </div>
        </section>

        <section className="tb-section" id="stack">
          <div className="tb-section-inner">
            <div className="tb-section-kicker">~/TECH STACK · AREAS OF FOCUS</div>
            <h2 className="tb-section-title">The tools behind<br /><em>the ideas.</em></h2>
            <p className="tb-section-lede">A growing toolkit for building interfaces, connecting systems, and making routine work easier to manage.</p>
            <div className="tb-stack-layout">
              <div className="tb-stack-grid">{STACK.map(([label,tools]) => <div className="tb-stack-item" key={label}><small>{label}</small><strong>{tools}</strong></div>)}</div>
              <div><div className="tb-section-kicker" style={{ marginBottom: 18 }}>WHAT I’M EXPLORING</div><div className="tb-services">{SERVICES.map((s,i) => <div className="tb-service" key={s}><span>0{i+1}</span>{s}</div>)}</div></div>
            </div>
          </div>
        </section>

        <section className="tb-section" id="about">
          <div className="tb-section-inner">
            <div className="tb-about-grid">
              <div className="tb-about-copy">
                <div className="tb-section-kicker">~/ABOUT</div>
                <h2 className="tb-section-title">Curious by<br /><em>nature.</em></h2>
                <p>I’m Carlo Timbas, a full-stack developer interested in how useful digital products come together—from the details of an interface to the systems working behind it.</p>
                <p>I enjoy learning by building, exploring Java, Spring Boot, React, and new ways to reduce repetitive steps in a workflow.</p>
                <div className="tb-about-note">Experience: Learning through hands-on projects<br />Based in Manila, Philippines</div>
              </div>
              <div className="tb-about-art" aria-hidden="true" />
            </div>
            <div className="tb-final-cta">
              <div><h3>Let’s make busywork<br />a little smaller.</h3><p>Have a workflow idea or a project in mind? Let’s talk.</p></div>
              <a className="tb-button primary" href="#projects" onClick={(e) => { e.preventDefault(); jumpTo("projects"); }}>Explore the projects ↗</a>
            </div>
          </div>
        </section>
      </main>

      <div className="tb-core-float" aria-hidden="true" style={{ left: coreView.side === "left" ? "4vw" : "calc(96vw - min(32vw, 390px))", opacity: coreView.visible ? 0.42 : 0 }}>
        <div className="tb-core" style={{ transform: `rotateY(${coreView.rotate}deg) rotateX(4deg)` }}>
          <model-viewer src={coreModel} poster="/photos/timbas/core-detail.png" alt="A sculptural 3D automation core with glass plates, machined gears, and jade-lit pathways" camera-orbit={motionReduced ? "0deg 75deg 125%" : "calc(0deg + env(window-scroll-y) * 360deg) 75deg 125%"} camera-target="0m 0m 0m" camera-controls disable-zoom interaction-prompt="none" touch-action="pan-y" loading="eager" shadow-intensity="0.55" exposure="1.08" style={{ width: "100%", height: "100%", background: "transparent", "--poster-color": "transparent" }} />
        </div>
      </div>
      <footer className="tb-footer"><span>© {new Date().getFullYear()} CARLO TIMBAS</span><button onClick={() => go?.("home")}>Back to CTPR Club ↑</button>{next && <button onClick={() => go?.(next.id)}>Next: {next.name} →</button>}</footer>
    </div>
  );
}







