const tracks = [
  { title: 'Play Dead', file: 'audio/01-play-dead.mp3' },
  { title: 'No Sleep for the Brave', file: 'audio/02-no-sleep-for-the-brave.mp3' },
  { title: 'Paranoïa', file: 'audio/03-paranoia.mp3' },
  { title: 'Just One More', file: 'audio/04-just-one-more.mp3' },
  { title: 'When Heaven Breaks', file: 'audio/05-when-heaven-breaks.mp3' },
  { title: 'Night Game', file: 'audio/06-night-game.mp3' },
  { title: 'Still Mine', file: 'audio/07-still-mine.mp3' },
  { title: 'No Tomorrow Club', file: 'audio/08-no-tomorrow-club.mp3' },
  { title: 'What Happened to the Fun', file: 'audio/09-what-happened-to-the-fun.mp3' },
  { title: 'Master of the Night', file: 'audio/10-master-of-the-night.mp3' },
  { title: 'Disco Balls Versus Drones', file: 'audio/11-disco-balls-versus-drones.mp3' },
  { title: 'Déjà Vu', file: 'audio/12-deja-vu.mp3' },
  { title: 'I See You', file: 'audio/13-i-see-you.mp3' },
  { title: 'We Make It Human', file: 'audio/14-we-make-it-human.mp3' },
  { title: 'The Pulse', file: 'audio/15-the-pulse.mp3' },
];

// Add live services here when the album is released.
const platforms = [];
const audioVersion = '20260923-1';

const icons = {
  play: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m8 5 11 7-11 7Z"></path></svg>',
  pause: '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="7" y="5" width="3.5" height="14" rx="1"></rect><rect x="13.5" y="5" width="3.5" height="14" rx="1"></rect></svg>',
};

const audio = new Audio();
audio.preload = 'metadata';

let currentIndex = -1;
let isPlaying = false;

const trackList = document.querySelector('#track-list');
const nowPlaying = document.querySelector('#now-playing');
const playerNumber = document.querySelector('#player-number');
const playerTitle = document.querySelector('#player-title');
const playerPlay = document.querySelector('#player-play');
const previousButton = document.querySelector('#previous-button');
const nextButton = document.querySelector('#next-button');
const closeButton = document.querySelector('#player-close');
const elapsed = document.querySelector('#elapsed');
const duration = document.querySelector('#duration');
const timeline = document.querySelector('#timeline');
const timelineProgress = document.querySelector('#timeline-progress');

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

function rowFor(index) {
  return trackList.querySelector(`[data-index="${index}"]`);
}

function renderTracks() {
  const fragment = document.createDocumentFragment();
  tracks.forEach((track, index) => {
    const button = document.createElement('button');
    button.className = 'track-row';
    button.type = 'button';
    button.dataset.index = index;
    button.setAttribute('aria-label', `Play ${track.title}`);
    button.innerHTML = `
      <span class="track-progress" aria-hidden="true"></span>
      <span class="track-number">${String(index + 1).padStart(2, '0')}</span>
      <span class="track-title">${track.title}</span>
      <span class="track-action">
        <span class="track-time">PREVIEW</span>
        <span class="play-icon" aria-hidden="true">${icons.play}</span>
      </span>`;
    button.addEventListener('click', () => toggleTrack(index));
    fragment.appendChild(button);
  });
  trackList.appendChild(fragment);
}

function setActiveRow() {
  document.querySelectorAll('.track-row').forEach((row, index) => {
    const active = index === currentIndex;
    row.classList.toggle('is-active', active);
    row.setAttribute('aria-label', `${active && isPlaying ? 'Pause' : 'Play'} ${tracks[index].title}`);
    const icon = row.querySelector('.play-icon');
    icon.innerHTML = active && isPlaying ? icons.pause : icons.play;
    if (!active) row.style.setProperty('--track-progress', '0%');
  });
}

