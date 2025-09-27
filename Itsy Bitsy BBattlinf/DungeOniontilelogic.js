class TileManager {
    constructor() {
        this.tileProperties = [
            { "tileIndex": 0, "description": "Stone Wall Top Left Corner", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 1, "description": "Stone Wall Top", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 2, "description": "Stone Wall Top Right Corner", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 3, "description": "Stone Wall Top T-Junction Down", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 4, "description": "Stone Wall Top End (Cap Right)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 5, "description": "Stone Wall Top End (Cap Left)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 6, "description": "Stone Wall Top with Shield", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 7, "description": "Stone Wall Top (Single Block)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 8, "description": "Stone Wall Top (Detailed)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 9, "description": "Stone Wall Top (Pillar Top Left)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 10, "description": "Stone Wall Top (Pillar Top Right)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 11, "description": "Stone Wall Top (Archway Top)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 12, "description": "Stone Wall Left Side", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 13, "description": "Stone Wall Center Block", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 14, "description": "Stone Wall with Banner", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 15, "description": "Stone Wall Right Side", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 16, "description": "Stone Wall with Barred Window", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 17, "description": "Stone Wall (Plain)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 18, "description": "Stone Wall with Shield Emblem", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 19, "description": "Stone Wall (Detailed Center)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 20, "description": "Stone Wall (Pillar Mid Left)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 21, "description": "Stone Wall (Pillar Mid Right)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 22, "description": "Stone Wall (Archway Mid Left)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 23, "description": "Stone Wall (Archway Mid Right)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 24, "description": "Dirt Floor Edge (Top Left)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 25, "description": "Dirt Floor", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 26, "description": "Dirt Floor with Pebbles", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 27, "description": "Dirt Floor Edge (Top Right)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 28, "description": "Wooden Plank Floor (Vertical)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 29, "description": "Wooden Plank Floor (Horizontal)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 30, "description": "Wooden Plank Floor (Cross)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 31, "description": "Floor Grate", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 32, "description": "Stone Brick Floor", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 33, "description": "Stone Slab Floor", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 34, "description": "Stone Wall (Pillar Base Left)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 35, "description": "Stone Wall (Pillar Base Right)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 36, "description": "Stone Floor (Light, Cracked)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 37, "description": "Stone Floor (Light, Plain)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 38, "description": "Stone Floor (Common Grey)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 39, "description": "Stone Floor (Darker Grey)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 40, "description": "Wooden Beam/Low Wall Base", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 41, "description": "Wooden Beam/Low Wall End", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 42, "description": "Stone Floor (Patterned)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 43, "description": "Stone Floor (Small Tiles)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 44, "description": "Stone Floor (Large Tile Center)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 45, "description": "Stone Floor (Stairs Illusion Up Left)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 46, "description": "Stone Floor (Stairs Illusion Up Right)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 47, "description": "Stone Floor (Stairs Illusion Down)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 48, "description": "UI Element (Selection Box Corner)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 49, "description": "UI Element (Selection Box Edge)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 50, "description": "UI Element (Slash Icon)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 51, "description": "Sand/Light Dirt Floor", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 52, "description": "Minecart Track (Horizontal)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 53, "description": "Minecart Track (Vertical)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 54, "description": "Minecart Track (Curve Bottom-Right)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 55, "description": "Minecart Track (Curve Top-Right)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 56, "description": "Minecart Track End/Buffer", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 57, "description": "Barrel", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 58, "description": "Crate", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 59, "description": "Chest (Closed, Brown)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 60, "description": "Wooden Door (Closed, Vertical)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 61, "description": "Wooden Door (Closed, Horizontal)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 62, "description": "Metal Door/Gate (Closed)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 63, "description": "Barrel (Side View)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 64, "description": "Crate Stack", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 65, "description": "Chest (Open, Empty)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 66, "description": "Chest (Closed, Red/Gold)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 67, "description": "Minecart (Empty)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 68, "description": "Minecart Track Intersection", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 69, "description": "Minecart Track (Horizontal, Darker)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 70, "description": "Minecart Track (Curve Top-Left)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 71, "description": "Stone Column/Pillar Base", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 72, "description": "Entity Sprite: Knight", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 73, "description": "Entity Sprite: Archer", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 74, "description": "Entity Sprite: Female Warrior", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 75, "description": "Entity Sprite: Mage/Civilian", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 76, "description": "Entity Sprite: King/Noble", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 77, "description": "Entity Sprite: Old Man/Merchant", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 78, "description": "Entity Sprite: Guard", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 79, "description": "Entity Sprite: Hooded Figure", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 80, "description": "Entity Sprite: Female Civilian", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 81, "description": "Entity Sprite: Child/Small Figure", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 82, "description": "Entity Sprite: Male Civilian", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 83, "description": "Entity Sprite: Dark Knight", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 84, "description": "Entity Sprite: Player Wizard", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 85, "description": "Entity Sprite: Alt Hero 1", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 86, "description": "Entity Sprite: Alt Hero 2", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 87, "description": "Entity Sprite: Alt Hero 3", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 88, "description": "Entity Sprite: Alt Hero 4", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 89, "description": "Entity Sprite: Alt Hero 5", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 90, "description": "Entity Sprite: Alt Hero 6", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 91, "description": "Entity Sprite: Alt Hero 7", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 92, "description": "Entity Sprite: Alt Hero 8", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 93, "description": "Entity Sprite: Alt Hero 9", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 94, "description": "Entity Sprite: Alt Hero 10", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 95, "description": "Entity Sprite: Alt Hero 11", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 96, "description": "Entity Sprite: Goblin", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 97, "description": "Entity Sprite: Skeleton", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 98, "description": "Entity Sprite: Orc/Green Monster", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 99, "description": "Entity Sprite: Slime", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 100, "description": "Entity Sprite: Eye Monster", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 101, "description": "Entity Sprite: Mushroom Monster", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 102, "description": "Entity Sprite: Snake/Worm", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 103, "description": "Entity Sprite: Zombie/Ghoul", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 104, "description": "Entity Sprite: Imp/Small Demon", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 105, "description": "Entity Sprite: Large Orc/Brute", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 106, "description": "Entity Sprite: Wolf/Dog", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 107, "description": "Entity Sprite: Minotaur/Beastman", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 108, "description": "Entity Sprite: Bat", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 109, "description": "Entity Sprite: Ghost", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 110, "description": "Entity Sprite: Crab", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 111, "description": "Entity Sprite: Small Spider", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 112, "description": "Item Sprite: Small Chest/Box", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 113, "description": "Item Sprite: Red Potion (Small)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 114, "description": "Item Sprite: Blue Potion (Small)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 115, "description": "Item Sprite: Red Potion (Large)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 116, "description": "Item Sprite: Blue Potion (Large)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 117, "description": "Item Sprite: Sword", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 118, "description": "Item Sprite: Axe", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 119, "description": "Item Sprite: Dagger", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 120, "description": "Entity Sprite: Bat (Flying)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 121, "description": "Entity Sprite: Ghost (Floating)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 122, "description": "Entity Sprite: Spider (Large)", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 123, "description": "Entity Sprite: Elemental/Goo", "magicPasses": false, "playerPasses": false },
            { "tileIndex": 124, "description": "Item Sprite: Green Potion (Small)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 125, "description": "Item Sprite: Yellow Potion (Small)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 126, "description": "Item Sprite: Green Potion (Large)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 127, "description": "Item Sprite: Yellow Potion (Large)", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 128, "description": "Item Sprite: Bow", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 129, "description": "Item Sprite: Staff", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 130, "description": "Item Sprite: Mace", "magicPasses": true, "playerPasses": true },
            { "tileIndex": 131, "description": "Empty/Dark Floor Tile", "magicPasses": true, "playerPasses": true }
        ];
    }

    getProperties(tileIndex) {
        return this.tileProperties[tileIndex] || { tileIndex: tileIndex, description: "N/A", playerPasses: true, magicPasses: true };
    }
}

// --- MAP MANAGER ---
class MapManager {
    constructor(tileSize, initialCols, initialRows, tileManager) {
        this.tileSize = tileSize;
        this.mapWidth = initialCols;
        this.mapHeight = initialRows;
        this.tileManager = tileManager;
        this.gameMapData = [];
        this.loadDefaultMap();
    }

    loadDefaultMap() {
        this.mapWidth = 32; // Default size
        this.mapHeight = 20;
        this.gameMapData = [];
        
        // First, fill the entire map with a base floor tile
        for (let r = 0; r < this.mapHeight; r++) {
            this.gameMapData[r] = [];
            for (let c = 0; c < this.mapWidth; c++) {
                this.gameMapData[r][c] = [51]; // Tile 51 is "Sand/Light Dirt Floor"
            }
        }

        const defaultDungeonLayer = [
            14,1610612787,16,1,1,3221225485,1,1,1,2,3,3,3,3,3,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            14,1610612787,17,3,3,4,1,1,1,14,41,41,41,41,41,16,1,1,1,1,1,25,1,1,1,1,1,1,1,1,1073741837,1,
            14,1610612787,58,41,41,16,25,1,1,14,1610612789,51,51,52,51,16,2,3,4,1,1,1,1,2,3,7,3,3,3,7,3,4,
            14,1610612787,51,52,51,16,1,1,1,14,1610612787,49,3221225522,49,49,16,14,41,16,1,1,536870925,1,14,41,19,41,30,41,19,41,16,
            14,1610612787,5,27,27,28,1,1073741837,1,14,1610612787,49,49,49,49,16,14,1610612789,16,1,1,1,1073741837,14,1610612789,31,51,51,52,31,51,16,
            14,1610612787,16,2,3,3,3,3,4,26,27,27,27,27,27,28,14,1610612787,17,7,3,3,4,14,1610612787,49,49,49,49,49,49,16,
            14,1610612787,16,14,41,41,41,41,17,3,3,3,3,4,1,1,14,1610612787,58,19,41,41,16,14,1610612787,49,49,49,49,49,49,16,
            18,1610612787,17,18,1610612789,51,52,51,58,41,41,22,41,16,2684354573,1,14,1610612787,51,31,51,51,16,14,1610612787,49,49,49,49,49,49,16,
            60,1610612787,58,60,1610612787,49,49,49,51,51,51,51,51,17,3,3,18,1610612787,49,43,49,3221225522,17,18,1610612787,49,49,49,49,49,2684354610,17,
            51,54,51,51,54,43,49,50,49,49,49,49,49,58,41,41,60,1610612787,49,49,43,49,58,60,37,38,38,38,38,38,39,58,
            49,43,49,49,49,49,49,49,49,49,49,49,49,51,52,51,51,54,49,49,49,49,51,52,54,49,49,49,49,49,49,51,
            49,49,49,5,27,6,1610612790,49,49,2147483698,49,49,49,49,49,49,49,49,49,49,49,49,5,27,27,27,27,27,27,27,27,
            49,49,49,16,1,14,1610612787,49,49,49,49,49,49,5,27,27,27,27,27,27,6,1610612790,49,16,1,1,1,1,1,1,1,1,
            27,27,27,28,3221225485,14,1610612787,49,49,5,27,27,27,28,2,3,3,3,3,3,18,1610612787,49,16,1,1,1,2,3,3,3,3,
            1,1,1,1,2,18,1610612787,49,49,17,3,4,1,1,14,41,20,41,41,21,60,1610612787,49,16,1,1,1073741837,14,41,11,12,41,
            1,2,3,3,18,60,1610612787,49,49,58,41,17,3,3,18,1610612789,32,51,51,33,51,54,2147483698,16,1,1,1,14,1610612789,51,51,51,
            1,14,41,41,60,1610612789,54,49,49,51,51,58,41,41,60,1610612787,49,43,49,49,49,49,49,17,3,3,3,18,1610612787,49,49,49,
            1,14,1610612789,52,51,54,49,49,2147483698,42,49,51,51,51,51,54,43,49,49,49,49,49,49,58,41,41,41,60,1610612787,49,49,49,
            1,14,1610612787,3758096434,49,49,49,49,49,3758096434,49,49,49,49,49,49,49,49,49,49,49,43,49,51,51,51,51,51,54,49,49,49,
            1,14,1610612787,49,49,49,49,49,49,49,49,49,49,49,49,49,49,49,49,49,49,49,49,49,49,49,49,49,49,3758096434,49
        ];

        // Then, layer the detailed dungeon tiles on top
        for (let r = 0; r < this.mapHeight; r++) {
            for (let c = 0; c < this.mapWidth; c++) {
                const tileId = defaultDungeonLayer[r * this.mapWidth + c];
                const actualTileId = (tileId & 0x0FFFFFFF) - 1;
                // Add the tile if it's not the same as the base floor tile we already placed
                if (actualTileId >= 0 && actualTileId < 132 && actualTileId !== 51) {
                    this.gameMapData[r][c].push(actualTileId);
                }
            }
        }
        // Make gameMapData globally accessible for now, for the editor
        window.gameMapData = this.gameMapData;
    }

    checkCollision(x, y, type) {
        const col = Math.floor(x / this.tileSize);
        const row = Math.floor(y / this.tileSize);
        
        if (row < 0 || row >= this.mapHeight || col < 0 || col >= this.mapWidth) {
            return true; // Out of bounds
        }
        
        if (!this.gameMapData[row] || !this.gameMapData[row][col]) {
            return false; // No tile data here, treat as passable
        }
        
        for (let tileIndex of this.gameMapData[row][col]) {
            const tileProps = this.tileManager.getProperties(tileIndex);
            if (!tileProps) continue;
            
            if (type === 'player' && !tileProps.playerPasses) {
                return true;
            }
            if (type === 'projectile' && !tileProps.magicPasses) {
                return true;
            }
        }
        
        return false;
    }

    expandMap() {
        const expansionAmount = 10;
        const oldWidth = this.mapWidth;
        const oldHeight = this.mapHeight;

        this.mapWidth += expansionAmount;
        this.mapHeight += expansionAmount;

        // Create a new, larger map filled with the base floor tile
        const newMapData = [];
        for (let r = 0; r < this.mapHeight; r++) {
            newMapData[r] = [];
            for (let c = 0; c < this.mapWidth; c++) {
                newMapData[r][c] = [51]; // Base floor tile
            }
        }

        // Copy the old map data into the center of the new map
        const startX = Math.floor(expansionAmount / 2);
        const startY = Math.floor(expansionAmount / 2);
        for (let r = 0; r < oldHeight; r++) {
            for (let c = 0; c < oldWidth; c++) {
                if (this.gameMapData[r] && this.gameMapData[r][c]) {
                    newMapData[r + startY][c + startX] = this.gameMapData[r][c];
                }
            }
        }

        this.gameMapData = newMapData;
        console.log(`Map expanded to ${this.mapWidth}x${this.mapHeight}`);
    }

    getMapSaveData() {
        return {
            gridCols: this.mapWidth,
            gridRows: this.mapHeight,
            tileSize: this.tileSize,
            mapData: this.gameMapData
        };
    }

    loadMapFromData(mapObject) {
        this.mapWidth = mapObject.gridCols || 32;
        this.mapHeight = mapObject.gridRows || 20;
        this.gameMapData = mapObject.mapData || [];

        // Ensure the map has a consistent structure
        for (let r = 0; r < this.mapHeight; r++) {
            if (!this.gameMapData[r]) this.gameMapData[r] = [];
            for (let c = 0; c < this.mapWidth; c++) {
                if (!Array.isArray(this.gameMapData[r][c])) {
                    this.gameMapData[r][c] = [];
                }
            }
        }
        window.gameMapData = this.gameMapData; // Update global reference for editor
        console.log(`Map loaded with dimensions ${this.mapWidth}x${this.mapHeight}`);
    }
}
