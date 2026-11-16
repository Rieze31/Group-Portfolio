import { useEffect, useState } from "react";

// An indicator that slides in from the side edge as you scroll down
export default function Peek() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const f = () => { const mx = document.body.scrollHeight - innerHeight; setP(mx > 0 ? scrollY / mx : 0); };
    addEventListener("scroll", f); f();
    return () => removeEventListener("scroll", f);
  }, []);
  const k = Math.max(0, Math.min(1, p * 1.4));
  return (
    <div
      className="peek hidden md:grid"
      style={{ transform: `translateX(${140 - k * 90}px)` }}
    >
      peeking…
    </div>
  );
}
