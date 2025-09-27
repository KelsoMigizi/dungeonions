const enemyTypes = {
    crab: {
        name: 'Crab',
        tileIndex: 110,
        health: 10,
        speed: 8, // This is more of a step distance for now
        damage: 10,
        minSpawnDistance: 100,
    }
    // Future enemy types like 'goblin', 'skeleton', etc. can be added here
};

class Enemy {
    constructor(enemyTypeName, startX, startY) {
        const enemyType = enemyTypes[enemyTypeName];
        if (!enemyType) {
            throw new Error(`Enemy type "${enemyTypeName}" not found.`);
        }

        this.type = enemyType;

        // Position and state
        this.x = startX;
        this.y = startY;
        this.dead = false;
        this.respawnTimer = 0;

        // Stats from type
        this.health = this.type.health;
        this.maxHealth = this.type.health;
        this.tileIndex = this.type.tileIndex;
        this.damage = this.type.damage;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.dead = true;
            this.respawnTimer = 3000 + Math.random() * 5000; // Set respawn timer
        }
    }

    respawn(x, y) {
        this.x = x;
        this.y = y;
        this.health = this.maxHealth;
        this.dead = false;
        this.respawnTimer = 0;
    }

    update(deltaTime, player, gameManager) {
        if (this.dead) {
            this.respawnTimer -= deltaTime;
            if (this.respawnTimer <= 0) {
                // Logic for respawning will be handled by the GameManager
            }
            return;
        }

        // Check for collision with player
        if (gameManager.getDistance(this.x + 8, this.y + 8, player.x + 8, player.y + 8) < 16) {
            player.takeDamage(this.damage);
            
            // Push enemy away slightly after attacking
            const dx = this.x - player.x;
            const dy = this.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0) {
                const pushbackDist = 8;
                const newX = this.x + (dx / distance) * pushbackDist;
                const newY = this.y + (dy / distance) * pushbackDist;

                if (!gameManager.mapManager.checkCollision(newX, this.y, 'player')) {
                    this.x = newX;
                }
                if (!gameManager.mapManager.checkCollision(this.x, newY, 'player')) {
                    this.y = newY;
                }
            }
        }
    }

    // The simple "move towards player" logic will still be timed by the GameManager,
    // but the action of moving will be on the enemy instance.
    moveTowards(targetX, targetY, gameManager) {
        if (this.dead) return;

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const moveDistance = 16; // Move in fixed steps for now
            const newEnemyX = this.x + (dx / distance) * moveDistance;
            const newEnemyY = this.y + (dy / distance) * moveDistance;
            
            // Check collision before moving enemy
            if (!gameManager.mapManager.checkCollision(newEnemyX, this.y, 'player')) {
                this.x = Math.max(0, Math.min(gameManager.mapManager.mapWidth * gameManager.mapManager.tileSize - gameManager.mapManager.tileSize, newEnemyX));
            }
            if (!gameManager.mapManager.checkCollision(this.x, newEnemyY, 'player')) {
                this.y = Math.max(0, Math.min(gameManager.mapManager.mapHeight * gameManager.mapManager.tileSize - gameManager.mapManager.tileSize, newEnemyY));
            }
        }
    }

    draw(ctx, atlas) {
        if (this.dead) return;

        const enemyTile = atlas.getTile(`tile_${String(this.tileIndex).padStart(4, '0')}`);
        if (enemyTile) {
            ctx.putImageData(enemyTile, Math.round(this.x), Math.round(this.y));
        }

        // Draw enemy health bar
        if (this.health < this.maxHealth) {
            const barWidth = 12;
            const barHeight = 2;
            const healthPercent = this.health / this.maxHealth;

            ctx.fillStyle = '#400'; // Dark red for background
            ctx.fillRect(this.x + 2, this.y - 4, barWidth, barHeight);
            ctx.fillStyle = '#f00'; // Bright red for health
            ctx.fillRect(this.x + 2, this.y - 4, barWidth * healthPercent, barHeight);
        }
    }
}
