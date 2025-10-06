// This file will contain the core "inner workings" of the game engine,
// including the main GameManager and other manager classes.
// This helps to separate the engine logic from the HTML document.

// --- SHARED ATLAS MANAGER ---
class AtlasManager {
    constructor() {
        this.tileSize = 16;
        this.spacing = 1;
        this.columns = 12;
        this.rows = 11;
        this.tiles = {};
        this.loaded = false;
        this.tileset = null;
    }

    async loadTileset(imagePath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.tileset = img;
                this.extractTiles();
                this.loaded = true;
                resolve();
            };
            img.onerror = (error) => {
                console.warn('Could not load tileset from', imagePath, '- creating placeholder');
                this.createPlaceholderTileset().then(resolve).catch(reject);
            };
            img.src = imagePath;
        });
    }

    extractTiles() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.tileSize;
        canvas.height = this.tileSize;

        let tileIndex = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                ctx.clearRect(0, 0, this.tileSize, this.tileSize);
                
                const sx = col * (this.tileSize + this.spacing);
                const sy = row * (this.tileSize + this.spacing);
                
                ctx.drawImage(
                    this.tileset,
                    sx, sy, this.tileSize, this.tileSize,
                    0, 0, this.tileSize, this.tileSize
                );
                
                const imageData = ctx.getImageData(0, 0, this.tileSize, this.tileSize);
                const data = imageData.data;

                // Color keying: make the background transparent
                const keyR = data[0];
                const keyG = data[1];
                const keyB = data[2];

                for (let i = 0; i < data.length; i += 4) {
                    if (data[i] === keyR && data[i + 1] === keyG && data[i + 2] === keyB) {
                        data[i + 3] = 0; // Set alpha to 0 (transparent)
                    }
                }

                const tileCanvas = document.createElement('canvas');
                tileCanvas.width = this.tileSize;
                tileCanvas.height = this.tileSize;
                const tileCtx = tileCanvas.getContext('2d');
                tileCtx.putImageData(imageData, 0, 0);

                this.tiles[`tile_${String(tileIndex).padStart(4, '0')}`] = {
                    imageData,
                    canvas: tileCanvas
                };
                tileIndex++;
            }
        }
    }

    async createPlaceholderTileset() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const tileSize = this.tileSize;
        const spacing = this.spacing;
        const columns = this.columns;
        const rows = this.rows;
        
        canvas.width = columns * (tileSize + spacing) - spacing;
        canvas.height = rows * (tileSize + spacing) - spacing;
        
        // Create simple colored tiles for visualization
        let tileIndex = 0;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const x = col * (tileSize + spacing);
                const y = row * (tileSize + spacing);
                
                // Get tile properties for color coding
                const tileProps = tileManager.getProperties(tileIndex);
                
                // Color code based on properties
                if (!tileProps.playerPasses && !tileProps.magicPasses) {
                    // Wall - dark grey
                    ctx.fillStyle = '#444';
                } else if (!tileProps.playerPasses) {
                    // Player can't pass but magic can - medium grey
                    ctx.fillStyle = '#666';
                } else if (!tileProps.magicPasses) {
                    // Magic can't pass but player can - blue
                    ctx.fillStyle = '#4a6fa5';
                } else {
                    // Both can pass - brown floor
                    ctx.fillStyle = '#8B7355';
                }
                
                ctx.fillRect(x, y, tileSize, tileSize);
                
                // Special tiles
                if (tileIndex === 84) {
                    // Player - purple wizard
                    ctx.fillStyle = '#8B4F9F';
                    ctx.fillRect(x, y, tileSize, tileSize);
                    ctx.fillStyle = '#FFD700';
                    ctx.fillRect(x + 6, y + 2, 4, 4);
                } else if (tileIndex === 110) {
                    // Enemy - red crab
                    ctx.fillStyle = '#FF6B6B';
                    ctx.fillRect(x, y, tileSize, tileSize);
                    ctx.fillStyle = '#8B0000';
                    ctx.fillRect(x + 2, y + 6, 3, 2);
                    ctx.fillRect(x + 11, y + 6, 3, 2);
                } else if (tileIndex === 115) {
                    // Projectile - red potion
                    ctx.fillStyle = '#CC0000';
                    ctx.fillRect(x + 4, y + 2, 8, 10);
                    ctx.fillStyle = '#660000';
                    ctx.fillRect(x + 6, y, 4, 3);
                }
                
                tileIndex++;
            }
        }
        
        // Convert canvas to image and load it
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const img = new Image();
                img.onload = () => {
                    this.tileset = img;
                    this.extractTiles();
                    this.loaded = true;
                    resolve();
                };
                img.src = url;
            });
        });
    }

    getTile(tileName) {
        const tile = this.tiles[tileName];
        return tile ? tile.imageData : null;
    }

    drawTile(ctx, tileName, dx, dy, dw = this.tileSize, dh = this.tileSize) {
        const tile = this.tiles[tileName];
        if (!tile || !tile.canvas) {
            return;
        }
        ctx.drawImage(tile.canvas, dx, dy, dw, dh);
    }
}

