class UpgradeSystem {
    constructor() {
        this.options = [
            { name: "Damage Up", type: "stat", stat: "damage", value: 5, desc: "Increases weapon damage" },
            { name: "Fire Rate Up", type: "stat", stat: "fireRate", value: -0.1, desc: "Shoots faster" },
            { name: "Speed Up", type: "stat", stat: "speed", value: 1, desc: "Move faster" },
            { name: "Max HP Up", type: "stat", stat: "maxHealth", value: 20, desc: "Increases max health" },
            { name: "Orbit Shield", type: "weapon", class: OrbitWeapon, desc: "Protective ring of energy" },
            { name: "Boomerang", type: "weapon", class: BoomerangWeapon, desc: "Returns to sender" },
            { name: "Laser", type: "weapon", class: LaserWeapon, desc: "Pierces enemies" }
        ];
    }

    getRandomOptions(count = 3) {
        // Shuffle and pick 3
        let shuffled = this.options.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    applyUpgrade(upgrade) {
        if (upgrade.type === "stat") {
            if (upgrade.stat === "damage") {
                game.player.weapons.forEach(w => w.damage += upgrade.value);
            } else if (upgrade.stat === "fireRate") {
                game.player.weapons.forEach(w => w.fireRate = Math.max(0.1, w.fireRate + upgrade.value));
            } else if (upgrade.stat === "speed") {
                game.player.maxSpeed += upgrade.value;
            } else if (upgrade.stat === "maxHealth") {
                game.player.maxHealth += upgrade.value;
                game.player.health += upgrade.value;
            }
        } else if (upgrade.type === "weapon") {
            // Check if player already has this weapon
            let existing = game.player.weapons.find(w => w instanceof upgrade.class);
            if (existing) {
                // Upgrade existing weapon (e.g. add count or damage)
                if (existing.count) existing.count++; // For Orbit
                existing.damage += 5;
            } else {
                // Add new weapon
                game.player.weapons.push(new upgrade.class(game.player));
            }
        }
        // Resume game
        game.state = "PLAY";
    }
}
