import { useEffect, useRef, useState } from "react";

/*
  CARLO TIMBAS — AI Automation Specialist
  Direct implementation inspired by rjv-automation-portfolio.vercel.app
  Includes:
   - 760vh Hero scroll track with smooth camera/character inertia
   - carlo.png moving between Center -> Left -> Right -> Left -> Right -> Center
   - Fading title ("CARLO TIMBAS"), tagline, and CTAs behind cutout layer
   - 4 Scroll-synchronized Stories opposite the character (node, orb, pipe, tiles)
   - Continuous 3D Automation Core canvas across About (right), Services (left), and Work (right)
   - Process (4 steps) and Case Studies with customizable placeholder metrics
   - Fully interactive Book a Call modal
*/

export default function TimbasPortfolio({ member, next, go, dark, toggle }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Hero scroll state (drives character camera & story passages)
  const heroRef = useRef(null);
  const [heroProgress, setHeroProgress] = useState(0);

  // Panels scroll state (drives 3D Core positioning)
  const panelsRef = useRef(null);
  const [coreState, setCoreState] = useState({ x: 0.28, y: 0, scale: 1.15, opacity: 0 });

  // 3D Canvas ref
  const canvasRef = useRef(null);

  // Character animation refs for smooth physics (LERP)
  const characterAnimRef = useRef({
    currentX: 0,      // percentage offset (-24% = left, +24% = right)
    targetX: 0,
    currentScale: 1,  // 1.0 to 1.3
    targetScale: 1,
    currentRotY: 0,   // degrees
    targetRotY: 0,
  });

  const characterDomRef = useRef(null);

  // Scroll smoothly to section
  const scrollTo = (id) => {
    setMenuOpen(false);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // ─────────────────────────────────────────────────────────────
  // 1. HERO SCROLL TRACKER & CHARACTER LERP LOOP
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let animFrameId;
    let lastTime = performance.now();

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const winH = window.innerHeight;

      // Nav bar visibility: hidden during hero scroll, solid afterwards
      if (heroRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        const heroH = heroRect.height;
        const totalDist = heroH - winH;
        const p = Math.max(0, Math.min(1, -heroRect.top / (totalDist || 1)));
        setHeroProgress(p);
        setNavScrolled(scrollY > winH * 0.4);

        // Character camera tracking keyframes:
        // p = 0.00 - 0.08: Center (scale 1.0, X 0%)
        // p = 0.12 - 0.32: Slide LEFT  (scale 1.25, X -24%, Story 0 on Right)
        // p = 0.36 - 0.54: Slide RIGHT (scale 1.25, X +24%, Story 1 on Left)
        // p = 0.58 - 0.74: Slide LEFT  (scale 1.25, X -24%, Story 2 on Right)
        // p = 0.78 - 0.94: Slide RIGHT (scale 1.25, X +22%, Story 3 on Left)
        // p = 0.95 - 1.00: Return to Center
        let tx = 0;
        let ts = 1.0;
        let ry = 0;

        if (p < 0.08) {
          tx = 0;
          ts = 1.0;
          ry = 0;
        } else if (p >= 0.08 && p < 0.32) {
          tx = -24; // Character glides to LEFT
          ts = 1.24;
          ry = -7;
        } else if (p >= 0.32 && p < 0.54) {
          tx = 24;  // Character glides to RIGHT
          ts = 1.24;
          ry = 7;
        } else if (p >= 0.54 && p < 0.74) {
          tx = -24; // Character glides to LEFT
          ts = 1.24;
          ry = -7;
        } else if (p >= 0.74 && p < 0.94) {
          tx = 22;  // Character glides to RIGHT
          ts = 1.24;
          ry = 6;
        } else {
          tx = 0;
          ts = 1.05;
          ry = 0;
        }

        characterAnimRef.current.targetX = tx;
        characterAnimRef.current.targetScale = ts;
        characterAnimRef.current.targetRotY = ry;
      }

      // Panels scroll tracker for 3D Automation Core
      if (panelsRef.current) {
        const panelsRect = panelsRef.current.getBoundingClientRect();
        const inPanels = panelsRect.top < winH && panelsRect.bottom > 0;
        const coreOpacity = inPanels ? Math.min(1, Math.max(0, (winH - panelsRect.top) / 400)) : 0;

        // Determine which section is currently active
        const aboutEl = document.getElementById("about");
        const servicesEl = document.getElementById("services");
        const workEl = document.getElementById("work");

        let targetX = 0.28; // Default right
        let targetScale = 1.15;

        if (servicesEl && servicesEl.getBoundingClientRect().top <= winH * 0.5 && (!workEl || workEl.getBoundingClientRect().top > winH * 0.5)) {
          targetX = -0.28; // Left for services
          targetScale = 1.25;
        } else if (workEl && workEl.getBoundingClientRect().top <= winH * 0.5) {
          targetX = 0.26;  // Right for case studies
          targetScale = 1.12;
        }

        setCoreState((prev) => ({
          ...prev,
          x: targetX,
          scale: targetScale,
          opacity: coreOpacity,
        }));
      }
    };

    // Smooth inertia render loop (60fps)
    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const c = characterAnimRef.current;
      const lerpFactor = 1 - Math.exp(-dt * 6.5); // Buttery smooth spring inertia
      c.currentX += (c.targetX - c.currentX) * lerpFactor;
      c.currentScale += (c.targetScale - c.currentScale) * lerpFactor;
      c.currentRotY += (c.targetRotY - c.currentRotY) * lerpFactor;

      if (characterDomRef.current) {
        characterDomRef.current.style.transform = `translate3d(${c.currentX}vw, 0, 0) scale(${c.currentScale}) rotateY(${c.currentRotY}deg)`;
      }

      animFrameId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    animFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 2. CONTINUOUS 3D AUTOMATION CORE CANVAS RENDERER
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // 3D Matrix Math
    const project = (x, y, z, cx, cy, fov, scale) => {
      const distance = 460;
      const factor = (fov / (distance + z)) * scale;
      return { x: cx + x * factor, y: cy + y * factor, scale: factor, z };
    };

    const rotateX = (x, y, z, a) => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
    const rotateY = (x, y, z, a) => [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
    const rotateZ = (x, y, z, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z];

    let currentCoreX = 0.28;
    let currentCoreScale = 1.15;

    const render = () => {
      t += 0.016;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // Lerp Core position smoothly between Left and Right
      currentCoreX += (coreState.x - currentCoreX) * 0.06;
      currentCoreScale += (coreState.scale - currentCoreScale) * 0.06;

      const isMobile = w < 768;
      const activeX = isMobile ? w * 0.5 : w * 0.5 + currentCoreX * w;
      const activeY = isMobile ? h * 0.35 : h * 0.5;
      const fov = 380;
      const s = isMobile ? currentCoreScale * 0.75 : currentCoreScale;

      const rotX = 0.35 + Math.sin(t * 0.35) * 0.08;
      const rotY = t * 0.6;
      const rotZ = Math.sin(t * 0.25) * 0.05;
      const pulse = 0.8 + Math.sin(t * 2.8) * 0.2;

      // Volumetric Core Glow
      const bgGrad = ctx.createRadialGradient(activeX, activeY, 15, activeX, activeY, 260 * s);
      bgGrad.addColorStop(0, "rgba(56, 220, 255, 0.22)");
      bgGrad.addColorStop(0.4, "rgba(15, 107, 92, 0.12)");
      bgGrad.addColorStop(1, "rgba(10, 12, 15, 0)");
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(activeX, activeY, 260 * s, 0, Math.PI * 2);
      ctx.fill();

      // Outer Brushed Metal Ring
      ctx.save();
      ctx.beginPath();
      const ringPts = [];
      const segs = 36;
      for (let i = 0; i < segs; i++) {
        const rad = (i / segs) * Math.PI * 2;
        let [rx, ry, rz] = rotateZ(Math.cos(rad) * 160, Math.sin(rad) * 160, 0, rotZ);
        [rx, ry, rz] = rotateX(rx, ry, rz, rotX);
        [rx, ry, rz] = rotateY(rx, ry, rz, rotY);
        const p = project(rx, ry, rz, activeX, activeY, fov, s);
        ringPts.push(p);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      const metalGrad = ctx.createLinearGradient(activeX - 100, activeY - 100, activeX + 100, activeY + 100);
      metalGrad.addColorStop(0, "#4a5a64");
      metalGrad.addColorStop(0.3, "#a0b2be");
      metalGrad.addColorStop(0.7, "#8fa3af");
      metalGrad.addColorStop(1, "#182329");
      ctx.strokeStyle = metalGrad;
      ctx.lineWidth = 3.5 * s;
      ctx.stroke();

      // Ring nodes
      ringPts.forEach((p, idx) => {
        if (idx % 4 === 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5 * s, 0, Math.PI * 2);
          ctx.fillStyle = idx % 8 === 0 ? "#38dcff" : "#ffffff";
          ctx.fill();
        }
      });
      ctx.restore();

      // Frosted Glass Hexagonal Plate
      ctx.save();
      ctx.beginPath();
      const hexSteps = 6;
      for (let i = 0; i <= hexSteps; i++) {
        const rad = (i / hexSteps) * Math.PI * 2 + Math.PI / 6;
        let [rx, ry, rz] = rotateZ(Math.cos(rad) * 125, Math.sin(rad) * 125, 8, -rotZ * 1.5);
        [rx, ry, rz] = rotateX(rx, ry, rz, rotX + 0.1);
        [rx, ry, rz] = rotateY(rx, ry, rz, -rotY * 0.8);
        const p = project(rx, ry, rz, activeX, activeY, fov, s);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(15, 107, 92, 0.18)";
      ctx.fill();
      ctx.strokeStyle = "rgba(56, 220, 255, 0.4)";
      ctx.lineWidth = 1.5 * s;
      ctx.stroke();
      ctx.restore();

      // Interlocking Metal Gear
      ctx.save();
      ctx.beginPath();
      const gearTeeth = 16;
      for (let i = 0; i < gearTeeth * 2; i++) {
        const rad = (i / (gearTeeth * 2)) * Math.PI * 2;
        const r = i % 2 === 0 ? 85 : 68;
        let [rx, ry, rz] = rotateZ(Math.cos(rad) * r, Math.sin(rad) * r, -6, rotZ);
        [rx, ry, rz] = rotateX(rx, ry, rz, rotX);
        [rx, ry, rz] = rotateY(rx, ry, rz, rotY * 1.8);
        const p = project(rx, ry, rz, activeX, activeY, fov, s);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.fillStyle = "#162026";
      ctx.fill();
      ctx.strokeStyle = "rgba(160, 178, 190, 0.6)";
      ctx.lineWidth = 1.8 * s;
      ctx.stroke();
      ctx.restore();

      // Emissive Light Paths with glowing traveling packets
      ctx.save();
      for (let i = 0; i < 8; i++) {
        const rad = (i / 8) * Math.PI * 2 + t * 0.7;
        let [x1, y1, z1] = rotateY(Math.cos(rad) * 30, Math.sin(rad) * 30, 0, rotY);
        let [x2, y2, z2] = rotateY(Math.cos(rad + 0.4) * 140, Math.sin(rad + 0.4) * 140, 20, rotY);
        [x1, y1, z1] = rotateX(x1, y1, z1, rotX);
        [x2, y2, z2] = rotateX(x2, y2, z2, rotX);

        const p1 = project(x1, y1, z1, activeX, activeY, fov, s);
        const p2 = project(x2, y2, z2, activeX, activeY, fov, s);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = "rgba(56, 220, 255, 0.28)";
        ctx.lineWidth = 1.2 * s;
        ctx.stroke();

        const prog = (t * 1.8 + i * 0.25) % 1;
        const px = p1.x + (p2.x - p1.x) * prog;
        const py = p1.y + (p2.y - p1.y) * prog;

        ctx.beginPath();
        ctx.arc(px, py, 3 * s, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#38dcff";
        ctx.shadowBlur = 10;
        ctx.fill();
      }
      ctx.restore();

      // Central Quantum Core Sphere
      ctx.save();
      let [cx3, cy3, cz3] = rotateX(0, 0, 0, rotX);
      [cx3, cy3, cz3] = rotateY(cx3, cy3, cz3, rotY);
      const cp = project(cx3, cy3, cz3, activeX, activeY, fov, s);

      const coreR = 26 * s * pulse;
      const coreGrad = ctx.createRadialGradient(cp.x - 4, cp.y - 4, 2, cp.x, cp.y, coreR);
      coreGrad.addColorStop(0, "#ffffff");
      coreGrad.addColorStop(0.3, "#38dcff");
      coreGrad.addColorStop(0.7, "#0f6b5c");
      coreGrad.addColorStop(1, "rgba(15, 107, 92, 0)");

      ctx.beginPath();
      ctx.arc(cp.x, cp.y, coreR, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.shadowColor = "#38dcff";
      ctx.shadowBlur = 25 * pulse;
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [coreState]);

  // Story opacity calculation based on hero scroll progress
  // Story 0 (at 0.12 - 0.32, peak 0.22, right)
  // Story 1 (at 0.34 - 0.54, peak 0.44, left)
  // Story 2 (at 0.56 - 0.74, peak 0.65, right)
  // Story 3 (at 0.76 - 0.94, peak 0.85, left)
  const getStoryStyle = (start, end, side) => {
    const p = heroProgress;
    if (p < start || p > end) {
      return { opacity: 0, visibility: "hidden", transform: "translateY(24px) scale(0.96)" };
    }
    const mid = (start + end) / 2;
    const span = (end - start) / 2;
    const dist = Math.abs(p - mid);
    const opacity = Math.max(0, Math.min(1, 1 - dist / span));
    const translateY = (1 - opacity) * (p < mid ? 28 : -28);

    return {
      opacity: opacity.toFixed(3),
      visibility: opacity > 0.01 ? "visible" : "hidden",
      transform: `translate3d(0, ${translateY.toFixed(1)}px, 0)`,
      transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
    };
  };

  // Hero intro fade (fades out as user scrolls past 0.02 to 0.08)
  const introOpacity = Math.max(0, Math.min(1, 1 - heroProgress / 0.07));
  const introBlur = ((1 - introOpacity) * 12).toFixed(1);

  const copyEmail = () => {
    navigator.clipboard.writeText("carlo.timbas@automation.dev");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  return (
    <div
      className="min-h-screen text-[#eef3f7] selection:bg-[#38dcff]/30 selection:text-[#38dcff] relative overflow-x-hidden"
      style={{
        backgroundColor: "#0a0c0f",
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          FIXED MINIMAL NAVIGATION (rjv style)
         ───────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] px-[clamp(16px,4vw,56px)] flex items-center justify-between transition-all duration-500 ${
          navScrolled
            ? "bg-[#0a0c0f]/90 backdrop-blur-md border-b border-[#d6ecff1a]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => go("home")}
            className="text-[13px] font-mono tracking-wider text-[#93a0ad] hover:text-[#38dcff] transition-colors flex items-center gap-1.5"
          >
            <span className="text-[#38dcff]">←</span> CTPR CLUB
          </button>
          <span className="text-slate-700">/</span>
          <button
            onClick={() => scrollTo("top")}
            className="text-[17px] font-bold tracking-tight text-white hover:text-[#38dcff] transition-colors"
          >
            CARLO TIMBAS
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-mono text-[#93a0ad]">
          <button onClick={() => scrollTo("about")} className="hover:text-white transition-colors">
            About
          </button>
          <button onClick={() => scrollTo("services")} className="hover:text-white transition-colors">
            Services
          </button>
          <button onClick={() => scrollTo("process")} className="hover:text-white transition-colors">
            Process
          </button>
          <button onClick={() => scrollTo("work")} className="hover:text-white transition-colors">
            Case Studies
          </button>
          <button onClick={() => scrollTo("contact")} className="hover:text-white transition-colors">
            Contact
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBookingOpen(true)}
            className="px-4 py-2 rounded-full text-[13px] font-mono font-medium text-[#0a0c0f] bg-[#38dcff] hover:bg-white transition-all shadow-[0_0_20px_rgba(56,220,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
          >
            Book a Call
          </button>
          {toggle && (
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-full border border-[#d6ecff1a] text-[#93a0ad] hover:text-white flex items-center justify-center text-xs transition-colors"
              title="Toggle theme"
            >
              {dark ? "☀" : "☾"}
            </button>
          )}
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          760vh HERO SCROLL SECTION (Directly matching rjv-automation)
         ───────────────────────────────────────────────────────────── */}
      <section ref={heroRef} id="hero" className="relative w-full h-[760vh] z-20">
        {/* Sticky 100vh Viewport Stage */}
        <div className="sticky top-0 h-screen w-full overflow-hidden isolation-auto flex items-center justify-center">
          {/* Subtle Ambient Studio Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,220,255,0.08),transparent_70%)] pointer-events-none" />

          {/* Vignette Layer */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(10,12,15,0.85)_100%)] pointer-events-none z-10" />

          {/* GIANT HEADLINE: CARLO TIMBAS (Behind character cutout) */}
          <div
            className="absolute top-[18vh] left-0 right-0 flex justify-center pointer-events-none select-none z-0 px-4"
            style={{
              opacity: introOpacity.toFixed(3),
              filter: `blur(${introBlur}px)`,
              visibility: introOpacity > 0.01 ? "visible" : "hidden",
              transition: "opacity 0.2s ease-out, filter 0.2s ease-out",
            }}
          >
            <h1 className="text-[clamp(44px,14vw,200px)] font-black tracking-[-0.055em] leading-[0.8] whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-b from-[#f4f8fb] via-[#d6ecff]/70 to-[#d6ecff]/20">
              CARLO TIMBAS
            </h1>
          </div>

          {/* ─────────────────────────────────────────────────────────
              ANIMATED CHARACTER LAYER (carlo.png)
              Smoothly shifts Center -> Left -> Right -> Left -> Right
              with 3D perspective, scale, and subtle rotation!
             ───────────────────────────────────────────────────────── */}
          <div
            ref={characterDomRef}
            className="relative z-10 w-full h-full max-h-[88vh] flex items-end justify-center pointer-events-none will-change-transform"
            style={{
              transform: "translate3d(0, 0, 0) scale(1)",
              transformOrigin: "center 75%",
            }}
          >
            <img
              src="./photos/timbas/carlo.png"
              alt="Carlo Timbas - AI Automation Specialist"
              className="h-[80vh] max-h-[750px] object-contain filter drop-shadow-[0_15px_45px_rgba(0,0,0,0.85)] select-none pointer-events-none"
              onError={(e) => {
                // Fallback poster if needed
                e.target.src = "./photos/timbas/hero-poster.webp";
              }}
            />
          </div>

          {/* INTRO FOOTER (Tagline, CTAs, and Scroll cue - fades out on scroll) */}
          <div
            className="absolute bottom-12 left-0 right-0 z-20 flex flex-col items-center text-center pointer-events-auto px-4"
            style={{
              opacity: introOpacity.toFixed(3),
              filter: `blur(${introBlur}px)`,
              visibility: introOpacity > 0.01 ? "visible" : "hidden",
              transition: "opacity 0.2s ease-out, filter 0.2s ease-out",
            }}
          >
            <p className="text-base sm:text-xl font-medium text-[#eef3f7] mb-6 tracking-tight">
              I automate businesses for a living.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <button
                onClick={() => scrollTo("work")}
                className="px-6 py-3 rounded-full text-[14px] font-medium text-white border border-[#d6ecff33] bg-[#0a0c0f]/60 backdrop-blur-md hover:bg-white/10 transition-all"
              >
                View Case Studies
              </button>
              <button
                onClick={() => setBookingOpen(true)}
                className="px-6 py-3 rounded-full text-[14px] font-medium text-[#0a0c0f] bg-[#38dcff] hover:bg-white transition-all shadow-[0_0_20px_rgba(56,220,255,0.3)]"
              >
                Book a Call
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#93a0ad] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38dcff] animate-ping" />
              <span>Scroll to explore</span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              4 STORY PASSAGES OVERLAYING OPPOSITE THE MOVING CHARACTER
             ───────────────────────────────────────────────────────── */}
          <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-between px-[clamp(20px,6vw,80px)]">
            {/* Story 0 (Appears on RIGHT while Carlo is on Left) */}
            <div
              className="absolute right-[clamp(24px,8vw,120px)] w-[min(38vw,480px)] space-y-4"
              style={getStoryStyle(0.12, 0.32, "right")}
            >
              <img
                src="./photos/timbas/node.webp"
                alt="Glass workflow nodes"
                className="w-24 sm:w-32 h-auto object-contain filter drop-shadow-[0_0_30px_rgba(56,220,255,0.4)]"
              />
              <p className="text-xl sm:text-2xl md:text-3xl font-medium text-white tracking-tight leading-snug">
                Every repetitive task is a decision waiting to be automated.
              </p>
            </div>

            {/* Story 1 (Appears on LEFT while Carlo is on Right) */}
            <div
              className="absolute left-[clamp(24px,8vw,120px)] w-[min(38vw,480px)] space-y-4"
              style={getStoryStyle(0.34, 0.54, "left")}
            >
              <img
                src="./photos/timbas/orb.webp"
                alt="Chrome AI agent orb"
                className="w-24 sm:w-32 h-auto object-contain filter drop-shadow-[0_0_30px_rgba(56,220,255,0.4)]"
              />
              <p className="text-xl sm:text-2xl md:text-3xl font-medium text-white tracking-tight leading-snug">
                Let AI agents carry the busywork, so your people keep the judgment calls.
              </p>
            </div>

            {/* Story 2 (Appears on RIGHT while Carlo is on Left) */}
            <div
              className="absolute right-[clamp(24px,8vw,120px)] w-[min(38vw,480px)] space-y-4"
              style={getStoryStyle(0.56, 0.74, "right")}
            >
              <img
                src="./photos/timbas/pipe.webp"
                alt="Interlocking data pipeline"
                className="w-24 sm:w-32 h-auto object-contain filter drop-shadow-[0_0_30px_rgba(56,220,255,0.4)]"
              />
              <p className="text-xl sm:text-2xl md:text-3xl font-medium text-white tracking-tight leading-snug">
                Good automation is invisible. The data simply arrives where it’s needed.
              </p>
            </div>

            {/* Story 3 (Appears on LEFT while Carlo is on Right) */}
            <div
              className="absolute left-[clamp(24px,8vw,120px)] w-[min(38vw,480px)] space-y-4"
              style={getStoryStyle(0.76, 0.94, "left")}
            >
              <img
                src="./photos/timbas/tiles.webp"
                alt="Stack of connected app tiles"
                className="w-24 sm:w-32 h-auto object-contain filter drop-shadow-[0_0_30px_rgba(56,220,255,0.4)]"
              />
              <p className="text-xl sm:text-2xl md:text-3xl font-medium text-white tracking-tight leading-snug">
                Your tools already work. I make them work together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          PANELS CONTAINER (ABOUT, SERVICES, PROCESS, WORK, CONTACT)
          With Continuous 3D Automation Core Canvas in the background!
         ───────────────────────────────────────────────────────────── */}
      <div ref={panelsRef} className="relative z-30 bg-[#0a0c0f]">
        {/* Sticky 3D Core Canvas Layer spanning all panels */}
        <div
          className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-700 overflow-hidden"
          style={{
            opacity: coreState.opacity.toFixed(3),
            visibility: coreState.opacity > 0.01 ? "visible" : "hidden",
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
            style={{ filter: "drop-shadow(0 0 50px rgba(56,220,255,0.25))" }}
          />
        </div>

        {/* ── PANEL 1: ABOUT (Right-aligned 3D Model, Left-aligned content) ── */}
        <section
          id="about"
          className="relative z-20 min-h-screen py-[max(140px,20vh)] px-[clamp(16px,4vw,56px)] flex items-center"
        >
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-7">
              <p className="text-xs font-mono tracking-[0.18em] uppercase text-[#38dcff]">
                About
              </p>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                Turning busywork into autonomous systems.
              </h2>
              <p className="text-[#93a0ad] text-base sm:text-lg leading-relaxed">
                I’m <strong className="text-white">Carlo Timbas</strong>, an AI automation specialist and full-stack developer.
                I build the workflows, AI agents, chatbots, and integrations that take manual work off your team’s plate, so
                the work gets done without anyone having to do it.
              </p>
              <p className="text-[#93a0ad] text-base leading-relaxed">
                You get systems that are documented, monitored, and easy to hand over. Not a pile of fragile zaps.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-2">
                <div className="flex flex-col">
                  <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    3+<small className="text-xs font-mono text-[#38dcff] ml-1">years</small>
                  </span>
                  <span className="text-xs text-[#93a0ad] font-mono mt-1">of development & automation</span>
                </div>
                <div className="w-px h-12 bg-[#d6ecff1a]" />
                <div className="flex flex-col">
                  <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    5<small className="text-xs font-mono text-[#38dcff] ml-1">services</small>
                  </span>
                  <span className="text-xs text-[#93a0ad] font-mono mt-1">from audit to deployment</span>
                </div>
              </div>

              {/* Tool Stack Chips */}
              <div className="pt-2">
                <p className="text-xs font-mono tracking-[0.18em] uppercase text-[#38dcff] mb-3">
                  Tool stack
                </p>
                <ul className="flex flex-wrap gap-2 text-xs font-mono">
                  {["n8n", "Make", "Zapier", "Python", "Claude API", "OpenAI API", "GoHighLevel", "HubSpot", "Java", "Spring Boot", "React", "PostgreSQL"].map((chip) => (
                    <li
                      key={chip}
                      className="px-3.5 py-2 rounded-full border border-[#d6ecff33] bg-[#111419]/60 text-[#eef3f7] hover:border-[#38dcff] transition-colors"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Empty right column: 3D Core shines through here! */}
            <div className="hidden lg:block lg:col-span-6 pointer-events-none" />
          </div>
        </section>

        {/* ── PANEL 2: SERVICES (Left-aligned 3D Model, Right-aligned content) ── */}
        <section
          id="services"
          className="relative z-20 min-h-screen py-[max(140px,20vh)] px-[clamp(16px,4vw,56px)] flex items-center"
        >
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Empty left column: 3D Core glides across here! */}
            <div className="hidden lg:block lg:col-span-6 pointer-events-none" />

            <div className="lg:col-span-6 space-y-7">
              <p className="text-xs font-mono tracking-[0.18em] uppercase text-[#38dcff]">
                Services
              </p>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                What I build for you.
              </h2>

              <ol className="divide-y divide-[#d6ecff1a] border-t border-b border-[#d6ecff1a]">
                {[
                  {
                    num: "01",
                    title: "Workflow automation",
                    desc: "Connect your apps and retire copy-paste. Built in n8n, Make or Zapier, whichever fits how your team works.",
                  },
                  {
                    num: "02",
                    title: "AI agents & chatbots",
                    desc: "Assistants that answer, qualify and route, trained on your process, with a clean handoff to a human.",
                  },
                  {
                    num: "03",
                    title: "CRM setup & integrations",
                    desc: "GoHighLevel or HubSpot set up around your pipeline, with clean data flowing in from every source.",
                  },
                  {
                    num: "04",
                    title: "RPA & process audits",
                    desc: "I map where the hours go, then automate the steps that don’t need a person.",
                  },
                  {
                    num: "05",
                    title: "Corporate AI training",
                    desc: "Hands-on sessions that get your team using AI confidently and safely, on their real work.",
                  },
                ].map((s) => (
                  <li key={s.num} className="grid grid-cols-[48px_1fr] gap-4 py-5 group">
                    <span className="font-mono text-sm text-[#38dcff] font-bold">{s.num}</span>
                    <div>
                      <h3 className="text-base font-semibold text-white group-hover:text-[#38dcff] transition-colors">
                        {s.title}
                      </h3>
                      <p className="text-sm text-[#93a0ad] mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Process Sub-Section */}
              <div id="process" className="pt-4 space-y-4">
                <h3 className="text-xs font-mono tracking-[0.18em] uppercase text-[#38dcff]">
                  How it works
                </h3>
                <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { num: "1", title: "Audit", text: "Find the highest-leverage tasks to automate first." },
                    { num: "2", title: "Blueprint", text: "Map the data flow, tools, and edge cases." },
                    { num: "3", title: "Build", text: "Ship the workflow, test with real data, handle errors." },
                    { num: "4", title: "Handover", text: "Video walkthrough, documentation, and support." },
                  ].map((step) => (
                    <li
                      key={step.num}
                      className="p-4 rounded-xl border border-[#d6ecff1a] bg-[#111419]/60 text-xs space-y-1.5"
                    >
                      <span className="font-mono text-[#38dcff] font-bold text-sm block">#{step.num}</span>
                      <strong className="text-white block text-sm">{step.title}</strong>
                      <span className="text-[#93a0ad] block leading-relaxed">{step.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ── PANEL 3: CASE STUDIES (Right-aligned 3D Model, Left-aligned content) ── */}
        <section
          id="work"
          className="relative z-20 min-h-screen py-[max(140px,20vh)] px-[clamp(16px,4vw,56px)] flex items-center"
        >
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-7">
              <p className="text-xs font-mono tracking-[0.18em] uppercase text-[#38dcff]">
                Case Studies
              </p>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                Results, not just workflows.
              </h2>
              <p className="text-xs font-mono text-[#93a0ad]">
                Sample projects. Numbers in dashed boxes are placeholders.
              </p>

              <div className="space-y-4">
                {/* Case 1 */}
                <article className="p-6 rounded-2xl border border-[#d6ecff1a] bg-gradient-to-br from-[#1a1f26]/75 to-[#0d1014]/75 backdrop-blur-md space-y-3">
                  <p className="text-xs font-mono text-white flex items-center justify-between">
                    <span>Real estate agency</span>
                    <span className="px-2 py-0.5 rounded border border-[#d6ecff33] text-[10px] text-[#38dcff]">
                      Sample
                    </span>
                  </p>
                  <dl className="text-xs space-y-1.5 leading-relaxed">
                    <div>
                      <dt className="text-[#93a0ad] font-mono inline mr-2">Problem:</dt>
                      <dd className="text-slate-300 inline">
                        Leads from four sources sat in inboxes for hours before anyone replied.
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#93a0ad] font-mono inline mr-2">Solution:</dt>
                      <dd className="text-slate-300 inline">
                        An n8n and GoHighLevel pipeline that captures, enriches, and routes every lead, with an AI-drafted first reply.
                      </dd>
                    </div>
                  </dl>
                  <p className="pt-2 text-xs font-mono text-[#93a0ad]">
                    <span className="text-white font-bold text-sm px-2 py-1 rounded border border-dashed border-[#38dcff] mr-2 text-[#38dcff]">
                      15 min
                    </span>
                    response time, down from{" "}
                    <span className="px-1.5 py-0.5 rounded border border-dashed border-[#d6ecff33] text-white">
                      4 hrs
                    </span>
                  </p>
                </article>

                {/* Case 2 */}
                <article className="p-6 rounded-2xl border border-[#d6ecff1a] bg-gradient-to-br from-[#1a1f26]/75 to-[#0d1014]/75 backdrop-blur-md space-y-3">
                  <p className="text-xs font-mono text-white flex items-center justify-between">
                    <span>E-commerce brand</span>
                    <span className="px-2 py-0.5 rounded border border-[#d6ecff33] text-[10px] text-[#38dcff]">
                      Sample
                    </span>
                  </p>
                  <dl className="text-xs space-y-1.5 leading-relaxed">
                    <div>
                      <dt className="text-[#93a0ad] font-mono inline mr-2">Problem:</dt>
                      <dd className="text-slate-300 inline">
                        The support team answered the same repetitive order questions all day.
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#93a0ad] font-mono inline mr-2">Solution:</dt>
                      <dd className="text-slate-300 inline">
                        An AI chatbot connected to live Shopify data, handing complex cases to a human with full context.
                      </dd>
                    </div>
                  </dl>
                  <p className="pt-2 text-xs font-mono text-[#93a0ad]">
                    <span className="text-white font-bold text-sm px-2 py-1 rounded border border-dashed border-[#38dcff] mr-2 text-[#38dcff]">
                      35 hrs
                    </span>
                    saved per week
                  </p>
                </article>

                {/* Case 3 */}
                <article className="p-6 rounded-2xl border border-[#d6ecff1a] bg-gradient-to-br from-[#1a1f26]/75 to-[#0d1014]/75 backdrop-blur-md space-y-3">
                  <p className="text-xs font-mono text-white flex items-center justify-between">
                    <span>Professional services firm</span>
                    <span className="px-2 py-0.5 rounded border border-[#d6ecff33] text-[10px] text-[#38dcff]">
                      Sample
                    </span>
                  </p>
                  <dl className="text-xs space-y-1.5 leading-relaxed">
                    <div>
                      <dt className="text-[#93a0ad] font-mono inline mr-2">Problem:</dt>
                      <dd className="text-slate-300 inline">
                        Invoicing and reporting meant manual copy-paste across three separate tools.
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#93a0ad] font-mono inline mr-2">Solution:</dt>
                      <dd className="text-slate-300 inline">
                        A Make and Python workflow that syncs CRM, accounting, and reporting on an automated schedule.
                      </dd>
                    </div>
                  </dl>
                  <p className="pt-2 text-xs font-mono text-[#93a0ad]">
                    <span className="text-white font-bold text-sm px-2 py-1 rounded border border-dashed border-[#38dcff] mr-2 text-[#38dcff]">
                      $4,200
                    </span>
                    monthly operating cost reduced
                  </p>
                </article>
              </div>
            </div>

            {/* Empty right column: 3D Core shines through here! */}
            <div className="hidden lg:block lg:col-span-6 pointer-events-none" />
          </div>
        </section>

        {/* ── PANEL 4: CONTACT / CTA (Full-width centered, rjv style) ── */}
        <section
          id="contact"
          className="relative z-20 min-h-[90vh] py-32 px-[clamp(16px,4vw,56px)] text-center flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Cyan Glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(1100px,130vw)] aspect-[2] pointer-events-none bg-[radial-gradient(closest-side,rgba(56,220,255,0.18),transparent)]" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Let’s Automate Your Business
            </h2>
            <p className="text-base sm:text-lg text-[#93a0ad] leading-relaxed">
              Book a free automation audit. We’ll find the work your team shouldn’t be doing, and what to automate first.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setBookingOpen(true)}
                className="px-8 py-4 rounded-full text-base font-semibold text-[#0a0c0f] bg-[#38dcff] hover:bg-white transition-all shadow-[0_0_30px_rgba(56,220,255,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)]"
              >
                Book a Free Automation Audit
              </button>
              <button
                onClick={copyEmail}
                className="px-6 py-4 rounded-full text-sm font-mono text-[#93a0ad] hover:text-white border border-[#d6ecff1a] bg-[#111419]/60 hover:bg-[#111419] transition-all"
              >
                {copiedEmail ? "Copied Email!" : "carlo.timbas@automation.dev"}
              </button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-[#d6ecff1a] bg-[#07090c] py-10 px-[clamp(16px,4vw,56px)] relative z-20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-[#93a0ad]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => go("home")}
                className="hover:text-[#38dcff] transition-colors"
              >
                ← BACK TO CTPR CLUB
              </button>
              <span className="text-slate-700">|</span>
              <span>© {new Date().getFullYear()} CARLO TIMBAS</span>
            </div>

            {next && (
              <button
                onClick={() => go(next.id)}
                className="px-4 py-2 rounded-lg bg-[#111419] hover:bg-[#1a1f26] text-white border border-[#d6ecff1a] hover:border-[#38dcff] transition-colors"
              >
                Next: {next.name} →
              </button>
            )}
          </div>
        </footer>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BOOKING AUDIT MODAL
         ───────────────────────────────────────────────────────────── */}
      {bookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#111419] border border-[#d6ecff33] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#d6ecff1a] pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Book an Automation Audit</h3>
                <p className="text-xs font-mono text-[#38dcff] mt-0.5">30-MIN STRATEGY SESSION</p>
              </div>
              <button
                onClick={() => setBookingOpen(false)}
                className="w-8 h-8 rounded-full bg-[#1a1f26] text-[#93a0ad] hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#93a0ad] mb-1.5 uppercase">Your Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full bg-[#0a0c0f] border border-[#d6ecff33] rounded-xl p-3 text-white focus:outline-none focus:border-[#38dcff]"
                />
              </div>

              <div>
                <label className="block text-[#93a0ad] mb-1.5 uppercase">Work Email</label>
                <input
                  type="email"
                  placeholder="jane@company.com"
                  className="w-full bg-[#0a0c0f] border border-[#d6ecff33] rounded-xl p-3 text-white focus:outline-none focus:border-[#38dcff]"
                />
              </div>

              <div>
                <label className="block text-[#93a0ad] mb-1.5 uppercase">What manual process hurts most?</label>
                <textarea
                  rows="3"
                  placeholder="We spend 15+ hours weekly copying CRM data into accounting..."
                  className="w-full bg-[#0a0c0f] border border-[#d6ecff33] rounded-xl p-3 text-white focus:outline-none focus:border-[#38dcff]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setBookingOpen(false)}
                className="px-4 py-2.5 text-xs font-mono text-[#93a0ad] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Thank you! Carlo will review your details and send a calendar invite.");
                  setBookingOpen(false);
                }}
                className="px-6 py-3 rounded-full text-xs font-mono font-bold bg-[#38dcff] hover:bg-white text-[#0a0c0f] transition-all shadow-[0_0_20px_rgba(56,220,255,0.3)]"
              >
                Confirm Booking →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
