class Pacman extends Vehicle {
    constructor(x, y) {
        super(x, y);
        this.r = 12;
        this.color = color(255, 255, 0);
        this.currentDir = createVector(0, 0);
        this.nextDir = createVector(0, 0);
        this.maxSpeed = 2;
        this.aiControlled = false;
    }

    setDir(x, y) {
        this.nextDir = createVector(x, y);
    }

    update(maze) {
        let i = floor(this.pos.x / maze.cellSize);
        let j = floor(this.pos.y / maze.cellSize);
        let cell = maze.getCell(i, j);

        if (cell) {
            let center = cell.center;
            let d = dist(this.pos.x, this.pos.y, center.x, center.y);

            // AI Logic
            if (this.aiControlled && d < 1.5) {
                this.decideAI(maze, i, j);
            }

            // Immediate Reverse
            if (this.nextDir.x === -this.currentDir.x && this.nextDir.y === -this.currentDir.y) {
                this.currentDir = this.nextDir.copy();
                this.nextDir.set(0, 0);
            }

            // Turn at Intersection
            if (d < 1.5) {
                if (this.nextDir.mag() > 0) {
                    let ni = i + this.nextDir.x;
                    let nj = j + this.nextDir.y;
                    let nextCell = maze.getCell(ni, nj);
                    if (nextCell && nextCell.type !== 'wall') {
                        this.pos.x = center.x;
                        this.pos.y = center.y;
                        this.currentDir = this.nextDir.copy();
                        this.nextDir.set(0, 0);
                    }
                }

                // Wall Stop
                let checkI = i + this.currentDir.x;
                let checkJ = j + this.currentDir.y;
                let checkCell = maze.getCell(checkI, checkJ);
                if (!checkCell || checkCell.type === 'wall') {
                    this.pos.x = center.x;
                    this.pos.y = center.y;
                    this.currentDir.set(0, 0);
                }
            }
        }

        this.vel = this.currentDir.copy().mult(this.maxSpeed);
        this.pos.add(this.vel);

        if (this.pos.x < -10) this.pos.x = width + 10;
        if (this.pos.x > width + 10) this.pos.x = -10;
    }

    decideAI(maze, i, j) {
        // Improved AI: BFS to find nearest SAFE pellet

        // 1. Get Valid Moves
        let moves = [createVector(0, -1), createVector(0, 1), createVector(-1, 0), createVector(1, 0)];
        let candidates = [];
        for (let m of moves) {
            let ni = i + m.x;
            let nj = j + m.y;
            let c = maze.getCell(ni, nj);
            if (c && c.type !== 'wall') {
                // Safety First: Don't move directly into a Ghost
                if (this.isSafe(ni, nj, maze)) {
                    candidates.push(m);
                }
            }
        }

        if (candidates.length === 0) return; // Trapped

        // 2. Score candidates
        let bestMove = candidates[0];
        let bestScore = -Infinity;

        // Greedy Search with Safety
        for (let m of candidates) {
            let ni = i + m.x;
            let nj = j + m.y;
            // Simulated position
            let nextPos = maze.getCell(ni, nj).center;

            let score = 0;

            // Distance to nearest pellet
            let minPelletDist = Infinity;
            for (let p of maze.pellets) {
                let d = dist(nextPos.x, nextPos.y, p.pos.x, p.pos.y);
                if (d < minPelletDist) minPelletDist = d;
            }
            if (minPelletDist !== Infinity) score -= minPelletDist;

            // Ghost Distance (Global)
            for (let g of ghosts) {
                let gd = dist(nextPos.x, nextPos.y, g.pos.x, g.pos.y);
                if (gd < 100) {
                    if (g.scared) score += 200;
                    else score -= 10000 / (gd + 1);
                }
            }

            // Dont reverse randomly
            if (m.x === -this.currentDir.x && m.y === -this.currentDir.y) score -= 50;

            // Random noise to break loops
            score += random(0, 5);

            if (score > bestScore) {
                bestScore = score;
                bestMove = m;
            }
        }

        this.nextDir = bestMove;
    }

    isSafe(i, j, maze) {
        let cell = maze.getCell(i, j);
        if (!cell) return false;
        let pos = cell.center;
        for (let g of ghosts) {
            if (!g.scared && dist(pos.x, pos.y, g.pos.x, g.pos.y) < maze.cellSize * 1.5) return false;
        }
        return true;
    }

    show() {
        fill(this.color); noStroke();
        let angle = 0;
        if (this.currentDir.x === 1) angle = 0;
        if (this.currentDir.x === -1) angle = PI;
        if (this.currentDir.y === 1) angle = HALF_PI;
        if (this.currentDir.y === -1) angle = -HALF_PI;

        push();
        translate(this.pos.x, this.pos.y);
        rotate(angle);
        let mouth = abs(sin(frameCount * 0.2)) * QUARTER_PI;
        arc(0, 0, this.r * 2, this.r * 2, mouth, TWO_PI - mouth, PIE);
        pop();

        if (this.aiControlled) {
            fill(255); textAlign(CENTER); textSize(8);
            text("AI", this.pos.x, this.pos.y - 12);
        }

        if (typeof debugMode !== 'undefined' && debugMode) {
            // Draw Velocity Vector
            stroke(0, 255, 0); strokeWeight(2);
            line(this.pos.x, this.pos.y, this.pos.x + this.vel.x * 10, this.pos.y + this.vel.y * 10);

            // Draw Next Dir
            stroke(255, 255, 0); strokeWeight(1);
            line(this.pos.x, this.pos.y, this.pos.x + this.nextDir.x * 20, this.pos.y + this.nextDir.y * 20);

            // Safety Radius
            noFill(); stroke(0, 255, 255, 100);
            ellipse(this.pos.x, this.pos.y, 3 * 25); // 3 cell radius check
        }
    }
}
