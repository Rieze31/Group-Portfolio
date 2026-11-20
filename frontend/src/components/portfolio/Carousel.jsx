import { useEffect, useRef, useState } from "react";

// About-me carousel: prev/next arrows, the caption changes with each picture.
// slides = [{ t: title, d: description, g: css gradient (swap for an image later) }]
export default function Carousel({ slides, activeIndex, onChange }) {
  const [internalIndex, setInternalIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const fadeTimer = useRef(null);
  const i = activeIndex ?? internalIndex;
  const n = slides.length, s = slides[i];

  useEffect(() => () => window.clearTimeout(fadeTimer.current), []);

  const changeSlide = (nextIndex) => {
    setFading(true);
    window.clearTimeout(fadeTimer.current);
    fadeTimer.current = window.setTimeout(() => {
      if (activeIndex === undefined) setInternalIndex(nextIndex);
      onChange?.(nextIndex);
      setFading(false);
    }, 140);
  };

  return (
    <div>
      <div className={`relative max-w-[340px] mx-auto transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}>
        <div
          key={i}
          className="portfolio-carousel-slide relative h-[380px] overflow-hidden rounded-[22px] grid place-items-center text-white font-medium text-[22px] shadow-[0_18px_36px_-12px_rgba(0,0,0,.35)]"
          style={{ background: s.g, fontFamily: "var(--sans)" }}
        >
          {s.image ? <img src={s.image} alt={s.t} className="absolute inset-0 h-full w-full rounded-[22px] object-cover" /> : s.t}
          <span className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-[11px] tracking-wide text-white">
            {s.t}
          </span>
        </div>
        <button
          className="absolute top-[calc(50%-20px)] left-[-14px] w-10 h-10 rounded-full border-0 bg-white/92 text-[#111] text-xl cursor-pointer hover:bg-white transition-colors"
          aria-label="Previous"
          onClick={() => changeSlide((i + n - 1) % n)}
        >‹</button>
        <button
          className="absolute top-[calc(50%-20px)] right-[-14px] w-10 h-10 rounded-full border-0 bg-white/92 text-[#111] text-xl cursor-pointer hover:bg-white transition-colors"
          aria-label="Next"
          onClick={() => changeSlide((i + 1) % n)}
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
