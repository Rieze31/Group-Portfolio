export default function ThemeBtn({ dark, toggle, compact = false, className = "" }) {
  return (
    <button
      type="button"
      className={`tb${compact ? " tb-compact" : ""}${className ? ` ${className}` : ""}`}
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className={dark ? "tb-icon" : "tb-icon moon"} aria-hidden="true">{dark ? "☀" : "☾"}</span>
    </button>
  );
}
