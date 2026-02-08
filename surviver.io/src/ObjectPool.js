class ObjectPool {
    constructor(createFunc, resetFunc, initialSize = 100) {
        this.createFunc = createFunc;
        this.resetFunc = resetFunc;
        this.pool = [];
        this.active = [];

        // Pre-allocate
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFunc());
        }
    }

    spawn(x, y, ...args) {
        let obj;
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.createFunc();
        }
        this.resetFunc(obj, x, y, ...args);
        obj.alive = true;
        this.active.push(obj);
        return obj;
    }

    despawn(obj) {
        obj.alive = false;
        // We don't remove from active list here to avoid O(N) splice in the loop.
        // Instead, the main loop should filter dead objects and return them to pool.
        // OR we can splice if we iterate backwards.
        // Efficient strategy: Mark dead, and have a `cleanup` method.
    }

    // Expects the main loop to call this periodically or use filter.
    // Implementation B: The main loop iterates active, updates, and if dead, calls returnToPool.
    returnToPool(obj) {
        this.pool.push(obj);
    }
}
