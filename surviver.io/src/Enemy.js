class Enemy extends Vehicle {
    constructor() {
        super(0, 0);
        this.alive = false;
    }

    reset(type, x, y, difficulty = 1.0) {
        this.pos.set(x, y);
        this.vel.set(0, 0);
        this.acc.set(0, 0);
        this.alive = true;
        this.type = type;
        this.flashTimer = 0;

        // Stats based on type
        if (type === "basic") {
            this.maxSpeed = 2;
            this.maxForce = 0.2;
            this.maxHealth = 50 * difficulty; // Buffed
            this.health = this.maxHealth;
            this.damage = 10 * difficulty;
            this.r = 15;
            this.color = "red";
            this.xpValue = 10;
        } else if (type === "fast") {
            this.maxSpeed = 4;
            this.maxForce = 0.4;
            this.maxHealth = 30 * difficulty; // Buffed
            this.health = this.maxHealth;
            this.damage = 5 * difficulty;
            this.r = 10;
            this.color = "orange";
            this.xpValue = 15;
        } else if (type === "tank") {
            this.maxSpeed = 1;
            this.maxForce = 0.1;
            this.maxHealth = 300 * difficulty; // Buffed
            this.health = this.maxHealth;
            this.damage = 20 * difficulty;
            this.r = 25;
            this.color = "purple";
            this.xpValue = 50;
        } else if (type === "boss") {
            this.maxSpeed = 1.5;
            this.maxForce = 0.2;
            this.maxHealth = 2000 * difficulty; // HUGE Buff
            this.health = this.maxHealth;
            this.damage = 50 * difficulty;
            this.r = 40;
            this.color = "gold";
            this.xpValue = 500;
        } else if (type === "shooter") {
            this.maxSpeed = 1.5; // Slower
            this.maxForce = 0.2;
            this.maxHealth = 40 * difficulty; // Buffed
            this.health = this.maxHealth;
            this.damage = 10 * difficulty;
            this.r = 12;
            this.color = "green"; // Green shooter
            this.xpValue = 20;
            this.shootTimer = random(60, 180); // Init timer
        }
    }

    applyBehaviors(target, enemies) {
        // Seek target
        let seekForce = this.seek(target.pos);

        // Separate from other enemies
        let separateForce = this.separate(enemies);

        seekForce.mult(1.0);
        separateForce.mult(2.0); // High separation to avoid clotting

        this.applyForce(seekForce);
        this.applyForce(separateForce);

        // Shooter specific behavior
        if (this.type === "shooter" && this.alive) {
            this.shootTimer--;
            if (this.shootTimer <= 0) {
                // Shoot at player
                let vel = p5.Vector.sub(target.pos, this.pos);
                vel.setMag(4); // Slow projectile

                // Spawn projectile (Needs access to game logic, simplified here assuming 'game' global)
                if (typeof game !== 'undefined') {
                    let p = game.projectilePool.spawn(this.pos.x, this.pos.y, vel, this.damage, "linear", this, 1);
                    game.projectiles.push(p);
                }

                this.shootTimer = 120; // 2 seconds cooldown
            }
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        this.flashTimer = 5; // Frames to flash
        if (this.health <= 0) {
            this.alive = false;
        }
    }

    show() {
        if (!this.alive) return;
        push();
        translate(this.pos.x, this.pos.y);

        // Animations
        let wobble = sin(frameCount * 0.2 + this.pos.x) * 0.1;
        let breathing = 1.0 + sin(frameCount * 0.15) * 0.05; // Pulse size

        rotate(this.vel.heading() + wobble);
        scale(breathing);

        // Body
        stroke(0); // Black outline for cartoon look
        strokeWeight(2);
        fill(this.color);

        if (this.flashTimer && this.flashTimer > 0) {
            fill(255); // Flash white
            this.flashTimer--;
        }

        // Draw Main Shape
        if (this.type === "tank") {
            rectIsSquare(0, 0, this.r * 2);
        } else if (this.type === "boss") {
            // Boss is a big circle with a crown
            ellipse(0, 0, this.r * 2);

            // Crown
            push();
            translate(this.r * 0.2, -this.r * 0.8);
            rotate(PI / 4);
            fill("gold");
            stroke("red");
            triangle(-15, 0, 15, 0, 0, -25);
            pop();
        } else if (this.type === "shooter") {
            fill("green");
            ellipse(0, 0, this.r * 2);
            // Gun visual? Just a line?
            stroke(0);
            line(0, 0, this.r + 5, 0);
        } else {
            ellipse(0, 0, this.r * 2);
        }

        // Eyes (The Soul)
        // White Sclera
        fill(255);
        noStroke();
        let eyeOffset = this.r * 0.5;
        let eyeSee = this.r * 0.4; // Lateral spacing

        ellipse(eyeOffset, -eyeSee / 2, this.r * 0.5, this.r * 0.5); // Right Eye
        ellipse(eyeOffset, eyeSee / 2, this.r * 0.5, this.r * 0.5);  // Left Eye

        // Pupils
        fill(0);
        let pupilSize = this.r * 0.2;
        ellipse(eyeOffset + 2, -eyeSee / 2, pupilSize, pupilSize);
        ellipse(eyeOffset + 2, eyeSee / 2, pupilSize, pupilSize);

        pop();

        // Health Bar (Always show)
        if (this.health < this.maxHealth) { // Only show if damaged? Or always? User asked for health bar. Let's show if damaged or always.
            // Let's show always for Boss/Tank, maybe only damaged for small ones to avoid clutter?
            // "add heath bar" implies seeing it. Let's show always.
            push();
            translate(this.pos.x, this.pos.y);
            noStroke();
            fill(100);
            rectMode(CENTER);
            rect(0, -this.r - 10, this.r * 2, 4); // Background
            fill(0, 255, 0);
            rectMode(CORNER);
            rect(-this.r, -this.r - 12, (this.r * 2) * (this.health / this.maxHealth), 4); // Foreground
            pop();
        } else if (this.type === "boss" || this.type === "tank") {
            // Always show max HP for big guys
            push();
            translate(this.pos.x, this.pos.y);
            noStroke();
            fill(100);
            rectMode(CENTER);
            rect(0, -this.r - 10, this.r * 2, 4);
            fill(0, 255, 0);
            rectMode(CORNER);
            rect(-this.r, -this.r - 12, this.r * 2, 4);
            pop();
        }

        // Debug Hitbox overlay
        if (Vehicle.debug) {
            push();
            translate(this.pos.x, this.pos.y);
            noFill();
            stroke(255, 0, 0);
            strokeWeight(1);
            ellipse(0, 0, this.r * 2);
            pop();
        }
    }
}

function rectIsSquare(x, y, s) {
    rectMode(CENTER);
    rect(x, y, s, s);
}
