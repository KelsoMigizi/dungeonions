const playerClasses = {
    wizard: {
        name: 'Wizard',
        tileIndex: 84,
        baseHealth: 100,
        baseSpeed: 120, // pixels per second
        projectileDamage: 5,
        projectileSpeed: 250, // pixels per second
        projectileFireRate: 200, // ms
    }
    // Future classes like Knight, Archer, etc. can be added here
};

class Player {
    constructor(playerClassName) {
        const playerClass = playerClasses[playerClassName];
        if (!playerClass) {
            throw new Error(`Player class "${playerClassName}" not found.`);
        }

        this.classInfo = playerClass;
        
        // Position and core stats
        this.x = 256;
        this.y = 160;
        this.health = this.classInfo.baseHealth;
        this.maxHealth = this.classInfo.baseHealth;
        
        // Class-specific properties
        this.speed = this.classInfo.baseSpeed;
        this.tileIndex = this.classInfo.tileIndex;
        this.projectileDamage = this.classInfo.projectileDamage;
        this.projectileSpeed = this.classInfo.projectileSpeed;
        this.projectileFireRate = this.classInfo.projectileFireRate;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
        // This function can be expanded later to trigger other effects on taking damage.
    }

    reset() {
        this.x = 256;
        this.y = 160;
        this.health = this.maxHealth;
    }
}
