import { useEffect, useLayoutEffect, useRef, useState } from "react";

const DIRS = ["right", "bottom-right", "bottom", "bottom-left", "left", "top-left", "top", "top-right"];
const RELEASE_REACTIONS = ["hurt1", "funny1", "funny2", "funny3"];
const RELEASE_SOUNDS = ["classic_hurt_7UuVwoL.mp3", "roblox-death-sound_1_nogvyuq.mp3"];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const prefersReducedMotion = () => typeof window !== "undefined"
  && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function pickPose(dx, dy, deadZone) {
  if (Math.hypot(dx, dy) < deadZone) return "neutral";
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return DIRS[Math.round(((angle + 360) % 360) / 45) % 8];
}

function drawLocalWarp(canvas, image, drag, sourceCache) {
  if (!canvas || !image?.complete || !image.naturalWidth || prefersReducedMotion()) return;
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return;

  const sourceKey = image.currentSrc || image.src;
  if (sourceCache.key !== sourceKey || sourceCache.width !== width || sourceCache.height !== height) {
    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = width;
    sourceCanvas.height = height;
    const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
    if (!sourceContext) return;
    sourceContext.drawImage(image, 0, 0, width, height);
    sourceCache.key = sourceKey;
    sourceCache.width = width;
    sourceCache.height = height;
    sourceCache.pixels = sourceContext.getImageData(0, 0, width, height);
  }

  const sourcePixels = sourceCache.pixels;
  const source = sourcePixels.data;
  const output = context.createImageData(width, height);
  output.data.set(source);
  const destination = output.data;
  // Keep the displacement around the grabbed cheek instead of bending the whole portrait.
  const radius = Math.min(width, height) * 0.12;
  const centerX = drag.originX * width;
  const centerY = drag.originY * height;
  const offsetX = drag.dx * width;
  const offsetY = drag.dy * height;
  const left = Math.max(0, Math.floor(centerX - radius * 2.5));
  const right = Math.min(width, Math.ceil(centerX + radius * 2.5));
  const top = Math.max(0, Math.floor(centerY - radius * 2.5));
  const bottom = Math.min(height, Math.ceil(centerY + radius * 2.5));

  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const relativeX = x - centerX;
      const relativeY = y - centerY;
      const distanceSquared = relativeX * relativeX + relativeY * relativeY;
      const falloff = Math.exp(-distanceSquared / (2 * radius * radius));
      if (falloff < 0.001) continue;

      const sourceX = clamp(x - offsetX * falloff, 0, width - 1);
      const sourceY = clamp(y - offsetY * falloff, 0, height - 1);
      const x0 = Math.floor(sourceX);
      const y0 = Math.floor(sourceY);
      const x1 = Math.min(x0 + 1, width - 1);
      const y1 = Math.min(y0 + 1, height - 1);
      const mixX = sourceX - x0;
      const mixY = sourceY - y0;
      const targetIndex = (y * width + x) * 4;
      const topLeft = (y0 * width + x0) * 4;
      const topRight = (y0 * width + x1) * 4;
      const bottomLeft = (y1 * width + x0) * 4;
      const bottomRight = (y1 * width + x1) * 4;

      for (let channel = 0; channel < 4; channel += 1) {
        const upper = source[topLeft + channel] * (1 - mixX) + source[topRight + channel] * mixX;
        const lower = source[bottomLeft + channel] * (1 - mixX) + source[bottomRight + channel] * mixX;
        destination[targetIndex + channel] = upper * (1 - mixY) + lower * mixY;
      }
    }
  }

  context.putImageData(output, 0, 0);
}

function getVisibleImageRegion(image, rect) {
  if (!image.naturalWidth || !image.naturalHeight || !rect.width || !rect.height) {
    return { left: 0, top: 0, width: 1, height: 1 };
  }
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const boxRatio = rect.width / rect.height;
  if (imageRatio > boxRatio) {
    const visibleWidth = boxRatio / imageRatio;
    return { left: (1 - visibleWidth) / 2, top: 0, width: visibleWidth, height: 1 };
  }
  const visibleHeight = imageRatio / boxRatio;
  return { left: 0, top: (1 - visibleHeight) * 0.38, width: 1, height: visibleHeight };
}

