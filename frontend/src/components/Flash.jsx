import { useCallback, useEffect, useRef, useState } from "react";

const LIGHT_MODE_SOUNDS = [
  "/audio/venzon/lebron-x-steve-lacy.mp3",
  "/audio/venzon/lebron-james-soothing-music.mp3",
  "/audio/venzon/lebron-james.mp3",
  "/audio/venzon/lebron.mp3",
];

export default function Flash({ onDone, type = "light" }) {
  const portfolioTransition = type === "portfolio";
  const [soundSrc] = useState(() => LIGHT_MODE_SOUNDS[Math.floor(Math.random() * LIGHT_MODE_SOUNDS.length)]);
  const audioRef = useRef(null);
  const onDoneRef = useRef(onDone);
  const completed = useRef(false);
  onDoneRef.current = onDone;

  const finish = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onDoneRef.current?.();
  }, []);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return undefined;
    }

    const audio = audioRef.current;
    if (audio && !portfolioTransition) {
      audio.volume = 0.8;
      audio.play().catch(() => {});
    }
    const fallback = window.setTimeout(finish, 6200);
    return () => {
      window.clearTimeout(fallback);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [finish, portfolioTransition]);

  return (
    <div className={`flash${portfolioTransition ? " portfolio-flash" : ""}`} onClick={finish} onAnimationEnd={(event) => event.target === event.currentTarget && finish()}>
      <img src={portfolioTransition ? "/portfolio-transition-cutout.png" : "/sunshine.png"} alt={portfolioTransition ? "Baby looking at the camera" : "Sunshine meme"} />
      <span>{portfolioTransition ? "Wait lang guys" : "Light mode activated. Sorry for your eyes."}</span>
      {!portfolioTransition && <audio ref={audioRef} src={soundSrc} preload="auto" aria-hidden="true" style={{ display: "none" }} />}
    </div>
  );
}
