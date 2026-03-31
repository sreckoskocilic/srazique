# Changelog

All notable changes to this project will be documented in this file.

## [1.0.5] - 2026-03-31

### Changed

- Questions no longer repeat within the same game — full question pool loaded from `questions.enc` with no per-category cap
- Removed online multiplayer — socket.io bridge, lobby UI, and all online game logic removed from app

### Fixed

- Multiplayer socket left alive on connection timeout or error — now properly disconnected in both cases

## [1.0.3] - 2026-03-29

### Added

- Web browser support — questions auto-load via client-side XOR decrypt; multiplayer API shim using socket.io CDN
- Turn announcement overlay — 2-second block between turns announces the next player
- Category selection on home screen — all 10 categories shown, minimum 3 required
- "Start as Vitez" option — begin the game with all pegs at max rank
- Player stats in turn panel — correct answers, attempts, and accuracy percentage
- Collapsible Settings section on home screen (categories + Start as Vitez)
- Player count managed via + / × controls instead of fixed number buttons

### Changed

- Rank-up thresholds: 3 correct answers on boards ≤8×8, 5 on larger boards
- Combat resolution: attacker wins if correct OR has higher rank (rank advantage bypasses Q2)
- Wrong-answered questions excluded from pool for the rest of the game
- Multiple-move pegs use one attempt per wrong answer instead of losing all remaining moves
- Game screen fills full viewport height on both web and desktop
- Phase text and move progress more visible when a peg is selected

### Fixed

- After combat, attacker's remaining moves were lost — now correctly continues turn
- Custom player colors not applied when starting a new game

## [1.0.2] - 2026-03-28

### Changed

- Major refactor of app context, obfuscator and content loading

### Updated

- README documentation

## [1.0.1] - 2026-03-27

### Added

- Countdown timer per answer (15, 30, or 45 seconds configurable)
- Keyboard navigation (A/B/C/D or 1/2/3/4 for answers, arrow keys for board)

## [1.0.0] - 2026-03-23

### Added

- Initial release
- 2–4 player multiplayer support
- Strategic board game mechanics
- Windows (NSIS installer) and macOS (DMG) builds
