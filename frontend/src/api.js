// Calls the Spring Boot API. In dev, vite.config.js proxies /api to http://localhost:8080.
// In production the React build is served by Spring Boot itself, so /api is the same origin.
<<<<<<< Updated upstream
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
=======
const photos = {
  dwight: "./dwight-ramos.png",
  bella: "./bela-padilla.jpg",
  liza: "./member-rose.jpg",
  donny: "./piolo.jpg",
};

export function normalize(m) {
  const parts = m.name.split(" ");
>>>>>>> Stashed changes
  return {
    id: m.id,
    portfolio: m.portfolio || m.id,
    name: m.name,
    role: m.role,
    loc: m.location,
    quote: m.quote,
    tags: m.tags || [],
<<<<<<< Updated upstream
    color,
    textColor: paletteTextColor(color),
    photoUrl: m.id === "dwight" ? "/dwight-ramos.png" : m.id === "m2" ? "/member-rose.jpg" : m.id === "m3" ? "/bela-padilla.jpg" : m.id === "m4" ? "/piolo.jpg" : null,
=======
    color: m.color,
    photoUrl: photos[m.id] || m.photoUrl || null,
>>>>>>> Stashed changes
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

const FALLBACK_MEMBERS = [
  {
    id: "garcia",
    portfolio: "garcia",
    name: "Phiona Garcia",
    role: "BSIT STUDENT",
    location: "Manila, PH",
    quote: "Portfolio inside. Tap to open.",
    color: "#7fb2e8",
    caption: "PORTFOLIO INSIDE",
    matchPercent: 98,
    bio: "Portfolio coming soon. Replace this text with your story.",
    tags: ["React", "Java", "Git"],
    projects: [
      { title: "Project A", description: "React frontend. Details coming soon.", gradient: "linear-gradient(135deg,#1c2a3a,#4a3f2e)" },
      { title: "Project B", description: "Built with React and Java. Details coming soon.", gradient: "linear-gradient(135deg,#0d2b45,#1f6f8b)" },
    ],
    slides: [
      { title: "Workspace", description: "Where the work happens.", gradient: "linear-gradient(160deg,#7fb2e8,#2b2622)" },
      { title: "Campus life", description: "Life between classes.", gradient: "linear-gradient(160deg,#2d8de0,#9b8cff)" },
      { title: "Off the clock", description: "What I do for fun.", gradient: "linear-gradient(160deg,#003f66,#002a45)" },
    ],
  },
  {
    id: "santos",
    portfolio: "santos",
    name: "Althea Lei Santos",
    role: "BSIT STUDENT",
    location: "Manila, PH",
    quote: "Portfolio inside. Tap to open.",
    color: "#b49cf0",
    caption: "PORTFOLIO INSIDE",
    matchPercent: 96,
    bio: "Portfolio coming soon. Replace this text with your story.",
    tags: ["Figma", "React", "Git"],
    projects: [
      { title: "Project A", description: "Figma frontend. Details coming soon.", gradient: "linear-gradient(135deg,#1c2a3a,#4a3f2e)" },
      { title: "Project B", description: "Built with Figma and React. Details coming soon.", gradient: "linear-gradient(135deg,#0d2b45,#1f6f8b)" },
    ],
    slides: [
      { title: "Workspace", description: "Where the work happens.", gradient: "linear-gradient(160deg,#b49cf0,#2b2622)" },
      { title: "Campus life", description: "Life between classes.", gradient: "linear-gradient(160deg,#2d8de0,#9b8cff)" },
      { title: "Off the clock", description: "What I do for fun.", gradient: "linear-gradient(160deg,#003f66,#002a45)" },
    ],
  },
  {
    id: "timbas",
    portfolio: "timbas",
    name: "Carlo Timbas",
    role: "FULL-STACK DEVELOPER",
    location: "Manila, PH",
    quote: "Portfolio inside. Tap to open.",
    color: "#3fb0a6",
    caption: "PORTFOLIO INSIDE",
    matchPercent: 94,
    bio: "Portfolio coming soon. Replace this text with your story.",
    tags: ["Java", "Spring Boot", "React"],
    projects: [
      { title: "Project A", description: "Java frontend. Details coming soon.", gradient: "linear-gradient(135deg,#1c2a3a,#4a3f2e)" },
      { title: "Project B", description: "Built with Java and Spring Boot. Details coming soon.", gradient: "linear-gradient(135deg,#0d2b45,#1f6f8b)" },
    ],
    slides: [
      { title: "Workspace", description: "Where the work happens.", gradient: "linear-gradient(160deg,#3fb0a6,#2b2622)" },
      { title: "Campus life", description: "Life between classes.", gradient: "linear-gradient(160deg,#2d8de0,#9b8cff)" },
      { title: "Off the clock", description: "What I do for fun.", gradient: "linear-gradient(160deg,#003f66,#002a45)" },
    ],
  },
  {
    id: "venzon",
    portfolio: "venzon",
    name: "Rieze Andrei Venzon",
    role: "FULL-STACK DEVELOPER",
    location: "Manila, PH",
    quote: "Portfolio inside. Tap to open.",
    color: "#ff6a4d",
    caption: "OPEN TO AMBITIOUS PROBLEMS",
    matchPercent: 92,
    bio: "Portfolio coming soon. Replace this text with your story.",
    tags: ["React", "Spring Boot", "Java"],
    projects: [
      { title: "Project A", description: "React frontend. Details coming soon.", gradient: "linear-gradient(135deg,#1c2a3a,#4a3f2e)" },
      { title: "Project B", description: "Built with React and Spring Boot. Details coming soon.", gradient: "linear-gradient(135deg,#0d2b45,#1f6f8b)" },
    ],
    slides: [
      { title: "Workspace", description: "Where the work happens.", gradient: "linear-gradient(160deg,#ff6a4d,#2b2622)" },
      { title: "Campus life", description: "Life between classes.", gradient: "linear-gradient(160deg,#2d8de0,#9b8cff)" },
      { title: "Off the clock", description: "What I do for fun.", gradient: "linear-gradient(160deg,#003f66,#002a45)" },
    ],
  },
  {
    id: "bella",
    portfolio: "garcia",
    name: "Bella Padilla",
    role: "MYSTERY GUEST",
    location: "Manila, PH",
    quote: "Same name energy, different portfolio.",
    color: "#f29bb6",
    caption: "PORTFOLIO INSIDE",
    matchPercent: 90,
    bio: "Portfolio coming soon. Replace this text with your story.",
    tags: ["Surprise", "Plot twist", "Open me"],
    projects: [],
    slides: [],
  },
  {
    id: "liza",
    portfolio: "santos",
    name: "Liza Soberano",
    role: "MYSTERY GUEST",
    location: "Manila, PH",
    quote: "Is it who you think? Only one way to find out.",
    color: "#e9b93c",
    caption: "PORTFOLIO INSIDE",
    matchPercent: 88,
    bio: "Portfolio coming soon. Replace this text with your story.",
    tags: ["Surprise", "Plot twist", "Open me"],
    projects: [],
    slides: [],
  },
  {
    id: "donny",
    portfolio: "timbas",
    name: "Donny Pangilinan",
    role: "MYSTERY GUEST",
    location: "Manila, PH",
    quote: "Do not judge a card by its name.",
    color: "#7cc99a",
    caption: "PORTFOLIO INSIDE",
    matchPercent: 86,
    bio: "Portfolio coming soon. Replace this text with your story.",
    tags: ["Surprise", "Plot twist", "Open me"],
    projects: [],
    slides: [],
  },
  {
    id: "dwight",
    portfolio: "venzon",
    name: "Dwight Ramos",
    role: "MYSTERY GUEST",
    location: "Manila, PH",
    quote: "Plot twist: not who you think. Click to find out.",
    color: "#ffa24d",
    caption: "PORTFOLIO INSIDE",
    matchPercent: 84,
    bio: "Portfolio coming soon. Replace this text with your story.",
    tags: ["Surprise", "Plot twist", "Open me"],
    projects: [],
    slides: [],
  },
];

export async function fetchMembers() {
  const res = await fetch("/api/members");
  if (!res.ok) throw new Error("API returned " + res.status);
  return (await res.json()).slice(0, cardColors.length).map(normalize);
}
