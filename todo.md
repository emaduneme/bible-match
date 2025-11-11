## Implementation TODOs (Phase 1 - High Impact, Low Risk)

- [x] ✅ Improve selection slots contrast/labels/size in `src/components/GameBoard.tsx`
  - ✅ Labels now use `text-foreground` class for WCAG AA contrast
  - ✅ Changed unselected placeholder from "—" to "Tap a card"
  - ✅ Reduced slot height from h-14/h-16 to h-12/h-14

- [x] ✅ Make `MatchCard` accessible (button semantics, focus-visible ring)
  - ✅ Added `role="button"` and `tabIndex={isMatched ? -1 : 0}` for keyboard users
  - ✅ Added `aria-pressed` for selected state and `aria-disabled` for matched cards
  - ✅ Added `focus-visible:ring-2 focus-visible:ring-primary` and keyboard handler (Enter/Space)

- [x] ✅ Simplify HUD in `src/components/GameBoard.tsx`
  - ✅ Renamed "Attempts" to "Lives remaining"
  - ✅ Removed redundant "Pairs this game" text
  - ✅ Kept `aria-live` announcement for lives

- [x] ✅ Add confirmation on "Back to Home"
  - ✅ Added `handleBackClick` with `window.confirm()` prompt when game is in progress

- [x] ✅ Improve mobile layout density
  - ✅ Changed cards grid to `grid-cols-3` on small screens (was `grid-cols-2`)

- [x] ✅ Tweak progress bar contrast
  - ✅ Added `bg-muted/40` background to Progress component for better visibility

- [x] ✅ Shorten theme descriptions in `src/data/themes.ts`
  - ✅ People & Relationships: "Siblings, mentors, companions."
  - ✅ People & Places: "Travels and encounters."
  - ✅ People & Events: "Battles, miracles, callings."

## Phase 2 - Enhanced Interactions (Completed)

- [x] ✅ Card deselection/undo on re-click
  - ✅ Click a selected card again to deselect it
  - ✅ Allows users to change their mind before completing a pair

- [x] ✅ Mobile vibration feedback on selection (feature-detected `navigator.vibrate`)
  - ✅ Short 10ms vibration on card selection
  - ✅ Double pulse (50-30-50ms) on correct match
  - ✅ Triple pulse (30-50-30-50-30ms) on incorrect match
  - ✅ Gracefully degrades on devices without vibration support

- [x] ✅ Immediate per-card feedback animations
  - ✅ Soft shake animation on incorrect pair (`animate-shake-soft`)
  - ✅ Green pulse/glow on correct pair (`animate-pulse-success`)
  - ✅ Red border and background tint for incorrect matches
  - ✅ Green border and background tint for correct matches

## Future Enhancements (Optional)

- [ ] Tooltip/onboarding for first-time users
- [ ] Light mode toggle
- [ ] High-contrast mode for accessibility
- [ ] Sound effects (with mute toggle)
- [ ] Difficulty levels with timer mode

## Notes from Review

- Selected card names already appear in the selection slots; improving contrast and placeholder text suffices.
- Educational feedback is already shown on correct matches (`FeedbackDialog` with note + verse).
- A victory screen with stats/share is already implemented (`VictoryScreen`).


