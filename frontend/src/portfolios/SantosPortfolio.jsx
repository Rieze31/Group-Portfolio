import PortfolioPage from "../components/portfolio/PortfolioPage.jsx";

// Althea Lei Santos: edit everything for this portfolio in THIS file.
// (Placeholder content: replace the role, bio, projects, tools and slides with your own.)
const DATA = {
  name: "Althea Lei Santos",
  role: "BSIT STUDENT",
  color: "#9b5de5",
  onAcc: "#ffffff",
  bio: "Portfolio coming soon. Replace this text with your story.",
  projects: [
    { title: "Project A", description: "Details coming soon.", gradient: "linear-gradient(135deg,#2a1b4a,#7b5ea7)", tags: ["Figma"] },
    { title: "Project B", description: "Details coming soon.", gradient: "linear-gradient(135deg,#3a1b3f,#b45bd6)", tags: ["React"] },
  ],
  tools: [
    { n: "Figma", c: "Tools", e: "🎨" }, { n: "React", c: "Frontend", e: "⚛️" },
    { n: "Git", c: "Tools", e: "🔀" },
  ],
  slides: [
    { t: "Workspace", d: "Where the work happens.", g: "linear-gradient(160deg,#9b5de5,#2b2622)" },
    { t: "Campus life", d: "Life between classes.", g: "linear-gradient(160deg,#0f6b5c,#6fcf97)" },
    { t: "Off the clock", d: "What I do for fun.", g: "linear-gradient(160deg,#f15bb5,#ffb347)" },
  ],
};

export default function SantosPortfolio(props) {
  return <PortfolioPage data={DATA} {...props} />;
}