// --- INPUT MANAGER ---
class InputManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseClicked = false;
        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Prevent default for game keys
            if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'escape'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Left click
                this.mouseClicked = true;
            }
        });

        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) {
                this.mouseClicked = false;
            }
        });
    }

    isKeyPressed(key) {
        return this.keys[key] || false;
    }

    getMovementVector() {
        let dx = 0;
        let dy = 0;

        if (this.isKeyPressed('w') || this.isKeyPressed('arrowup')) dy = -1;
        if (this.isKeyPressed('s') || this.isKeyPressed('arrowdown')) dy = 1;
        if (this.isKeyPressed('a') || this.isKeyPressed('arrowleft')) dx = -1;
        if (this.isKeyPressed('d') || this.isKeyPressed('arrowright')) dx = 1;

        return { dx, dy };
    }

    getMousePosition() {
        return { x: this.mouseX, y: this.mouseY };
    }

    isMouseClicked() {
        if (this.mouseClicked) {
            this.mouseClicked = false;
            return true;
        }
        return false;
    }
}

// --- CAMERA ---
class Camera {
    constructor(target, mapWidth, mapHeight) {
        this.target = target; // The object to follow (e.g., the player)
        this.x = 0;
        this.y = 0;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.viewportWidth = 0;
        this.viewportHeight = 0;
    }

    setViewportDimensions(width, height) {
        this.viewportWidth = Math.max(1, width);
        this.viewportHeight = Math.max(1, height);
        this.update();
    }

    update() {
        if (!this.target) {
            return;
        }

        // Center the camera on the target, with clamping to map boundaries
        const desiredX = this.target.x - this.viewportWidth / 2;
        const desiredY = this.target.y - this.viewportHeight / 2;

        const maxX = Math.max(0, this.mapWidth - this.viewportWidth);
        const maxY = Math.max(0, this.mapHeight - this.viewportHeight);

        this.x = Math.max(0, Math.min(Math.floor(desiredX), maxX));
        this.y = Math.max(0, Math.min(Math.floor(desiredY), maxY));
    }

    setTarget(newTarget) {
        this.target = newTarget;
        this.update();
    }

    // Method to update map size if it changes
    updateMapSize(newWidth, newHeight) {
        this.mapWidth = newWidth;
        this.mapHeight = newHeight;
        this.update();
    }
}

// --- GAME MANAGER ---
class GameManager {
    constructor(canvas, atlasManager, inputManager, healthBarManager, particleManager, mapManager, initialPlayerClass = 'wizard') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.atlas = atlasManager;
        this.input = inputManager;
        this.healthBar = healthBarManager;
        this.particleManager = particleManager;
        this.mapManager = mapManager; // Use the new MapManager
        
        // Round and Score System
        this.round = 1;
        this.score = 0;
        this.roundState = 'playing'; // 'playing', 'between_rounds'
        this.betweenRoundsTimer = 0;
        this.betweenRoundsDuration = 3000; // 3 seconds
        this.finalRound = 14;
        this.mapExpansionCost = 500;

        // Game state
        this.isPaused = false;
        this.gameRunning = false;
        
        this.renderTarget = document.createElement('canvas');
        this.renderCtx = this.renderTarget.getContext('2d');
        this.displayScale = 1;
        this.viewportWidth = this.canvas.width || 1;
        this.viewportHeight = this.canvas.height || 1;

        // Player properties
        this.player = new Player(initialPlayerClass);
        this.currentPlayerClass = initialPlayerClass;

        // Camera
        this.camera = new Camera(
            this.player,
            this.mapManager.mapWidth * this.mapManager.tileSize,
            this.mapManager.mapHeight * this.mapManager.tileSize
        );

