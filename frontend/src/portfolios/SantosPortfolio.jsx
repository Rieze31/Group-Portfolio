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
    {
      title: "A Web-Based Order Management and Service Reservation System with Predictive Analytics for Ermel’s Glass and Aluminum Works.",
      description: "A web-based system for managing orders and service reservations, with predictive analytics for Ermel’s Glass and Aluminum Works.",
      image: "./ermels-glass-aluminum.png",
      gradient: "linear-gradient(135deg,#2a1b4a,#7b5ea7)",
      tags: ["Figma", "Canva", "React"],
    },
    {
      title: "DiaBeates: Web-Based Diabetes Complication Risk Assessment System Using Rule-Based Scoring and Calibrated Machine Learning Models",
      description: "A web-based tool for assessing diabetes complication risk using rule-based scoring and calibrated machine-learning models.",
      image: "./diabeates-risk-assessment.png",
      imagePosition: "center top",
      gradient: "linear-gradient(135deg,#3a1b3f,#b45bd6)",
      tags: ["JavaScript", "HTML", "CSS"],
    },
    {
      title: "FitXBrawl: A Gym Scheduling Management Website for Fit X Brawl Gym",
      description: "A website for managing gym scheduling at Fit X Brawl Gym.",
      image: "./fitxbrawl-home.png",
      imagePosition: "center top",
      gradient: "linear-gradient(135deg,#1b3a35,#458a72)",
      tags: ["JavaScript", "HTML", "CSS"],
    },
  ],
  tools: [
    { n: "React", c: "Frontend", e: "⚛️" },
    { n: "HTML", c: "Frontend", e: "🌐" },
    { n: "CSS", c: "Frontend", e: "🎨" },
    { n: "JavaScript", c: "Frontend", e: "⚡" },
    { n: "Supabase", c: "Backend", e: "🟢" },
    { n: "Python", c: "Backend", e: "🐍" },
    { n: "Figma", c: "Tools", e: "🎨" },
    { n: "Canva", c: "Tools", e: "🖌️" },
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
