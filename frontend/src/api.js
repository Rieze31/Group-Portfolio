// Calls the Spring Boot API. In dev, vite.config.js proxies /api to http://localhost:8080.
// In production the React build is served by Spring Boot itself, so /api is the same origin.
const paletteColors = {
  "#ff6a4d": "#EEA233",
  "#e9b93c": "#FFB915",
  "#7fb2e8": "#003F66",
  "#7cc99a": "#002A45",
  "#b49cf0": "#FFD358",
  "#f29bb6": "#001B2B",
  "#3fb0a6": "#003F66",
  "#ffa24d": "#FFB915",
  "#0f6b5c": "#003F66",
  "#6fcf97": "#FFD358",
  "#2d8de0": "#003F66",
  "#9b8cff": "#002A45",
  "#1c2a3a": "#002A45",
  "#4a3f2e": "#FFB915",
  "#0d2b45": "#001B2B",
  "#1f6f8b": "#003F66",
  "#2b2622": "#001B2B",
};
const cardColors = ["#EEA233", "#003F66", "#FFD358", "#002A45"];
const paletteColor = (color) => paletteColors[color.toLowerCase()] || color;
const paletteTextColor = (color) =>
  ["#003f66", "#002a45", "#001b2b"].includes(color.toLowerCase()) ? "#fff" : "#151515";

export function normalize(m, index) {
  const name = m.id === "m4" ? "Piolo Pascual" : m.name;
  const parts = name.split(" ");
  const color = cardColors[index % cardColors.length];
  return {
    id: m.id,
    name,
    role: m.role,
    loc: m.location,
    quote: m.quote,
    tags: m.tags || [],
    color,
    textColor: paletteTextColor(color),
    photoUrl: m.id === "dwight" ? "/dwight-ramos.png" : m.id === "m2" ? "/member-rose.jpg" : m.id === "m3" ? "/bela-padilla.jpg" : m.id === "m4" ? "/piolo.jpg" : null,
    bio: m.bio,
    match: m.matchPercent,
    cap: m.caption,
    first: parts[0],
    init: parts.map((w) => w[0]).join("").slice(0, 2),
    projects: m.projects || [],
    slides: (m.slides || []).map((s) => ({
      t: s.title,
      d: s.description,
      g: s.gradient.replace(/#[0-9a-f]{6}/gi, paletteColor),
    })),
  };
}

export async function fetchMembers() {
  const res = await fetch("/api/members");
  if (!res.ok) throw new Error("API returned " + res.status);
  return (await res.json()).slice(0, cardColors.length).map(normalize);
}
