# Megaman-Style Game Development Tasks

## Project Overview
Creating a Phaser.js game with TypeScript that emulates classic Megaman-style gameplay.

## Todo List

### High Priority
- [x] Set up Phaser.js project structure with TypeScript
- [x] Configure TypeScript and build tools

### Medium Priority
- [x] Create basic game scenes (Menu, Game, GameOver)
- [x] Implement player character with Megaman-style controls
- [x] Add shooting mechanics and projectiles
- [x] Create basic enemy AI and patterns
- [x] Set up collision detection and physics

### Low Priority
- [ ] Add placeholder assets and animations

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run typecheck` - Check TypeScript types

## Key Features to Implement
1. **Player Movement**: Running, jumping, wall sliding
2. **Shooting System**: Basic projectiles, charge shots
3. **Enemy Patterns**: Simple AI with predictable movements
4. **Level Design**: Platform-based stages with obstacles
5. **Health System**: Player health, enemy damage
6. **Game States**: Menu, gameplay, game over screens

## Phaser.js API Usage Guidelines

### IMPORTANT: Always Use Correct Phaser.js APIs
When working with Phaser.js in this project, you MUST reference the official Phaser documentation at https://docs.phaser.io/api-documentation/api-documentation to ensure correct usage of classes and methods.

### Common Phaser Classes and Their Correct Usage:

1. **Graphics Class**
   - Use `fillStyle(color, alpha?)` for setting fill color
   - Use `fillRect()`, `fillCircle()`, `fillPath()` for drawing
   - NO `createLinearGradient()` method exists - use multiple rectangles or textures for gradients
   - Use `generateTexture(key, width, height)` to create textures from graphics

2. **Sprites and Physics**
   - Extend `Phaser.Physics.Arcade.Sprite` for physics-enabled sprites
   - Always enable physics with `this.physics.world.enable(sprite)` before accessing `body`
   - Use `setVelocityX()`, `setVelocityY()` on the body after physics is enabled

3. **Scene Lifecycle**
   - `preload()` - Load assets
   - `create()` - Initialize game objects
   - `update()` - Game loop (called every frame)

4. **Input Handling**
   - Use `this.input.keyboard.createCursorKeys()` for arrow keys
   - Use `this.input.keyboard.addKeys()` for custom keys
   - Check `isDown` property on keys, not `isPressed`

5. **Groups**
   - Use `this.add.group()` for managing collections of objects
   - Use `group.get()` to retrieve objects from pools
   - Always check if returned object exists before using

### Common Pitfalls to Avoid:
- Don't assume methods exist - check Phaser docs
- Always enable physics before accessing body properties
- Use Phaser's built-in methods rather than native Canvas API
- Remember that Phaser uses its own event system

### When in Doubt:
Always consult https://docs.phaser.io/api-documentation/api-documentation for the correct API usage.