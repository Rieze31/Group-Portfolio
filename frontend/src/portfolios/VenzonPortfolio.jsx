import PortfolioPage from "../components/portfolio/PortfolioPage.jsx";

// Rieze Andrei Venzon: edit everything for this portfolio in THIS file.
const DATA = {
  name: "Rieze Andrei Venzon",
  role: "FULL-STACK DEVELOPER",
  color: "#ff6a00",
  bio: "3rd year BSIT student at Pamantasan ng Lungsod ng Maynila, exploring frontend and backend development with React, Spring Boot, Java, and Tailwind.",
  about: [
    "I'm Rieze Andrei Venzon, from Manila City. I'm currently a college student taking up Information Technology at the Pamantasan ng Lungsod ng Maynila. I'm always passionate about exploring new technologies and constantly improving my skills in the field.",
    "I see myself as a future developer working alongside people who build and innovate responsive, thoughtful systems and applications that help the community.",
  ],
  aboutImage: "/photos/venzon/about.png",
  projects: [
    { title: "Cashiering System", image: "/photos/venzon/projects/cashiering.jpg", description: "A cashiering system that streamlines transactions, manages inventory, and generates reports to enhance business operations.", gradient: "linear-gradient(135deg,#1c2a3a,#4a3f2e)", tags: ["VB.NET", "MS Access"], action: { label: "PRIVATE" } },
    { title: "Smart-Track", image: "/photos/venzon/projects/smart-track.png", description: "A grade tracking system that helps students and teachers view and manage grades and classes from their Android phones.", gradient: "linear-gradient(135deg,#0d2b45,#1f6f8b)", tags: ["Java", "Firebase"], action: { label: "PRIVATE" } },
    { title: "Portfolio V1", image: "/photos/venzon/projects/portfolio.PNG", description: "My first personal portfolio showcasing my skills, projects, and the technologies I use, with a short introduction and a way to get in touch.", gradient: "linear-gradient(135deg,#1c2a3a,#4a3f2e)", tags: ["HTML", "CSS", "JavaScript"], action: { label: "LIVE", url: "https://portfolionirieze.vercel.app/" } },
    { title: "TicTacToe", image: "/photos/venzon/projects/tictactoe.png", description: "A fun tic-tac-toe game built from scratch with two-player and versus-AI modes.", gradient: "linear-gradient(135deg,#0d2b45,#1f6f8b)", tags: ["HTML", "CSS", "JavaScript"], action: { label: "LIVE", url: "https://riezevenzon-tictactoe.vercel.app/" } },
    { title: "HangMan", image: "/photos/venzon/projects/hangman-img.png", description: "An interactive word-guessing game where players race to uncover the hidden word before running out of tries.", gradient: "linear-gradient(135deg,#1c2a3a,#4a3f2e)", tags: ["HTML", "CSS", "JavaScript"], action: { label: "LIVE", url: "https://riezevenzon-hangman.vercel.app/" } },
    { title: "Fit X Brawl Gym Scheduling Website", image: "/photos/venzon/projects/fitbrawl.png", description: "A scheduling website for a local gym that allows users to book classes and manage their fitness routines.", gradient: "linear-gradient(135deg,#0d2b45,#1f6f8b)", tags: ["CSS", "JavaScript", "Php", "Xampp", "MySQL"], action: { label: "PRIVATE" } },
    { title: "UHS Online Appointment System", image: "/photos/venzon/projects/uhs.JPG", description: "An online appointment system for the University Health Service that allows students to schedule appointments for medical and dental consultations and services.", gradient: "linear-gradient(135deg,#1c2a3a,#4a3f2e)", tags: ["React.JS", "Tailwind CSS", "Node.js", "Express.js", "PostgreSQL"], action: { label: "LIVE", url: "https://plm-university-health-service-bmgk.onrender.com/" } },
    { title: "Troll Tower Extreme", image: "/photos/venzon/projects/roblox.webp", description: "A Roblox multiplayer game where players navigate through a challenging tower where they can troll each other and compete to reach the top.", gradient: "linear-gradient(135deg,#0d2b45,#1f6f8b)", tags: ["Roblox Studio", "Lua"], action: { label: "LIVE", url: "https://www.roblox.com/games/126593206249920/Troll-Tower-Extreme" } },
    { title: "ResumeFIT", image: "/photos/venzon/projects/resumefit.JPG", description: "A resume to job fit analyzer that allows users to test their resume against their target job roles.", gradient: "linear-gradient(135deg,#0d2b45,#1f6f8b)", tags: ["ReactJS", "Supabase", "TailwindCSS", "Python"], action: { label: "LIVE", url: "https://resumefit-gilt.vercel.app/" } },
  ],
  tools: [
    { n: "HTML", c: "Frontend", e: "🌐", icon: "html5-plain" }, { n: "CSS", c: "Frontend", e: "🎨", icon: "css3-plain" },
    { n: "JavaScript", c: "Frontend", e: "🟨", icon: "javascript-plain" }, { n: "React", c: "Frontend", e: "⚛️", icon: "react-original" },
    { n: "Tailwind CSS", c: "Frontend", e: "🌬️", icon: "tailwindcss-original" }, { n: "Java", c: "Languages", e: "☕", icon: "java-plain" },
    { n: "C#", c: "Languages", e: "🟪", icon: "csharp-plain" }, { n: "C++", c: "Languages", e: "🔷", icon: "cplusplus-plain" },
    { n: "VB.NET", c: "Languages", e: "🟣", icon: "dotnetcore-plain" }, { n: "Lua", c: "Languages", e: "🌙", icon: "lua-plain" },
    { n: "Node.js", c: "Backend", e: "🟩", icon: "nodejs-plain" }, { n: "Express.js", c: "Backend", e: "🚂", icon: "express-original" },
    { n: "PHP", c: "Backend", e: "🐘", icon: "php-plain" }, { n: "Firebase", c: "Backend", e: "🔥", icon: "firebase-plain" },
    { n: "PostgreSQL", c: "Databases", e: "🐘", icon: "postgresql-plain" }, { n: "MS Access", c: "Databases", e: "📊" },
    { n: "Android Studio", c: "Tools", e: "🤖", icon: "androidstudio-plain" }, { n: "Visual Studio", c: "Tools", e: "🟪", icon: "visualstudio-plain" },
    { n: "VS Code", c: "Tools", e: "💻", icon: "vscode-plain" }, { n: "Git", c: "Tools", e: "🔀", icon: "git-plain" },
    { n: "XAMPP", c: "Tools", e: "🛠️" }, { n: "Roblox Studio", c: "Game Dev", e: "🎮" },
    { n: "Spring Boot", c: "Backend", e: "🍃", icon: "spring-original" }, { n: "Figma", c: "Tools", e: "🎨", icon: "figma-plain" },
  ],
  slides: [
    { t: "Coding sessions", d: "Late nights exploring Java, Spring Boot, and React.", g: "linear-gradient(160deg,#ff6a00,#2b2622)" },
    { t: "Campus life", d: "3rd year BSIT student at Pamantasan ng Lungsod ng Maynila.", g: "linear-gradient(160deg,#0f6b5c,#6fcf97)" },
    { t: "Off the clock", d: "What I do for fun.", g: "linear-gradient(160deg,#2d8de0,#9b8cff)" },
  ],
  headFolder: "./photos/venzon",
  portrait: "/photos/venzon/portrait.png",
  headBackText: "kalabitin mo ko",
};

export default function VenzonPortfolio(props) {
  return <PortfolioPage data={DATA} {...props} />;
}
