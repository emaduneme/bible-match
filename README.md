# Bible Link Match

An interactive Bible-themed matching game that helps players learn about biblical connections between people, places, and events. Test your knowledge of Scripture by matching related pairs and discover verses that illuminate each connection!

## Game Features

- **Theme-First Play**: Pick a theme (People & Relationships, People & Places, People & Events) and stay immersed in it
- **Built-In Difficulty Curve**: Each theme embeds tiered decks (Yellow → Green → Blue) with rising pair counts and fewer lives
- **Progress That Sticks**: Completed tiers unlock the next tier for that theme and are remembered via local storage
- **Fresh Rotations**: Each tier has a larger pool of pairs so replays feel new, and recently used matches are rotated out automatically
- **Educational Feedback**: Every correct match reveals its verse reference and explanatory note
- **Accessibility & Mobile-First**: Keyboard-friendly controls, `aria-live` updates, dense mobile grid
- **Score + Lives HUD**: Progress bar, remaining lives indicator, and review dialog for each attempt
- **Modern UI**: Smooth animations and elegant design using shadcn-ui components

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/emaduneme/bible-match.git

# Navigate to the project directory
cd bible-match

# Install dependencies
npm install

# Start the development server
npm run dev
```

The game will open in your browser at `http://localhost:5173`

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn-ui** - Beautiful, accessible component library
- **React Router** - Client-side routing
- **Lucide React** - Icon library

## Project Structure

```
bible-match/
├── src/
│   ├── components/
│   │   ├── GameBoard.tsx      # Main game logic and UI
│   │   ├── MatchCard.tsx      # Individual card component
│   │   ├── FeedbackDialog.tsx # Success/feedback modal
│   │   └── VictoryScreen.tsx  # End-game screen
│   ├── data/
│   │   ├── themesWithTiers.json # Theme + tier dataset (yellow/green/blue)
│   │   ├── themesWithTiers.ts   # Helper utilities for theme/tier lookup
│   │   ├── matchPairs.json      # Shared Bible pairs with verses (reference library)
│   │   └── books.json           # Bible book metadata
│   ├── pages/
│   │   ├── Index.tsx          # Home/landing page
│   │   └── NotFound.tsx       # 404 page
│   └── lib/
│       ├── utils.ts           # Utility functions
│       └── storage.ts         # Local storage helpers
├── public/                    # Static assets
└── package.json
```

## How to Play

1. **Pick a Theme**: Choose the topic that excites you most (relationships, places, events)
2. **Select a Tier**: Start with the Yellow deck for a warm-up and climb toward the tougher Blue decks
3. **Match Pairs**: Tap any two cards; matching them removes the pair and awards points
4. **Learn as You Go**: Each correct match surfaces its verse and a quick historical note
5. **Advance or Explore**: After a win, continue to the next tier in that theme or jump back to explore another theme

## Themes, Tiers & Dataset

- Source file: `src/data/themesWithTiers.json`
- Each theme entry defines:
  - `id`, `title`, `description`, `icon`
  - `tiers[]`: ordered difficulty steps (e.g., Yellow → Green → Blue)
- Each tier defines:
  - `id`, `label`, `difficulty`, `color`, `pairCount`, `maxLives`
  - `pairs[]`: **acts as the full pool**. Each playthrough randomly samples `pairCount` entries from this list, so give every tier more pairs than it needs. Each entry is shaped like `MatchPair` (fields `id`, `a`, `b`, `relationship`, `verse`, `note`, optional `book`)
- `src/data/themesWithTiers.ts` loads the JSON, normalizes `pairCount`/`maxLives`, and exposes helpers (`getThemes`, `getTier`, `getNextTier`)
- To add or edit content:
  1. Duplicate a theme or tier in `themesWithTiers.json`
  2. Provide at least 4 pairs for the entry-level tier, then raise difficulty by increasing pair count or obscurity
  3. Make sure `pairs.length >= pairCount` so the random rotation has something to work with
  4. Run `npm run build` (or `npm run lint`) to ensure the JSON parses cleanly
- The home page lists themes; selecting one reveals its tiers. `GameBoard` launches with `{ themeId, tierId }` and Victory suggests the next tier automatically.

## Progress Persistence

- File: `src/lib/progress.ts`
- Stores unlocked tiers per theme in `localStorage` (`bible-match:theme-progress:v1`)
- Guarantees the first tier of every theme is unlocked by default
- Helper functions:
  - `loadProgress(themes)` → loads + normalizes progress
  - `saveProgress(progress)` → persists to storage
  - `unlockTierProgress(progress, themeId, tierId)` → returns a new map with the tier unlocked
  - `isTierUnlocked(progress, themeId, tierId)` → convenience check for the UI
- `Index.tsx` consumes these helpers to disable locked tiers and remember player progress, while `GameBoard` notifies the parent when a tier is completed so the next tier unlocks automatically.

### Pair Rotation History

- File: `src/lib/tierHistory.ts`
- Tracks the most recently used pair IDs per `{themeId}:{tierId}` in `localStorage`
- `GameBoard` samples `pairCount` cards from the tier’s `pairs` pool, preferring pairs that have not appeared recently. When the pool is exhausted it resets the history and starts over, so replays feel novel while still cycling through the full set.

## Contributing

Contributions are welcome! Feel free to:
- Add new Bible pairs and themes
- Improve the UI/UX
- Fix bugs or optimize performance
- Enhance documentation

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Bible verses and content sourced from various Bible translations
- Built with modern web technologies and best practices
- Designed with accessibility and user experience in mind

## Contact

Emmanuel Aduneme - [@emaduneme](https://github.com/emaduneme)

Project Link: [https://github.com/emaduneme/bible-match](https://github.com/emaduneme/bible-match)

---

**Made to help people engage with Scripture in a fun, interactive way!**
