class Game {
    constructor() {
        this.state = "MENU"; // MENU, PLAY, PAUSE, GAME_OVER
        this.width = windowWidth;
        this.height = windowHeight;

        // Systems
        this.camera = new Camera();
        this.waveManager = new WaveManager();
        this.upgradeSystem = new UpgradeSystem();
        this.ui = new UI();

        // Entities
        this.player = null;
        this.enemies = []; // Will be managed via Pool, but kept in array for updates
        this.projectiles = [];
        this.particles = [];
        this.xpOrbs = [];

        this.debug = false;

        // Pools
        this.enemyPool = null;
        this.projectilePool = null;
        this.particlePool = null;
        this.xpPool = null;

        this.init();
    }

    init() {
        // Initialize Pools
        this.enemyPool = new ObjectPool(
            () => new Enemy(),
            (e, type, x, y, diff) => e.reset(type, x, y, diff),
            200
        );

        this.projectilePool = new ObjectPool(
            () => new Projectile(),
            (p, x, y, vel, damage, behavior, owner, pierce) => p.reset(x, y, vel, damage, behavior, owner, pierce),
            100
        );

        this.xpPool = new ObjectPool(
            () => new XPOrb(),
            (o, x, y, val) => o.reset(x, y, val),
            100
        );

        // Initialize Player
        this.player = new Player(0, 0); // Spawns at world center
    }

    start() {
        this.state = "PLAY";
        this.waveManager.reset();
    }

    update() {
        if (this.state === "PLAY") {
            let dt = deltaTime / 1000; // Delta time in seconds

            // System Updates
            this.waveManager.update(dt);

            // Entity Updates
            this.player.update(dt);
            this.player.applyBehaviors(this.enemies, this.xpOrbs);

            // Update Enemies
            for (let i = this.enemies.length - 1; i >= 0; i--) {
                let e = this.enemies[i];
                e.applyBehaviors(this.player, this.enemies); // Flocking + seek
                e.update(dt);
                if (!e.alive) {
                    this.enemyPool.returnToPool(e);
                    this.enemies.splice(i, 1);
                }
            }

            // Update Projectiles
            for (let i = this.projectiles.length - 1; i >= 0; i--) {
                let p = this.projectiles[i];
                p.update(dt);
                if (!p.alive) {
                    this.projectilePool.returnToPool(p);
                    this.projectiles.splice(i, 1);
                }
            }

            // Update XP Orbs
            for (let i = this.xpOrbs.length - 1; i >= 0; i--) {
                let orb = this.xpOrbs[i];
                orb.update(dt, this.player);
                if (!orb.alive) {
                    this.xpPool.returnToPool(orb);
                    this.xpOrbs.splice(i, 1);
                }
            }

            // Camera Follow
            this.camera.follow(this.player);

            // Collisions
            checkCollisions(this);
        }
    }

    draw() {
        background(20);

        if (this.state === "PLAY" || this.state === "PAUSE" || this.state === "GAME_OVER") {
            this.camera.apply(); // Apply translation/shake

            // Draw World Grid (Optional, helps visualize movement)
            drawGrid(this.player.pos);

            // Draw Entities
            this.xpOrbs.forEach(o => o.show());
            this.projectiles.forEach(p => p.show());
            this.enemies.forEach(e => e.show());
            this.player.show();

            this.camera.reset(); // Reset translation for UI

            // Draw HUD
            this.ui.drawHUD(this.player, this.waveManager);
            this.ui.drawMessage(); // Show temporary messages

            // Debug Overlay
            if (this.debug) {
                this.ui.drawDebugInfo(this);
            }
        }

        if (this.state === "MENU") {
            this.ui.drawMenu();
        } else if (this.state === "PAUSE") {
            this.ui.drawPause();
        } else if (this.state === "GAME_OVER") {
            this.ui.drawGameOver();
        } else if (this.state === "VICTORY") {
            this.ui.drawVictory();
        }
    }

    keyPressed() {
        if (keyCode === 68) { // 'D' key
            this.debug = !this.debug;
        }
    }
}

// Helper for infinite grid
function drawGrid(pos) {
    push();
    stroke(255, 10);
    strokeWeight(1);
    let gridSize = 100;
    let offsetX = pos.x % gridSize;
    let offsetY = pos.y % gridSize;

    // Draw relative to player to simulate infinite world
    // Actually we just draw a screen-sized grid that scrolls
    // But since we are using camera translate, we can just draw lines around the camera view?
    // Simplified: No grid for now to save performance, or add later.
    pop();
}

function checkCollisions(game) {
    // Player vs XP
    for (let orb of game.xpOrbs) {
        if (p5.Vector.dist(game.player.pos, orb.pos) < game.player.r + orb.r) {
            game.player.gainXP(orb.value);
            orb.alive = false;
        }
    }

    // Projectiles collision
    for (let p of game.projectiles) {
        if (!p.alive) continue;

        // If Player Projectile -> Hits Enemies
        if (p.owner === game.player) {
            for (let e of game.enemies) {
                if (e.alive && !p.hitList.includes(e)) {
                    if (p5.Vector.dist(p.pos, e.pos) < p.r + e.r) {
                        e.takeDamage(p.damage);
                        p.hitList.push(e); // Mark as hit

                        // Pierce Logic
                        p.pierce--;
                        if (p.pierce <= 0) {
                            p.alive = false;
                        }

                        if (!e.alive) {
                            // Drop XP
                            let orb = game.xpPool.spawn(e.pos.x, e.pos.y, e.xpValue);
                            game.xpOrbs.push(orb);

                            // Boss Kill
                            if (e.type === "boss") {
                                game.waveManager.onBossKilled();
                            }
                        }

                        if (!p.alive) break; // Optimization
                    }
                }
            }
        }
        // If Enemy Projectile -> Hits Player
        else if (p.owner instanceof Enemy) {
            if (p5.Vector.dist(p.pos, game.player.pos) < p.r + game.player.r) {
                game.player.takeDamage(p.damage); // Player needs takeDamage or adjust health directly
                p.alive = false;
            }
        }
    }

    // Enemies vs Player
    for (let e of game.enemies) {
        if (e.alive && p5.Vector.dist(e.pos, game.player.pos) < e.r + game.player.r) {
            game.player.takeDamage(e.damage);
        }
    }
}
