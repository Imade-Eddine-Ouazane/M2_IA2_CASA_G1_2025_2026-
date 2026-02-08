class Maze {
    constructor(cellSize, level = 1) {
        this.cellSize = cellSize;
        this.cols = 19;
        this.rows = 21;
        this.grid = []; // 2D array of Cells
        this.walls = []; // For rendering
        this.pellets = []; // {x, y, power}
        this.layout = this.generateLevel(level);
    }

    generateLevel(level) {
        // 1. Initialize empty grid with walls
        let map = [];
        for (let r = 0; r < this.rows; r++) {
            let row = [];
            for (let c = 0; c < this.cols; c++) {
                row.push('#');
            }
            map.push(row);
        }

        // 2. Clear Ghost House (Center)
        // Rows 9-11, Cols 8-10 approx
        for (let r = 9; r <= 11; r++) {
            for (let c = 7; c <= 11; c++) {
                map[r][c] = ' ';
            }
        }
        map[9][9] = '-'; // Ghost spawn center

        // 3. Recursive Backtracker for Paths (Symmetric)
        // We carve the left half, and mirror to the right
        let stack = [];
        let startR = 1;
        let startC = 1;
        map[startR][startC] = '.'; // Start top-left
        stack.push({ r: startR, c: startC });

        // Helper to check valid wall
        // We operate on odd coordinates to leave walls between paths
        let attempts = 0;

        // Simple "Worm" Digger approach for Pacman-style (less dead ends than backtracker)
        // Actually, let's use a specialized "Random Walker" that prefers straight lines

        // BETTER: Template based + Randomization?
        // Let's do a simple symmetric random carver.

        // Carve "Spines" to ensure playability
        // Outer Ring
        for (let c = 1; c < this.cols - 1; c++) { map[1][c] = '.'; map[this.rows - 2][c] = '.'; }
        for (let r = 1; r < this.rows - 1; r++) { map[r][1] = '.'; map[r][this.cols - 2] = '.'; }

        // Random Horizontal and Vertical corridors
        let density = 0.4 + (level * 0.01); // Dense maps

        for (let r = 2; r < this.rows - 2; r++) {
            for (let c = 2; c < this.cols / 2; c++) { // Left half
                if (random() < 0.3) {
                    map[r][c] = '.'; // Carve
                    // Mirror
                    map[r][this.cols - 1 - c] = '.';
                }
            }
        }

        // Ensure connectivity using cellular automata smoothing or just brute force paths
        // Let's force some guaranteed paths
        for (let r = 2; r < this.rows - 2; r += 2) {
            for (let c = 1; c < this.cols - 1; c++) map[r][c] = '.';
        }
        for (let c = 2; c < this.cols - 2; c += 2) {
            for (let r = 1; r < this.rows - 1; r++) map[r][c] = '.';
        }

        // Re-inject walls randomly to create maze-like structure
        for (let r = 2; r < this.rows - 2; r++) {
            for (let c = 2; c < Math.floor(this.cols / 2); c++) {
                if (map[r][c] === '.' && random() < 0.4) {
                    map[r][c] = '#';
                    map[r][this.cols - 1 - c] = '#';
                }
            }
        }

        // 4. Final Cleanup & Special Tiles
        // Ensure Ghost House is valid
        for (let r = 9; r <= 11; r++) {
            for (let c = 7; c <= 11; c++) {
                if (r === 10 && c === 9) map[r][c] = '-';
                else if (r === 9 && (c >= 8 && c <= 10)) map[r][c] = ' '; // Door
                else map[r][c] = ' ';
            }
        }
        map[8][9] = '.'; // Exit point

        // Player Start
        map[15][9] = 'P';

        // Power Pellets
        map[3][1] = 'O'; map[3][this.cols - 2] = 'O';
        map[this.rows - 4][1] = 'O'; map[this.rows - 4][this.cols - 2] = 'O';

        // Fix strings
        return map.map(row => row.join(''));
    }

    build() {
        this.rows = this.layout.length;
        this.cols = this.layout[0].length;

        for (let j = 0; j < this.rows; j++) {
            let row = [];
            for (let i = 0; i < this.cols; i++) {
                let char = this.layout[j][i];
                let type = 'empty';
                if (char === '#') type = 'wall';
                else if (char === '.') type = 'pellet';
                else if (char === 'O') type = 'power';
                else if (char === '-') type = 'home';

                let cell = new Cell(i, j, this.cellSize, type);
                row.push(cell);

                if (type === 'pellet') this.pellets.push({ pos: cell.center.copy(), type: 'normal' });
                if (type === 'power') this.pellets.push({ pos: cell.center.copy(), type: 'power' });
            }
            this.grid.push(row);
        }

        // Compute neighbors for graph
        for (let j = 0; j < this.rows; j++) {
            for (let i = 0; i < this.cols; i++) {
                if (this.grid[j][i].type !== 'wall') {
                    this.grid[j][i].addNeighbors(this.grid);
                }
            }
        }
    }

    getCell(i, j) {
        if (i < 0 || i >= this.cols || j < 0 || j >= this.rows) return null;
        return this.grid[j][i];
    }

    getCellFromPos(pos) {
        let i = floor(pos.x / this.cellSize);
        let j = floor(pos.y / this.cellSize);
        return this.getCell(i, j);
    }

    draw() {
        for (let j = 0; j < this.rows; j++) {
            for (let i = 0; i < this.cols; i++) {
                this.grid[j][i].show();
            }
        }
        // Draw pellets
        for (let p of this.pellets) {
            if (p.type === 'normal') {
                fill(255, 183, 174); noStroke();
                ellipse(p.pos.x, p.pos.y, 4);
            } else {
                fill(255, 183, 174); noStroke();
                if (frameCount % 60 < 30) ellipse(p.pos.x, p.pos.y, 12);
            }
        }
    }

    // BFS for standard pathfinding
    // Returns array of Cells from start to end (excluding start)
    findPath(startCell, endCell, isGhost = false) {
        if (!startCell || !endCell || startCell === endCell) return [];

        let queue = [startCell];
        let cameFrom = new Map();
        cameFrom.set(startCell, null);

        let current = null;

        while (queue.length > 0) {
            current = queue.shift();

            if (current === endCell) break;

            for (let next of current.neighbors) {
                if (!cameFrom.has(next)) {
                    // Optional: Ghosts generally cannot enter spawn house unless dead/spawning
                    if (isGhost && next.type === 'home' && current.type !== 'home') continue;

                    queue.push(next);
                    cameFrom.set(next, current);
                }
            }
        }

        if (current !== endCell) return []; // No path

        let path = [];
        while (current !== startCell) {
            path.push(current);
            current = cameFrom.get(current);
        }
        // path.reverse(); // Standard BFS gives path end->start. Reverse to get start->end.
        // Actually, for steering, we usually want the immediate next node. 
        // The current order is End -> ... -> Next -> Start.
        // So path.pop() gives the immediate next step.
        return path;
    }
}

