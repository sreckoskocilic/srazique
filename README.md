# Srazique

Strategic board game built with Electron.

## Features

- 2-4 player local multiplayer
- 8x8 game board with category-based tiles
- Trivia questions (10 categories + Croatia/BiH regional)
- Combat system with rank progression (Kmet → Vojnik → Vitez)
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

- Windows: `dist/Srazique-Setup-{version}.exe` (version from package.json)
- macOS: `dist/Srazique-{version}.dmg`

## License

ISC