        const initialWidth = this.canvas.width || 800;
        const initialHeight = this.canvas.height || 600;
        this.updateCanvasSize(initialWidth, initialHeight);

        // Projectile system
        this.projectiles = [];
        this.projectileCooldown = 0;
        this.lastProjectileWasParticle = false;
        
        // Enemy system
        this.enemies = [];
        this.enemyMoveInterval = 2000; // ms between enemy moves
        this.enemyMoveTimer = 0;
        this.maxEnemies = 5;
        this.enemyMinSpawnDistance = 128;
        
        // Timing
        this.lastTime = 0;
        this.elapsedGameTime = 0;

        // Initialize game
        this.initializeGame();

        if (typeof window !== 'undefined' && typeof window.updateClassInfoDisplay === 'function') {
            window.updateClassInfoDisplay(initialPlayerClass, { forceActiveName: true, updateSelect: true });
        }
    }

    updateCanvasSize(width, height) {
        if (!width || !height) {
            return;
        }

        this.canvas.width = width;
        this.canvas.height = height;

        this.updateViewportMetrics();
    }

    updateViewportMetrics() {
        if (!this.mapManager) {
            return;
        }

        const mapPixelWidth = this.mapManager.mapWidth * this.mapManager.tileSize;
        const mapPixelHeight = this.mapManager.mapHeight * this.mapManager.tileSize;

        const scaleX = this.canvas.width / mapPixelWidth;
        const scaleY = this.canvas.height / mapPixelHeight;

        this.displayScale = Math.max(scaleX, scaleY);
        if (!isFinite(this.displayScale) || this.displayScale <= 0) {
            this.displayScale = 1;
        }

        this.viewportWidth = Math.min(mapPixelWidth, Math.round(this.canvas.width / this.displayScale));
        this.viewportHeight = Math.min(mapPixelHeight, Math.round(this.canvas.height / this.displayScale));

        this.renderTarget.width = Math.max(1, this.viewportWidth);
        this.renderTarget.height = Math.max(1, this.viewportHeight);

        if (this.camera) {
            this.camera.setViewportDimensions(this.viewportWidth, this.viewportHeight);
        }
    }

    initializeGame() {
        this.spawnInitialEnemies();
        this.gameRunning = true;
    }

    switchPlayerClass(newClassName) {
        if (!playerClasses[newClassName]) {
            console.warn(`Player class "${newClassName}" not found.`);
            return false;
        }

        if (this.player.className === newClassName) {
            return false;
        }

        const previousX = this.player.x;
        const previousY = this.player.y;

        this.player = new Player(newClassName);
        this.player.x = previousX;
        this.player.y = previousY;
        this.currentPlayerClass = newClassName;

        if (this.camera) {
            this.camera.setTarget(this.player);
        }

        this.projectiles = [];
        this.projectileCooldown = 0;
        this.lastProjectileWasParticle = false;

        this.healthBar.update(0, this.player.health, this.player.maxHealth);
        this.updateUI();

        if (typeof window !== 'undefined' && typeof window.updateClassInfoDisplay === 'function') {
            window.updateClassInfoDisplay(newClassName, { forceActiveName: true, updateSelect: true });
        }

        return true;
    }

    spawnInitialEnemies() {
        const numEnemies = Math.min(3, this.maxEnemies);
        for (let i = 0; i < numEnemies; i++) {
            this.spawnEnemy();
        }
    }

    spawnEnemy() {
        if (this.enemies.filter(e => !e.dead).length >= this.maxEnemies) {
            return;
        }

        let x, y;
        let attempts = 0;
        const enemyType = 'crab'; // Hardcoded for now
        const enemyProto = enemyTypes[enemyType];

        do {
            x = Math.random() * (this.mapManager.mapWidth * this.mapManager.tileSize - this.mapManager.tileSize);
            y = Math.random() * (this.mapManager.mapHeight * this.mapManager.tileSize - this.mapManager.tileSize);
            attempts++;
        } while ((this.getDistance(x, y, this.player.x, this.player.y) < (enemyProto.minSpawnDistance || this.enemyMinSpawnDistance) ||
                this.mapManager.checkCollision(x, y, 'player')) && attempts < 100);

        if (attempts < 100) {
            const newEnemy = new Enemy(enemyType, x, y);
            // Scale health based on round
            newEnemy.maxHealth += Math.floor(newEnemy.maxHealth * 0.1 * (this.round - 1));
            newEnemy.health = newEnemy.maxHealth;
            this.enemies.push(newEnemy);
        }
    }

    getDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    update(deltaTime) {
        if (!this.gameRunning || this.isPaused) {
            return;
        }

        this.elapsedGameTime += deltaTime;

        // Update player movement with collision detection
        const movement = this.input.getMovementVector();
        const deltaTimeSeconds = deltaTime / 1000;
        const newX = this.player.x + movement.dx * this.player.speed * deltaTimeSeconds;
        const newY = this.player.y + movement.dy * this.player.speed * deltaTimeSeconds;
        
        // Check collision before moving
        if (!this.mapManager.checkCollision(newX, this.player.y, 'player')) {
            this.player.x = Math.max(0, Math.min(this.mapManager.mapWidth * this.mapManager.tileSize - this.mapManager.tileSize, newX));
        }
        if (!this.mapManager.checkCollision(this.player.x, newY, 'player')) {
            this.player.y = Math.max(0, Math.min(this.mapManager.mapHeight * this.mapManager.tileSize - this.mapManager.tileSize, newY));
        }

        // Update camera
        this.camera.update();
        
        // Update projectile firing
        this.projectileCooldown -= deltaTime;
        if (this.input.isMouseClicked() && this.projectileCooldown <= 0) {
            this.fireProjectileAtMouse();
            this.projectileCooldown = this.player.projectileFireRate;
        }
        
        // Update projectiles with collision detection
        this.projectiles = this.projectiles.filter(proj => {
            const newProjX = proj.x + proj.dx * this.player.projectileSpeed * deltaTimeSeconds;
            const newProjY = proj.y + proj.dy * this.player.projectileSpeed * deltaTimeSeconds;
            
            // Check tile collision
            if (this.mapManager.checkCollision(newProjX, newProjY, 'projectile')) {
                return false; // Remove projectile
            }
            
            proj.x = newProjX;
            proj.y = newProjY;
            
            // Check if projectile is out of bounds
            if (proj.x < 0 || proj.x > this.mapManager.mapWidth * this.mapManager.tileSize || 
                proj.y < 0 || proj.y > this.mapManager.mapHeight * this.mapManager.tileSize) {
                return false;
            }
            
            // Check collision with enemies
            for (let enemy of this.enemies) {
                if (!enemy.dead && this.getDistance(proj.x, proj.y, enemy.x + 8, enemy.y + 8) < 12) {
                    enemy.takeDamage(this.player.projectileDamage, proj.x, proj.y);
                    if (enemy.dead) {
                        this.score += 10 * this.round; // Add points for kill
                    }
                    return false; // Projectile is consumed
                }
            }
            
            return true;
        });
        
        // Update enemies
        this.enemyMoveTimer += deltaTime;
        const moveEnemies = this.enemyMoveTimer >= this.enemyMoveInterval;

        for (let enemy of this.enemies) {
            enemy.update(deltaTime, this.player, this);

            if (enemy.dead && enemy.respawnTimer <= 0) {
                // Don't respawn automatically, wait for next round
            } else if (!enemy.dead && moveEnemies) {
                enemy.moveTowards(this.player.x, this.player.y, this);
            }
        }
        
        // Reset enemy move timer
        if (moveEnemies) {
            this.enemyMoveTimer = 0;
        }
        
        // Check for end of round
        if (this.roundState === 'playing' && this.enemies.every(e => e.dead)) {
            this.startBetweenRounds();
        }
        
        // Update UI
        this.updateUI();
        this.healthBar.update(deltaTime, this.player.health, this.player.maxHealth);
        this.particleManager.update(deltaTime);
    }

    startBetweenRounds() {
        this.roundState = 'between_rounds';
        this.betweenRoundsTimer = this.betweenRoundsDuration;
        document.getElementById('healthBarContainer').style.opacity = 0.7;

        const messageElement = document.getElementById('roundMessage');
        if (this.round >= this.finalRound) {
            messageElement.textContent = 'Final Round Clear!';
        } else {
            messageElement.textContent = `Round ${this.round} Clear!`;
        }
        messageElement.style.opacity = 1;

        setTimeout(() => {
            messageElement.style.opacity = 0;
            if (this.round < this.finalRound) {
                this.nextRound();
            } else {
                // Game win condition
                this.isPaused = true;
                messageElement.textContent = 'YOU WIN!';
                messageElement.style.opacity = 1;
            }
        }, this.betweenRoundsDuration);
    }

    nextRound() {
        this.round++;
        this.roundState = 'playing';
        document.getElementById('healthBarContainer').style.opacity = 0.2;

        // Increase enemy count and reset enemies
        this.maxEnemies = Math.min(10, 5 + this.round -1);
        this.enemies = [];
        this.spawnInitialEnemies();
    }

    fireProjectileAtMouse() {
        if (this.roundState !== 'playing') return;
        const mousePos = this.input.getMousePosition();
        // Adjust mouse position by camera offset to get world coordinates
        const scale = this.displayScale || 1;
        const worldMouseX = mousePos.x / scale + this.camera.x;
        const worldMouseY = mousePos.y / scale + this.camera.y;

        const playerCenterX = this.player.x + this.mapManager.tileSize / 2;
        const playerCenterY = this.player.y + this.mapManager.tileSize / 2;
        
        const dx = worldMouseX - playerCenterX;
        const dy = worldMouseY - playerCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 10) {
            // Alternate between particle effect and projectile
            if (this.lastProjectileWasParticle) {
                this.projectiles.push({
                    x: playerCenterX,
                    y: playerCenterY,
                    dx: (dx / distance),
                    dy: (dy / distance),
                    tileIndex: this.player.projectileTileIndex || 115
                });
                this.lastProjectileWasParticle = false;
            } else {
                this.particleManager.createEffect(playerCenterX, playerCenterY);
                this.lastProjectileWasParticle = true;
            }
        }
    }

    resetGame() {
        // Reset player
        this.player.x = 256;
        this.player.y = 160;
        this.player.health = this.player.maxHealth;
        
        // Clear projectiles
        this.projectiles = [];
        
        // Reset enemies
        this.enemies = [];
        this.spawnInitialEnemies();
        
        // Reset timers
        this.enemyMoveTimer = 0;
        this.projectileCooldown = 0;
    }

    updateUI() {
        document.getElementById('enemyCount').textContent = this.enemies.filter(e => !e.dead).length;
        document.getElementById('roundNumber').textContent = this.round;
        document.getElementById('playerScore').textContent = this.score;

        const activeClassNameElement = document.getElementById('activeClassName');
        if (activeClassNameElement) {
            activeClassNameElement.textContent = this.player.classInfo.name;
        }

        const expandMapBtn = document.getElementById('expandMapBtn');
        expandMapBtn.textContent = `Expand Map (Cost: ${this.mapExpansionCost})`;
        expandMapBtn.disabled = this.score < this.mapExpansionCost;

        const healthBarContainer = document.getElementById('healthBarContainer');
        const healthBarImage = this.healthBar.getImage();
        if (healthBarContainer && healthBarImage) {
            if (!healthBarContainer.firstChild || healthBarContainer.firstChild.src !== healthBarImage.src) {
                healthBarContainer.innerHTML = '';
                healthBarContainer.appendChild(healthBarImage);
            }
        }
    }

    expandMap() {
        if (this.score >= this.mapExpansionCost) {
            this.score -= this.mapExpansionCost;

            // Delegate to MapManager
            this.mapManager.expandMap();

            // Update camera boundaries
            this.camera.updateMapSize(
                this.mapManager.mapWidth * this.mapManager.tileSize,
                this.mapManager.mapHeight * this.mapManager.tileSize
            );

            this.updateViewportMetrics();

            // Increase cost for next expansion
            this.mapExpansionCost = Math.floor(this.mapExpansionCost * 1.8);

            console.log(`Map expanded to ${this.mapManager.mapWidth}x${this.mapManager.mapHeight}`);
            this.updateUI();
        }
    }

    render() {
        const worldCtx = this.renderCtx;
        const targetWidth = this.renderTarget.width;
        const targetHeight = this.renderTarget.height;

        // Clear offscreen target
        worldCtx.setTransform(1, 0, 0, 1, 0, 0);
        worldCtx.imageSmoothingEnabled = false;
        worldCtx.fillStyle = '#000';
        worldCtx.fillRect(0, 0, targetWidth, targetHeight);

        worldCtx.save();
        worldCtx.translate(-this.camera.x, -this.camera.y);

        const tileSize = this.mapManager.tileSize;
        const startCol = Math.max(0, Math.floor(this.camera.x / tileSize));
        const startRow = Math.max(0, Math.floor(this.camera.y / tileSize));
        const visibleCols = Math.ceil(targetWidth / tileSize) + 2;
        const visibleRows = Math.ceil(targetHeight / tileSize) + 2;
        const endCol = Math.min(this.mapManager.mapWidth, startCol + visibleCols);
        const endRow = Math.min(this.mapManager.mapHeight, startRow + visibleRows);

        for (let y = startRow; y < endRow; y++) {
            for (let x = startCol; x < endCol; x++) {
                if (this.mapManager.gameMapData[y] && this.mapManager.gameMapData[y][x]) {
                    this.mapManager.gameMapData[y][x].forEach(tileIdx => {
                        if (tileIdx >= 0 && tileIdx < 132) {
                            const tileName = `tile_${String(tileIdx).padStart(4, '0')}`;
                            this.atlas.drawTile(worldCtx, tileName, x * tileSize, y * tileSize, tileSize, tileSize);
                        }
                    });
                }
            }
        }

        for (let enemy of this.enemies) {
            enemy.draw(worldCtx, this.atlas, this.elapsedGameTime);
        }

        const playerTileName = `tile_${String(this.player.tileIndex).padStart(4, '0')}`;
        this.atlas.drawTile(worldCtx, playerTileName, Math.round(this.player.x), Math.round(this.player.y), tileSize, tileSize);

        const projectileSize = tileSize / 2;
        for (let proj of this.projectiles) {
            const projTileName = `tile_${String(proj.tileIndex).padStart(4, '0')}`;
            this.atlas.drawTile(
                worldCtx,
                projTileName,
                proj.x - projectileSize / 2,
                proj.y - projectileSize / 2,
                projectileSize,
                projectileSize
            );
        }

        this.particleManager.render(worldCtx);
        worldCtx.restore();

        // Blit scaled result to the display canvas
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(
            this.renderTarget,
            0,
            0,
            targetWidth,
            targetHeight,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        // Draw crosshair at mouse position (screen space)
        const mousePos = this.input.getMousePosition();
        this.ctx.save();
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.7;

        this.ctx.beginPath();
        this.ctx.moveTo(mousePos.x - 6, mousePos.y);
        this.ctx.lineTo(mousePos.x + 6, mousePos.y);
        this.ctx.moveTo(mousePos.x, mousePos.y - 6);
        this.ctx.lineTo(mousePos.x, mousePos.y + 6);
        this.ctx.stroke();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(mousePos.x - 1, mousePos.y - 1, 2, 2);
        this.ctx.restore();
    }

    gameLoop(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        if (currentMode === 'game') {
            requestAnimationFrame((time) => this.gameLoop(time));
        }
    }
}

