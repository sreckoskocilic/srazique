# Srazique

Strategic board game built with Electron.

![CI](https://github.com/sreckoskocilic/srazique/actions/workflows/ci.yml/badge.svg)

## Features

- 2-4 player local multiplayer
- 8x8 game board with category-based tiles
- Trivia questions (10 categories + Croatia/BiH regional)
- Combat system with rank progression
- Flag capture mechanics

## Development

```bash
# Install dependencies
npm install

# Start development
npm start

# Run tests
npm test

# Lint code
npm run lint

# Build Windows
npm run build:win

# Build macOS
npm run build:mac
```

## Build Output

- Windows: `dist/Srazique_Setup.exe`
- macOS: `dist/Srazique-{version}.dmg`

## Releases

Releases are published automatically to [GitHub Releases](../../releases) when a version tag is pushed:

```bash
git tag v1.0.0
git push origin v1.0.0
```

## License

MIT
