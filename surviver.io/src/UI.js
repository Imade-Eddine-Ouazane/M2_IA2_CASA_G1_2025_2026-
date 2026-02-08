class UI {
    constructor() {
        this.canvas = document.getElementsByTagName('canvas')[0];
    }

    drawHUD(player, waveManager) {
        resetMatrix(); // Draw in screen space

        // Health Bar
        push();
        fill(50);
        rect(20, 20, 200, 20);
        fill("red");
        let hpPct = player.health / player.maxHealth;
        rect(20, 20, 200 * hpPct, 20);
        fill(255);
        textSize(12);
        textAlign(CENTER, CENTER);
        text(`${player.health}/${player.maxHealth}`, 120, 30);
        pop();

        // XP Bar
        push();
        fill(50);
        rect(0, height - 10, width, 10);
        fill("cyan");
        let xpPct = player.xp / player.nextLevelXP;
        rect(0, height - 10, width * xpPct, 10);
        pop();

        // Level & Time
        push();
        fill(255);
        textSize(20);
        textAlign(RIGHT, TOP);
        text(`Level ${player.level}`, width - 20, 20);

        let mins = Math.floor(waveManager.timer / 60);
        let secs = Math.floor(waveManager.timer % 60);
        let timeStr = nf(mins, 2) + ":" + nf(secs, 2);
        textAlign(CENTER, TOP);
        text(timeStr, width / 2, 20);
        pop();
    }

    drawMenu() {
        background(0, 150);
        fill(255);
        textSize(40);
        textAlign(CENTER, CENTER);
        text("SURVIVOR.IO CLONE", width / 2, height / 2 - 50);
        textSize(20);
        text("Press ENTER to Start", width / 2, height / 2 + 20);

        if (keyIsDown(ENTER)) {
            game.start();
        }
    }

    drawPause() {
        // Upgrade Menu
        background(0, 100); // Overlay
        fill(255);
        textSize(30);
        textAlign(CENTER, TOP);
        text("LEVEL UP!", width / 2, 100);

        // Draw 3 options provided by UpgradeSystem?
        // For now, simpler: Just press 1, 2, 3
        let options = game.upgradeSystem.getRandomOptions(3); // This logic needs to be stable per pause... 
        // Actually UpgradeSystem should store current options.
        // Let's simplified: "Press 1 for Damage, 2 for FireRate"

        textSize(20);
        text("1. Increase Damage", width / 2, height / 2 - 30);
        text("2. Increase Fire Rate", width / 2, height / 2);
        text("3. Increase Speed", width / 2, height / 2 + 30);

        // Handling input here is tricky in draw loop. ideally handle in keyPressed.
    }

    drawGameOver() {
        background(0, 200);
        fill("red");
        textSize(50);
        textAlign(CENTER, CENTER);
        text("GAME OVER", width / 2, height / 2);
        textSize(20);
        text("Press R to Restart", width / 2, height / 2 + 60);

        if (keyIsDown(82)) { // R
            game.init(); // Reset
            game.start();
        }
    }

    showUpgradeMenu() {
        // Called once when leveling up
        // In a real app, create HTML elements or set state
        this.currentOptions = game.upgradeSystem.getRandomOptions(3);
    }

    drawVictory() {
        background(0, 200);
        fill("gold");
        textSize(50);
        textAlign(CENTER, CENTER);
        text("VICTORY!", width / 2, height / 2 - 20);

        fill(255);
        textSize(30);
        text("You Defeated the Boss!", width / 2, height / 2 + 40);

        textSize(20);
        text("Press R to Play Again", width / 2, height / 2 + 100);

        if (keyIsDown(82)) { // R
            game.init(); // Reset
            game.start();
        }
    }

    drawDebugInfo(game) {
        push();
        resetMatrix();
        fill(255);
        stroke(0);
        textSize(12);
        textAlign(LEFT, TOP);
        text(`FPS: ${Math.floor(frameRate())}`, 10, 60);
        text(`Enemies: ${game.enemies.length}`, 10, 75);
        text(`Projectiles: ${game.projectiles.length}`, 10, 90);
        text(`XP Orbs: ${game.xpOrbs.length}`, 10, 105);
        text(`Diff: ${game.waveManager.difficultyMultiplier.toFixed(1)}`, 10, 120);
        pop();

        // Draw Hitboxes & Vectors logic is mostly in Entity.show() if Vehicle.debug is true
        // But we can add global overlay here if needed.
    }

    showMessage(msg, duration = 120) {
        this.message = msg;
        this.messageTimer = duration;
    }

    drawMessage() {
        if (this.message && this.messageTimer > 0) {
            push();
            resetMatrix();
            textAlign(CENTER, CENTER);
            textSize(40);
            fill(255, 255, 0);
            stroke(0);
            strokeWeight(3);
            text(this.message, width / 2, height / 4);
            pop();
            this.messageTimer--;
        }
    }
}
