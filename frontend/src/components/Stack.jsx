import { useEffect, useRef, useState } from "react";
import { members } from "../state/members.js";

const clamp = (v) => Math.max(0, Math.min(1, v));
const BACK = [null, "translate(10px,12px) rotate(3deg)", "translate(-8px,22px) rotate(-3deg)"];

// The swipeable card stack. Swipe right / "Let's look" opens the portfolio, swipe left skips.
export default function Stack({ go, order, setOrder }) {
  const M = members();
  const [dx, setDx] = useState(0);
  const [drag, setDrag] = useState(false);
  const busy = useRef(false), start = useRef(0), moved = useRef(false), act = useRef({});

  const fly = (dir, cb) => {
    if (busy.current) return;
    busy.current = true; setDrag(false); setDx(dir * 560);
    setTimeout(() => { cb(); setDx(0); busy.current = false; }, 280);
  };
  const pass = () => fly(-1, () => setOrder((o) => [...o.slice(1), o[0]]));
  const look = () => fly(1, () => go(M[order[0]].portfolio));
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

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-5">
      {/* Counter */}
      <div className="self-start w-[min(420px,86vw)] mx-auto text-[13px] text-[var(--mute)]"
           style={{ fontFamily: "var(--mono)" }}>
        <b className="text-[28px] text-[var(--ink)]">{String(order[0] + 1).padStart(2, "0")}</b> / {String(M.length).padStart(2, "0")}
      </div>

      {/* Stack area */}
      <div className="relative w-[min(420px,86vw)] h-[500px] sm:h-[520px]">
        {order.slice(0, 3).map((idx, i) => {
          const m = M[idx], t = i === 0;
          return (
            <div key={idx} className={"card" + (t ? " t" : "")} {...(t ? h : {})}
              style={{ background: m.color, zIndex: 10 - i, transition: t && drag ? "none" : undefined,
                transform: t ? `translateX(${dx}px) rotate(${dx / 22}deg)` : BACK[i] }}>
              {t && (
                <>
                  {/* Photo area */}
                  <div className="relative h-[56%] grid place-items-center"
                       style={{ background: `linear-gradient(155deg,${m.color}cc,#2b2622)` }}>
                    <b className="text-[120px] leading-none font-light tracking-tight text-white/90"
                       style={{ fontFamily: "var(--sans)" }}>{m.init}</b>
                    <span className="absolute top-3.5 right-3.5 text-white text-[11px] font-bold px-3.5 py-2 rounded-full"
                          style={{ background: "rgba(30,28,26,.78)", fontFamily: "var(--mono)" }}>
                      {m.match}% YOUR TYPE
                    </span>
                    <span className="absolute left-4 bottom-3 text-white text-[10px] font-bold tracking-widest"
                          style={{ fontFamily: "var(--mono)" }}>{m.cap}</span>
                    <span className="stamp" style={{
                      opacity: clamp(Math.abs(dx) / 90),
                      transform: dx < 0 ? "rotate(10deg)" : undefined,
                      left: dx < 0 ? "auto" : 20, right: dx < 0 ? 20 : "auto"
                    }}>{dx < 0 ? "NOT YET" : "LET'S LOOK"}</span>
                  </div>

                  {/* Info area */}
                  <div className="p-[18px_22px] grid grid-cols-2 gap-x-3">
                    <div className="col-span-2 text-[11px] tracking-widest" style={{ fontFamily: "var(--mono)" }}>{m.role}</div>
                    <div>
                      <div className="text-[34px] font-light leading-none tracking-tight mt-1.5" style={{ fontFamily: "var(--sans)" }}>{m.name}</div>
                      <div className="text-[13px] opacity-60 mt-1.5">{m.loc}</div>
                    </div>
                    <div className="text-[13px] leading-snug mt-1.5">{m.quote}</div>
                    <div className="col-span-2 flex gap-1.5 mt-2.5 flex-wrap">
                      {m.tags.map((x) => (
                        <span key={x} className="border border-black/45 rounded-full px-2.5 py-1 text-[11px] font-bold">{x}</span>
                      ))}
                    </div>
                    <button
                      className="col-span-2 flex justify-between mt-2.5 border-0 border-t border-black/40 bg-transparent pt-3 text-[14px] font-bold cursor-pointer text-inherit"
                      style={{ fontFamily: "var(--sans)" }}
                      onClick={look}
                    >View portfolio <span>→</span></button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex gap-7 mt-2">
        <button className="grid justify-items-center gap-2 text-[10px] bg-transparent border-0 text-[var(--ink)] cursor-pointer hover:[&_i]:scale-110"
                style={{ fontFamily: "var(--mono)", letterSpacing: ".08em" }}
                onClick={pass}>
          <i className="w-14 h-14 rounded-full grid place-items-center not-italic text-2xl text-white transition-transform"
             style={{ background: "#1a1816" }}>✕</i>
          NOT YET
        </button>
        <button className="grid justify-items-center gap-2 text-[10px] bg-transparent border-0 text-[var(--ink)] cursor-pointer hover:[&_i]:scale-110"
                style={{ fontFamily: "var(--mono)", letterSpacing: ".08em" }}
                onClick={look}>
          <i className="w-14 h-14 rounded-full grid place-items-center not-italic text-2xl text-white transition-transform"
             style={{ background: "#ff6a4d" }}>+</i>
          LET'S LOOK
        </button>
      </div>
    </div>
  );
}
