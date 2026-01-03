// Sovereign Architect - Logic Controller

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are in architect mode (element exists)
    const architectCanvas = document.getElementById('blueprint-canvas');
    if (!architectCanvas) return;

    console.log("Sovereign Architect Initialized");

    // Audio System
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playSound(type) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (type === 'add') {
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'remove') {
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        }
    }

    // State
    const state = {
        modules: new Set(),
        totalCost: 0,
        totalWeeks: 0,
        complexity: 0
    };

    // Configuration Database
    const MODULE_DATA = {
        'core_web': { name: 'Web Platform', cost: 2000, time: 2, complexity: 15, stack: ['React', 'Node.js'] },
        'core_mob': { name: 'Mobile App', cost: 3000, time: 3, complexity: 25, stack: ['Flutter', 'Firebase'] },
        'core_desk': { name: 'Desktop SW', cost: 2500, time: 3, complexity: 20, stack: ['Electron', 'Rust'] },

        'ai_basic': { name: 'AI Chatbot', cost: 1500, time: 1, complexity: 10, stack: ['OpenAI API'] },
        'ai_adv': { name: 'Neural Net', cost: 4000, time: 3, complexity: 30, stack: ['Python', 'TensorFlow'] },

        'inf_db': { name: 'Secure DB', cost: 500, time: 1, complexity: 5, stack: ['PostgreSQL'] },
        'inf_pay': { name: 'Payments', cost: 800, time: 1, complexity: 10, stack: ['Stripe'] },
        'inf_crypto': { name: 'Blockchain', cost: 1500, time: 2, complexity: 25, stack: ['Solidity', 'Web3.js'] }
    };

    // DOM Elements
    const nodesContainer = document.getElementById('active-nodes');
    const complexityBar = document.getElementById('complexity-bar');
    const timeDisplay = document.getElementById('time-display');
    const costDisplay = document.getElementById('cost-display');
    const stackList = document.getElementById('tech-stack-list');
    const canvasMessage = document.getElementById('canvas-empty');

    // global exposure for HTML onclicks
    window.toggleModule = (id, cost, time, label) => {
        // Toggle UI
        const btn = document.querySelector(`button[onclick*="'${id}'"]`);

        if (state.modules.has(id)) {
            // Remove
            state.modules.delete(id);
            btn.classList.remove('active');
            removeVisualNode(id);
        } else {
            // Add
            state.modules.add(id);
            btn.classList.add('active');
            addVisualNode(id, label);
        }

        recalculate();
    };

    window.initiateSequence = () => {
        if (state.modules.size === 0) {
            alert("SYSTEM ERROR: No Modules Selected. protocols_halted.");
            return;
        }

        const btn = document.querySelector('.init-btn');
        const originalText = btn.innerHTML;

        // Animation
        playSound('add'); // Reusing 'add' sound for now, or could make a custom 'compile' sound
        btn.innerHTML = `<span class="blink">COMPILING BLUEPRINT...</span>`;
        btn.style.background = "#fff";

        setTimeout(() => {
            // Redirect to contact with params
            const params = new URLSearchParams();
            params.append('subject', 'Architect Blueprint Request');
            params.append('cost', state.totalCost);
            params.append('stack', Array.from(state.modules).map(m => MODULE_DATA[m].name).join(', '));

            window.location.href = `contact.html?${params.toString()}`;
        }, 1500);
    };

    function recalculate() {
        let cost = 0;
        let time = 0;
        let comp = 0;
        let stack = new Set();

        state.modules.forEach(id => {
            const data = MODULE_DATA[id];
            cost += data.cost;
            time += data.time; // Simplified additive time
            comp += data.complexity;
            data.stack.forEach(s => stack.add(s));
        });

        // Update State
        state.totalCost = cost;
        state.totalWeeks = time;
        state.complexity = comp;

        // Render Specs
        animateValue(costDisplay, cost, "$");
        timeDisplay.innerText = time + " Weeks";
        complexityBar.style.width = Math.min(comp, 100) + "%";

        // Color shift based on complexity
        if (comp > 80) complexityBar.style.background = "#ef4444";
        else if (comp > 50) complexityBar.style.background = "#fbbf24";
        else complexityBar.style.background = "#00f2ff";

        // Render Stack
        stackList.innerHTML = '';
        if (stack.size === 0) {
            stackList.innerHTML = '<span class="stack-placeholder">Waiting for input...</span>';
            canvasMessage.style.display = 'block';
        } else {
            canvasMessage.style.display = 'none';
            stack.forEach(tech => {
                const s = document.createElement('span');
                s.className = 'stack-item';
                s.innerText = tech;
                stackList.appendChild(s);
            });
        }
    }

    function addVisualNode(id, label) {
        const node = document.createElement('div');
        node.id = `node-${id}`;
        node.className = 'blueprint-node';

        // Icon mapping
        let icon = '📦';
        if (id.includes('web')) icon = '🌐';
        if (id.includes('mob')) icon = '📱';
        if (id.includes('ai')) icon = '🧠';
        if (id.includes('crypto')) icon = '⛓️';
        if (id.includes('db')) icon = '🗄️';

        node.innerHTML = `
            <span class="node-icon">${icon}</span>
            <span class="node-label">${label}</span>
        `;
        nodesContainer.appendChild(node);
    }

    function removeVisualNode(id) {
        const node = document.getElementById(`node-${id}`);
        if (node) node.remove();
    }

    function animateValue(obj, val, prefix = "") {
        // Simple text update for now, can be tweened later
        obj.innerText = prefix + val.toLocaleString();
    }

});

