import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { loadMembers } from "./App.jsx";
import { fetchMembers } from "./api.js";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
const msg = (t) => root.render(<p style={{ padding: 24, fontFamily: "system-ui" }}>{t}</p>);

msg("Loading…");
fetchMembers()
  .then((list) => { loadMembers(list); root.render(<App />); })
  .catch((e) => msg("Could not load members (" + e.message + "). Is the Spring Boot backend running on port 8080?"));
