/**
 * Pac-Man (Steering Hybrid)
 * Play Mode: Arrow keys to guide Pac-Man (he steers to center of tiles).
 * Watch AI: Pac-Man plays himself.
 */

let maze;
let pacman;
let ghosts = [];
let CELL_SIZE = 25;
let score = 0;
let gameState = "menu"; // menu, play, win, gameover
let playMode = "player"; // player, ai
let debugMode = false;


let currentLevel = 1;

function setup() {
    createCanvas(600, 600); // adjusted dinamically

    // UI Listeners
    const speedSlider = document.getElementById('speedSlider');
    const diffSlider = document.getElementById('diffSlider');
    const speedVal = document.getElementById('speedVal');
    const diffVal = document.getElementById('diffVal');

    if (speedSlider) {
        speedSlider.addEventListener('input', () => {
            speedVal.innerText = speedSlider.value;
            updateGameSettings();
        });
    }
    if (diffSlider) {
        diffSlider.addEventListener('input', () => {
            diffVal.innerText = diffSlider.value;
            updateGameSettings();
        });
    }

    resetGame(currentLevel);
}

function updateGameSettings() {
    let baseSpeed = parseFloat(document.getElementById('speedSlider').value);
    let difficulty = parseFloat(document.getElementById('diffSlider').value);

    // Level Multiplier (e.g. Lev 1 = 1.0, Lev 5 = 1.2)
    let levelMult = 1 + (currentLevel * 0.05);

    if (pacman) pacman.maxSpeed = baseSpeed * levelMult;

    // Ghosts get base speed * difficulty multiplier * levelMult
    for (let g of ghosts) {
        g.maxSpeed = baseSpeed * (0.8 + (difficulty - 1) * 0.2) * levelMult;
    }
}

function resetGame(level) {
    if (level) currentLevel = level;

    maze = new Maze(CELL_SIZE, currentLevel);
    maze.build();
    resizeCanvas(maze.cols * CELL_SIZE, maze.rows * CELL_SIZE + 50);

    // Find start pos
    let startPos = createVector(1, 1);
    for (let j = 0; j < maze.rows; j++) {
        for (let i = 0; i < maze.cols; i++) {
            if (maze.layout[j][i] === 'P') {
                startPos = maze.grid[j][i].center.copy();
            }
        }
    }

    pacman = new Pacman(startPos.x, startPos.y);

    ghosts = [];
    ghosts.push(new Ghost(maze.grid[9][9].center.x, maze.grid[9][9].center.y, 'red'));
    ghosts.push(new Ghost(maze.grid[9][8].center.x, maze.grid[9][8].center.y, 'pink'));
    ghosts.push(new Ghost(maze.grid[9][10].center.x, maze.grid[9][10].center.y, 'cyan'));
    ghosts.push(new Ghost(maze.grid[8][9].center.x, maze.grid[8][9].center.y, 'orange'));

    score = 0;
}

function draw() {
    background(0);

    if (gameState === "menu") {
        drawMenu();
    } else if (gameState === "play") {
        // Logic
        pacman.update(maze);
        for (let g of ghosts) g.update(pacman, maze);

        // Collisions
        checkCollisions();

        // Render
        maze.draw();
        pacman.show();
        for (let g of ghosts) g.show();
        drawUI();

        // Win check
        if (maze.pellets.length === 0) {
            currentLevel++;
            gameState = "level_transition";
            setTimeout(() => {
                resetGame(currentLevel);
                gameState = "play";
            }, 2000);
        }
    } else if (gameState === "level_transition") {
        maze.draw();
        pacman.show();
        fill(0, 150); rect(0, 0, width, height);
        fill(255, 255, 0); textAlign(CENTER); textSize(40);
        text("LEVEL " + currentLevel, width / 2, height / 2);
    } else if (gameState === "gameover") {
        maze.draw();
        pacman.show();
        for (let g of ghosts) g.show();
        fill(0, 150); rect(0, 0, width, height);
        fill(255, 0, 0); textAlign(CENTER); textSize(40);
        text("GAME OVER", width / 2, height / 2);
        textSize(20); fill(255);
        text("Press ENTER to Restart", width / 2, height / 2 + 40);
    } else if (gameState === "win") {
        fill(0, 150); rect(0, 0, width, height);
        fill(0, 255, 0); textAlign(CENTER); textSize(40);
        text("VICTORY!", width / 2, height / 2);
        textSize(20); fill(255);
        text("Press ENTER to Restart", width / 2, height / 2 + 40);
    }
}

function checkCollisions() {
    // Eat Pellets
    // Pacman center vs Pellet center
    for (let i = maze.pellets.length - 1; i >= 0; i--) {
        let p = maze.pellets[i];
        if (dist(pacman.pos.x, pacman.pos.y, p.pos.x, p.pos.y) < pacman.r) {
            if (p.type === 'normal') {
                score += 10;
            } else if (p.type === 'power') {
                score += 50;
                scareGhosts();
            }
            maze.pellets.splice(i, 1);
        }
    }

    // Ghost Collision
    for (let g of ghosts) {
        if (dist(pacman.pos.x, pacman.pos.y, g.pos.x, g.pos.y) < pacman.r + g.r) {
            if (g.scared) {
                // Eat ghost
                g.reset(maze);
                score += 200;
            } else {
                // Die
                gameState = "gameover";
            }
        }
    }
}

function scareGhosts() {
    for (let g of ghosts) g.makeScared();
}

function drawUI() {
    fill(255); textSize(20); textAlign(LEFT, TOP);
    text("Score: " + score, 10, height - 40);
    textAlign(RIGHT, TOP);
    text(playMode === "player" ? "PLAYER" : "AI WATCH", width - 10, height - 40);
}

function drawMenu() {
    textAlign(CENTER); fill(255, 255, 0); textSize(50);
    text("PAC-MAN", width / 2, height / 3);
    textSize(20); fill(255);
    text("Press [P] to Play", width / 2, height / 2);
    text("Press [W] to Watch AI", width / 2, height / 2 + 30);
}

function keyPressed() {
    if (gameState === "menu") {
        if (key === 'p' || key === 'P') {
            playMode = "player";
            pacman.aiControlled = false;
            gameState = "play";
        }
        if (key === 'w' || key === 'W') {
            playMode = "ai";
            pacman.aiControlled = true;
            gameState = "play";
        }
    } else if (gameState === "play") {
        if (key === 'd' || key === 'D') {
            debugMode = !debugMode;
        }
        if (playMode === "player") {
            if (keyCode === UP_ARROW) pacman.setDir(0, -1);
            if (keyCode === DOWN_ARROW) pacman.setDir(0, 1);
            if (keyCode === LEFT_ARROW) pacman.setDir(-1, 0);
            if (keyCode === RIGHT_ARROW) pacman.setDir(1, 0);
        }
    } else if (gameState === "gameover" || gameState === "win") {
        if (keyCode === ENTER) {
            resetGame(1);
            gameState = "menu";
        }
    }
}
