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
  bio: "I'm just a regular girl with big dreams and big hopes, hunney.",
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
  aboutSlides: [
    { t: "Campus Life at PLM", image: "/images/campus-life.jpg", d: "“I entered PLM as a BSIT student who simply loved design—not knowing yet that true IT is rooted in empathy for the user.” Loving every moment of campus life while learning to build software that truly understands people." },
    { t: "Art & UI/UX Design", image: "/images/art-uiux.jpg", d: "During the pandemic, I discovered that I actually know how to draw and paint. That creative spark became my superpower—now I naturally step into the UI/UX designer role in every project we build." },
    { t: "Skills & Teamwork", image: "/images/skills-vibe.jpg", d: "Behind the visuals, I'm big on analytical thinking, problem-solving, time management, and being meticulous with every detail—while always making sure I can easily vibe and collaborate with everyone on the team." },
    { t: "Childhood dreams", image: "/images/childhood-1.jpg", d: "Ever since I was a kid, I really liked makeup, art, and dressing up—playing with colors and aesthetics long before I realized that same eye for styling and visual detail is what connects straight into UI/UX design." },
    { t: "The real outfit", image: "/images/childhood-2.jpg", d: "I'm kidding—I wasn't actually blonde and I didn't wear that dress. But I really love makeup though!" },
    { t: "No smile", image: "/images/childhood-3.jpg", d: "I wasn't actually smiling." },
    { t: "Sorry", image: "/images/childhood-4.jpg", d: "I'm so sorry." },
  ],
  slides: [
    { t: "Campus Life at PLM", image: "/images/campus-life.jpg", d: "" },
    { t: "Art & UI/UX Design", image: "/images/art-uiux.jpg", d: "" },
    { t: "Skills & Teamwork", image: "/images/skills-vibe.jpg", d: "" },
    { t: "Childhood dreams", image: "/images/childhood-1.jpg", d: "" },
    { t: "The real outfit", image: "/images/childhood-2.jpg", d: "" },
    { t: "No smile", image: "/images/childhood-3.jpg", d: "" },
    { t: "Sorry", image: "/images/childhood-4.jpg", d: "" },
  ],
};

export default function SantosPortfolio(props) {
  return <PortfolioPage data={DATA} {...props} />;
}