// --- HEALTH BAR MANAGER ---
class HealthBarManager {
    constructor() {
        this.healthBarImages = [];
        this.currentImage = null;
        this.imagePaths = [
            './assets/healthbar_01.png',
            './assets/healthbar_02.png',
            './assets/healthbar_03.png',
            './assets/healthbar_04.png',
            './assets/healthbar_05.png',
            './assets/healthbar_06.png',
            './assets/healthbar_07.png'
        ];
        this.criticalFlashTimer = 0;
        this.criticalFlashInterval = 250; // ms for flashing
        this.isFlashingImage4 = true;
        this.loaded = false;
    }

    async loadImages() {
        const imagePromises = this.imagePaths.map(path => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => {
                    console.warn(`Could not load health bar image: ${path}. A placeholder will be used.`);
                    const canvas = document.createElement('canvas');
                    canvas.width = 128;
                    canvas.height = 32;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = 'white';
                    ctx.font = '12px monospace';
                    ctx.fillText(`Missing: ${path.split('/').pop()}`, 5, 20);
                    
                    const placeholderImg = new Image();
                    placeholderImg.src = canvas.toDataURL();
                    placeholderImg.onload = () => resolve(placeholderImg);
                };
                img.src = path;
            });
        });

        this.healthBarImages = await Promise.all(imagePromises);
        if (this.healthBarImages.length > 0) {
            this.currentImage = this.healthBarImages[0];
        }
        this.loaded = true;
        console.log('Health bar images loaded.');
    }

    update(deltaTime, playerHealth, maxHealth) {
        if (!this.loaded || this.healthBarImages.length < 7) return;

        const healthPercentage = playerHealth > 0 ? playerHealth / maxHealth : 0;
        let imageIndex = -1;

        if (healthPercentage <= 0) {
            imageIndex = 6; // healthbar_07
        } else if (healthPercentage <= 0.20) {
            imageIndex = 6; // healthbar_07
        } else if (healthPercentage <= 0.40) {
            imageIndex = 5; // healthbar_06
        } else if (healthPercentage <= 0.60) {
            // Critical flash range
            this.criticalFlashTimer += deltaTime;
            if (this.criticalFlashTimer >= this.criticalFlashInterval) {
                this.criticalFlashTimer = 0;
                this.isFlashingImage4 = !this.isFlashingImage4;
            }
            imageIndex = this.isFlashingImage4 ? 3 : 4; // healthbar_04 or healthbar_05
        } else if (healthPercentage <= 0.80) {
            imageIndex = 2; // healthbar_03
        } else if (healthPercentage < 1.0) {
            imageIndex = 1; // healthbar_02
        } else { // 100%
            imageIndex = 0; // healthbar_01
        }

        if (imageIndex !== -1) {
            this.currentImage = this.healthBarImages[imageIndex];
        }
    }

    getImage() {
        return this.currentImage;
    }
}

