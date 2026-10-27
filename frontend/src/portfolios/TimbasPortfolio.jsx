import PortfolioPage from "../components/portfolio/PortfolioPage.jsx";

// Carlo Timbas: edit everything for this portfolio in THIS file.
const DATA = {
  name: "Carlo Timbas",
  role: "FULL-STACK DEVELOPER",
  color: "#0f6b5c",
  onAcc: "#ffffff",
  bio: "3rd year BSIT student at Pamantasan ng Lungsod ng Maynila, exploring web development with Java, Spring Boot, and UI/UX with React.",
  projects: [
    { title: "Project A", description: "A scalable backend with automated deployments. Details coming soon.", gradient: "linear-gradient(135deg,#0b3d3a,#2f8f83)", tags: ["Java", "Spring Boot"] },
    { title: "Project B", description: "A React interface on top of a Java API. Details coming soon.", gradient: "linear-gradient(135deg,#123a5c,#3b7ea1)", tags: ["React", "Java"] },
  ],
  tools: [
    { n: "Java", c: "Backend", e: "☕" }, { n: "Spring Boot", c: "Backend", e: "🍃" },
    { n: "React", c: "Frontend", e: "⚛️" }, { n: "Tailwind", c: "Frontend", e: "🌬️" },
    { n: "Git", c: "Tools", e: "🔀" }, { n: "Figma", c: "Tools", e: "🎨" },
  ],
  slides: [
    { t: "Workspace", d: "Where the work happens.", g: "linear-gradient(160deg,#0f6b5c,#2b2622)" },
    { t: "Campus life", d: "Life between classes at PLM.", g: "linear-gradient(160deg,#2d8de0,#6fcf97)" },
    { t: "Off the clock", d: "What I do for fun.", g: "linear-gradient(160deg,#ff6a00,#ffb347)" },
  ],
};

export default function TimbasPortfolio(props) {
  return <PortfolioPage data={DATA} {...props} />;
}
