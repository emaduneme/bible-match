# Bible Match

A daily Bible puzzle. Every day, everyone gets the same 8 cards. Find the 4 pairs that belong together, then share a spoiler-free result.

## How It Works

- **One puzzle a day.** The puzzle is picked by the player's local date from a hand-written list. No backend.
- **Everyone finishes.** There is no game over. Your score is how few misses you make.
- **Shareable result.** One square per guess, in order:

```
📖 Bible Match #14
🟩🟥🟩🟩🟩
1 miss

https://bible-match.vercel.app
```

- **Learn as you go.** Each correct match shows its verse and a short note. The result screen recaps all 4.
- **Streaks.** Stats live in `localStorage`. A refresh resumes the game instead of resetting it.

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

The game will open in your browser at `http://127.0.0.1:8080`

Run the tests with `npm test`.

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
src/
├── components/
│   ├── GameBoard.tsx        # The daily board: guesses, misses, feedback
│   ├── ResultScreen.tsx     # Result grid, stats, share button, recap
│   ├── WelcomeScreen.tsx    # First visit: how to play + optional name
│   ├── MatchCard.tsx        # One card
│   └── FeedbackDialog.tsx   # Verse + note after a correct match
├── data/
│   ├── matchPairs.json      # All pairs (the authoring library)
│   └── dailyPuzzles.ts      # LAUNCH_DATE + the ordered puzzle list
├── lib/
│   ├── daily.ts             # Local date -> puzzle, saved progress, seeded shuffle
│   ├── storage.ts           # Streak/stats + share text
│   └── player.ts            # Optional player name
└── pages/Index.tsx          # Welcome -> board -> result
```

## Writing Puzzles

1. Add new pairs to `src/data/matchPairs.json`. Give each one a new, unique `id`.
2. Append a puzzle to `dailyPuzzles` in `src/data/dailyPuzzles.ts`: a `theme` and exactly 4 `pairIds`.
3. **Only append.** Do not reorder or remove old puzzles; that changes past puzzle numbers.
4. Run `npm test`. It checks that IDs exist, no card name repeats on a board, and no pair is used twice.
5. Check by hand that no card has a second *true* partner on the same board (e.g. "Joseph" and "Mary"). The game only accepts the pair you wrote.

When the list runs out, players see an "all caught up" screen. It does not repeat old puzzles.

**Preview any puzzle** with `?day=N`, e.g. `http://127.0.0.1:8080/?day=12`. Nothing is saved in preview mode.

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

Emmanuel Maduneme - [@emaduneme](https://github.com/emaduneme)

Project Link: [https://github.com/emaduneme/bible-match](https://github.com/emaduneme/bible-match)

---

**Made to help people engage with Scripture in a fun, interactive way!**