class Cell {
    constructor(i, j, size, type) {
        this.i = i;
        this.j = j;
        this.size = size;
        this.type = type; // wall, empty, pellet, power, home
        this.center = createVector(i * size + size / 2, j * size + size / 2);
        this.neighbors = [];
    }

    addNeighbors(grid) {
        let rows = grid.length;
        let cols = grid[0].length;
        let dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        for (let d of dirs) {
            let ni = this.i + d[0];
            let nj = this.j + d[1];
            if (ni >= 0 && ni < cols && nj >= 0 && nj < rows) {
                let neighbor = grid[nj][ni];
                if (neighbor.type !== 'wall') {
                    this.neighbors.push(neighbor);
                }
            }
        }
    }

    show() {
        if (this.type === 'wall') {
            fill(30, 30, 180); noStroke();
            rectMode(CORNER);
            rect(this.i * this.size, this.j * this.size, this.size, this.size);
        } else if (this.type === 'home') {
            fill(255, 100, 100, 50); noStroke();
            rect(this.i * this.size, this.j * this.size, this.size, this.size);
        }
        // Debug graph
        /*
        stroke(255, 50); strokeWeight(1);
        for(let n of this.neighbors) {
            line(this.center.x, this.center.y, n.center.x, n.center.y);
        }
        */
    }
}
