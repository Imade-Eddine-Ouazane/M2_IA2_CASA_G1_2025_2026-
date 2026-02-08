class Projectile extends Vehicle {
    constructor() {
        super(0, 0);
        this.r = 5;
        this.damage = 10;
        this.lifespan = 2.0; // seconds
        this.timer = 0;
        this.alive = false;
    }

    reset(x, y, vel, damage, behavior = "linear", owner = null, pierce = 1) {
        this.pos.set(x, y);
        this.vel = vel;
        this.damage = damage;
        this.alive = true;
        this.timer = 60; // default (unused for boomerang mostly)
        this.behavior = behavior; // "linear", "boomerang"
        this.owner = owner;
        this.returnTimer = 0;
        this.pierce = pierce;
        this.hitList = []; // Track IDs of entities hit to avoid double hits

        if (this.behavior === "boomerang") {
            this.timer = 120; // Longer life
            this.returnTimer = 30; // Return after 30 frames
        } else if (this.behavior === "laser") {
            this.timer = 30; // Fast fade
        }
    }

    update(dt) {
        if (this.behavior === "linear" || this.behavior === "laser") {
            this.pos.add(this.vel);
            this.timer -= dt * 60; // Approximate frames
            if (this.timer <= 0) this.alive = false;
        } else if (this.behavior === "boomerang") {
            this.pos.add(this.vel);
            this.returnTimer--;

            if (this.returnTimer <= 0 && this.owner) {
                // Seek owner
                let steer = p5.Vector.sub(this.owner.pos, this.pos);
                steer.setMag(0.5); // Turn speed
                this.vel.add(steer);
                this.vel.limit(10);

                // If touches owner, catch it (despawn)
                if (p5.Vector.dist(this.pos, this.owner.pos) < 20) {
                    this.alive = false; // Caught
                }
            }
            // Also die if too old
            this.timer--;
            if (this.timer <= 0) this.alive = false;
        }
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        noStroke();

        // Color based on owner (Player = Yellow/Cyan, Enemy = Red)
        // We can check if owner is Player (how? instanceof or just property?)
        // Let's assume owner has a 'type' or just hardcode for now based on behavior?
        // Better: Projectile should have color property?
        // For now:
        if (this.owner && this.owner instanceof Enemy) {
            fill("red");
            ellipse(0, 0, 10);
        } else {
            if (this.behavior === "boomerang") {
                fill("cyan");
                rotate(frameCount * 0.5);
                rectMode(CENTER);
                rect(0, 0, 20, 5);
            } else if (this.behavior === "laser") {
                fill(100, 255, 255);
                // Draw a trail?
                ellipse(0, 0, 15, 5);
            } else {
                fill("yellow");
                ellipse(0, 0, 8);
            }
        }
        pop();
    }
}
