# CLAUDE.md - AI Assistant Guide for DungeOnions

## Project Overview

**Project Name:** DungeOnions (titled "Itsy Bitsy BBattlinf")
**Type:** Web-based Dungeon Crawler Game with Integrated Level Editor
**Language:** Vanilla JavaScript (ES6+)
**Graphics:** p5.js v1.9.0 (HTML5 Canvas)
**Deployment:** Firebase Hosting (Project ID: `dangerous-dungeonions`)

**Description:** A browser-based RPG dungeon game featuring dual modes - a playable game mode and an in-browser level/map editor. Players navigate dungeons, fight enemies, and accumulate score while avoiding damage. The game includes character class selection, progressive difficulty through rounds, and procedural enemy spawning.

---

## Repository Structure

```
/home/user/dungeonions/
├── .git/                                    # Git repository
└── Itsy Bitsy BBattlinf/                   # Main project directory
    ├── public/
    │   └── index.html                      # Firebase hosting landing page
    ├── assets/
    │   ├── healthbar_01.png to 07.png      # Health bar sprite frames
    │   ├── particlesampler.png             # Particle effect texture
    │   └── Weapons_Knight/                 # Character weapon assets
    ├── tilemap.png                         # Main tileset spritesheet (16x16 tiles)
    ├── tiny-dungeon-game.html              # Main game application file
    ├── TINYDUNGEONui.css                   # UI and styling
    ├── DungeOnionplayerclasses.js          # Player class definitions
    ├── DungeOnionenemies.js                # Enemy type definitions
    ├── DungeOniontilelogic.js              # TileManager with tile properties
    └── DungeOnioninnerworking.js           # Core game engine
```

**Important Note:** The main project files are located in the `Itsy Bitsy BBattlinf/` directory (note the space and spelling in the directory name).

---

## Technology Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Web Browser (Client-side) |
| **Language** | JavaScript (Vanilla JS, ES6+) |
| **Graphics** | p5.js v1.9.0 (Canvas API) |
| **Styling** | CSS 3 |
| **Deployment** | Firebase Hosting v12.3.0 |
| **Build Process** | None (Pure vanilla development) |
| **Dependencies** | p5.js from CDN |

**No Build System:** This project uses plain script tags - no webpack, rollup, or bundlers.

---

## Core Architecture

### Manager-Based Architecture

The application follows a modular manager-based architecture:

```
tiny-dungeon-game.html (Entry Point & UI Controller)
    ├── GameManager (Main Game Loop & State)
    │   ├── Player (Class-based: Wizard, Paladin)
    │   ├── Enemy[] (Spawned dynamically)
    │   ├── Projectile[] (Player weapons)
    │   └── Particle Effects
    │
    ├── AtlasManager (Sprite Asset Management)
    ├── MapManager (World Layout & Expansion)
    ├── TileManager (Tile Properties & Definitions - 132 types)
    ├── Camera (View Management)
    ├── InputManager (Keyboard & Mouse)
    ├── HealthBarManager (Visual Health Display)
    └── ParticleManager (Visual Effects)
```

### Key Classes & Files

#### 1. **GameManager** (`DungeOnioninnerworking.js`)
- **Location:** Lines 1-600+
- **Responsibilities:** Game loop, collision detection, score tracking, game state
- **Key Methods:**
  - `constructor(canvasElement)`
  - `async initialize()` - Load assets before game starts
  - `update(deltaTime)` - Main update loop
  - `render()` - Main render loop
  - `fireProjectileAtMouse()` - Shooting mechanic
  - `nextRound()` - Round progression
  - `expandMap()` - Map expansion system
  - `resetGame()` - Reset after death

#### 2. **Player Class** (`DungeOnionplayerclasses.js`)
- **Constructor:** `new Player(playerClassName)`
- **Available Classes:**
  - **Wizard:** Speed=120, Health=100, Damage=5, FireRate=200ms
  - **Paladin:** Speed=90, Health=150, Damage=8, FireRate=320ms
