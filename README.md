# Jena Knox — What Happened to the Fun

Official album preview page for **What Happened to the Fun** by Jena Knox.

## Content

- 15 album previews with automatic track-to-track playback
- responsive layout for desktop and mobile
- sharing menu for Facebook, X, WhatsApp, email and link copying
- GitHub Pages deployment workflow

## Update streaming links

Open `public/app.js` and add the available services to the `platforms` array:

```js
const platforms = [
  { name: 'Spotify', url: 'https://...' },
  { name: 'Apple Music', url: 'https://...' },
];
```

Pushing the change to `main` updates the live page automatically.
