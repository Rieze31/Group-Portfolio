export default function ThemeBtn({ dark, toggle }) {
  return (
    <button
      onClick={toggle}
      className="bg-transparent border border-[var(--line)] text-[var(--ink)] rounded-full px-3 py-1 text-[11px] cursor-pointer hover:border-[var(--acc)] transition-colors"
      style={{ fontFamily: "var(--mono)" }}
    >
      {dark ? "☀️ LIGHT" : "🌙 DARK"}
    </button>
  );
}