- **Key Properties:** x, y, health, maxHealth, speed, tileIndex, projectileDamage
- **Key Methods:** `takeDamage(amount)`, `reset()`

#### 3. **Enemy Class** (`DungeOnionenemies.js`)
- **Constructor:** `new Enemy(enemyTypeName, startX, startY)`
- **Current Types:**
  - **Crab:** Health=10, Speed=40px/s, Damage=10, AttackCooldown=1000ms
- **AI Features:** Pathfinding toward player, attack cooldown, knockback physics
- **Visual Effects:** Hurt flash, death animation, idle bobbing
- **Key Methods:** `takeDamage(amount, fromX, fromY)`, `update(deltaTime, player, gameManager)`

#### 4. **TileManager** (`DungeOniontilelogic.js`)
- **Responsibilities:** Define properties for all 132 tile types
- **Tile Properties:**
  - `tileIndex` (0-131)
  - `description` (semantic name)
  - `playerPasses` (boolean - collision)
  - `magicPasses` (boolean - projectile passthrough)

#### 5. **AtlasManager** (`DungeOnioninnerworking.js`)
- **Responsibilities:** Load and parse tilemap.png spritesheet
- **Tile Configuration:**
  - Tile Size: 16x16 pixels
  - Grid: 12 columns × 11 rows = 132 tiles
  - Spacing: 1 pixel between tiles
  - Color Keying: Transparent background (magic pink removal)

#### 6. **MapManager** (`DungeOnioninnerworking.js`)
- **Responsibilities:** Store world layout, map expansion, collision detection
- **Initial Size:** 32×20 tiles
- **Map Format:** 2D array of tile arrays (supports multiple tiles per cell)
- **Save/Load:** JSON format for persistence

---

## Development Workflows

### Common Tasks

#### Adding a New Player Class

1. **Edit:** `DungeOnionplayerclasses.js`
2. **Add to playerClasses object:**
   ```javascript
   'ClassName': {
       displayName: 'Class Name',
       tileIndex: 0,  // Sprite index from tilemap.png
       speed: 100,
       health: 120,
       maxHealth: 120,
       projectileDamage: 6,
       fireRate: 250,
       description: 'Class description here'
   }
   ```
3. **Test:** Load game and verify class appears in selection dropdown

#### Adding a New Enemy Type

1. **Edit:** `DungeOnionenemies.js`
2. **Add to enemyTypes object:**
   ```javascript
   'EnemyName': {
       displayName: 'Enemy Name',
       tileIndex: 0,  // Sprite index from tilemap.png
       speed: 50,
       health: 15,
       maxHealth: 15,
       damage: 12,
       attackCooldown: 1200,
       knockbackForce: 3
   }
   ```
3. **Update spawning logic in GameManager** if needed
4. **Test:** Verify enemy spawns and AI works correctly

#### Modifying Tile Properties

1. **Edit:** `DungeOniontilelogic.js`
2. **Update the tiles array:**
   ```javascript
   { tileIndex: 42, description: 'New Tile', playerPasses: true, magicPasses: true }
   ```
3. **playerPasses:** `false` = solid wall, `true` = walkable
4. **magicPasses:** `false` = blocks projectiles, `true` = projectiles pass through

#### Adding New Game Mechanics

1. **Identify the appropriate manager** (GameManager for most gameplay features)
2. **Add properties to the relevant class**
3. **Update the `update()` method** for per-frame logic
4. **Update the `render()` method** for visual changes
5. **Update UI elements** in `tiny-dungeon-game.html` if needed
6. **Update CSS** in `TINYDUNGEONui.css` for styling

---

## Code Conventions & Standards

### JavaScript Style

- **Variable Naming:** camelCase for variables and functions
- **Class Naming:** PascalCase for classes
- **Constants:** UPPER_SNAKE_CASE for true constants
- **No Semicolons:** This codebase generally omits semicolons (ASI-style)
- **Indentation:** 4 spaces (not tabs)
- **Comments:** Use descriptive comments for complex logic

