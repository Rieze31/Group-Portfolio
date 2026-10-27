import Stack from "./Stack.jsx";
import ThemeBtn from "./ThemeBtn.jsx";
import { members } from "../state/members.js";
import { PORTFOLIOS } from "../portfolios/index.js";

export default function Landing({ go, order, setOrder, dark, toggle }) {
  const withPortfolio = members().filter((m) => PORTFOLIOS[m.id]);
  return (
    <main className="relative min-h-screen grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-12 items-center max-w-[1180px] mx-auto px-5 sm:px-8 pt-[88px] pb-12">
      {/* Top bar — always visible, pinned to top of the main container */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-5 sm:px-8 py-5">
        <span className="text-[11px] tracking-[.08em]" style={{ fontFamily: "var(--mono)" }}>CTPR CLUB</span>
        <ThemeBtn dark={dark} toggle={toggle} />
      </div>

      {/* Left copy */}
      <div className="text-center md:text-left">
        <div className="text-[11px] tracking-[.08em]" style={{ fontFamily: "var(--mono)" }}>
          A VERY SERIOUS CODING COLLECTIVE
        </div>
        <h1
          className="font-medium mt-4 tracking-tight leading-[.92]"
          style={{ fontSize: "clamp(42px,7.6vw,108px)", fontFamily: "var(--sans)" }}
        >
          Find your<br />dev <em>match.</em>
        </h1>
        <p
          className="mt-5 mx-auto md:mx-0 max-w-[430px] leading-relaxed text-[16px] sm:text-[17px]"
          style={{ color: "var(--mute)" }}
        >
          Eight charming profiles. Four real portfolios. Zero awkward coffee
          chats. Swipe through the people behind the pixels.
        </p>
      </div>

      {/* Card stack — centred on mobile */}
      <div className="flex justify-center md:justify-end">
        <Stack go={go} order={order} setOrder={setOrder} />
      </div>
    </main>
  );
}
