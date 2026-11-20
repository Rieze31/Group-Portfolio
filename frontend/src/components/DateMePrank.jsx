import { useEffect, useRef, useState } from "react";

function createHearts() {
  return Array.from({ length: 40 }, (_, id) => ({
    id,
    left: Math.random() * 100,
    size: 18 + Math.random() * 26,
    delay: Math.random() * 1,
    duration: 2 + Math.random() * 3,
  }));
}

export default function DateMePrank({ member, onOpenPortfolio, onStartMusic }) {
  const [noClickCount, setNoClickCount] = useState(0);
  const [noPosition, setNoPosition] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [showPortfolioButton, setShowPortfolioButton] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [musicError, setMusicError] = useState("");
  const noButtonRef = useRef(null);

  useEffect(() => {
    if (!accepted) return undefined;
    const portfolioTimer = window.setTimeout(() => setShowPortfolioButton(true), 2500);
    const heartsTimer = window.setTimeout(() => setHearts([]), 5000);
    return () => {
      window.clearTimeout(portfolioTimer);
      window.clearTimeout(heartsTimer);
    };
  }, [accepted]);

  const moveNoButton = () => {
    const buttonHeight = noButtonRef.current?.getBoundingClientRect().height || 48;
    const width = Math.min(220, Math.max(0, window.innerWidth - 24));
    const maxLeft = Math.max(12, window.innerWidth - width - 12);
    const maxTop = Math.max(12, window.innerHeight - buttonHeight - 12);
    setNoPosition({
      left: 12 + Math.random() * (maxLeft - 12),
      top: 12 + Math.random() * (maxTop - 12),
    });
  };

  const handleNo = () => {
    const nextCount = noClickCount + 1;
    setNoClickCount(nextCount);
    if (nextCount >= 4 && nextCount < 15) moveNoButton();
  };

  const handleYes = () => {
    setAccepted(true);
    setHearts(createHearts());
    if (onStartMusic) {
      onStartMusic().catch(() => {
        setMusicError("The music could not be played. Check that the audio file is available.");
      });
    }
  };

  const yesFontSize = noClickCount >= 3 ? 56 : noClickCount === 2 ? 40 : noClickCount === 1 ? 28 : 18;
  const noFontSize = noClickCount >= 3 ? 7 : noClickCount === 2 ? 10 : 18;
  const caption = noClickCount >= 15
    ? "Oh No! You broke the button :c"
    : noClickCount >= 10 ? "Are you sure?" : "";

  return (
    <main className="date-prank-screen">
      <section className={`date-prank-card${accepted ? " is-accepted" : ""}`} role="dialog" aria-modal="true" aria-label="Would you like to see my portfolio?">
        {accepted ? (
          <>
            <div className="date-prank-message" aria-live="polite">ayiee lezgooo</div>
            {musicError && <p className="date-prank-music-error" role="alert">{musicError}</p>}
          </>
        ) : (
          <>
            <h1 className="date-prank-heading">Would you like to see my portfolio?</h1>
            <div className="date-prank-buttons">
              <button
                className="date-prank-yes"
                style={{ fontSize: `${yesFontSize}px` }}
                onClick={handleYes}
              >YES</button>
              <div
                className={`date-prank-no-wrap${noPosition ? " is-moving" : ""}`}
                style={noPosition ? { left: `${noPosition.left}px`, top: `${noPosition.top}px` } : undefined}
              >
                <button
                  ref={noButtonRef}
                  className="date-prank-no"
                  style={{ fontSize: `${noFontSize}px` }}
                  onClick={handleNo}
                  disabled={noClickCount >= 15}
                >NO</button>
                <div className="date-prank-caption" aria-live="polite">{caption}</div>
              </div>
            </div>
          </>
        )}
        {showPortfolioButton && (
          <button className="date-prank-portfolio" onClick={() => onOpenPortfolio(member.id)}>
            Open my portfolio
          </button>
        )}
      </section>
      {hearts.length > 0 && (
        <div className="date-prank-heart-field" aria-hidden="true">
          {hearts.map((heart) => (
            <span
              className="date-prank-heart"
              key={heart.id}
              style={{
                left: `${heart.left}%`,
                fontSize: `${heart.size}px`,
                animationDelay: `${heart.delay}s`,
                animationDuration: `${heart.duration}s`,
              }}
            >♥</span>
          ))}
        </div>
      )}
    </main>
  );
}