### File Organization

- **One major class per file** (e.g., Enemy class in DungeOnionenemies.js)
- **Related utilities in same file** (e.g., all managers in DungeOnioninnerworking.js)
- **CSS organized by component** with clear section comments

### Naming Patterns

- **Managers:** Suffix with "Manager" (e.g., `GameManager`, `AtlasManager`)
- **Game Objects:** Singular class names (e.g., `Player`, `Enemy`, `Projectile`)
- **UI Elements:** ID format uses camelCase (e.g., `#gameCanvas`, `#classSelect`)

### Asset Paths

- **Relative paths from HTML location:** `./tilemap.png`, `./assets/healthbar_01.png`
- **All paths are relative** to the `Itsy Bitsy BBattlinf/` directory

---

## Game Mechanics Reference

### Game States

1. **Round Transition** - Enemy respawning, player invulnerability
2. **Playing** - Active combat, enemy AI active
3. **Dead** - Game over on player death

### Round System

- Starts at Round 1
- Enemy count formula: `Math.min(10, 5 + round - 1)`
- Enemies respawn 3-8 seconds after defeat
- Round advances when all enemies are defeated

### Map Expansion

- Initial cost: 500 score
- Cost multiplier: 1.8x per expansion
- Expands by 2 tiles in each direction
- Updates camera bounds automatically

### Controls

**Game Mode:**
- **Movement:** WASD or Arrow Keys
- **Attack:** Left-click toward mouse cursor
- **Map Expansion:** Click "Expand Map" button

**Editor Mode:**
- **D:** Drawing tool (place tiles)
- **E:** Eraser tool (remove tiles)
- **P:** Pan tool (navigate)
- **G:** Toggle grid display
- **Click tiles in palette** to select
- **Click canvas** to place/erase

---

## Rendering System

### Canvas Configuration

```javascript
const VIEWPORT_SCALE = 0.85;
const MAX_CANVAS_WIDTH = 1200;
const MAX_CANVAS_HEIGHT = 800;
const MIN_CANVAS_WIDTH = 640;
const MIN_CANVAS_HEIGHT = 480;
```

### Rendering Pipeline

1. Clear to black background
2. Apply camera transform (translate by camera offset)
3. Render visible tiles (viewport culling)
4. Render enemies with effects
5. Render player sprite
6. Render projectiles
7. Render particle effects
8. Screen-space crosshair overlay

### Coordinate Systems

- **World Space:** Absolute pixel positions (0,0 is top-left of map)
- **Screen Space:** Canvas pixel positions (0,0 is top-left of viewport)
- **Tile Space:** Grid coordinates (multiply by 16 to get world pixels)

---

## Testing Guidelines

### Manual Testing Checklist

**Game Mode:**
- [ ] Player movement works with WASD and Arrow keys
- [ ] Shooting fires projectiles toward mouse cursor
- [ ] Enemies spawn and move toward player
- [ ] Combat damage works (player and enemy)
- [ ] Health bar updates correctly
- [ ] Score increases on enemy defeat
- [ ] Round progression works
- [ ] Map expansion works and costs correct score
- [ ] Death triggers game over state
- [ ] Class selection changes player stats

**Editor Mode:**
- [ ] Drawing tool places tiles
- [ ] Eraser tool removes tiles
- [ ] Pan tool navigates large maps
- [ ] Grid toggle works
- [ ] Tile palette selection works
- [ ] Save map exports JSON file
- [ ] Load map imports JSON file
- [ ] "Load Current Game Map" transfers game map to editor
- [ ] "Save To Game Map" transfers editor map to game

### Performance Testing

- Test with 10+ enemies on screen
- Test with large maps (50+ tiles wide)
- Verify FPS stays above 30
- Check memory usage doesn't grow unbounded

### Browser Compatibility

- **Primary:** Chrome/Chromium
- **Secondary:** Firefox, Safari, Edge
- Test responsive canvas scaling at different window sizes

