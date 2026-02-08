class XPOrb extends Vehicle {
    constructor() {
        super(0, 0);
        this.r = 5;
        this.value = 10;
        this.color = "cyan";
    }

    reset(x, y, value) {
        this.pos.set(x, y);
        this.value = value;
        this.alive = true;
        this.vel.set(0, 0); // Reset velocity
    }

    update(dt) {
        // Only moves if attracted by player (handled in seek)
        this.pos.add(this.vel);
        this.vel.mult(0.9); // Friction
    }

    seek(target) {
        // Magnetic pull
        let force = p5.Vector.sub(target, this.pos);
        force.setMag(8); // Speed of attraction
        this.vel = force; // Direct velocity assignment for magnetic feel (or use force)
    }

    show() {
        if (!this.alive) return;
        push();
        translate(this.pos.x, this.pos.y);
        fill(this.color);
        noStroke();
        circle(0, 0, this.r * 2);
        pop();
    }
}
