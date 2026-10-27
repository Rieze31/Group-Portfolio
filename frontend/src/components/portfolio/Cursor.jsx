import { useEffect, useRef, useState } from "react";

// 8 directions, in order starting from "right" and going clockwise (screen y points down)
const DIRS = ["right", "bottom-right", "bottom", "bottom-left", "left", "top-left", "top", "top-right"];

function pickPose(dx, dy, deadZone) {
  if (Math.hypot(dx, dy) < deadZone) return "neutral";
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;      // 0 = right, 90 = down
  return DIRS[Math.round(((angle + 360) % 360) / 45) % 8];
}

// Starts showing "back". Click it and it turns around ("neutral"), then looks at your cursor.
// Needs these files inside `folder`:
// neutral, back, left, right, top, bottom, top-left, top-right, bottom-left, bottom-right (.png)
// Optional `backText` — a string overlaid on the image while the back pose is showing.
export default function Cursor({ folder, alt = "", backText = "" }) {
  const ref = useRef(null);
  const [awake, setAwake] = useState(false);
  const [pose, setPose] = useState("back");

  // preload every pose so nothing flickers when it swaps
  useEffect(() => {
    [...DIRS, "neutral", "back"].forEach((n) => { new Image().src = `${folder}/${n}.png`; });
  }, [folder]);

  // only follow the cursor after the first click
  useEffect(() => {
    if (!awake) return;
    const move = (e) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height * 0.4;   // roughly where the face is
      setPose(pickPose(e.clientX - cx, e.clientY - cy, r.width * 0.3));
    };
    const leave = () => setPose("neutral");   // cursor left the window: look straight ahead
    addEventListener("pointermove", move);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [awake]);

  const wake = () => { setAwake(true); setPose("neutral"); };

  return (
    <div className="relative inline-block">
      <button
        onClick={wake}
        disabled={awake}
        aria-label="Click to turn the head around"
        className="bg-transparent border-0 cursor-pointer p-0 block disabled:cursor-default"
      >
        <img
          ref={ref}
          src={`${folder}/${pose}.png`}
          alt={alt}
          draggable={false}
          className="w-[min(260px,76vw)] h-[min(320px,76vw)] object-cover rounded-3xl block shadow-[0_20px_48px_-12px_rgba(0,0,0,.35)]"
        />
      </button>
      {/* back-pose overlay text */}
      {backText && pose === "back" && (
        <span
          className="absolute inset-0 flex items-end justify-center pb-5 pointer-events-none"
        >
          <span
            className="text-white text-[13px] font-bold tracking-widest px-3 py-1.5 rounded-full whitespace-nowrap"
            style={{
              fontFamily: "var(--mono)",
              background: "rgba(0,0,0,0.52)",
              backdropFilter: "blur(4px)",
            }}
          >
            {backText}
          </span>
        </span>
      )}
      {!awake && (
        <span
          className="absolute bottom-[-28px] left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest text-[var(--acc)] whitespace-nowrap"
          style={{ fontFamily: "var(--mono)" }}
        >
          
        </span>
      )}
    </div>
  );
}
