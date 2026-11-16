// Calls the Spring Boot API. In dev, vite.config.js proxies /api to http://localhost:8080.
// In production the React build is served by Spring Boot itself, so /api is the same origin.
export function normalize(m) {
  const parts = m.name.split(" ");
  return {
    id: m.id,
    portfolio: m.portfolio || m.id,
    name: m.name,
    role: m.role,
    loc: m.location,
    quote: m.quote,
    tags: m.tags || [],
    color: m.color,
    bio: m.bio,
    match: m.matchPercent,
    cap: m.caption,
    first: parts[0],
    init: parts.map((w) => w[0]).join("").slice(0, 2),
    projects: m.projects || [],
    slides: (m.slides || []).map((s) => ({ t: s.title, d: s.description, g: s.gradient })),
  };
}

export async function fetchMembers() {
  const res = await fetch("/api/members");
  if (!res.ok) throw new Error("API returned " + res.status);
  return (await res.json()).map(normalize);
}