---

## Git Workflow

### Branch Strategy

- **Main Branch:** `main` (or master)
- **Feature Branches:** Use descriptive names (e.g., `feature/add-archer-class`)
- **Claude Branches:** Prefix with `claude/` for AI-assisted development

### Commit Message Style

Based on recent commits:
- Use descriptive present tense (e.g., "Enhance enemy behaviour and visuals")
- Keep messages concise but informative
- Reference PRs in merge commits

### Recent History

```
cc1a7f2 Merge pull request #2 from KelsoMigizi/codex/enhance-enemy-class-functionality
de067da Enhance enemy behaviour and visuals
0a77a14 Itsy Bitsy BBattlinf
2149d17 Tighten camera alignment and relocate HUD
650d70a v1
```

---

## Deployment Process

### Firebase Hosting

**Project ID:** `dangerous-dungeonions`

**Deployment Steps:**
1. Ensure changes are tested locally (open `tiny-dungeon-game.html` in browser)
2. Run `firebase deploy` from repository root
3. Verify deployment at Firebase hosting URL

**Configuration:**
- Public directory: `public/`
- Main app file: `tiny-dungeon-game.html` (not in public/)
- Firebase services prepared but not actively used (Firestore, Functions, Storage)

---

## Common Issues & Troubleshooting

### Issue: Assets Not Loading

