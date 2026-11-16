// The light-mode flashbang + sunshine meme
export default function Flash({ onDone }) {
  return (
    <div className="flash" onClick={onDone} onAnimationEnd={(e) => e.target === e.currentTarget && onDone()}>
      <img src="./sunshine.png" alt="Sunshine meme" />
      <span>Light mode activated. Sorry for your eyes. ☀️</span>
    </div>
  );
}
