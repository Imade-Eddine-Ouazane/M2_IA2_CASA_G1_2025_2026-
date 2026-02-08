class WaveManager {
    constructor() {
        this.timer = 0;
        this.nextSpawn = 0;
        this.spawnRate = 2.0; // Seconds between spawns
        this.difficultyMultiplier = 1.0;
    }

    reset() {
        this.timer = 0;
        this.nextSpawn = 0;
        this.spawnRate = 2.0;
        this.difficultyMultiplier = 1.0;
        this.bossSpawned = false;
        // Initial wave
    }

    update(dt) {
        this.timer += dt;

        // Increase difficulty every 30 seconds
        this.difficultyMultiplier = 1.0 + Math.floor(this.timer / 30) * 0.5;

        // Spawn logic
        if (this.timer >= this.nextSpawn) {
            this.spawnWave();
            this.nextSpawn = this.timer + (this.spawnRate / this.difficultyMultiplier);
        }
    }

    spawnWave() {
        // Find spawn position relative to player (outside camera)
        let spawnDist = Math.sqrt(width * width + height * height) / 2 + 50;
        let angle = random(TWO_PI);
        let x = game.player.pos.x + cos(angle) * spawnDist;
        let y = game.player.pos.y + sin(angle) * spawnDist;

        // Determine type based on time
        let type = "basic";
        if (this.timer > 30 && random() < 0.3) type = "fast";
        if (this.timer > 45 && random() < 0.2) type = "shooter"; // Start spawning shooters at 45s
        if (this.timer > 60 && random() < 0.1) type = "tank";

        // Boss Spawn every 60s (scalable)
        // If boss is alive, don't spawn another one yet? Or allow multiples?
        // Let's say one boss at a time for now.
        if (this.timer >= this.bossSpawnInterval && !this.bossSpawned) {
            type = "boss";
            this.bossSpawned = true;
            // Notify user? 
        }

        // Spawn from pool
        // Pass difficulty multiplier to enemy reset
        let enemy = game.enemyPool.spawn(type, x, y, this.difficultyMultiplier);
        game.enemies.push(enemy);
    }

    onBossKilled() {
        this.bossSpawned = false;
        this.timer = 0; // Reset wave timer to loop? Or just keep increasing?
        // If we reset timer, we get basic enemies again but with higher multiplier.
        // Let's reset timer for the "loop" feel but keep increasing difficulty.

        this.difficultyMultiplier += 0.5; // Big jump in difficult
        game.ui.showMessage("BOSS DEFEATED! DIFFICULTY UP!");
    }
}
