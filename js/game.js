
// Global Error Handler
window.onerror = function (msg, url, line) {
    alert("Game Error: " + msg + "\nLine: " + line);
};

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Game State
        let gameLoopInterval;
        let gameState = {
            netWorth: 0,
            passiveIncome: 0,
            clickPower: 1,
            upgrades: {
                server: {
                    id: 'server',
                    count: 0,
                    baseCost: 50,
                    income: 1,
                    nameKey: 'game.upg.server'
                },
                algo: {
                    id: 'algo',
                    count: 0,
                    baseCost: 250,
                    income: 5,
                    nameKey: 'game.upg.algo'
                },
                ai: {
                    id: 'ai',
                    count: 0,
                    baseCost: 1000,
                    income: 25,
                    nameKey: 'game.upg.ai'
                }
            },
            startTime: Date.now()
        };

        // DOM Elements
        const netWorthElem = document.getElementById('net-worth-val');
        const incomeElem = document.getElementById('income-val');
        const mineBtn = document.getElementById('mine-btn');
        const shopContainer = document.getElementById('shop-container');
        const resetButton = document.getElementById('reset-game-btn');

        // Initialize
        loadGame();
        renderShop();
        updateUI();
        startGameLoop();

        // Event Listeners
        if (mineBtn) {
            mineBtn.addEventListener('click', (e) => {
                clickMine(e);
            });
        }

        if (resetButton) {
            resetButton.addEventListener('click', () => {
                if (confirm('Reset Simulation? This cannot be undone.')) {
                    // Stop the loop to prevent auto-save resurrection
                    if (gameLoopInterval) clearInterval(gameLoopInterval);

                    // Nuclear Option
                    localStorage.removeItem('sovereignIdleSave');

                    location.reload();
                }
            });
        }

        // Core Mechanics
        function clickMine(e) {
            addCurrency(gameState.clickPower);
            createFloatingText(e.clientX, e.clientY, `+$${gameState.clickPower}`);

            // Visual feedback
            mineBtn.style.transform = 'scale(0.95)';
            setTimeout(() => mineBtn.style.transform = 'scale(1)', 50);
        }

        function addCurrency(amount) {
            gameState.netWorth += amount;
            updateUI();
            checkUnlocks();
        }

        function buyUpgrade(upgradeKey) {
            const upgrade = gameState.upgrades[upgradeKey];
            const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.count));

            if (gameState.netWorth >= cost) {
                gameState.netWorth -= cost;
                upgrade.count++;
                recalcIncome();
                renderShop(); // Update costs
                updateUI();
                saveGame();
            }
        }

        function recalcIncome() {
            let income = 0;
            for (let key in gameState.upgrades) {
                income += gameState.upgrades[key].count * gameState.upgrades[key].income;
            }
            gameState.passiveIncome = income;
        }

        // Game Loop
        function startGameLoop() {
            gameLoopInterval = setInterval(() => {
                if (gameState.passiveIncome > 0) {
                    addCurrency(gameState.passiveIncome);
                }
                saveGame();
            }, 1000);
        }

        // Save System
        function saveGame() {
            gameState.lastSave = Date.now();
            localStorage.setItem('sovereignIdleSave', JSON.stringify(gameState));
        }

        function loadGame() {
            const saved = localStorage.getItem('sovereignIdleSave');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);

                    // Validate parsed data
                    if (parsed && typeof parsed === 'object') {
                        // Merge save with default structure to handle updates
                        gameState = { ...gameState, ...parsed };

                        // Deep merge upgrades manually if needed
                        if (parsed.upgrades) {
                            for (let key in parsed.upgrades) {
                                if (gameState.upgrades[key]) {
                                    gameState.upgrades[key].count = parsed.upgrades[key].count;
                                }
                            }
                        }
                        recalcIncome();
                    }
                } catch (e) {
                    console.error("Save file corrupted, strictly business.");
                }
            }
        }

        // UI Functions
        function updateUI() {
            if (netWorthElem) netWorthElem.textContent = Math.floor(gameState.netWorth).toLocaleString();
            if (incomeElem) incomeElem.textContent = gameState.passiveIncome.toLocaleString();

            // Update Scan Button State based on affordability
            for (let key in gameState.upgrades) {
                const upgrade = gameState.upgrades[key];
                const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.count));
                const btn = document.getElementById(`btn-${key}`);
                if (btn) {
                    if (gameState.netWorth >= cost) {
                        btn.classList.remove('disabled');
                        btn.classList.add('enabled');
                    } else {
                        btn.classList.add('disabled');
                        btn.classList.remove('enabled');
                    }
                }
            }
        }

        function renderShop() {
            if (!shopContainer) return;
            shopContainer.innerHTML = '';

            for (let key in gameState.upgrades) {
                const upgrade = gameState.upgrades[key];
                const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.count));

                // Item Card
                const item = document.createElement('div');
                item.className = 'shop-item';

                // Use translation if available, else usage default
                let name = upgrade.nameKey;
                if (typeof _t === 'function') {
                    name = _t(upgrade.nameKey);
                } else {
                    // Fallback map
                    const fallback = { 'game.upg.server': 'Cloud Server', 'game.upg.algo': 'Trading Algo', 'game.upg.ai': 'Neural Net' };
                    name = fallback[upgrade.nameKey];
                }

                item.innerHTML = `
                <div class="item-info">
                    <h4>${name}</h4>
                    <p class="cost text-muted">Cost: $${cost.toLocaleString()}</p>
                    <p class="count">Owned: ${upgrade.count}</p>
                </div>
                <button id="btn-${key}" class="btn btn-sm btn-outline-primary shop-btn">BUY</button>
            `;

                const btn = item.querySelector('button');
                btn.addEventListener('click', () => buyUpgrade(key));

                shopContainer.appendChild(item);
            }
        }

        function createFloatingText(x, y, text) {
            const el = document.createElement('div');
            el.className = 'floating-text';
            el.textContent = text;
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            document.body.appendChild(el);

            setTimeout(() => {
                el.remove();
            }, 1000);
        }

        function checkUnlocks() {
            // Future expansion: Unlock 'Consultation' free after 1M Net Worth
        }
    } catch (e) {
        alert("CRITICAL GAME ERROR: " + e.message);
        console.error(e);
    }
});
