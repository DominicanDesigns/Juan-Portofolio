// src/ui/chat.js

export function initChatUI() {
    window.chatBackend = window.chatBackend || {};

    // State
    let socket = null;
    let isConnected = false;

    // UI Elements
    ensureChatWidget();
    const widget = document.getElementById('chat-widget');
    const messagesEl = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const form = document.getElementById('chat-form');

    // 1. Try to connect via Socket.IO (for logged-in users)
    if (window.io) {
        socket = window.io();

        socket.on('connect', () => {
            console.log('Socket connected');
            isConnected = true;
            // If we receive a welcome message, we know we are authenticated?
            // Actually server only sends 'message' events.
        });

        socket.on('message', (data) => {
            // data can be {user, msg} or {id, user, msg}
            if (data.msg) {
                const name = data.user || 'System';
                const isMe = name === 'You' || (socket.id && name === socket.id); // Simple check, ideally matched by username
                appendMessage({ name: name, text: data.msg, self: false });
            }
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            isConnected = false;
        });
    }

    // 2. Handle Sending
    async function handleSend(text) {
        console.log('handleSend called with:', text);
        if (!text) return;

        // Optimistic append
        appendMessage({ name: 'You', text, self: true });

        if (isConnected && socket) {
            // Send to server
            socket.emit('send_message', { msg: text });
        } else {
            // Fallback: AI Responder for Guests
            simulateAIResponse(text);
        }
    }

    // 3. AI Logic (Client-Side)
    function simulateAIResponse(userText) {
        const lower = userText.toLowerCase();
        let response = "Access Restricted. Please log in to access the Sovereign Network.";

        if (lower.includes('hello') || lower.includes('hi')) {
            response = "Greetings. I am the Sovereign Protocol Assistant. How may I direct your inquiry?";
        } else if (lower.includes('services') || lower.includes('ventures')) {
            response = "Our ventures include High-Utility Apps, Business Platforms, and Strategic Support. View the 'Ventures' section for details.";
        } else if (lower.includes('contact') || lower.includes('hire')) {
            response = "Partnerships are available for qualified entities. Please use the 'Partnership' form.";
        } else if (lower.includes('audit')) {
            response = "The Audit Protocol is available for domain analysis. Navigate to 'Protocol: AUDIT'.";
        } else if (lower.includes('game') || lower.includes('empire')) {
            response = "Sim: EMPIRE is active. Begin your simulation to understand the wealth algorithm.";
        } else if (lower.includes('login') || lower.includes('admin')) {
            response = "Authorized personnel may proceed to /login.";
        }

        // Simulate network delay
        setTimeout(() => {
            // Show "Typing..." indicator? (Optional, kept simple for now)
            appendMessage({ name: 'Sovereign AI', text: response, self: false });
        }, 600 + Math.random() * 800);
    }

    // 4. UI Helpers
    function ensureChatWidget() {
        if (!document.getElementById('chat-open')) {
            const openBtn = document.createElement('button');
            openBtn.id = 'chat-open';
            openBtn.className = 'chat-open-btn';
            openBtn.textContent = 'Chat';
            openBtn.onclick = () => {
                document.getElementById('chat-widget').classList.toggle('hidden');
                openBtn.classList.remove('has-new-messages'); // Clear badge on open

                // Unlock audio context on interaction
                const ctx = getAudioContext();
                if (ctx && ctx.state === 'suspended') {
                    ctx.resume();
                }
            };
            document.body.appendChild(openBtn);
        }

        if (!document.getElementById('chat-widget')) {
            const w = document.createElement('div');
            w.id = 'chat-widget';
            w.className = 'chat-widget hidden';
            w.innerHTML = `
            <div class="chat-header">
                <span>Sovereign Net</span>
                <button id="chat-close" style="border:none;background:transparent;cursor:pointer;color:#fff;">✕</button>
            </div>
            <div id="chat-messages" class="chat-messages"></div>
            <form id="chat-form" class="chat-form">
                <input id="chat-input" placeholder="Transmit..." autocomplete="off" />
                <button type="submit">></button>
            </form>
            `;
            document.body.appendChild(w);

            w.querySelector('#chat-close').onclick = () => w.classList.add('hidden');
        }
    }

    // Sound & Notification Logic
    function requestNotificationPermission() {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }

    // Call immediately on init
    requestNotificationPermission();

    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        return audioCtx;
    }

    function playNotificationSound() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            // Resume if suspended (browser autoplay policy)
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
            osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.error("Audio play failed", e);
        }
    }

    function notifyUser(name, text) {
        // 1. Play Sound (Inside)
        playNotificationSound();

        // 2. Browser Notification (Outside)
        if ("Notification" in window && Notification.permission === "granted") {
            // Only if document is hidden or user wants constant updates
            if (document.hidden) {
                new Notification(`Message from ${name}`, {
                    body: text,
                    icon: '/favicon.ico' // Assuming standard favicon or similar
                });
            }
        }

        // 3. Visual Prompt on Button
        const btn = document.getElementById('chat-open');
        const widget = document.getElementById('chat-widget');
        if (btn && widget && widget.classList.contains('hidden')) {
            btn.classList.add('has-new-messages');
        }
    }

    function appendMessage({ name, text, self }) {
        const messages = document.getElementById('chat-messages');
        if (!messages) return;

        const div = document.createElement('div');
        div.className = `chat-message ${self ? 'me' : ''}`;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        div.innerHTML = `
            <div class="meta">${name} · ${timestamp}</div>
            <div class="text">${text}</div>
        `;

        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;

        // Trigger notification if not self
        if (!self) {
            notifyUser(name, text);
        }
    }

    // 5. Bind Events
    if (form) {
        console.log('Chat form init: binding submit event'); // Debug
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Chat form submitted'); // Debug
            const val = input.value.trim();
            if (val) {
                handleSend(val);
                input.value = '';
            }
        });

        // Also bind Enter key on input just in case
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                // Let form submit handle it, but log it
                console.log('Enter key pressed in chat input');
            }
        });
    } else {
        console.error('Chat form element NOT found!');
    }

    // Expose for external calls
    window.chatBackend.sendMessage = handleSend;
    console.log('Chat UI initialized');
}