**Symptoms:** Black screen, "Loading..." never disappears
**Causes:** Incorrect file paths, CORS issues
**Solutions:**
- Verify `tilemap.png` exists in `Itsy Bitsy BBattlinf/` directory
- Check browser console for 404 errors
- Ensure serving from local file server (not file://)

### Issue: Collision Detection Not Working

**Symptoms:** Player walks through walls
**Causes:** Tile properties incorrect, tile index mismatch
**Solutions:**
- Check `DungeOniontilelogic.js` for correct `playerPasses` values
- Verify tile indices match spritesheet positions
- Check TileManager initialization

### Issue: Performance Degradation

**Symptoms:** Low FPS, choppy gameplay
**Causes:** Too many particles, inefficient rendering
**Solutions:**
- Reduce particle count in ParticleManager
- Enable viewport culling (should be default)
- Check for infinite loops in update methods

### Issue: Editor Save/Load Not Working

**Symptoms:** JSON not downloading, map not loading
**Causes:** Browser security settings, JSON format errors
**Solutions:**
- Check browser allows downloads
- Validate JSON format (must have mapWidth, mapHeight, tiles)
- Ensure tiles array dimensions match map size

---

## Extension Points

### Areas Designed for Extension

1. **Player Classes** - Easy to add in `DungeOnionplayerclasses.js`
2. **Enemy Types** - Easy to add in `DungeOnionenemies.js`
3. **Tile Types** - Can expand tilemap.png and update TileManager
4. **Game Modes** - Can add new modes alongside game/editor

### Missing Features (Opportunities)

- **Audio System** - No sound effects or music
- **Multiplayer** - Firebase prepared but not implemented
- **Mobile Controls** - Touch events partially implemented
- **Database Persistence** - Firebase Firestore available but unused
- **Leaderboards** - Could use Firebase Database
- **More Enemy AI** - Current AI is simple pathfinding

---

## Critical File Locations

### For Quick Reference

| Task | File | Location |
|------|------|----------|
| Add player class | `DungeOnionplayerclasses.js` | playerClasses object |
| Add enemy type | `DungeOnionenemies.js` | enemyTypes object |
| Change tile properties | `DungeOniontilelogic.js` | tiles array |
| Modify game loop | `DungeOnioninnerworking.js` | GameManager.update() |
| Change UI layout | `tiny-dungeon-game.html` | HTML structure |
| Style changes | `TINYDUNGEONui.css` | CSS selectors |
| Add sprite | `tilemap.png` | 16x16 grid (must update TileManager) |

---

## Constants Reference

### Tile System

```javascript
const TILE_SIZE = 16;          // Pixels per tile
const TILE_SPACING = 1;        // Pixels between tiles in spritesheet
const GRID_COLS = 32;          // Initial map width in tiles
const GRID_ROWS = 20;          // Initial map height in tiles
const TILESET_COLS = 12;       // Spritesheet columns
const TILESET_ROWS = 11;       // Spritesheet rows
const TOTAL_TILES = 132;       // Total unique tiles
```

### Game Balance

```javascript
// In GameManager
const INITIAL_ENEMY_COUNT = 5;
const MAX_ENEMY_COUNT = 10;
const ENEMY_RESPAWN_MIN = 3000;    // ms
const ENEMY_RESPAWN_MAX = 8000;    // ms
const MAP_EXPAND_INITIAL_COST = 500;
const MAP_EXPAND_COST_MULTIPLIER = 1.8;
const ROUND_MESSAGE_DURATION = 2000;  // ms
```

---

## Best Practices for AI Assistants

### When Making Changes

1. **Always read the file first** before editing
2. **Test in browser** after changes (open tiny-dungeon-game.html)
3. **Check console for errors** in browser DevTools
4. **Verify asset paths** are relative and correct
5. **Update related systems** (e.g., if adding enemy, update spawn logic)

### When Adding Features

1. **Follow existing patterns** (manager-based architecture)
2. **Add to appropriate file** (don't create new files unnecessarily)
3. **Update UI if needed** (HTML and CSS)
4. **Consider performance** (viewport culling, object pooling)
5. **Add comments** for complex logic

### When Debugging

1. **Check browser console** for JavaScript errors
2. **Use console.log** liberally in update/render methods
3. **Verify asset loading** in initialize() method
4. **Check coordinate systems** (world vs screen vs tile)
5. **Test both game and editor modes**

### Code Quality

- Maintain consistent indentation (4 spaces)
- Use descriptive variable names
- Add comments for non-obvious logic
- Follow existing naming conventions
- Keep methods focused and under 100 lines when possible

---

## Quick Start for AI Development

### First-Time Setup

1. **Navigate to project:**
   ```bash
   cd "/home/user/dungeonions/Itsy Bitsy BBattlinf"
   ```

2. **Serve locally** (use any local server):
   ```bash
   python3 -m http.server 8000
   # or
   npx serve
   ```

3. **Open in browser:**
   ```
   http://localhost:8000/tiny-dungeon-game.html
   ```

### Making a Simple Change

**Example: Increase Wizard speed**

1. Read file:
   ```bash
   Read DungeOnionplayerclasses.js
   ```

2. Find Wizard class definition

3. Edit speed value:
   ```javascript
   'Wizard': {
       speed: 150,  // Changed from 120
       // ... rest unchanged
   }
   ```

4. Test in browser (reload page, select Wizard, test movement)

### Committing Changes

1. **Check status:**
   ```bash
   git status
   ```

2. **Add changes:**
   ```bash
   git add "Itsy Bitsy BBattlinf/DungeOnionplayerclasses.js"
   ```

3. **Commit:**
   ```bash
   git commit -m "Increase Wizard movement speed to 150"
   ```

4. **Push to branch:**
   ```bash
   git push -u origin claude/[branch-name]
   ```

---

## Summary

**DungeOnions** is a well-structured vanilla JavaScript game with clear architecture and extension points. The manager-based design makes it easy to add content (classes, enemies, tiles) and features (new mechanics, game modes). When working on this project:

- Respect the existing architecture patterns
- Test changes in both game and editor modes
- Maintain the vanilla JavaScript approach (no build tools)
- Follow the established naming conventions
- Keep performance in mind (viewport culling, asset management)

The codebase is clean, maintainable, and suitable for both enhancement and as an educational resource for game development.

---

**Last Updated:** 2025-11-17
**Repository:** KelsoMigizi/dungeonions
**Current Branch:** claude/claude-md-mi3ft73tgq6eok3n-01SUMvaSZuJZW2xVPrEx721T
