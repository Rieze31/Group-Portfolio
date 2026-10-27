import { useState } from "react";

// Tech stack with All / Frontend / Backend / Tools filter tabs
// tools = [{ n: name, c: "Frontend" | "Backend" | "Tools", e: emoji }]
export default function ToolGrid({ tools }) {
  const [f, setF] = useState("All");
  return (
    <>
      <div className="flex gap-2 my-4 flex-wrap">
        {["All", "Frontend", "Backend", "Tools"].map((c) => (
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
            <i className="block not-italic text-2xl mb-1.5">{t.e}</i>
            {t.n}
          </div>
        ))}
      </div>
    </>
  );
}
