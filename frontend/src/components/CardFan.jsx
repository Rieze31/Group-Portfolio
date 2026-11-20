import { useEffect, useRef, useState } from "react";

const AUTOPLAY_MS = 1600;
const TRANSITION_MS = 550;
const FADE_MS = 350;

const SHOWCASE_SLOTS = [
  { x: 0, y: 0, scale: 1, rotate: -8 },
  { x: 52, y: 18, scale: 0.82, rotate: -2 },
  { x: 104, y: 38, scale: 0.68, rotate: 7 },
  { x: 143, y: 58, scale: 0.54, rotate: 13 },
];
const HERO_SLOTS = [
  { x: -12, y: 28, scale: 0.72, rotate: -16, z: 2 },
  { x: 28, y: 10, scale: 0.86, rotate: -7, z: 3 },
  { x: 68, y: 0, scale: 1, rotate: 0, z: 4 },
  { x: 108, y: 24, scale: 0.72, rotate: 16, z: 2 },
];
const HERO_LABELS = {
  dwight: "Dwight, 20",
  liza: "Rosé, 20",
  bella: "Bela, 21",
  donny: "Piolo, 21",
};
const HERO_LABELS_BY_INDEX = ["Dwight, 20", "Rosé, 20", "Bela, 21", "Piolo, 21"];

export default function CardFan({
  members,
  variant = "showcase",
  sectionVisible = false,
  focusPaused = false,
}) {
  const [active, setActive] = useState(0);
  const [dissolvingIndex, setDissolvingIndex] = useState(-1);
  const [moveDissolving, setMoveDissolving] = useState(false);
  const [entered, setEntered] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeRef = useRef(0);
  const canAutoplayRef = useRef(false);
  const fadeTimer = useRef(null);
  const settleTimer = useRef(null);
  const count = members.length;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => setTabVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (variant === "showcase" && sectionVisible) setEntered(true);
  }, [sectionVisible, variant]);

  const shouldAutoplay =
    variant === "showcase" &&
    count > 1 &&
    sectionVisible &&
    entered &&
    tabVisible &&
    !hovered &&
    !focusPaused &&
    !reducedMotion;

  useEffect(() => {
    canAutoplayRef.current = shouldAutoplay;
  }, [shouldAutoplay]);

  useEffect(() => {
    if (!shouldAutoplay) return undefined;

    const interval = window.setInterval(() => {
      if (!canAutoplayRef.current) return;
      const current = activeRef.current;
      setDissolvingIndex(current);
      setMoveDissolving(false);
      const next = (current + 1) % count;
      activeRef.current = next;
      setActive(next);
      fadeTimer.current = window.setTimeout(() => {
        fadeTimer.current = null;
        setMoveDissolving(true);
        settleTimer.current = window.setTimeout(() => {
          settleTimer.current = null;
          setDissolvingIndex(-1);
          setMoveDissolving(false);
        }, TRANSITION_MS - FADE_MS);
      }, FADE_MS);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(interval);
  }, [count, shouldAutoplay]);

  useEffect(() => () => {
    window.clearTimeout(fadeTimer.current);
    window.clearTimeout(settleTimer.current);
  }, []);

  const visibleMembers = variant === "hero" ? members.slice(0, 4) : members;
  const slots = variant === "hero" ? HERO_SLOTS : SHOWCASE_SLOTS;

  return (
    <div
      className={`card-fan card-fan--${variant}${entered ? " is-entered" : ""}${reducedMotion ? " is-reduced" : ""}`}
      aria-hidden="true"
      style={{ "--fan-transition-ms": `${TRANSITION_MS}ms`, "--fan-fade-ms": `${FADE_MS}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {visibleMembers.map((member, index) => {
        const slot = variant === "showcase" ? (index - active + count) % count : index;
        const dissolving = variant === "showcase" && index === dissolvingIndex;
        const positionSlot = dissolving && !moveDissolving ? 0 : slot;
        const position = slots[Math.min(positionSlot, slots.length - 1)];
        const heroLabel = HERO_LABELS[member.id] || HERO_LABELS_BY_INDEX[index];
        const hidden = variant === "showcase" && slot >= slots.length && !(
          dissolving && !moveDissolving
        );
        const moved = dissolving && moveDissolving;
        const photoUrl = variant === "showcase" &&
          (member.id === "liza" || member.name === "Althea Lei Santos")
          ? "/althea-peeking.png"
          : member.photoUrl;

        return (
          <div
            className="card-fan-entry"
            key={member.id || index}
            data-hidden={hidden}
            data-dissolving={dissolving}
            data-moved={moved}
            data-slot={Math.min(slot, slots.length - 1)}
            style={{
              "--fan-x": `${position.x}%`,
              "--fan-y": `${position.y}px`,
              "--fan-scale": position.scale,
              "--fan-delay": `${Math.min(positionSlot, slots.length - 1) * 80}ms`,
              zIndex: hidden ? 0 : (variant === "hero" ? position.z : slots.length - positionSlot),
              transform: variant === "hero"
                ? `translate3d(${position.x}%,${position.y}px,0) scale(${position.scale}) rotate(${position.rotate}deg)`
                : variant === "showcase"
                  ? `translate3d(${position.x}%,calc(-50% + ${position.y}px),0) scale(${position.scale}) rotate(${position.rotate}deg)`
                  : undefined,
            }}
          >
            <div className="card-fan-card" style={{ backgroundColor: member.color || "#FDFCF9" }}>
              {photoUrl && <img src={photoUrl} alt="" draggable="false" />}
            {(variant === "hero" || variant === "showcase") && heroLabel && (
              <span className="card-fan-name">{heroLabel}</span>
            )}
              {variant === "hero" && member.tags?.[0] && (
                <span className="card-fan-tag">{member.tags[0]}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
