# Mad Podcast App

This is a podcast app I built for the final portfolio piece of the DJS course. You can browse a bunch of shows, search and filter them, dig into seasons and episodes, and actually listen to stuff with a player that stays put at the bottom of the screen no matter where you click around the app. You can favourite episodes, and it'll remember where you left off if you come back to something you were halfway through.

**Check it out live:** https://madpodcastapp.vercel.app/

## What it does

- **Browse and search shows** — search by name, filter by genre, sort however you want.
- **Recommended carousel** — a scrollable row of shows on the homepage, loops around, works with arrows or just swiping/scrolling.
- **Show pages** — click into a show, flip between seasons, see the episode list.
- **Player that doesn't quit on you** — play an episode, wander off to another page, it just keeps playing. Pause, seek, resume, all of it.
- **Favourites** — heart an episode, it shows up on its own page grouped by show, sortable by title or by when you added it.
- **Picks up where you left off** — the app remembers how far into an episode you got and resumes from there next time. Marks stuff as finished once you've actually listened all the way through. There's a button to wipe that history if you want a clean slate.
- **Light/dark mode** — toggle it, it sticks, transitions are smooth instead of jarring.
- **Won't let you accidentally lose your spot** — if you're playing something and try to close or reload the tab, it'll ask if you're sure.

## Built with

- **React** (function components + hooks, nothing fancier)
- **Vite** for the dev server/build — fast and no config headaches
- **React Router** for navigation between pages
- **Context API** for the global stuff (theme, favourites, listening progress, the audio player itself) — didn't bother with Redux or anything, the app just isn't big enough to need it
- **Plain CSS** with CSS variables for the theming — no Tailwind, no styled-components, just `.css` files.
- **[podcast-api.netlify.app](https://podcast-api.netlify.app)** for all the show/episode/genre data — this was provided for the course, it's a placeholder API
- **Vercel** for hosting

## How it's organized

```bash
src/
  api/
    podcastApi.js          # talks to the podcast API, caches the shows list
  context/
    ThemeContext.jsx
    FavouritesContext.jsx
    ListeningProgressContext.jsx
    AudioPlayerContext.jsx
  hooks/
    useLocalStorage.js      # one hook, reused by all the contexts above
  components/
    layout/
      Header.jsx
      ThemeToggle.jsx
      AudioPlayerBar.jsx
    shows/
      ShowCard.jsx
      RecommendedCarousel.jsx
      SeasonTabs.jsx
    episodes/
      EpisodeItem.jsx
  pages/
    LandingPage.jsx
    ShowDetailPage.jsx
    FavouritesPage.jsx
  utils/
    formatDate.js
    formatTime.js
    shuffle.js
    genreCache.js
    recommendedCache.js
  App.jsx
  main.jsx
  index.css
```

## Running it yourself

You'll need Node 18+ and npm.

```bash
git clone https://github.com/Muizz-CS/ABDKIE25146_pto2508-class_Abdul_Kiewitz_DJSPP.git
cd ABDKIE25146_pto2508-class_Abdul_Kiewitz_DJSPP
npm install
npm run dev
```

That'll get it running at `http://localhost:5173`. No API keys, no `.env` file needed — it just hits the public podcast API directly.

To build it for production:

```bash
npm run build
```

That spits out static files into `dist/` that you can host anywhere.

## Stuff worth knowing

- The "recommended" shows on the homepage are just a random pick from the catalogue, not an actual recommendation engine — there's no endpoint for that, so this felt like the honest way to fill that feature.
- Favourites, theme, and listening progress all live in your browser's localStorage, so they're per-device, not synced anywhere.
- The app caches the shows list in memory so it doesn't refetch on every page visit — that resets if you do a hard refresh, which is expected.

## Who made this

Me — Abdul Muizz. Final portfolio piece for the DJS (Dynamic JavaScript) course at CodeSpace.