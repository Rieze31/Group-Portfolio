import PortfolioPage from "../components/portfolio/PortfolioPage.jsx";

// Rieze Andrei Venzon: edit everything for this portfolio in THIS file.
const DATA = {
  name: "Rieze Andrei Venzon",
  role: "FULL-STACK DEVELOPER",
  color: "#ff6a00",
  bio: "3rd year BSIT student at Pamantasan ng Lungsod ng Maynila, exploring frontend and backend development with React, Spring Boot, Java, and Tailwind.",
  projects: [
    { title: "Project A", description: "React frontend with a Spring Boot backend. Details coming soon.", gradient: "linear-gradient(135deg,#1c2a3a,#4a3f2e)", tags: ["React", "Spring Boot"] },
    { title: "Project B", description: "Built with React and Spring Boot. Details coming soon.", gradient: "linear-gradient(135deg,#0d2b45,#1f6f8b)", tags: ["React", "Spring Boot"] },
  ],
  tools: [
    { n: "Java", c: "Backend", e: "☕" }, { n: "Spring Boot", c: "Backend", e: "🍃" },
    { n: "React", c: "Frontend", e: "⚛️" }, { n: "Tailwind", c: "Frontend", e: "🌬️" },
    { n: "Git", c: "Tools", e: "🔀" }, { n: "Figma", c: "Tools", e: "🎨" },
  ],
  slides: [
    { t: "Coding sessions", d: "Late nights exploring Java, Spring Boot, and React.", g: "linear-gradient(160deg,#ff6a00,#2b2622)" },
    { t: "Campus life", d: "3rd year BSIT student at Pamantasan ng Lungsod ng Maynila.", g: "linear-gradient(160deg,#0f6b5c,#6fcf97)" },
    { t: "Off the clock", d: "What I do for fun.", g: "linear-gradient(160deg,#2d8de0,#9b8cff)" },
  ],
  headFolder: "./photos/venzon",
  headBackText: "kalabitin mo ko",
};

export default function VenzonPortfolio(props) {
  return <PortfolioPage data={DATA} {...props} />;
}
