/**
 * SOVEREIGN ASSET TERMINAL
 * "The House doesn't just win. It conquers."
 */

document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('sovereign-terminal');
    if (!terminal) return;

    // --- STATE MANAGEMENT ---
    const State = {
        balance: 50000,
        stake: 1000,
        isProcessing: false,
        mode: 'STANDARD' // STANDARD or PROSECUTION
    };

    // --- DOM ELEMENTS ---
    const ui = {
        reels: [
            document.getElementById('reel-1'),
            document.getElementById('reel-2'),
            document.getElementById('reel-3')
        ],
        balance: document.getElementById('term-balance'),
        stakeInput: document.getElementById('term-stake-input'),
        status: document.getElementById('term-status'),
        log: document.getElementById('term-log'),
        btnDeploy: document.getElementById('btn-deploy'),
        btnProsecute: document.getElementById('btn-prosecute'),
        jackpotText: document.getElementById('jackpot-display')
    };

    // Symbols (Professional/Wealth)
    const symbols = ['💎', '👑', '🏙️', '📈', '🍸', '📡', '🐉'];
    // 📡 = Uplink (Wild), 🐉 = Dragon (Jackpot)

    // --- INITIALIZATION ---
    function init() {
        updateDisplay();
        log("TERMINAL ONLINE. CONNECTION SECURE.");
        log("ACCESSING GLOBAL GAMING HUB... [LINK ESTABLISHED]");

        // Event Listeners
        ui.btnDeploy.addEventListener('click', () => executeTrade('STANDARD'));
        ui.btnProsecute.addEventListener('click', () => executeTrade('PROSECUTION'));

        // Stake Input Listeners
        document.getElementById('btn-stake-up').addEventListener('click', () => adjustStake(500));
        document.getElementById('btn-stake-down').addEventListener('click', () => adjustStake(-500));
    }

    // --- CORE LOGIC ---

    function adjustStake(amount) {
        if (State.isProcessing) return;
        const newStake = State.stake + amount;
        if (newStake >= 500 && newStake <= 10000 && newStake <= State.balance) {
            State.stake = newStake;
            updateDisplay();
            log(`STAKE REFINED: $${State.stake.toLocaleString()}`);
        } else {
            log("ERROR: STAKE OUT OF BOUNDS OR INSUFFICIENT LIQUIDITY");
        }
    }

    async function executeTrade(mode) {
        if (State.isProcessing) return;

        // Prosecution Logic Checks
        if (mode === 'PROSECUTION') {
            const required = State.stake * 2; // High risk cost
            if (State.balance < required) {
                log("ERROR: INSUFFICIENT CAPITAL FOR PROSECUTION PROTOCOL");
                return;
            }
            log(">>> INITIATING PROSECUTION PROTOCOL <<<");
            await typeText("SCANNING LONG DISTANCE NODES...", 50);
            await wait(800);

            const targets = ["SHANGHAI SYNDICATE", "ZURICH VAULT", "VEGAS WHALE", "MONACO ROYAL", "TOKYO PEAK"];
            const target = targets[Math.floor(Math.random() * targets.length)];
            const distance = Math.floor(Math.random() * 8000) + 1000;

            log(`TARGET LOCKED: ${target}`);
            log(`DISTANCE: ${distance}KM | LATENCY: 12ms`);
            await wait(1000);
        }

        // Standard Checks
        if (State.balance < State.stake) {
            log("MARGIN CALL: INSUFFICIENT FUNDS");
            return;
        }

        // Start Spin
        State.isProcessing = true;
        State.mode = mode;
        ui.btnDeploy.classList.add('disabled');
        ui.btnProsecute.classList.add('disabled');

        // Deduct Stake
        const cost = mode === 'PROSECUTION' ? State.stake * 1.5 : State.stake; // Fee for prosecution
        State.balance -= cost;
        updateDisplay();

        ui.status.textContent = mode === 'PROSECUTION' ? "ENGAGING TARGET..." : "EXECUTING STRATEGY...";
        ui.status.style.color = mode === 'PROSECUTION' ? "#ff0055" : "var(--accent-primary)";

        // Spin Animation
        await spinReels();

        State.isProcessing = false;
        ui.btnDeploy.classList.remove('disabled');
        ui.btnProsecute.classList.remove('disabled');
    }

    async function spinReels() {
        // Blur
        ui.reels.forEach(r => r.classList.add('blur'));

        // Spin Duration
        const duration = State.mode === 'PROSECUTION' ? 3000 : 1500; // Longer tension for prosecution

        const spinInterval = setInterval(() => {
            ui.reels.forEach(r => r.textContent = symbols[Math.floor(Math.random() * symbols.length)]);
        }, 80);

        await wait(duration);
        clearInterval(spinInterval);

        // Stop Reels
        ui.reels[0].classList.remove('blur');
        let r1 = symbols[Math.floor(Math.random() * symbols.length)];
        ui.reels[0].textContent = r1;

        await wait(200);
        ui.reels[1].classList.remove('blur');
        let r2 = symbols[Math.floor(Math.random() * symbols.length)];
        ui.reels[1].textContent = r2;

        await wait(200);
        ui.reels[2].classList.remove('blur');
        let r3 = symbols[Math.floor(Math.random() * symbols.length)];

        // --- BLACK OPS ALGORITHM ---
        // If in Prosecution Mode, 95% chance to FORCE a Win (Guaranteed Execution)
        if (State.mode === 'PROSECUTION') {
            const roll = Math.random();
            if (roll < 0.80) {
                // Force Jackpot (80% chance)
                r2 = r1;
                r3 = r1;
                log(">> [ROOT ACCESS] COUNTER-MEASURES BYPASSED. FORCING UPLINK.");
                document.getElementById('sovereign-terminal').classList.add('hack-glitch');
                setTimeout(() => document.getElementById('sovereign-terminal').classList.remove('hack-glitch'), 500);
            } else if (roll < 0.95) {
                // Force Pair (15% chance)
                r2 = r1;
                log(">> [EXPLOIT] PARTIAL BREACH SUCCESSFUL.");
            }
        }

        ui.reels[1].textContent = r2;
        ui.reels[2].textContent = r3;

        checkResult(r1, r2, r3);
    }

    function checkResult(r1, r2, r3) {
        let winMultiplier = 0;
        let message = "TRADE FAILED. LIQUIDITY LOST.";
        let color = "#ef4444";

        // Logic
        if (r1 === r2 && r2 === r3) {
            // JACKPOT
            winMultiplier = 20;
            if (r1 === '💎') winMultiplier = 50;
            if (r1 === '👑') winMultiplier = 100;
            if (r1 === '📡') winMultiplier = 75;

            message = "CRITICAL SUCCESS. ASSETS SEIZED.";
            color = "#ffd700";
            createConfetti();
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            // Pair
            winMultiplier = 1.5;
            message = "PARTIAL EXECUTION. SMALL YIELD.";
            color = "#fbbf24";
        }

        // Prosecution Bonus
        if (State.mode === 'PROSECUTION') {
            if (winMultiplier > 0) {
                winMultiplier *= 2; // Double payout on prosecution
                message = "PROSECUTION SUCCESSFUL. TARGET LIQUIDATED.";
            } else {
                message = "PROSECUTION FAILED. COUNTER-MEASURES DETECTED.";
            }
        }

        const payout = State.stake * winMultiplier;
        if (payout > 0) {
            State.balance += payout;
            log(`[SUCCESS] YIELD: +$${payout.toLocaleString()}`);
            ui.status.textContent = message;
            ui.status.style.color = color;
            ui.jackpotText.textContent = `+$${payout.toLocaleString()}`;
            ui.jackpotText.classList.add('visible');
            setTimeout(() => ui.jackpotText.classList.remove('visible'), 2000);
        } else {
            log(`[LOSS] CAPITAL DEPLOYED: -$${State.stake}`);
            ui.status.textContent = message;
            ui.status.style.color = color;
        }

        updateDisplay();
    }

    // --- UTILS ---

    function updateDisplay() {
        ui.balance.textContent = `$${State.balance.toLocaleString()}`;
        ui.stakeInput.textContent = `$${State.stake.toLocaleString()}`;
    }

    function log(msg) {
        const line = document.createElement('div');
        line.textContent = `> ${msg}`;
        line.style.marginBottom = '4px';
        ui.log.appendChild(line);
        ui.log.scrollTop = ui.log.scrollHeight; // Auto scroll
    }

    // Simulated Typing
    function typeText(text, speed) {
        return new Promise(resolve => {
            log("");
            const lastLine = ui.log.lastElementChild;
            let i = 0;
            const timer = setInterval(() => {
                lastLine.textContent += text.charAt(i);
                i++;
                if (i >= text.length) {
                    clearInterval(timer);
                    resolve();
                }
            }, speed);
        });
    }

    function wait(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function createConfetti() {
        // Reuse previous logic logic or simple one
        for (let i = 0; i < 50; i++) {
            const c = document.createElement('div');
            c.className = 'confetti';
            c.style.left = Math.random() * 100 + '%';
            c.style.background = Math.random() > 0.5 ? '#ffd700' : '#00f2ff';
            c.style.animationDuration = Math.random() * 2 + 1 + 's';
            terminal.appendChild(c);
            setTimeout(() => c.remove(), 3000);
        }
    }

    // Start
    init();
});
