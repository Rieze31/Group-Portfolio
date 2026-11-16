import { useState } from "react";

// About-me carousel: prev/next arrows, the caption changes with each picture.
// slides = [{ t: title, d: description, g: css gradient (swap for an image later) }]
export default function Carousel({ slides }) {
  const [i, setI] = useState(0);
  const n = slides.length, s = slides[i];
  return (
    <div>
      <div className="relative max-w-[340px] mx-auto">
        <div
          className="h-[380px] rounded-[22px] grid place-items-center text-white font-medium text-[22px] shadow-[0_18px_36px_-12px_rgba(0,0,0,.35)]"
          style={{ background: s.g, fontFamily: "var(--sans)" }}
        >
          {s.t}
        </div>
        <button
          className="absolute top-[calc(50%-20px)] left-[-14px] w-10 h-10 rounded-full border-0 bg-white/92 text-[#111] text-xl cursor-pointer hover:bg-white transition-colors"
          aria-label="Previous"
          onClick={() => setI((v) => (v + n - 1) % n)}
        >‹</button>
        <button
          className="absolute top-[calc(50%-20px)] right-[-14px] w-10 h-10 rounded-full border-0 bg-white/92 text-[#111] text-xl cursor-pointer hover:bg-white transition-colors"
          aria-label="Next"
          onClick={() => setI((v) => (v + 1) % n)}
        >›</button>
      </div>
      <div className="text-center mt-3">
        {slides.map((_, k) => (
          <b
            key={k}
            className={`inline-block w-2 h-2 rounded-full mx-0.5 transition-colors ${k === i ? "bg-[var(--acc)]" : "bg-[var(--line)]"}`}
          />
        ))}
      </div>
      <p className="text-center mt-2.5 min-h-12 text-[var(--mute)] leading-relaxed text-sm">{s.d}</p>
    </div>
  );
}
