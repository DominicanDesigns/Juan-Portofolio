// src/services/mock-data.js

export const mockDataService = {
    active: false,
    timer: null,
    subscribers: [],

    subscribe(callback) {
        this.subscribers.push(callback);
        if (!this.active) this.startRandomizer();
    },

    startRandomizer() {
        this.active = true;
        this.timer = setInterval(() => {
            const yieldVal = (14.5 + Math.random()).toFixed(2); // 14.5 - 15.5%
            const nodesVal = Math.floor(800 + Math.random() * 200); // 800 - 1000 nodes

            const data = {
                yield: `${yieldVal}%`,
                activeNodes: nodesVal
            };

            this.subscribers.forEach(cb => cb(data));
        }, 4000); // Update every 4 seconds
    }
};