export default function Cursor({ folder, alt = "", backText = "", interactive = false }) {
  const ref = useRef(null);
  const canvasRef = useRef(null);
  const warpSourceCache = useRef({ key: "", width: 0, height: 0, pixels: null });
  const gesture = useRef(null);
  const dragRef = useRef(null);
  const faceStateRef = useRef("neutral");
  const previousReaction = useRef(null);
  const previousReleaseSound = useRef(null);
  const releaseAudio = useRef(null);
  const snapFrame = useRef(null);
  const faceTimer = useRef(null);
  const suppressClick = useRef(false);
  const [awake, setAwake] = useState(false);
  const [pose, setPose] = useState("back");
  const [drag, setDrag] = useState(null);
  const [faceState, setFaceState] = useState("neutral");
  const [reactionImage, setReactionImage] = useState("hurt1");

  const updateDrag = (next) => {
    dragRef.current = next;
    setDrag(next);
  };
  const updateFaceState = (next) => {
    faceStateRef.current = next;
    setFaceState(next);
  };

  useEffect(() => () => {
    cancelAnimationFrame(snapFrame.current);
    clearTimeout(faceTimer.current);
    releaseAudio.current?.pause();
  }, []);

  useEffect(() => {
    [...DIRS, "neutral", "back", "blink", ...RELEASE_REACTIONS].forEach((name) => {
      new Image().src = `${folder}/${name}.png`;
    });
  }, [folder]);

  useLayoutEffect(() => {
    if (!interactive || !drag?.active) return;
    drawLocalWarp(canvasRef.current, ref.current, drag, warpSourceCache.current);
  }, [drag, interactive]);

  useEffect(() => {
    if (!awake) return;
    const move = (event) => {
      const image = ref.current;
      if (!image) return;
      const currentGesture = gesture.current;
      if (interactive && currentGesture) {
        if (Math.hypot(event.clientX - currentGesture.startX, event.clientY - currentGesture.startY) <= 8) return;
        currentGesture.moved = true;
        setPose("neutral");
        if (prefersReducedMotion()) return;

        const rect = image.getBoundingClientRect();
        const visible = getVisibleImageRegion(image, rect);
        updateDrag({
          active: true,
          originX: currentGesture.originX,
          originY: currentGesture.originY,
          dx: clamp(((event.clientX - currentGesture.startX) / rect.width) * visible.width, -0.16, 0.16),
          dy: clamp(((event.clientY - currentGesture.startY) / rect.height) * visible.height, -0.16, 0.16),
        });
        return;
      }
      if (interactive && (dragRef.current || faceStateRef.current !== "neutral")) return;
      const rect = image.getBoundingClientRect();
      setPose(pickPose(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height * 0.4), rect.width * 0.3));
    };
    const leave = () => {
      if (!gesture.current && !dragRef.current && faceStateRef.current === "neutral") setPose("neutral");
    };
    addEventListener("pointermove", move);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [awake, interactive]);

  const playBlink = () => {
    clearTimeout(faceTimer.current);
    setPose("neutral");
    updateFaceState("blink");
    faceTimer.current = setTimeout(() => updateFaceState("neutral"), 220);
  };

  const activate = () => {
    if (!awake) {
      setAwake(true);
      setPose("neutral");
      return;
    }
    if (!interactive) {
      setAwake(true);
      setPose("neutral");
      return;
    }
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    playBlink();
  };

  const press = (event) => {
    if (!interactive || !awake || !ref.current) return;
    suppressClick.current = false;
    cancelAnimationFrame(snapFrame.current);
    clearTimeout(faceTimer.current);
    updateFaceState("neutral");
    updateDrag(null);
    setPose("neutral");
    const rect = ref.current.getBoundingClientRect();
    const visible = getVisibleImageRegion(ref.current, rect);
    const localX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const localY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    gesture.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: visible.left + localX * visible.width,
      originY: visible.top + localY * visible.height,
      moved: false,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const showHurt = () => {
    const choices = RELEASE_REACTIONS.filter((name) => name !== previousReaction.current);
    const reaction = choices[Math.floor(Math.random() * choices.length)];
    previousReaction.current = reaction;
    setReactionImage(reaction);
    const soundChoices = RELEASE_SOUNDS.filter((name) => name !== previousReleaseSound.current);
    const sound = soundChoices[Math.floor(Math.random() * soundChoices.length)];
    previousReleaseSound.current = sound;
    releaseAudio.current?.pause();
    releaseAudio.current = new Audio(`/audio/venzon/${sound}`);
    releaseAudio.current.volume = 0.85;
    releaseAudio.current.play().catch(() => {});
    setPose("neutral");
    updateDrag(null);
    updateFaceState("hurt");
    faceTimer.current = setTimeout(() => updateFaceState("neutral"), 700);
  };

  const release = () => {
    if (!interactive || !gesture.current) return;
    const releasedGesture = gesture.current;
    gesture.current = null;
    suppressClick.current = releasedGesture.moved;
    if (!releasedGesture.moved) return;
    setPose("neutral");

    const startDrag = dragRef.current;
    if (!startDrag || prefersReducedMotion()) {
      showHurt();
      return;
    }

    const startTime = performance.now();
    const snapDuration = 360;
    const snapBack = (now) => {
      const progress = clamp((now - startTime) / snapDuration, 0, 1);
      const spring = Math.exp(-5.5 * progress) * Math.cos(7 * progress);
      updateDrag({ ...startDrag, dx: startDrag.dx * spring, dy: startDrag.dy * spring });
      if (progress < 1) {
        snapFrame.current = requestAnimationFrame(snapBack);
      } else {
        updateDrag(null);
        showHurt();
      }
    };
    snapFrame.current = requestAnimationFrame(snapBack);
  };

  const imageName = interactive && faceState !== "neutral"
    ? (faceState === "hurt" ? reactionImage : "blink")
    : pose;

  return (
    <div className={`relative inline-block${interactive ? " venzon-face" : ""}`}>
      <button
        onClick={activate}
        onPointerEnter={() => { if (interactive && awake) setPose("neutral"); }}
        onPointerLeave={() => { if (interactive && !awake && !gesture.current) setPose("back"); else if (interactive && !gesture.current) setPose("neutral"); }}
        onPointerDown={press}
        onPointerUp={release}
        onPointerCancel={release}
        aria-label={interactive ? "Drag a spot on my face to stretch it, click to blink" : "Click to turn the head around"}
        className="relative bg-transparent border-0 cursor-pointer p-0 block disabled:cursor-default"
        style={{ touchAction: interactive ? "none" : undefined }}
      >
        <img
          ref={ref}
          src={`${folder}/${imageName}.png`}
          alt={alt}
          draggable={false}
          className="w-[min(260px,76vw)] h-[min(320px,76vw)] object-cover rounded-3xl block shadow-[0_20px_48px_-12px_rgba(0,0,0,.35)]"
          style={interactive && drag?.active && !prefersReducedMotion() ? { visibility: "hidden" } : undefined}
        />
        {interactive && <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="venzon-warp-canvas"
          style={{ display: drag?.active && !prefersReducedMotion() ? "block" : "none" }}
        />}
      </button>
      {backText && pose === "back" && <span className="absolute inset-0 flex items-end justify-center pb-5 pointer-events-none"><span className="text-white text-[13px] font-bold tracking-widest px-3 py-1.5 rounded-full whitespace-nowrap" style={{ fontFamily: "var(--mono)", background: "rgba(0,0,0,0.52)", backdropFilter: "blur(4px)" }}>{backText}</span></span>}
      {!awake && <span className="absolute bottom-[-28px] left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest text-[var(--acc)] whitespace-nowrap" style={{ fontFamily: "var(--mono)" }} />}
    </div>
  );
}
