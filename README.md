# Megaman-Style Game

A classic Megaman-style platformer built with Phaser 3.90 and TypeScript.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to http://localhost:3000

## Controls

- **Arrow Keys**: Move left/right
- **Space**: Jump
- **X**: Shoot (hold to charge)

## Game Features

- Classic platformer physics with gravity
- Player movement with running and jumping
- Shooting mechanics with projectiles
- Enemy AI with patrol patterns
- Collision detection between player, enemies, and bullets
- Health system with damage and invulnerability frames
- Game states: Main Menu, Gameplay, Game Over
- Placeholder graphics for quick prototyping

## Project Structure

```
megaman-game/
├── src/
│   ├── config/         # Game configuration
│   ├── entities/       # Player and Enemy classes
│   ├── scenes/         # Game scenes (Menu, Game, GameOver)
│   └── main.ts         # Entry point
├── public/
│   └── assets/         # Game assets (sprites, audio, tilemaps)
└── index.html          # HTML entry point
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run typecheck` - Check TypeScript types

## Next Steps

1. Add real sprite assets and animations
2. Implement more enemy types
3. Add sound effects and music
4. Create level layouts with tilemaps
5. Add power-ups and special weapons
6. Implement boss battles
7. Add more visual effects and polish