import { useEffect, useState } from "react";
import { members } from "../state/members.js";

// Route = "home" or a portfolio id (kept in the URL hash, e.g. #venzon)
export default function useRoute() {
  const get = () => {
    const h = location.hash.replace("#", "");
    const m = members().find((x) => x.id === h);
    return m ? m.portfolio : "home";   // #bella opens the same page as #garcia
  };
  const [route, setRoute] = useState(get);
  useEffect(() => {
    const f = () => { setRoute(get()); scrollTo(0, 0); };
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);
  const go = (to) => { setRoute(to); scrollTo(0, 0); try { location.hash = to; } catch (e) {} };
  return [route, go];
}