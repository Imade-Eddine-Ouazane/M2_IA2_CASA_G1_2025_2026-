let game;

function setup() {
    createCanvas(windowWidth, windowHeight);
    game = new Game();
}

function draw() {
    game.update();
    game.draw();
}

function keyPressed() {
    if (game.state === "PAUSE") {
        if (key === '1') game.upgradeSystem.applyUpgrade({ type: "stat", stat: "damage", value: 5 });
        if (key === '2') game.upgradeSystem.applyUpgrade({ type: "stat", stat: "fireRate", value: -0.1 });
        if (key === '3') game.upgradeSystem.applyUpgrade({ type: "stat", stat: "speed", value: 1 });
    }

    if (key === 'd' || key === 'D') {
        game.debug = !game.debug;
        Vehicle.debug = game.debug; // Sync static flag
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    game.width = windowWidth;
    game.height = windowHeight;
}
