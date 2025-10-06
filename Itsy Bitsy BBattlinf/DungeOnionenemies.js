const enemyTypes = {
    crab: {
        name: 'Crab',
        tileIndex: 110,
        health: 10,
        speed: 40, // pixels per second for smooth movement
        damage: 10,
        minSpawnDistance: 100,
        attackCooldown: 1000, // ms between attacks
        knockbackForce: 120, // knockback speed in pixels per second
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

        // Position and smooth movement
        this.x = startX;
        this.y = startY;
        this.targetX = startX;
        this.targetY = startY;
        this.visualX = startX; // For interpolated rendering
        this.visualY = startY;

        // Movement state
        this.isMoving = false;
        this.moveSpeed = this.type.speed || 40;

        // Combat state
        this.dead = false;
        this.respawnTimer = 0;
        this.attackCooldown = 0;
        this.knockbackVelocityX = 0;
        this.knockbackVelocityY = 0;

        // Visual effects
        this.hurtFlashTimer = 0;
        this.deathAnimationTimer = 0;
        this.bobOffset = Math.random() * Math.PI * 2; // For idle animation
        this.scale = 1.0;

        // Stats from type
        this.health = this.type.health;
        this.maxHealth = this.type.health;
        this.tileIndex = this.type.tileIndex;
        this.damage = this.type.damage;
    }

    takeDamage(amount, fromX = this.x, fromY = this.y) {
        if (this.dead) return;

        this.health -= amount;
        this.hurtFlashTimer = 150; // Flash red for 150ms

        // Apply knockback
        const dx = this.x - fromX;
        const dy = this.y - fromY;
        const distance = Math.hypot(dx, dy);
        if (distance > 0) {
            const force = this.type.knockbackForce || 0;
            this.knockbackVelocityX = (dx / distance) * force;
            this.knockbackVelocityY = (dy / distance) * force;
        }

        if (this.health <= 0) {
            this.health = 0;
            this.dead = true;
            this.isMoving = false;
            this.attackCooldown = 0;
            this.deathAnimationTimer = 500; // Death animation duration in ms
            this.respawnTimer = 3000 + Math.random() * 5000;
        }
    }

    respawn(x, y) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.visualX = x;
        this.visualY = y;
        this.health = this.maxHealth;
        this.dead = false;
        this.respawnTimer = 0;
        this.deathAnimationTimer = 0;
        this.hurtFlashTimer = 0;
        this.scale = 1.0;
        this.knockbackVelocityX = 0;
        this.knockbackVelocityY = 0;
        this.isMoving = false;
    }

    update(deltaTime, player, gameManager) {
        const dt = deltaTime / 1000; // Convert to seconds

        if (this.dead) {
            // Update death animation
            if (this.deathAnimationTimer > 0) {
                this.deathAnimationTimer -= deltaTime;
                // Shrink and fade during death
                this.scale = Math.max(0, this.deathAnimationTimer / 500);
            }

            this.respawnTimer -= deltaTime;
            if (this.respawnTimer <= 0) {
                // Respawn logic handled by GameManager
            }
            return;
        }

        // Update visual effects timers
        if (this.hurtFlashTimer > 0) {
            this.hurtFlashTimer -= deltaTime;
        }

        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown = Math.max(0, this.attackCooldown - deltaTime);
        }

        // Apply knockback with friction
        if (this.knockbackVelocityX !== 0 || this.knockbackVelocityY !== 0) {
            const newX = this.x + this.knockbackVelocityX * dt;
            const newY = this.y + this.knockbackVelocityY * dt;

            if (!gameManager.mapManager.checkCollision(newX, this.y, 'player')) {
                this.x = newX;
                this.targetX = newX;
            } else {
                this.knockbackVelocityX = 0;
            }
            if (!gameManager.mapManager.checkCollision(this.x, newY, 'player')) {
                this.y = newY;
                this.targetY = newY;
            } else {
                this.knockbackVelocityY = 0;
            }

            // Apply friction
            const friction = Math.exp(-8 * dt);
            this.knockbackVelocityX *= friction;
            this.knockbackVelocityY *= friction;

            // Stop knockback when velocity is very small
            if (Math.abs(this.knockbackVelocityX) < 1) this.knockbackVelocityX = 0;
            if (Math.abs(this.knockbackVelocityY) < 1) this.knockbackVelocityY = 0;
        }

        // Smooth movement interpolation
        if (this.isMoving) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const remainingDistance = Math.hypot(dx, dy);
            const moveDistance = this.moveSpeed * dt;

            if (remainingDistance > 0.5 && moveDistance > 0) {
                if (moveDistance >= remainingDistance) {
                    this.x = this.targetX;
                    this.y = this.targetY;
                    this.isMoving = false;
                } else {
                    const stepX = (dx / remainingDistance) * moveDistance;
                    const stepY = (dy / remainingDistance) * moveDistance;
                    const nextX = this.x + stepX;
                    const nextY = this.y + stepY;

                    const blockedX = gameManager.mapManager.checkCollision(nextX, this.y, 'player');
                    const blockedY = gameManager.mapManager.checkCollision(this.x, nextY, 'player');

                    if (!blockedX) {
                        this.x = nextX;
                    } else {
                        this.targetX = this.x;
                    }
                    if (!blockedY) {
                        this.y = nextY;
                    } else {
                        this.targetY = this.y;
                    }

                    if (blockedX && blockedY) {
                        this.isMoving = false;
                    }
                }
            } else {
                this.x = this.targetX;
                this.y = this.targetY;
                this.isMoving = false;
            }
        }

        // Smooth visual position interpolation (for extra smoothness)
        const lerpSpeed = 10; // Higher = snappier movement
        const lerpFactor = Math.min(1, lerpSpeed * dt);
        this.visualX += (this.x - this.visualX) * lerpFactor;
        this.visualY += (this.y - this.visualY) * lerpFactor;

        // Check for collision with player and attack
        const distToPlayer = gameManager.getDistance(this.x + 8, this.y + 8, player.x + 8, player.y + 8);
        if (distToPlayer < 16 && this.attackCooldown <= 0) {
            player.takeDamage(this.damage);
            this.attackCooldown = this.type.attackCooldown || 1000;

            // Small knockback when attacking
            if (distToPlayer > 0) {
                this.knockbackVelocityX = (this.x - player.x) / distToPlayer * 50;
                this.knockbackVelocityY = (this.y - player.y) / distToPlayer * 50;
            }
        }
    }

    moveTowards(targetX, targetY, gameManager) {
        if (this.dead || this.isMoving) return;

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 16) { // Only move if far enough from target
            const moveDistance = Math.min(distance * 0.5, 24); // Move up to 24 pixels towards the target
            const newTargetX = this.x + (dx / distance) * moveDistance;
            const newTargetY = this.y + (dy / distance) * moveDistance;

            const withinBoundsX = Math.max(0, Math.min(
                gameManager.mapManager.mapWidth * gameManager.mapManager.tileSize - gameManager.mapManager.tileSize,
                newTargetX
            ));
            const withinBoundsY = Math.max(0, Math.min(
                gameManager.mapManager.mapHeight * gameManager.mapManager.tileSize - gameManager.mapManager.tileSize,
                newTargetY
            ));

            if (!gameManager.mapManager.checkCollision(withinBoundsX, withinBoundsY, 'player')) {
                this.targetX = withinBoundsX;
                this.targetY = withinBoundsY;
                this.isMoving = true;
            } else {
                // Try to move around obstacle with a random angle offset
                const angleOffset = (Math.random() - 0.5) * Math.PI / 2;
                const newAngle = Math.atan2(dy, dx) + angleOffset;
                const altTargetX = this.x + Math.cos(newAngle) * moveDistance;
                const altTargetY = this.y + Math.sin(newAngle) * moveDistance;

                const clampedAltX = Math.max(0, Math.min(
                    gameManager.mapManager.mapWidth * gameManager.mapManager.tileSize - gameManager.mapManager.tileSize,
                    altTargetX
                ));
                const clampedAltY = Math.max(0, Math.min(
                    gameManager.mapManager.mapHeight * gameManager.mapManager.tileSize - gameManager.mapManager.tileSize,
                    altTargetY
                ));

                if (!gameManager.mapManager.checkCollision(clampedAltX, clampedAltY, 'player')) {
                    this.targetX = clampedAltX;
                    this.targetY = clampedAltY;
                    this.isMoving = true;
                }
            }
        }
    }

    draw(ctx, atlas, gameTime = 0) {
        if (this.dead && this.deathAnimationTimer <= 0) return;

        ctx.save();

        // Use visual position for smooth rendering
        const drawX = Math.round(this.visualX);
        const drawY = Math.round(this.visualY);

        // Apply idle bob animation
        let bobY = 0;
        if (!this.dead && !this.isMoving) {
            bobY = Math.sin(gameTime * 0.003 + this.bobOffset) * 2;
        }

        // Death animation effects
        if (this.dead) {
            ctx.globalAlpha = this.scale;
        }

        // Hurt flash effect
        if (this.hurtFlashTimer > 0 && !this.dead) {
            const flashIntensity = this.hurtFlashTimer / 150;
            ctx.filter = `brightness(${1 + flashIntensity * 0.5}) saturate(${1 + flashIntensity})`;
        }

        const enemyTileName = `tile_${String(this.tileIndex).padStart(4, '0')}`;
        const tile = atlas.tiles ? atlas.tiles[enemyTileName] : null;
        const tileCanvas = tile ? tile.canvas : null;
        const tileImageData = tile ? tile.imageData : atlas.getTile(enemyTileName);

        if (tileCanvas) {
            if (this.scale !== 1.0) {
                const centerX = drawX + 8;
                const centerY = drawY + 8 + bobY;
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.scale(this.scale, this.scale);
                ctx.drawImage(tileCanvas, -8, -8);
                ctx.restore();
            } else {
                ctx.drawImage(tileCanvas, drawX, drawY + bobY);
            }
        } else if (tileImageData) {
            // Fallback to drawing raw image data if needed
            ctx.putImageData(tileImageData, drawX, drawY + bobY);
        }

        ctx.filter = 'none';
        ctx.globalAlpha = 1;

        // Draw health bar (only if damaged and alive)
        if (this.health < this.maxHealth && !this.dead) {
            const barWidth = 14;
            const barHeight = 3;
            const barY = drawY - 5;
            const healthPercent = Math.max(0, this.health / this.maxHealth);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(drawX + 1, barY - 1, barWidth + 2, barHeight + 2);

            ctx.fillStyle = '#4a0000';
            ctx.fillRect(drawX + 2, barY, barWidth, barHeight);

            const gradient = ctx.createLinearGradient(drawX + 2, barY, drawX + 2 + barWidth, barY);
            if (healthPercent > 0.5) {
                gradient.addColorStop(0, '#00ff00');
                gradient.addColorStop(1, '#00aa00');
            } else if (healthPercent > 0.25) {
                gradient.addColorStop(0, '#ffff00');
                gradient.addColorStop(1, '#aaaa00');
            } else {
                gradient.addColorStop(0, '#ff0000');
                gradient.addColorStop(1, '#aa0000');
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(drawX + 2, barY, barWidth * healthPercent, barHeight);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(drawX + 2, barY, barWidth * healthPercent, 1);
        }

        ctx.restore();
    }
}

if (typeof window !== 'undefined') {
    window.enemyTypes = enemyTypes;
    window.Enemy = Enemy;
}
