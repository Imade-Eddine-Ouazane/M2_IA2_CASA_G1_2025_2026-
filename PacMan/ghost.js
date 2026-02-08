class Ghost extends Vehicle {
    constructor(x, y, colorName) {
        super(x, y);
        this.r = 11;
        this.colorName = colorName;
        this.color = this.getColor(colorName);
        this.state = "scatter";
        this.scared = false;
        this.maxSpeed = 1.8;

        // Always start with a direction
        this.currentDir = createVector(0, -1);
        this.vel = createVector(0, -1);
        this.modeTimer = 0;
    }

    getColor(name) {
        if (name === 'red') return color(255, 0, 0);
        if (name === 'pink') return color(255, 183, 255);
        if (name === 'cyan') return color(0, 255, 255);
        if (name === 'orange') return color(255, 183, 81);
        return color(255);
    }

    makeScared() {
        this.scared = true;
        this.state = "frightened";
        this.modeTimer = 600; // 10s
        this.maxSpeed = 1.0;
    }

    reset(maze) {
        if (maze && maze.grid && maze.grid[9] && maze.grid[9][9]) {
            this.pos = maze.grid[9][9].center.copy();
        } else {
            this.pos = createVector(width / 2, height / 2);
        }
        this.state = "scatter";
        this.scared = false;
        this.maxSpeed = 1.8;
        this.currentDir = createVector(0, -1);
    }

    update(pacman, maze) {
        // 1. Mode Logic
        if (this.scared) {
            this.modeTimer--;
            if (this.modeTimer <= 0) {
                this.scared = false;
                this.state = "chase";
                this.maxSpeed = 1.8;
            }
        } else {
            if (frameCount % 1200 === 0) { // Toggle every 20s
                this.state = this.state === "chase" ? "scatter" : "chase";
                this.currentDir.mult(-1); // Reverse
            }
        }

        // 2. Navigation Logic
        // Constantly move. Only change direction at center of tiles.
        let i = floor(this.pos.x / maze.cellSize);
        let j = floor(this.pos.y / maze.cellSize);
        let cell = maze.getCell(i, j);

        if (cell) {
            let center = cell.center;
            let d = dist(this.pos.x, this.pos.y, center.x, center.y);

            // INTERSECTION HANDLING
            // Use a small relaxed threshold to detect "being at center"
            // But only trigger if we haven't already decided for this tile?
            // Simplest: If close to center, snap and decide.

            if (d < 1.0) {
                // Snap to center to keep alignment
                this.pos.x = center.x;
                this.pos.y = center.y;

                // DECIDE NEXT MOVE
                let moves = [];
                let neighbors = [
                    createVector(0, -1), createVector(0, 1),
                    createVector(-1, 0), createVector(1, 0)
                ];

                for (let n of neighbors) {
                    // Don't reverse immediately
                    if (n.x === -this.currentDir.x && n.y === -this.currentDir.y) continue;

                    let ni = i + n.x;
                    let nj = j + n.y;
                    let c = maze.getCell(ni, nj);
                    if (c && c.type !== 'wall') {
                        moves.push(n);
                    }
                }

                // Dead end? Forced reverse.
                if (moves.length === 0) {
                    this.currentDir.mult(-1);
                } else {
                    // Choose best move
                    let target = this.getTarget(pacman, maze);
                    let bestMove = moves[0];
                    let minDist = Infinity;

                    if (this.state === 'frightened') {
                        bestMove = random(moves);
                    } else {
                        for (let m of moves) {
                            // Look ahead
                            let nextPos = createVector((i + m.x) * maze.cellSize, (j + m.y) * maze.cellSize);
                            let distToTarget = dist(nextPos.x, nextPos.y, target.x, target.y);
                            if (distToTarget < minDist) {
                                minDist = distToTarget;
                                bestMove = m;
                            }
                        }
                    }
                    this.currentDir = bestMove;
                }
            }
        }

        // 3. Move
        this.vel = this.currentDir.copy().mult(this.maxSpeed);
        this.pos.add(this.vel);

        // Screen Wrap
        if (this.pos.x < -10) this.pos.x = width + 10;
        if (this.pos.x > width + 10) this.pos.x = -10;
    }

    getTarget(pacman, maze) {
        if (this.state === 'scatter') {
            if (this.colorName === 'red') return createVector(width, 0);
            if (this.colorName === 'pink') return createVector(0, 0);
            if (this.colorName === 'cyan') return createVector(width, height);
            return createVector(0, height);
        }
        if (this.state === 'chase' && pacman) {
            return pacman.pos;
        }
        return createVector(width / 2, height / 2);
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        noStroke();
        fill(this.scared ? color(0, 0, 255) : this.color);

        // Body
        arc(0, 0, this.r * 2, this.r * 2, PI, 0);
        rect(-this.r, 0, this.r * 2, this.r);
        // Feet
        let f = this.r / 3;
        for (let k = 0; k < 3; k++) arc(-this.r + f + (k * f * 2), this.r, f * 2, f * 2, 0, PI);

        // Eyes
        fill(255);
        ellipse(-4, -4, 6, 8); ellipse(4, -4, 6, 8);
        fill(0);
        ellipse(-4 + this.currentDir.x * 2, -4 + this.currentDir.y * 2, 2, 2);
        ellipse(4 + this.currentDir.x * 2, -4 + this.currentDir.y * 2, 2, 2);
        ellipse(4 + this.currentDir.x * 2, -4 + this.currentDir.y * 2, 2, 2);
        pop();

        if (typeof debugMode !== 'undefined' && debugMode) {
            // Target Line
            // Re-calculate target to show it
            // (Efficiently we should store it, but this is debug)
            // Accessing maze from global or passing it? Update only passes it. 
            // We'll skip exact target line if maze isn't available here easily without refactor.
            // But we can show Direction and Tile Center.

            stroke(this.color); strokeWeight(1);
            line(this.pos.x, this.pos.y, this.pos.x + this.vel.x * 20, this.pos.y + this.vel.y * 20);

            fill(this.color); noStroke();
            text(this.state[0].toUpperCase(), this.pos.x + 8, this.pos.y - 8);
        }
    }
}
