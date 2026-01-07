// Sovereign Architect & AI Controller - Integrated System
// v3.0 - Free-Form Drag & Drop + Dynamic Audit

document.addEventListener('DOMContentLoaded', () => {

    // --- 0. INITIALIZATION CHECK ---
    const architectCanvas = document.getElementById('blueprint-canvas');
    if (!architectCanvas) return; // Not on audit page

    console.log("Sovereign Architect Initialized [v3.0 - DRAG ENABLED]");

    // --- 1. CONFIGURATION & STATE ---
    const MODULE_DATA = {
        'core_web': { name: 'Web Platform', cost: 2000, time: 2, complexity: 15, stack: ['React', 'Node.js'] },
        'core_mob': { name: 'Mobile App', cost: 3000, time: 3, complexity: 25, stack: ['Flutter', 'Firebase'] },
        'core_desk': { name: 'Desktop SW', cost: 2500, time: 3, complexity: 20, stack: ['Electron', 'Rust'] },
        'core_iot': { name: 'IoT System', cost: 3500, time: 4, complexity: 30, stack: ['C++', 'MQTT'] },

        'ai_basic': { name: 'AI Chatbot', cost: 1500, time: 1, complexity: 10, stack: ['OpenAI API'] },
        'ai_adv': { name: 'Neural Net', cost: 4000, time: 3, complexity: 30, stack: ['Python', 'TensorFlow'] },
        'ai_vision': { name: 'Vision AI', cost: 3000, time: 2, complexity: 25, stack: ['OpenCV', 'YOLO'] },
        'ai_agent': { name: 'Auto Agents', cost: 5000, time: 4, complexity: 35, stack: ['LangChain', 'AutoGPT'] },

        'inf_db': { name: 'Secure DB', cost: 500, time: 1, complexity: 5, stack: ['PostgreSQL'] },
        'inf_pay': { name: 'Payments', cost: 800, time: 1, complexity: 10, stack: ['Stripe'] },
        'inf_crypto': { name: 'Blockchain', cost: 1500, time: 2, complexity: 25, stack: ['Solidity', 'Web3.js'] },
        'inf_cloud': { name: 'Cloud Cluster', cost: 1200, time: 1, complexity: 15, stack: ['AWS', 'Kubernetes'] },
        'inf_sec': { name: 'Cyber Shield', cost: 2000, time: 2, complexity: 20, stack: ['Kali', 'Sentinel'] }
    };

    const state = {
        modules: [],      // Array of objects { id, type, x, y }
        displayCost: 0,   // Animated values
        displayTime: 0,
        displayComp: 0,
        dragTarget: null,
        dragOffsetX: 0,
        dragOffsetY: 0
    };

    // --- 2. DOM ELEMENTS & CONTEXT ---
    const nodesContainer = document.getElementById('active-nodes');
    const complexityBar = document.getElementById('complexity-bar');
    const timeDisplay = document.getElementById('time-display');
    const costDisplay = document.getElementById('cost-display');
    const stackList = document.getElementById('tech-stack-list');
    const canvasMessage = document.getElementById('canvas-empty');
    const connectionsLayer = document.getElementById('connections-layer');

    // Audio Context
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playSound(type) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        const now = audioCtx.currentTime;

        if (type === 'add') {
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
            gainNode.gain.setValueAtTime(0.05, now);
            osc.start();
            osc.stop(now + 0.1);
        } else if (type === 'hover') { // Click/Grab
            osc.frequency.setValueAtTime(200, now);
            gainNode.gain.setValueAtTime(0.02, now);
            osc.type = 'square';
            osc.start();
            osc.stop(now + 0.05);
        } else if (type === 'remove') {
            osc.frequency.setValueAtTime(150, now);
            gainNode.gain.setValueAtTime(0.05, now);
            osc.type = 'sawtooth';
            osc.start();
            osc.stop(now + 0.1);
        }
    }

    // --- 3. DRAG & DROP LOGIC ---

    // Global Mouse Handlers
    document.addEventListener('mousemove', (e) => {
        if (state.dragTarget) {
            e.preventDefault();

            // Limit bounds to canvas area
            const rect = architectCanvas.getBoundingClientRect();

            // Calculate new position relative to canvas
            let newX = e.clientX - rect.left - state.dragOffsetX;
            let newY = e.clientY - rect.top - state.dragOffsetY;

            // Update DOM
            state.dragTarget.element.style.left = `${newX}px`;
            state.dragTarget.element.style.top = `${newY}px`;

            // Update State
            state.dragTarget.data.x = newX;
            state.dragTarget.data.y = newY;

            // Redraw Connections immediately
            requestAnimationFrame(drawAllConnections);
        }
    });

    document.addEventListener('mouseup', () => {
        if (state.dragTarget) {
            state.dragTarget.element.classList.remove('dragging');
            state.dragTarget.element.style.zIndex = "20"; // Reset z-index
            state.dragTarget = null;
        }
    });

    function startDrag(e, moduleData, element) {
        // Ignore if clicking the close button
        if (e.target.closest('.close-btn')) return;

        // e is either MouseEvent or TouchEvent
        // For touch, prevent scrolling immediately
        if (e.type === 'touchstart') {
            // e.preventDefault(); // Don't prevent default here to allow clicking
        } else {
            e.stopPropagation(); // mouse
        }

        playSound('hover');

        state.dragTarget = { data: moduleData, element: element };

        // Normalize coordinates
        let clientX = e.clientX;
        let clientY = e.clientY;

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        // Calculate offset from mouse to element top-left
        const rect = element.getBoundingClientRect();
        state.dragOffsetX = clientX - rect.left;
        state.dragOffsetY = clientY - rect.top;

        element.classList.add('dragging');
        element.style.zIndex = "100"; // Lift up
    }

    // Touch Move Handler (Global)
    document.addEventListener('touchmove', (e) => {
        if (state.dragTarget) {
            e.preventDefault(); // Stop scrolling while dragging

            const touch = e.touches[0];
            const rect = architectCanvas.getBoundingClientRect();

            let newX = touch.clientX - rect.left - state.dragOffsetX;
            let newY = touch.clientY - rect.top - state.dragOffsetY;

            state.dragTarget.element.style.left = `${newX}px`;
            state.dragTarget.element.style.top = `${newY}px`;

            state.dragTarget.data.x = newX;
            state.dragTarget.data.y = newY;

            requestAnimationFrame(drawAllConnections);
        }
    }, { passive: false }); // crucial for preventDefault

    // Touch End Handler (Global)
    document.addEventListener('touchend', () => {
        if (state.dragTarget) {
            state.dragTarget.element.classList.remove('dragging');
            state.dragTarget.element.style.zIndex = "20";
            state.dragTarget = null;
        }
    });


    // --- 4. MODULE MANAGEMENT ---

    const genID = (type) => `${type}_${Math.floor(Math.random() * 100000)}`;

    window.toggleModule = (type, cost, time, label) => {
        // Visual Feedback on Button
        const btn = document.querySelector(`button[onclick*="'${type}'"]`);
        if (btn) {
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 200);
        }

        // Spawn Center-ish with random jitter
        const rect = architectCanvas.getBoundingClientRect();
        // Default to center if canvas is visible, else fallback
        const w = rect.width || 800;
        const h = rect.height || 600;

        const centerX = w / 2 - 60; // Half node width
        const centerY = h / 2 - 60;
        const jitter = () => (Math.random() - 0.5) * 150;

        const newData = {
            id: genID(type),
            type: type,
            x: centerX + jitter(),
            y: centerY + jitter(),
        };

        state.modules.push(newData);

        addVisualNode(newData, label);
        playSound('add');
        recalculate();
    };

    function addVisualNode(moduleData, label) {
        const node = document.createElement('div');
        node.id = `node-${moduleData.id}`;
        node.className = 'blueprint-node';
        node.style.left = `${moduleData.x}px`;
        node.style.top = `${moduleData.y}px`;
        node.style.position = 'absolute';
        node.style.margin = '0'; // Override previous margin centering
        node.style.transform = 'none'; // reset any transforms

        // Icons
        let icon = '📦';
        if (moduleData.type.includes('web')) icon = '🌐';
        if (moduleData.type.includes('mob')) icon = '📱';
        if (moduleData.type.includes('desk')) icon = '💻';
        if (moduleData.type.includes('iot')) icon = '📡';
        if (moduleData.type.includes('ai')) icon = '🧠';
        if (moduleData.type.includes('vision')) icon = '👁️';
        if (moduleData.type.includes('agent')) icon = '🕴️';
        if (moduleData.type.includes('crypto')) icon = '⛓️';
        if (moduleData.type.includes('db')) icon = '🗄️';
        if (moduleData.type.includes('pay')) icon = '💳';
        if (moduleData.type.includes('cloud')) icon = '☁️';
        if (moduleData.type.includes('sec')) icon = '🛡️';

        node.innerHTML = `
            <div class="node-header" style="position: absolute; top: -10px; right: -10px; z-index: 5;">
                <button class="close-btn" style="background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-weight: bold;" onclick="removeModule('${moduleData.id}')">×</button>
            </div>
            <span class="node-icon">${icon}</span>
            <span class="node-label">${label}</span>
            <div class="node-ports">
                <!-- Visual ports -->
            </div>
        `;

        // Event Listeners
        node.addEventListener('mousedown', (e) => startDrag(e, moduleData, node));
        node.addEventListener('touchstart', (e) => startDrag(e, moduleData, node), { passive: false });

        nodesContainer.appendChild(node);

        // Draw lines
        requestAnimationFrame(drawAllConnections);
    }

    window.removeModule = (id) => {
        state.modules = state.modules.filter(m => m.id !== id);
        const node = document.getElementById(`node-${id}`);
        if (node) node.remove();
        playSound('remove');
        recalculate();
        requestAnimationFrame(drawAllConnections);
    };

    // --- 5. CONNECTIONS (DYNAMIC MESH) ---
    // Connect nearest neighbors for visual mesh

    // --- 5. CONNECTIONS (DYNAMIC MESH) ---
    // connect every node to every other node for maximum audit visibility

    function drawAllConnections() {
        // Clear SVG
        connectionsLayer.innerHTML = '';
        if (state.modules.length < 2) return;

        const drawnPairs = new Set();

        // Full Mesh
        state.modules.forEach(source => {
            state.modules.forEach(target => {
                if (source.id === target.id) return;

                const pairId = [source.id, target.id].sort().join('-');

                if (!drawnPairs.has(pairId)) {
                    drawnPairs.add(pairId);
                    drawLine(source, target);
                }
            });
        });
    }

    function drawLine(m1, m2) {
        // Node size is roughly 120x120. Center is +60,+60
        const off = 60;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", m1.x + off);
        line.setAttribute("y1", m1.y + off);
        line.setAttribute("x2", m2.x + off);
        line.setAttribute("y2", m2.y + off);
        line.setAttribute("stroke", "rgba(0, 242, 255, 0.4)");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("stroke-dasharray", "5,5"); // Dashed "data" look

        connectionsLayer.appendChild(line);
    }


    // --- 6. SPECS & DATA ---

    function recalculate() {
        let cost = 0, time = 0, comp = 0;
        let stack = new Set();

        state.modules.forEach(inst => {
            const data = MODULE_DATA[inst.type];
            cost += data.cost;
            time += data.time;
            comp += data.complexity;
            data.stack.forEach(s => stack.add(s));
        });

        // Update Text
        costDisplay.innerText = "$" + cost.toLocaleString();
        timeDisplay.innerText = time + " Weeks";

        const perc = Math.min(comp, 100);
        complexityBar.style.width = perc + "%";

        // Colors
        if (perc > 80) complexityBar.style.background = "#ef4444";
        else if (perc > 50) complexityBar.style.background = "#fbbf24";
        else complexityBar.style.background = "#00f2ff";

        // Stack List
        stackList.innerHTML = '';
        if (stack.size === 0) {
            stackList.innerHTML = '<span class="stack-placeholder">System Empty. Deploy Modules.</span>';
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

    window.initiateSequence = () => {
        if (state.modules.length === 0) return;

        const btn = document.querySelector('.init-btn');
        btn.innerHTML = `<span class="blink">SYSTEM COMPILING...</span>`;
        btn.style.background = "#fff";
        btn.style.color = "#000";

        // Create detailed report
        const modulesList = state.modules.map(m => MODULE_DATA[m.type].name).join(', ');

        setTimeout(() => {
            const params = new URLSearchParams();
            params.append('subject', 'Sovereign Architect Audit');
            params.append('cost', costDisplay.innerText);
            params.append('modules', modulesList);
            window.location.href = `contact.html?${params.toString()}`;
        }, 1500);
    };

    // --- 7. RESIZE HANDLING ---
    window.addEventListener('resize', () => {
        requestAnimationFrame(drawAllConnections);
    });

});
