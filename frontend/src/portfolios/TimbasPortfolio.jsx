import { useEffect, useRef, useState } from "react";

/*
  CARLO TIMBAS — AI Automation Specialist & Full-Stack Developer
  Cinematic Portfolio with Continuous 3D Automation Core
  Image reference: ./photos/timbas/carlo.png
*/

// Color Palette
const ACCENT = "#0f6b5c";      // Deep signature teal
const ACCENT_GLOW = "#00f5d4"; // Electric cyan glow
const ACCENT_LIGHT = "#38bdf8";// Soft sky blue highlight
const BG_DARK = "#090d10";     // Deep charcoal studio
const BG_CARD = "#12181d";     // Graphite surface
const TEXT_MUTED = "#8fa3af";  // Soft metallic gray

export default function TimbasPortfolio({ member, next, go, dark, toggle }) {
  const [activeStory, setActiveStory] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sectionInView, setSectionInView] = useState("about"); // 'about', 'services', 'cases'

  // Canvas ref for the continuous shared 3D Automation Core
  const canvasRef = useRef(null);
  const threeSceneRef = useRef({
    targetX: 0.28,    // normalized screen X (-0.35 = left, 0.28 = right)
    currentX: 0.28,
    targetY: 0,
    currentY: 0,
    targetScale: 1.15,
    currentScale: 1.15,
    pulseEnergy: 1.0,
    rotX: 0.25,
    rotY: 0,
    rotZ: 0,
    speedY: 0.007,
  });

  const sharedContainerRef = useRef(null);

  // Storytelling passages
  const stories = [
    {
      quote: "Every repetitive task is a decision waiting to be automated.",
      sub: "Human creativity shouldn't be consumed by copy-pasting data between disconnected spreadsheets.",
      concept: "Glass Workflow-Node Cluster",
      icon: "⚡",
    },
    {
      quote: "Friction is just unorganized data between systems.",
      sub: "We construct autonomous multi-agent systems that ingest, reason, and act with zero latency.",
      concept: "Chrome AI-Agent Orb",
      icon: "🌐",
    },
    {
      quote: "Intelligent workflows turn operational drag into compound velocity.",
      sub: "Replacing 40 hours of weekly manual operations with resilient event-driven pipelines.",
      concept: "Interlocking Data Pipeline",
      icon: "🔗",
    },
    {
      quote: "The best automation feels like a quiet, flawless control room.",
      sub: "Zero alarms, zero failed syncs — just clean execution that scales while you sleep.",
      concept: "Connected App Ecosystem",
      icon: "💎",
    },
  ];

  // Rotate hero stories smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % stories.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [stories.length]);

  // Smooth scroll handler
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Monitor scroll across shared 3D container
  useEffect(() => {
    const handleScroll = () => {
      if (!sharedContainerRef.current) return;
      const rect = sharedContainerRef.current.getBoundingClientRect();
      const winHeight = window.innerHeight;
      const totalDist = rect.height - winHeight;
      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / (totalDist || 1)));
      setScrollProgress(progress);

      // Section calculation
      if (progress < 0.33) {
        setSectionInView("about");
        // About section: 3D model on RIGHT side, content on LEFT
        threeSceneRef.current.targetX = 0.26;
        threeSceneRef.current.targetScale = 1.15;
        threeSceneRef.current.targetY = 0.02;
        threeSceneRef.current.speedY = 0.009;
      } else if (progress < 0.68) {
        setSectionInView("services");
        // Services section: 3D model glides to LEFT side, content on RIGHT
        threeSceneRef.current.targetX = -0.26;
        threeSceneRef.current.targetScale = 1.25;
        threeSceneRef.current.targetY = -0.03;
        threeSceneRef.current.speedY = 0.016; // Gears accelerate!
      } else {
        setSectionInView("cases");
        // Case Studies section: 3D model glides back to RIGHT side, content on LEFT
        threeSceneRef.current.targetX = 0.25;
        threeSceneRef.current.targetScale = 1.12;
        threeSceneRef.current.targetY = 0.04;
        threeSceneRef.current.speedY = 0.012;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Continuous 3D Automation Core Renderer (Brushed metal, frosted glass, emissive light paths)
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

    // 3D Math Utilities
    const project = (x, y, z, cx, cy, fov, scale) => {
      const distance = 480;
      const factor = (fov / (distance + z)) * scale;
      return {
        x: cx + x * factor,
        y: cy + y * factor,
        scale: factor,
        z: z,
      };
    };

    const rotateX = (x, y, z, angle) => {
      const rad = angle;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      return [x, y * cos - z * sin, y * sin + z * cos];
    };

    const rotateY = (x, y, z, angle) => {
      const rad = angle;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      return [x * cos + z * sin, y, -x * sin + z * cos];
    };

    const rotateZ = (x, y, z, angle) => {
      const rad = angle;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      return [x * cos - y * sin, x * sin + y * cos, z];
    };

    // Render loop
    const render = () => {
      t += 0.016;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const state = threeSceneRef.current;
      // Smooth lerp positions and scale
      state.currentX += (state.targetX - state.currentX) * 0.06;
      state.currentY += (state.targetY - state.currentY) * 0.06;
      state.currentScale += (state.targetScale - state.currentScale) * 0.05;

      // Base center
      const isMobile = w < 768;
      const activeX = isMobile ? w * 0.5 : w * 0.5 + state.currentX * w;
      const activeY = isMobile ? h * 0.35 : h * 0.5 + state.currentY * h;
      const fov = 380;
      const scale = isMobile ? state.currentScale * 0.75 : state.currentScale;

      state.rotY += state.speedY;
      const baseRotX = 0.35 + Math.sin(t * 0.4) * 0.08;
      const baseRotY = state.rotY;
      const baseRotZ = Math.sin(t * 0.3) * 0.05;

      // Pulse glow intensity
      const pulse = 0.8 + Math.sin(t * 2.5) * 0.2;

      // 1. Ambient Volumetric Glow behind the Core
      const bgGrad = ctx.createRadialGradient(activeX, activeY, 10, activeX, activeY, 260 * scale);
      bgGrad.addColorStop(0, "rgba(0, 245, 212, 0.18)");
      bgGrad.addColorStop(0.4, "rgba(15, 107, 92, 0.12)");
      bgGrad.addColorStop(1, "rgba(9, 13, 16, 0)");
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(activeX, activeY, 260 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Collect render items for depth sorting
      const renderList = [];

      // A. OUTER BRUSHED METAL GIMBAL RING (Interlocking Gimbal Structure)
      const outerRingSegments = 40;
      const outerRadius = 160;
      const outerPoints = [];

      for (let i = 0; i < outerRingSegments; i++) {
        const theta = (i / outerRingSegments) * Math.PI * 2;
        const x = Math.cos(theta) * outerRadius;
        const y = Math.sin(theta) * outerRadius;
        const z = 0;

        let [rx, ry, rz] = rotateZ(x, y, z, baseRotZ);
        [rx, ry, rz] = rotateX(rx, ry, rz, baseRotX);
        [rx, ry, rz] = rotateY(rx, ry, rz, baseRotY);

        const proj = project(rx, ry, rz, activeX, activeY, fov, scale);
        outerPoints.push(proj);
      }

      renderList.push({
        type: "outerRing",
        z: outerPoints.reduce((acc, p) => acc + p.z, 0) / outerPoints.length,
        points: outerPoints,
      });

      // B. MIDDLE FROSTED GLASS CIRCUIT PLATE (Hexagonal Circuit Disc)
      const glassPoints = [];
      const glassRadius = 125;
      const hexSteps = 6;
      for (let i = 0; i <= hexSteps; i++) {
        const theta = (i / hexSteps) * Math.PI * 2 + Math.PI / 6;
        const x = Math.cos(theta) * glassRadius;
        const y = Math.sin(theta) * glassRadius;
        const z = 8;

        let [rx, ry, rz] = rotateZ(x, y, z, -baseRotZ * 1.5);
        [rx, ry, rz] = rotateX(rx, ry, rz, baseRotX + 0.1);
        [rx, ry, rz] = rotateY(rx, ry, rz, -baseRotY * 0.8);

        const proj = project(rx, ry, rz, activeX, activeY, fov, scale);
        glassPoints.push(proj);
      }

      renderList.push({
        type: "glassPlate",
        z: glassPoints.reduce((acc, p) => acc + p.z, 0) / glassPoints.length,
        points: glassPoints,
      });

      // C. INTERLOCKING COUNTER-ROTATING METAL GEAR (Inner Gear teeth)
      const gearTeeth = 16;
      const gearRInner = 65;
      const gearROuter = 85;
      const gearPoints = [];

      for (let i = 0; i < gearTeeth * 2; i++) {
        const theta = (i / (gearTeeth * 2)) * Math.PI * 2;
        const r = i % 2 === 0 ? gearROuter : gearRInner;
        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * r;
        const z = -6;

        let [rx, ry, rz] = rotateZ(x, y, z, baseRotZ);
        [rx, ry, rz] = rotateX(rx, ry, rz, baseRotX);
        [rx, ry, rz] = rotateY(rx, ry, rz, baseRotY * 1.6); // rotates faster

        const proj = project(rx, ry, rz, activeX, activeY, fov, scale);
        gearPoints.push(proj);
      }

      renderList.push({
        type: "metalGear",
        z: gearPoints.reduce((acc, p) => acc + p.z, 0) / gearPoints.length,
        points: gearPoints,
      });

      // D. EMISSIVE LIGHT PATHS & PHOTON PACKETS
      const numPaths = 8;
      const pathNodes = [];
      for (let i = 0; i < numPaths; i++) {
        const angle = (i / numPaths) * Math.PI * 2 + t * 0.8;
        const r1 = 30;
        const r2 = 140;
        const zSpread = Math.sin(t * 1.5 + i) * 35;

        let [x1, y1, z1] = [Math.cos(angle) * r1, Math.sin(angle) * r1, 0];
        let [x2, y2, z2] = [Math.cos(angle + 0.4) * r2, Math.sin(angle + 0.4) * r2, zSpread];

        [x1, y1, z1] = rotateX(x1, y1, z1, baseRotX);
        [x1, y1, z1] = rotateY(x1, y1, z1, baseRotY);
        [x2, y2, z2] = rotateX(x2, y2, z2, baseRotX);
        [x2, y2, z2] = rotateY(x2, y2, z2, baseRotY);

        const p1 = project(x1, y1, z1, activeX, activeY, fov, scale);
        const p2 = project(x2, y2, z2, activeX, activeY, fov, scale);

        // Packet along path
        const packetProgress = (t * 1.8 + i * 0.3) % 1;
        const px = p1.x + (p2.x - p1.x) * packetProgress;
        const py = p1.y + (p2.y - p1.y) * packetProgress;

        pathNodes.push({ p1, p2, px, py, z: (p1.z + p2.z) / 2 });
      }

      renderList.push({
        type: "lightPaths",
        z: 0,
        paths: pathNodes,
      });

      // E. CENTRAL QUANTUM EMISSIVE REACTOR CORE
      let [cx3, cy3, cz3] = rotateX(0, 0, 0, baseRotX);
      [cx3, cy3, cz3] = rotateY(cx3, cy3, cz3, baseRotY);
      const centerProj = project(cx3, cy3, cz3, activeX, activeY, fov, scale);

      renderList.push({
        type: "coreSphere",
        z: centerProj.z,
        proj: centerProj,
      });

      // Sort by depth (farthest first)
      renderList.sort((a, b) => a.z - b.z);

      // Draw all items
      renderList.forEach((item) => {
        if (item.type === "outerRing") {
          // Brushed Metal Ring with metallic specular sheen
          ctx.save();
          ctx.beginPath();
          item.points.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.closePath();
          ctx.lineWidth = 4 * scale;
          // Metallic brushed steel gradient
          const metalGrad = ctx.createLinearGradient(activeX - 100, activeY - 100, activeX + 100, activeY + 100);
          metalGrad.addColorStop(0, "#4a5a64");
          metalGrad.addColorStop(0.3, "#a0b2be");
          metalGrad.addColorStop(0.5, "#25333a");
          metalGrad.addColorStop(0.7, "#8fa3af");
          metalGrad.addColorStop(1, "#182329");
          ctx.strokeStyle = metalGrad;
          ctx.stroke();

          // Engraved tick marks on the ring
          item.points.forEach((pt, idx) => {
            if (idx % 4 === 0) {
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 2.5 * scale, 0, Math.PI * 2);
              ctx.fillStyle = idx % 8 === 0 ? ACCENT_GLOW : "#cbd5e1";
              ctx.fill();
            }
          });
          ctx.restore();
        }

        if (item.type === "glassPlate") {
          // Frosted Glass Hexagonal Circuit Plate with refraction & rim light
          ctx.save();
          ctx.beginPath();
          item.points.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.closePath();
          // Glass fill with subtle frosted opacity
          ctx.fillStyle = "rgba(15, 107, 92, 0.16)";
          ctx.fill();
          ctx.lineWidth = 1.5 * scale;
          ctx.strokeStyle = "rgba(0, 245, 212, 0.45)";
          ctx.stroke();

          // Glass specular rim gleam
          ctx.beginPath();
          ctx.moveTo(item.points[0].x, item.points[0].y);
          ctx.lineTo(item.points[1].x, item.points[1].y);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
          ctx.lineWidth = 2.5 * scale;
          ctx.stroke();

          // Inner circuit traces on the glass
          for (let k = 0; k < item.points.length - 1; k += 2) {
            ctx.beginPath();
            ctx.moveTo(activeX, activeY);
            ctx.lineTo(item.points[k].x, item.points[k].y);
            ctx.strokeStyle = "rgba(56, 189, 248, 0.22)";
            ctx.lineWidth = 1 * scale;
            ctx.stroke();
          }
          ctx.restore();
        }

        if (item.type === "metalGear") {
          // Interlocking Titanium Gear
          ctx.save();
          ctx.beginPath();
          item.points.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.closePath();
          const gearGrad = ctx.createRadialGradient(activeX, activeY, 10, activeX, activeY, 80 * scale);
          gearGrad.addColorStop(0, "#2c3b42");
          gearGrad.addColorStop(0.7, "#141d22");
          gearGrad.addColorStop(1, "#0a1013");
          ctx.fillStyle = gearGrad;
          ctx.fill();
          ctx.lineWidth = 1.8 * scale;
          ctx.strokeStyle = "rgba(160, 178, 190, 0.65)";
          ctx.stroke();

          // Gear inner cutouts
          ctx.beginPath();
          ctx.arc(activeX, activeY, 28 * scale, 0, Math.PI * 2);
          ctx.fillStyle = "#090d10";
          ctx.fill();
          ctx.strokeStyle = "rgba(0, 245, 212, 0.35)";
          ctx.lineWidth = 1.5 * scale;
          ctx.stroke();
          ctx.restore();
        }

        if (item.type === "lightPaths") {
          // Emissive light paths with glowing packets
          ctx.save();
          item.paths.forEach((p) => {
            // Emissive line
            ctx.beginPath();
            ctx.moveTo(p.p1.x, p.p1.y);
            ctx.lineTo(p.p2.x, p.p2.y);
            ctx.strokeStyle = `rgba(0, 245, 212, ${0.28 * pulse})`;
            ctx.lineWidth = 1.5 * scale;
            ctx.stroke();

            // High-energy photon packet traveling along the wire
            ctx.beginPath();
            ctx.arc(p.px, p.py, 3.2 * scale, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = ACCENT_GLOW;
            ctx.shadowBlur = 12;
            ctx.fill();
          });
          ctx.restore();
        }

        if (item.type === "coreSphere") {
          // Central Glowing Core Reactor (Pulsing Energy Sphere)
          ctx.save();
          const coreRadius = 26 * scale * pulse;
          const coreGrad = ctx.createRadialGradient(
            item.proj.x - 4,
            item.proj.y - 4,
            2,
            item.proj.x,
            item.proj.y,
            coreRadius
          );
          coreGrad.addColorStop(0, "#ffffff");
          coreGrad.addColorStop(0.3, ACCENT_GLOW);
          coreGrad.addColorStop(0.7, ACCENT);
          coreGrad.addColorStop(1, "rgba(15, 107, 92, 0.05)");

          ctx.beginPath();
          ctx.arc(item.proj.x, item.proj.y, coreRadius, 0, Math.PI * 2);
          ctx.fillStyle = coreGrad;
          ctx.shadowColor = ACCENT_GLOW;
          ctx.shadowBlur = 24 * pulse;
          ctx.fill();

          // Floating orbit electron nodes around core
          for (let m = 0; m < 3; m++) {
            const orbAngle = t * 3 + (m * Math.PI * 2) / 3;
            const ox = item.proj.x + Math.cos(orbAngle) * (42 * scale);
            const oy = item.proj.y + Math.sin(orbAngle) * (20 * scale);
            ctx.beginPath();
            ctx.arc(ox, oy, 2.5 * scale, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#38bdf8";
            ctx.shadowBlur = 8;
            ctx.fill();
          }
          ctx.restore();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText("carlo.timbas@automation.dev");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  return (
    <div
      className="min-h-screen text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-x-hidden"
      style={{
        backgroundColor: BG_DARK,
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── Background Subtle Studio Grid & Volumetric Ambience ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[160px] opacity-25 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${ACCENT_GLOW} 0%, ${ACCENT} 40%, transparent 70%)` }}
        />
      </div>

      {/* ── Fixed Minimal Navigation Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#090d10]/80 border-b border-slate-800/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => go("home")}
              className="text-xs tracking-wider text-slate-400 hover:text-emerald-400 transition-colors uppercase font-mono flex items-center gap-1.5 py-1"
            >
              <span className="text-emerald-400">←</span> CTPR CLUB
            </button>
            <span className="text-slate-700">/</span>
            <span className="text-sm font-semibold tracking-wider text-slate-100 font-mono">
              CARLO TIMBAS
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono tracking-widest bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              AI AUTOMATION
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono tracking-widest text-slate-400">
            <button onClick={() => scrollTo("about")} className="hover:text-emerald-300 transition-colors">
              ~/ABOUT
            </button>
            <button onClick={() => scrollTo("services")} className="hover:text-emerald-300 transition-colors">
              ~/SERVICES
            </button>
            <button onClick={() => scrollTo("case-studies")} className="hover:text-emerald-300 transition-colors">
              ~/CASE-STUDIES
            </button>
          </nav>

          {/* Action & Contact */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setBookingOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium tracking-wide bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all shadow-[0_0_15px_rgba(0,245,212,0.1)] hover:shadow-[0_0_20px_rgba(0,245,212,0.25)]"
            >
              BOOK A CALL
            </button>
            {toggle && (
              <button
                onClick={toggle}
                className="w-8 h-8 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center text-xs transition-colors"
                title="Toggle visual theme"
              >
                {dark ? "☀" : "☾"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO SEQUENCE (Edge-to-edge dark studio, 16:9 portrait, orbital nodes, massive headline) ── */}
      <section className="relative min-h-screen pt-24 pb-16 flex flex-col justify-between items-center z-10 px-4 sm:px-8 overflow-hidden">
        {/* Massive 90% Typography Headline Behind the Character */}
        <div className="absolute top-16 left-0 right-0 flex justify-center pointer-events-none select-none z-0">
          <h1
            className="text-[clamp(54px,14vw,210px)] font-black tracking-tighter leading-none uppercase text-transparent opacity-15"
            style={{
              WebkitTextStroke: "1px rgba(0, 245, 212, 0.4)",
              fontFamily: '"Impact", "Arial Black", sans-serif',
            }}
          >
            AUTOMATE
          </h1>
        </div>

        {/* Hero Main Content */}
        <div className="relative z-10 max-w-6xl w-full mx-auto my-auto flex flex-col items-center text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-6 backdrop-blur-sm shadow-[0_0_25px_rgba(15,107,92,0.3)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AVAILABLE FOR ENTERPRISE AUTOMATION & AGENT WORK</span>
          </div>

          {/* Expanded 16:9 Studio Frame with Carlo's Portrait and Holographic Floating Nodes */}
          <div className="relative w-full max-w-4xl aspect-[16/9] rounded-2xl overflow-hidden border border-slate-800/80 shadow-[0_20px_80px_rgba(0,0,0,0.85)] bg-gradient-to-b from-[#131b20] to-[#090d10] flex items-center justify-center group mb-8">
            {/* Cinematic Volumetric Light Beam */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,245,212,0.15),transparent_65%)] pointer-events-none" />

            {/* Orbiting Faint Holographic Workflow Nodes (Abstract Shapes Joined by Thin Light Paths) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
              <defs>
                <linearGradient id="beam" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0f6b5c" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <line x1="20%" y1="30%" x2="45%" y2="50%" stroke="url(#beam)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="80%" y1="28%" x2="55%" y2="52%" stroke="url(#beam)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50%" y1="75%" x2="78%" y2="68%" stroke="url(#beam)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="20%" cy="30%" r="5" fill="#00f5d4" className="animate-pulse" />
              <circle cx="80%" cy="28%" r="6" fill="#38bdf8" />
              <circle cx="78%" cy="68%" r="4" fill="#00f5d4" />
            </svg>

            {/* The Portrait Image (Preserving face, identity, hair, outfit, holding tablet) */}
            <div className="relative h-full w-full flex items-center justify-center p-4">
              <img
                src="./photos/timbas/carlo.png"
                alt="Carlo Timbas - AI Automation Specialist"
                className="h-full object-contain filter drop-shadow-[0_0_35px_rgba(0,245,212,0.22)] transform hover:scale-[1.02] transition-transform duration-700 select-none pointer-events-none"
                style={{ maxHeight: "88%" }}
                onError={(e) => {
                  // Fallback visual avatar if path issues occur
                  e.target.style.display = "none";
                }}
              />
            </div>

            {/* Subtle Studio Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090d10] via-transparent to-transparent opacity-75 pointer-events-none" />
            <div className="absolute inset-0 border border-emerald-500/10 rounded-2xl pointer-events-none" />

            {/* Floating Live Telemetry Badge inside frame */}
            <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#090d10]/85 border border-slate-800 text-[11px] font-mono text-slate-400 backdrop-blur-md">
              <span className="text-emerald-400">● LIVE RUNTIME</span>
              <span>AGENT ORBIT: 60 FPS</span>
              <span>LATENCY: 12ms</span>
            </div>
          </div>

          {/* Understated CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <button
              onClick={() => scrollTo("case-studies")}
              className="px-6 py-3 rounded-xl font-mono text-xs tracking-wider font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-[0_0_25px_rgba(0,245,212,0.35)] hover:shadow-[0_0_35px_rgba(0,245,212,0.5)] transform hover:-translate-y-0.5"
            >
              VIEW CASE STUDIES →
            </button>
            <button
              onClick={() => setBookingOpen(true)}
              className="px-6 py-3 rounded-xl font-mono text-xs tracking-wider font-semibold text-slate-300 hover:text-white bg-slate-900/90 border border-slate-700 hover:border-emerald-500/50 transition-all transform hover:-translate-y-0.5"
            >
              BOOK A DISCOVERY CALL
            </button>
          </div>

          {/* Dynamic Storytelling Passage Carousel (Opposite character visual) */}
          <div className="w-full max-w-2xl bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden transition-all duration-500">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3 text-[11px] font-mono text-slate-400">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span>{stories[activeStory].icon}</span>
                <span>PHILOSOPHY // 0{activeStory + 1}</span>
              </span>
              <span>{stories[activeStory].concept}</span>
            </div>
            <p className="text-base sm:text-lg font-medium text-slate-100 tracking-tight transition-opacity duration-300">
              "{stories[activeStory].quote}"
            </p>
            <p className="text-xs text-slate-400 mt-1 font-mono">{stories[activeStory].sub}</p>
            {/* Story Navigation Dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {stories.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStory(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeStory === i ? "w-8 bg-emerald-400" : "w-2 bg-slate-700 hover:bg-slate-500"
                  }`}
                  aria-label={`Go to philosophy ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator prompt */}
        <div className="relative z-10 flex flex-col items-center gap-2 text-slate-500 text-[11px] font-mono tracking-widest pt-4">
          <span>SCROLL TO EXPLORE ARCHITECTURE</span>
          <div className="w-4 h-7 border border-slate-700 rounded-full flex justify-center pt-1">
            <div className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          SHARED 3D STAGE & CONTINUOUS SCENE (ABOUT → SERVICES → CASE STUDIES)
          The 3D Automation Core canvas stays continuously mounted here!
         ══════════════════════════════════════════════════════════════════════════ */}
      <div ref={sharedContainerRef} className="relative w-full">
        {/* Sticky 3D Canvas Layer spanning all three sections */}
        <div className="sticky top-0 h-screen w-full pointer-events-none z-10 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
            style={{ filter: "drop-shadow(0 0 40px rgba(0,245,212,0.18))" }}
          />

          {/* Current Section Telemetry HUD in top right of 3D Canvas */}
          <div className="absolute top-20 right-6 hidden lg:flex flex-col items-end gap-1 font-mono text-[10px] text-slate-400 bg-slate-950/70 border border-slate-800/80 px-3 py-2 rounded-xl backdrop-blur-md">
            <span className="text-emerald-400">CORE STATUS: SYNCHRONIZED</span>
            <span>SECTION: {sectionInView.toUpperCase()}</span>
            <span>VECTOR PROGRESS: {Math.round(scrollProgress * 100)}%</span>
          </div>
        </div>

        {/* The Three Sections Content Overlaying Opposite the 3D Model */}
        <div className="relative z-20 -mt-[100vh]">
          {/* ───────────────────────────────────────────────────────────
              SECTION 1: ABOUT (Content on Left, 3D Core on Right)
             ─────────────────────────────────────────────────────────── */}
          <section id="about" className="min-h-screen py-28 px-6 sm:px-12 flex items-center">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content Column (Left) */}
              <div className="space-y-6 bg-slate-900/80 lg:bg-slate-900/60 p-6 sm:p-10 rounded-3xl border border-slate-800/90 backdrop-blur-xl shadow-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  <span>01 // IDENTITY & OPERATING SYSTEM</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Engineering Resilient <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Autonomous Business Engines.
                  </span>
                </h2>

                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  I'm <strong>Carlo Timbas</strong>, a 3rd year BSIT student at Pamantasan ng Lungsod ng Maynila and
                  an AI Automation Specialist. With <strong>[3+] years</strong> of hands-on experience bridging robust
                  backend software engineering with modern autonomous LLM workflows, I help fast-moving companies eliminate
                  thousands of hours of manual labor.
                </p>

                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Instead of fragile point-to-point Zapier triggers that break silently, I architect fault-tolerant
                  event-driven pipelines with automated telemetry, idempotency keys, and self-healing LLM fallbacks.
                </p>

                {/* Tool Stack Badges */}
                <div className="pt-2">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-3">
                    Validated Stack & Orchestration Toolkit
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "n8n", cat: "Orchestration" },
                      { name: "Make.com", cat: "Workflows" },
                      { name: "Zapier Central", cat: "Automation" },
                      { name: "Python", cat: "Code" },
                      { name: "Claude 3.5 Sonnet", cat: "AI Models" },
                      { name: "OpenAI GPT-4o", cat: "AI Models" },
                      { name: "GoHighLevel", cat: "CRM" },
                      { name: "HubSpot API", cat: "CRM" },
                      { name: "Java / Spring Boot", cat: "Backend" },
                      { name: "React", cat: "Frontend" },
                      { name: "PostgreSQL", cat: "Database" },
                      { name: "Docker", cat: "DevOps" },
                    ].map((tool) => (
                      <span
                        key={tool.name}
                        className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-800/80 text-slate-200 border border-slate-700/60 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
                      >
                        {tool.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => scrollTo("services")}
                    className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-2 group"
                  >
                    <span>EXPLORE SERVICES</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <span className="text-slate-700">|</span>
                  <button
                    onClick={copyEmail}
                    className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedEmail ? "COPIED TO CLIPBOARD!" : "COPY EMAIL"}
                  </button>
                </div>
              </div>

              {/* Right Column is kept open for the 3D Automation Core to shine through! */}
              <div className="hidden lg:block pointer-events-none" />
            </div>
          </section>

          {/* ───────────────────────────────────────────────────────────
              SECTION 2: SERVICES (Content on Right, 3D Core on Left)
             ─────────────────────────────────────────────────────────── */}
          <section id="services" className="min-h-screen py-28 px-6 sm:px-12 flex items-center">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column is kept open for the 3D Automation Core as it glides over! */}
              <div className="hidden lg:block pointer-events-none" />

              {/* Content Column (Right) */}
              <div className="space-y-6 bg-slate-900/80 lg:bg-slate-900/60 p-6 sm:p-10 rounded-3xl border border-slate-800/90 backdrop-blur-xl shadow-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  <span>02 // CAPABILITIES & OFFERINGS</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  High-Impact Services <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Designed to Multiply Margin.
                  </span>
                </h2>

                <p className="text-slate-300 text-sm">
                  We don't sell random scripts; we deliver end-to-end operational leverage. Every service includes
                  full architecture documentation, observability dashboards, and post-deployment monitoring.
                </p>

                {/* 5 Key Offerings */}
                <div className="space-y-3 pt-1">
                  {[
                    {
                      num: "01",
                      title: "Workflow Automation",
                      desc: "Multi-platform orchestration using n8n and Make with webhook validation, rate-limit protection, and zero data leakage.",
                    },
                    {
                      num: "02",
                      title: "AI Agents & Autonomous Chatbots",
                      desc: "Context-aware agents armed with custom tool calling, vector memory (RAG), and multi-step reasoning capabilities.",
                    },
                    {
                      num: "03",
                      title: "CRM Setup & Integrations",
                      desc: "Deep bi-directional syncs across HubSpot, GoHighLevel, and ERP databases. Automated lead scoring and dynamic routing.",
                    },
                    {
                      num: "04",
                      title: "RPA & Operational Process Audits",
                      desc: "Forensic analysis of employee keystrokes and manual bottlenecks, followed by headless Python scripts and browser automation.",
                    },
                    {
                      num: "05",
                      title: "Corporate AI Enablement & Training",
                      desc: "Hands-on workshops transforming non-technical teams into prompt engineers and self-sufficient automation operators.",
                    },
                  ].map((service) => (
                    <div
                      key={service.num}
                      className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-emerald-500/30 hover:bg-slate-800/70 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-mono text-xs font-bold">{service.num}</span>
                        <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 pl-7 leading-relaxed">{service.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => scrollTo("case-studies")}
                    className="w-full py-3 rounded-xl font-mono text-xs tracking-wider bg-slate-800 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all text-center"
                  >
                    SEE REAL MEASURABLE RESULTS →
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ───────────────────────────────────────────────────────────
              SECTION 3: CASE STUDIES (Content on Left, 3D Core on Right)
             ─────────────────────────────────────────────────────────── */}
          <section id="case-studies" className="min-h-screen py-28 px-6 sm:px-12 flex items-center">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content Column (Left) */}
              <div className="space-y-6 bg-slate-900/80 lg:bg-slate-900/60 p-6 sm:p-10 rounded-3xl border border-slate-800/90 backdrop-blur-xl shadow-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  <span>03 // EVIDENCE & BENCHMARKS</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Case Studies & <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Proven Production Outcomes.
                  </span>
                </h2>

                <p className="text-slate-300 text-sm">
                  Real client deployments with transparent problem statements, custom architectural remedies, and
                  quantifiable ROI metrics.
                </p>

                {/* 3 Detailed Case Studies */}
                <div className="space-y-4">
                  {/* Case 1 */}
                  <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                        FinTech & Underwriting Hub
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        LOAN PROCESSING
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      <strong>Problem:</strong> Underwriters spent 22+ hours each week manually reading PDF bank statements and keying financial data into loan origination software.
                    </p>
                    <p className="text-xs text-slate-400">
                      <strong>Solution:</strong> Automated ingestion webhook with Claude 3.5 Sonnet Vision OCR, strict JSON schema validation, and direct ERP pipeline sync.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
                      <span className="px-2.5 py-1 rounded bg-slate-900 text-emerald-300 border border-emerald-500/30">
                        ⚡ [34 hrs/week] saved per officer
                      </span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 text-cyan-300 border border-cyan-500/30">
                        📉 [99.4%] entry error reduction
                      </span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 text-amber-300 border border-amber-500/30">
                        ⏱ [4.2x] faster turnaround
                      </span>
                    </div>
                  </div>

                  {/* Case 2 */}
                  <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                        Omnichannel D2C Brand ($8M ARR)
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        E-COMMERCE OPS
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      <strong>Problem:</strong> Flash-sale ticket volume caused 14-hour first response delays, resulting in cancelled checkouts and customer churn.
                    </p>
                    <p className="text-xs text-slate-400">
                      <strong>Solution:</strong> Deployed autonomous Claude concierge with live Shopify API tool-calling for order changes, returns, and real-time inventory queries.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
                      <span className="px-2.5 py-1 rounded bg-slate-900 text-emerald-300 border border-emerald-500/30">
                        ⚡ [82%] response time cut (&lt; 2 min)
                      </span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 text-cyan-300 border border-cyan-500/30">
                        💰 [$18,500/mo] support cost saved
                      </span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 text-amber-300 border border-amber-500/30">
                        🎯 [91%] automated resolution
                      </span>
                    </div>
                  </div>

                  {/* Case 3 */}
                  <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                        B2B Enterprise SaaS (Series A)
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        SALES PIPELINE
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      <strong>Problem:</strong> Inbound enterprise demo requests sat in rep inboxes for 4+ hours, slashing close rates by 60%.
                    </p>
                    <p className="text-xs text-slate-400">
                      <strong>Solution:</strong> Instant enrichment via Apollo/Clearbit webhooks, algorithmic ICP scoring, Slack huddle alerts, and automated round-robin calendar booking.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
                      <span className="px-2.5 py-1 rounded bg-slate-900 text-emerald-300 border border-emerald-500/30">
                        ⚡ [&lt; 90 seconds] contact speed
                      </span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 text-cyan-300 border border-cyan-500/30">
                        📈 [3.1x] booked demo rate
                      </span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 text-amber-300 border border-amber-500/30">
                        📉 [47%] lower customer CAC
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setBookingOpen(true)}
                    className="px-6 py-3 rounded-xl font-mono text-xs tracking-wider bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold transition-all shadow-[0_0_20px_rgba(0,245,212,0.3)]"
                  >
                    START YOUR AUTOMATION SPRINT →
                  </button>
                </div>
              </div>

              {/* Right Column is kept open for 3D Automation Core */}
              <div className="hidden lg:block pointer-events-none" />
            </div>
          </section>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 bg-[#070a0c] py-12 px-6 sm:px-12 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => go("home")}
              className="text-xs font-mono text-slate-400 hover:text-emerald-400 transition-colors"
            >
              ← BACK TO CTPR CLUB
            </button>
            <span className="text-slate-700">|</span>
            <span className="text-xs font-mono text-slate-500">
              © {new Date().getFullYear()} CARLO TIMBAS · BUILT WITH REACT & TAILWIND
            </span>
          </div>

          <div className="flex items-center gap-4">
            {next && (
              <button
                onClick={() => go(next.id)}
                className="px-4 py-2 rounded-lg text-xs font-mono bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-700 transition-colors"
              >
                NEXT PORTFOLIO: {next.name} →
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* ── Booking / Contact Modal ── */}
      {bookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0e1419] border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Book an Automation Consultation</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">DIRECT ENGINEERING SESSION · 30 MIN</p>
              </div>
              <button
                onClick={() => setBookingOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">YOUR NAME</label>
                <input
                  type="text"
                  placeholder="Alex Mercer"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">WORK EMAIL</label>
                <input
                  type="email"
                  placeholder="alex@company.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">PRIMARY BOTTLENECK / GOAL</label>
                <textarea
                  rows="3"
                  placeholder="We are spending 20+ hours weekly moving lead data from Hubspot into our billing platform..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-[11px]">
                💡 Direct contact: carlo.timbas@automation.dev or click "Copy Email" to message directly.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setBookingOpen(false)}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  alert("Thank you! Carlo will review your bottleneck details and respond within 24 hours.");
                  setBookingOpen(false);
                }}
                className="px-5 py-2.5 rounded-lg text-xs font-mono font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-[0_0_15px_rgba(0,245,212,0.3)] transition-all"
              >
                SUBMIT REQUEST →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