// --- PARTICLE MANAGER ---
class ParticleManager {
    constructor() {
        this.particleSamplerImage = null;
        this.particles = [];
        this.loaded = false;
        this.samplerPath = './assets/particlesampler.png';
        this.frameCount = 0;
    }

    async loadParticleSampler() {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.particleSamplerImage = img;
                this.loaded = true;
                console.log('Particle sampler loaded.');
                resolve();
            };
            img.onerror = () => {
                console.warn(`Could not load particle sampler: ${this.samplerPath}. A placeholder will be used.`);
                const canvas = document.createElement('canvas');
                canvas.width = 128;
                canvas.height = 128;
                const ctx = canvas.getContext('2d');
                // Create a colorful gradient for placeholder
                const gradient = ctx.createLinearGradient(0, 0, 128, 128);
                gradient.addColorStop(0, 'magenta');
                gradient.addColorStop(0.5, 'yellow');
                gradient.addColorStop(1, 'cyan');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 128, 128);
                
                const placeholderImg = new Image();
                placeholderImg.src = canvas.toDataURL();
                placeholderImg.onload = () => {
                    this.particleSamplerImage = placeholderImg;
                    this.loaded = true;
                    resolve();
                };
            };
            img.src = this.samplerPath;
        });
    }

    getSampledColor(x, y) {
        if (!this.loaded || !this.particleSamplerImage) {
            return `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},1)`;
        }
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.particleSamplerImage.width;
        canvas.height = this.particleSamplerImage.height;
        ctx.drawImage(this.particleSamplerImage, 0, 0);

        const pixelData = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
        return `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
    }

    createEffect(x, y) {
        if (!this.loaded) return;

        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        let sampleX = this.frameCount % this.particleSamplerImage.width;
        
        let tempY = (day + month + year);
        if (sampleX > 0) {
            tempY /= sampleX;
        }
        
        let sampleY = Math.floor(tempY) % this.particleSamplerImage.height;

        sampleX = Math.max(0, Math.min(sampleX, this.particleSamplerImage.width - 1));
        sampleY = Math.max(0, Math.min(sampleY, this.particleSamplerImage.height - 1));

        const numParticles = 30 + Math.random() * 20;
        for (let i = 0; i < numParticles; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 2;
            const life = 400 + Math.random() * 400;
            
            const colorX = (sampleX + Math.floor(Math.random() * 10 - 5) + this.particleSamplerImage.width) % this.particleSamplerImage.width;
            const colorY = (sampleY + Math.floor(Math.random() * 10 - 5) + this.particleSamplerImage.height) % this.particleSamplerImage.height;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: life,
                maxLife: life,
                size: 2 + Math.random() * 3,
                color: this.getSampledColor(colorX, colorY)
            });
        }
    }

    update(deltaTime) {
        this.frameCount++;
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= deltaTime;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.99;
                p.vy *= 0.99;
            }
        }
    }

    render(ctx) {
        ctx.save();
        for (const p of this.particles) {
            const alpha = p.life / p.maxLife;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}
