class Weapon {
    constructor(owner) {
        this.owner = owner;
        this.cooldown = 0;
        this.fireRate = 0.5; // seconds
        this.damage = 10;
        this.range = 300;
    }

    update(dt) {
        if (this.cooldown > 0) {
            this.cooldown -= dt;
        }
    }

    scanAndFire(enemies) {
        // Override
    }

    show() {
        // Override
    }
}

class Wand extends Weapon {
    constructor(owner) {
        super(owner);
        this.name = "Magic Wand";
        this.fireRate = 0.5; // Faster auto-fire
        this.damage = 25;
        this.range = 400; // Increased range
    }

    scanAndFire(enemies) {
        if (this.cooldown > 0) return;

        // Find nearest enemy
        let nearest = null;
        let d = Infinity;
        for (let e of enemies) {
            if (!e.alive) continue;
            let dist = p5.Vector.dist(this.owner.pos, e.pos);
            if (dist < this.range && dist < d) {
                d = dist;
                nearest = e;
            }
        }

        if (nearest) {
            this.shoot(nearest);
            this.cooldown = this.fireRate;
        }
    }

    shoot(target) {
        // Spawn projectile
        let vel = p5.Vector.sub(target.pos, this.owner.pos);
        vel.setMag(10); // Projectile speed
        // Use global game instance to spawn
        let p = game.projectilePool.spawn(this.owner.pos.x, this.owner.pos.y, vel, this.damage, "linear", this.owner);
        game.projectiles.push(p);
    }
}

class OrbitWeapon extends Weapon {
    constructor(owner) {
        super(owner);
        this.name = "Orbit Shield";
        this.fireRate = 0; // Continuous
        this.damage = 5;
        this.projectiles = [];
        this.angle = 0;
        this.count = 3;
        this.radius = 80;
        this.speed = 3; // Rotation speed
    }

    update(dt) {
        this.angle += this.speed * dt;

        // Ensure projectiles exist
        if (this.projectiles.length < this.count) {
            // Create pseudo-projectiles or managed objects
            // For simplicity, we manage collision here directly or spawn perm projectiles?
            // Let's spawn persistent projectiles that updated by us?
            // Easier: Just manage logic here and draw here.
            // BUT collision system expects projectiles in game.projectiles.
            // Approach: Spawn distinct Projectiles but set them to special state? 
            // OR: Just check collision here.
        }
    }

    scanAndFire(enemies) {
        // Orbit collision logic
        let count = this.count; // or upgradeable
        if (this.currentCount && this.currentCount > count) count = this.currentCount; // Handle upgrade if attached to instance

        for (let i = 0; i < this.count; i++) {
            let theta = this.angle + (TWO_PI / this.count) * i;
            let x = cos(theta) * this.radius;
            let y = sin(theta) * this.radius;

            // World position for collision
            let worldPos = createVector(this.owner.pos.x + x, this.owner.pos.y + y);

            // Check collision
            for (let e of enemies) {
                if (!e.alive) continue;
                if (p5.Vector.dist(worldPos, e.pos) < 15 / 2 + e.r) {
                    e.takeDamage(this.damage); // Low damage per tick
                }
            }
        }
    }

    show() {
        push();
        translate(this.owner.pos.x, this.owner.pos.y);
        noStroke();
        fill("cyan");

        for (let i = 0; i < this.count; i++) {
            let theta = this.angle + (TWO_PI / this.count) * i;
            let x = cos(theta) * this.radius;
            let y = sin(theta) * this.radius;

            circle(x, y, 15);
        }
        pop();
    }
}

class BoomerangWeapon extends Weapon {
    constructor(owner) {
        super(owner);
        this.name = "Boomerang";
        this.fireRate = 1.5;
        this.damage = 15;
        this.range = 300;
        this.projectiles = [];
    }

    scanAndFire(enemies) {
        if (this.cooldown > 0) return;

        let count = 1; // Can be upgraded
        for (let i = 0; i < count; i++) {
            // Shoot in direction of movement + slight random
            let angle = this.owner.vel.mag() > 0.1 ? this.owner.vel.heading() : random(TWO_PI);
            angle += random(-0.5, 0.5);

            let vel = p5.Vector.fromAngle(angle);
            vel.mult(8);

            // Spawn with "boomerang" behavior
            let p = game.projectilePool.spawn(this.owner.pos.x, this.owner.pos.y, vel, this.damage, "boomerang", this.owner);
            game.projectiles.push(p);
        }

        this.cooldown = this.fireRate;
    }
}

class LaserWeapon extends Weapon {
    constructor(owner) {
        super(owner);
        this.name = "Laser";
        this.fireRate = 2.0;
        this.damage = 30;
        this.range = 500;
    }

    scanAndFire(enemies) {
        if (this.cooldown > 0) return;

        // Find Nearest enemy
        let nearest = null;
        let d = Infinity;
        for (let e of enemies) {
            if (!e.alive) continue;
            let dist = p5.Vector.dist(this.owner.pos, e.pos);
            if (dist < this.range && dist < d) {
                d = dist;
                nearest = e;
            }
        }

        if (nearest) {
            let vel = p5.Vector.sub(nearest.pos, this.owner.pos);
            vel.setMag(15); // Very fast

            // Spawn Laser with high pierce (e.g., 5)
            let p = game.projectilePool.spawn(this.owner.pos.x, this.owner.pos.y, vel, this.damage, "laser", this.owner, 10);
            game.projectiles.push(p);

            this.cooldown = this.fireRate;
        }
    }
}
