import PortfolioPage from "../components/portfolio/PortfolioPage.jsx";

// Used for any card without its own file. Content comes from the API (DataSeeder.java).
export default function GenericPortfolio(props) {
  const m = props.member;
  const data = {
    name: m.name,
    role: m.role,
    color: m.color,
    bio: m.bio,
    projects: m.projects.map((p) => ({ ...p, tags: m.tags.slice(0, 2) })),
    tools: m.tags.map((t) => ({ n: t, c: "Tools", e: "✦" })),
    slides: m.slides,
  };
  return <PortfolioPage data={data} {...props} />;
}
