import PortfolioPage from "../components/portfolio/PortfolioPage.jsx";

// Althea Lei Santos: edit everything for this portfolio in THIS file.
// (Placeholder content: replace the role, bio, projects, tools and slides with your own.)
const DATA = {
  name: "Althea Lei Santos",
  role: "BSIT STUDENT",
  color: "#FFDB5B",
  onAcc: "#3B3B3B",
  headPhoto: "/althea-main.jpg",
  peekPortrait: "/althea-peeking.png",
  bio: "Portfolio coming soon. Replace this text with your story.",
  projects: [
    {
      title: "A Web-Based Order Management and Service Reservation System with Predictive Analytics for Ermel’s Glass and Aluminum Works.",
      description: "A web-based system for managing orders and service reservations, with predictive analytics for Ermel’s Glass and Aluminum Works.",
      image: "./ermels-glass-aluminum.png",
      gradient: "linear-gradient(135deg,#3B3B3B,#FFDB5B)",
      tags: ["Figma", "Canva", "React"],
    },
    {
      title: "DiaBeates: Web-Based Diabetes Complication Risk Assessment System Using Rule-Based Scoring and Calibrated Machine Learning Models",
      description: "A web-based tool for assessing diabetes complication risk using rule-based scoring and calibrated machine-learning models.",
      image: "./diabeates-risk-assessment.png",
      imagePosition: "center top",
      gradient: "linear-gradient(135deg,#000000,#3B3B3B)",
      tags: ["JavaScript", "HTML", "CSS"],
    },
    {
      title: "FitXBrawl: A Gym Scheduling Management Website for Fit X Brawl Gym",
      description: "A website for managing gym scheduling at Fit X Brawl Gym.",
      image: "./fitxbrawl-home.png",
      imagePosition: "center top",
      gradient: "linear-gradient(135deg,#3B3B3B,#000000)",
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
    { t: "Workspace", d: "Where the work happens.", g: "linear-gradient(160deg,#FFDB5B,#3B3B3B)" },
    { t: "Campus life", d: "Life between classes.", g: "linear-gradient(160deg,#3B3B3B,#000000)" },
    { t: "Off the clock", d: "What I do for fun.", g: "linear-gradient(160deg,#FFDB5B,#000000)" },
  ],
};

export default function SantosPortfolio(props) {
  return <PortfolioPage data={DATA} {...props} />;
}
