import { useEffect, useState } from "react";
import useRoute from "./hooks/useRoute.js";
import { members } from "./state/members.js";
import Landing from "./components/Landing.jsx";
import Flash from "./components/Flash.jsx";
import GenericPortfolio from "./portfolios/GenericPortfolio.jsx";
import { PORTFOLIOS } from "./portfolios/index.js";

export default function App() {
  const M = members();
  const [route, go] = useRoute();
  const [order, setOrder] = useState(M.map((_, i) => i));
  const [dark, setDark] = useState(() => matchMedia("(prefers-color-scheme: dark)").matches);
  const [fk, setFk] = useState(0);
  useEffect(() => { document.documentElement.setAttribute("data-theme", dark ? "dark" : "light"); }, [dark]);
  const toggle = () => { if (dark) { setDark(false); setFk((k) => k + 1); } else setDark(true); };

  // the real cards (a joke card like "Bella Padilla" just points at one of these)
  const real = M.filter((x) => x.portfolio === x.id);
  const i = real.findIndex((x) => x.id === route);
  const member = real[i];
  const Page = member && (PORTFOLIOS[member.id] || GenericPortfolio);

  return (
    <>
      {fk > 0 && <Flash key={fk} onDone={() => setFk(0)} />}
      {member
        ? <Page key={member.id} member={member} next={real[(i + 1) % real.length]} go={go} dark={dark} toggle={toggle} />
        : <Landing go={go} order={order} setOrder={setOrder} dark={dark} toggle={toggle} />}
    </>
  );
}