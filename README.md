# Bible Link Match

An interactive Bible-themed matching game that helps players learn about biblical connections between people, places, and events. Test your knowledge of Scripture by matching related pairs and discover verses that illuminate each connection!

## Game Features

- **Multiple Themes**: Choose from different categories including:
  - People & Relationships (mentors, siblings, companions)
  - People & Places (origins, missions, revelations)
  - People & Events (battles, miracles, divine calls)
  - Old Testament pairs
  - New Testament pairs

- **Educational Feedback**: Each correct match reveals a relevant Bible verse and explanatory note
- **Score Tracking**: Monitor your progress with a visual progress bar
- **Limited Attempts**: Strategic gameplay with 5 attempts per game
- **Responsive Design**: Beautiful, mobile-first interface that works on all devices
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
│   │   ├── matchPairs.json    # Bible pairs with verses
│   │   ├── themes.json        # Game theme categories
│   │   └── books.json         # Bible book metadata
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

1. **Choose a Theme**: Select from various biblical themes or play with all pairs
2. **Match Pairs**: Click two cards to see if they match
3. **Learn**: When you make a correct match, discover the Bible verse that connects them
4. **Score Points**: Complete all pairs before running out of attempts
5. **Victory**: Achieve a perfect score and challenge yourself with a new theme!

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
