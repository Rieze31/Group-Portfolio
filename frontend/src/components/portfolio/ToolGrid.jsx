import { useEffect, useState } from "react";

// Tech stack with All / Frontend / Backend / Tools filter tabs
// tools = [{ n: name, c: "Frontend" | "Backend" | "Tools", e: emoji }]
export default function ToolGrid({ tools, categories, brandedIcons = false }) {
  const [f, setF] = useState("All");
  const filters = ["All", ...(categories || ["Frontend", "Backend", "Tools"])];
  useEffect(() => {
    if (!brandedIcons || document.querySelector("#devicon-styles")) return;
    const link = document.createElement("link");
    link.id = "devicon-styles";
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css";
    link.onload = () => document.documentElement.classList.add("venzon-devicons-ready");
    document.head.appendChild(link);
    return () => { link.remove(); document.documentElement.classList.remove("venzon-devicons-ready"); };
  }, [brandedIcons]);
  return (
    <>
      <div className="flex gap-2 my-4 flex-wrap">
        {filters.map((c) => (
          <button
            key={c}
            onClick={() => setF(c)}
            className={`border rounded-full px-4 py-1.5 cursor-pointer text-[13px] transition-colors ${
              f === c
                ? "bg-[var(--acc)] border-[var(--acc)] text-[var(--on-acc,#151515)]"
                : "bg-transparent border-[var(--line)] text-[var(--ink)] hover:border-[var(--acc)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3">
        {tools.filter((t) => f === "All" || t.c === f).map((t) => (
          <div
            key={t.n}
            className="bg-[var(--card)] border border-[var(--line)] rounded-2xl py-4 px-2 text-center text-[13px] transition-transform hover:-translate-y-1"
          >
            {brandedIcons && t.icon ? <i aria-hidden="true" className={`devicon-${t.icon} colored venzon-tech-icon`} /> : <i className="block not-italic text-2xl mb-1.5">{t.e}</i>}
            {brandedIcons && t.icon ? <span className="venzon-tech-fallback" aria-hidden="true">{t.e}</span> : null}
            {t.n}
          </div>
        ))}
      </div>
    </>
  );
}
