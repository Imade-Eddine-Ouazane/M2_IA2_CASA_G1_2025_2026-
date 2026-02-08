class Camera {
    constructor() {
        this.pos = createVector(0, 0);
        this.target = createVector(0, 0);
        this.shakeIntensity = 0;
        this.shakeDecay = 0.9;
    }

    follow(targetEntity) {
        if (!targetEntity) return;

        // Smooth follow (Linear Interpolation)
        let desiredPos = targetEntity.pos.copy();
        // Center the camera on the target
        desiredPos.sub(width / 2, height / 2);

        // Lerp factor (0.1 = smooth, 1.0 = instant)
        this.pos.lerp(desiredPos, 0.1);

        // Update shake
        if (this.shakeIntensity > 0.1) {
            this.shakeIntensity *= this.shakeDecay;
        } else {
            this.shakeIntensity = 0;
        }
    }

    shake(amount) {
        this.shakeIntensity = amount;
    }

    apply() {
        push();
        let xShake = random(-this.shakeIntensity, this.shakeIntensity);
        let yShake = random(-this.shakeIntensity, this.shakeIntensity);
        translate(-this.pos.x + xShake, -this.pos.y + yShake);
    }

    reset() {
        pop();
    }
}
