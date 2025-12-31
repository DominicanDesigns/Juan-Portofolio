import { db } from './db.js';
import { auth } from './auth-service.js';

class ChatService {
    constructor() {
        this.listeners = {};

        // Listen for storage events (multi-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === db.KEYS.MESSAGES) {
                this.emit('message', { type: 'sync' });
            }
            if (e.key === 'purge_trigger') {
                this.emit('chat_purged');
            }
        });
    }

    // --- Event System ---
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }

    // --- Actions ---
    sendMessage(content) {
        const user = auth.getUser();
        if (!user) throw new Error('Not logged in');
        if (user.is_banned) throw new Error('You are banned');

        const message = {
            user: user.username,
            user_id: user.id,
            content: content
        };

        const savedMsg = db.addMessage(message);

        // Trigger update locally
        this.emit('message', savedMsg);

        return savedMsg;
    }

    getHistory() {
        return db.getMessages();
    }

    // --- Admin Actions ---
    purgeChat() {
        const user = auth.getUser();
        // Check local admin flag (simulated)
        if (!user || user.username !== 'Administrator') return;

        db.purgeMessages();
        this.emit('chat_purged');

        // Trigger other tabs
        localStorage.setItem('purge_trigger', Date.now());
    }

    deleteMessage(msgId) {
        const user = auth.getUser();
        if (!user || user.username !== 'Administrator') return;

        db.deleteMessage(msgId);
        this.emit('message_deleted', { id: msgId });
    }
}

export const chatService = new ChatService();