async function playTrack(index) {
  if (index < 0 || index >= tracks.length) return;
  if (currentIndex !== index) {
    currentIndex = index;
    audio.src = `${tracks[index].file}?v=${audioVersion}`;
    audio.currentTime = 0;
  }
  try {
    await audio.play();
  } catch {
    isPlaying = false;
    updatePlayer();
  }
}

function toggleTrack(index) {
  if (currentIndex === index && !audio.paused) {
    audio.pause();
  } else {
    playTrack(index);
  }
}

function updatePlayer() {
  if (currentIndex < 0) return;
  const track = tracks[currentIndex];
  nowPlaying.hidden = false;
  document.body.classList.add('player-visible');
  playerNumber.textContent = String(currentIndex + 1).padStart(2, '0');
  playerTitle.textContent = track.title;
  playerPlay.innerHTML = isPlaying ? icons.pause : icons.play;
  playerPlay.setAttribute('aria-label', isPlaying ? 'Pause preview' : 'Play preview');
  previousButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === tracks.length - 1;
  setActiveRow();
}

audio.addEventListener('play', () => { isPlaying = true; updatePlayer(); });
audio.addEventListener('pause', () => { isPlaying = false; updatePlayer(); });
audio.addEventListener('loadedmetadata', () => { duration.textContent = formatTime(audio.duration); });
audio.addEventListener('timeupdate', () => {
  const progress = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  elapsed.textContent = formatTime(audio.currentTime);
  timelineProgress.style.width = `${progress}%`;
  timeline.setAttribute('aria-valuenow', Math.round(audio.currentTime));
  const row = rowFor(currentIndex);
  if (row) row.style.setProperty('--track-progress', `${progress}%`);
});
audio.addEventListener('ended', () => {
  if (currentIndex < tracks.length - 1) playTrack(currentIndex + 1);
  else { isPlaying = false; updatePlayer(); }
});

playerPlay.addEventListener('click', () => {
  if (currentIndex < 0) playTrack(0);
  else if (audio.paused) audio.play();
  else audio.pause();
});
previousButton.addEventListener('click', () => playTrack(currentIndex - 1));
nextButton.addEventListener('click', () => playTrack(currentIndex + 1));
closeButton.addEventListener('click', () => {
  audio.pause();
  nowPlaying.hidden = true;
  document.body.classList.remove('player-visible');
});

function seekFromEvent(event) {
  if (!audio.duration) return;
  const rect = timeline.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  audio.currentTime = audio.duration * ratio;
}
timeline.addEventListener('click', seekFromEvent);
timeline.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    audio.currentTime = Math.min(audio.duration || 30, Math.max(0, audio.currentTime + (event.key === 'ArrowRight' ? 3 : -3)));
  }
});

function renderPlatforms() {
  if (!platforms.length) return;
  const container = document.querySelector('#streaming-links');
  container.className = 'platform-links';
  container.innerHTML = platforms.map((platform) => `<a href="${platform.url}" target="_blank" rel="noreferrer">${platform.name}</a>`).join('');
}

const shareDialog = document.querySelector('#share-dialog');
const pageUrl = window.location.href.split('#')[0];
const shareText = 'What Happened to the Fun — Jena Knox';

document.querySelector('#share-button').addEventListener('click', () => shareDialog.showModal());
document.querySelector('#share-close').addEventListener('click', () => shareDialog.close());
shareDialog.addEventListener('click', (event) => {
  if (event.target === shareDialog) shareDialog.close();
});
document.querySelector('#share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
document.querySelector('#share-x').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`;
document.querySelector('#share-whatsapp').href = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`;
document.querySelector('#share-email').href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(pageUrl)}`;
document.querySelector('#copy-link').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(pageUrl);
    status.textContent = 'Link copied.';
  } catch {
    status.textContent = 'Select and copy the address from your browser.';
  }
});

renderTracks();
renderPlatforms();
