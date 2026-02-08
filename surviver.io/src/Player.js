class Player extends Vehicle {
    constructor(x, y) {
        super(x, y);
        this.r = 20;
        this.r_pourDessin = 20;
        this.color = "lime";

        // Stats
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.speed = 4;
        this.maxForce = 0.5;
        this.xp = 0;
        this.level = 1;
        this.nextLevelXP = 100;
        this.magnetRadius = 100;

        // Inventory
        this.weapons = [];
        // Add default weapon
        this.weapons.push(new Wand(this));
    }

    update(dt) {
        super.update(); // Physics update
        this.handleInput();

        // Update Weapons
        for (let w of this.weapons) {
            w.update(dt);
        }
    }

    handleInput() {
        let force = createVector(0, 0);
        if (keyIsDown(87) || keyIsDown(UP_ARROW)) force.y -= 1; // W
        if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) force.y += 1; // S
        if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) force.x -= 1; // A
        if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) force.x += 1; // D

        force.setMag(this.maxForce);
        this.applyForce(force);

        // Friction
        if (force.mag() === 0) {
            let friction = this.vel.copy();
            friction.mult(-0.1);
            this.applyForce(friction);
        }
    }

    applyBehaviors(enemies, xpOrbs) {
        // 1. Magnet XP
        for (let orb of xpOrbs) {
            if (p5.Vector.dist(this.pos, orb.pos) < this.magnetRadius) {
                orb.seek(this.pos);
            }
        }

        // 2. Auto-Fire Weapons (Find targets)
        for (let w of this.weapons) {
            w.scanAndFire(enemies);
        }
    }

    gainXP(amount) {
        this.xp += amount;
        if (this.xp >= this.nextLevelXP) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.xp -= this.nextLevelXP;
        this.nextLevelXP = Math.floor(this.nextLevelXP * 1.2);
        this.health = this.maxHealth; // Full heal on level up
        // Trigger UI
        game.state = "PAUSE"; // Pause for upgrade selection
        game.ui.showUpgradeMenu();
    }

    takeDamage(amount) {
        this.health -= amount;
        game.camera.shake(5);
        // Floating text?
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
            game.state = "GAME_OVER";
        }
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        // Breathing animation
        let breath = sin(frameCount * 0.1) * 2;
        let rAnim = this.r_pourDessin + breath;

        fill(this.color);
        stroke(255);
        strokeWeight(2);
        ellipse(0, 0, rAnim * 2);

        // Direction pointer (Gun?)
        let mousePos = createVector(mouseX, mouseY);
        // Need to account for camera translate... 
        // MouseX is screen space. Player pos in world space.
        // Easiest is to point to nearest enemy or direction of movement if no mouse aim.

        // For now, just a pointer in velocity direction
        if (this.vel.mag() > 0.1) {
            rotate(this.vel.heading());
            line(0, 0, rAnim + 10, 0);
        }

        pop();

        // Show Weapons (e.g. Orbit)
        for (let w of this.weapons) {
            w.show();
        }
    }
}
