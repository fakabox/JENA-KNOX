import { Play, Share2 } from 'lucide-react';

const previewTracks = ['Play Dead', 'No Sleep for the Brave', 'Paranoïa'];

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-glow" aria-hidden="true" />
        <nav className="nav-shell" aria-label="Primary navigation">
          <a className="wordmark" href="#top" aria-label="Jena Knox — home">
            JENA KNOX
          </a>
          <button className="share-pill" type="button">
            <Share2 size={16} aria-hidden="true" />
            Share
          </button>
        </nav>

        <div className="hero-grid">
          <figure className="cover-wrap">
            <img
              className="cover"
              src="/jena-knox-cover.jpg"
              alt="What Happened to the Fun album cover by Jena Knox"
            />
          </figure>

          <div className="hero-copy">
            <p className="eyebrow">THE NEW ALBUM · 15 TRACKS</p>
            <h1>What Happened<br />to the Fun</h1>
            <p className="intro">
              Fifteen songs caught between after-hours electricity, restless
              nights and the moment the mirror ball starts to crack.
            </p>
            <a className="primary-action" href="#tracklist">
              <Play size={17} fill="currentColor" aria-hidden="true" />
              Listen to the previews
            </a>
          </div>
        </div>
      </section>

      <section className="track-section" id="tracklist">
        <div className="section-heading">
          <div>
            <p className="eyebrow orange">TRACKLIST</p>
            <h2>Hear the album</h2>
          </div>
          <p>Short previews, played in album order.</p>
        </div>

        <div className="track-list">
          {previewTracks.map((title, index) => (
            <button className="track-row" type="button" key={title}>
              <span className="track-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="track-title">{title}</span>
              <span className="play-icon" aria-hidden="true"><Play size={18} fill="currentColor" /></span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
