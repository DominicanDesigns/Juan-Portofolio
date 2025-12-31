/**
 * LocalStorage Wrapper to act as the "Database"
 * Replaces SQLite for the static version.
 */
class LocalDatabase {
    constructor() {
        this.KEYS = {
            USERS: 'db_users',
            MESSAGES: 'db_messages',
            BANNED_IPS: 'db_banned_ips',
            SESSION: 'db_session'
        };

        // Initialize DB if empty
        if (!localStorage.getItem(this.KEYS.USERS)) {
            this.save(this.KEYS.USERS, []);
        }
        if (!localStorage.getItem(this.KEYS.MESSAGES)) {
            this.save(this.KEYS.MESSAGES, []);
        }
        if (!localStorage.getItem(this.KEYS.BANNED_IPS)) {
            this.save(this.KEYS.BANNED_IPS, []);
        }
    }

    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    load(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (e) {
            console.error('DB Load Error', e);
            return [];
        }
    }

    // --- Users ---
    getUsers() {
        return this.load(this.KEYS.USERS);
    }

    addUser(user) {
        const users = this.getUsers();
        // Check duplicate
        if (users.find(u => u.username === user.username)) {
            throw new Error('Username already exists');
        }
        // Assign ID
        user.id = Date.now();
        user.created_at = new Date().toISOString();
        user.is_banned = false;
        users.push(user);
        this.save(this.KEYS.USERS, users);
        return user;
    }

    updateUser(id, updates) {
        const users = this.getUsers();
        const idx = users.findIndex(u => u.id === id);
        if (idx !== -1) {
            users[idx] = { ...users[idx], ...updates };
            this.save(this.KEYS.USERS, users);
            return users[idx];
        }
        return null;
    }

    findUser(username) {
        return this.getUsers().find(u => u.username === username);
    }

    // --- Messages ---
    getMessages() {
        return this.load(this.KEYS.MESSAGES);
    }

    addMessage(msg) {
        const msgs = this.getMessages();
        msg.id = Date.now() + Math.random().toString(16).slice(2);
        msg.timestamp = new Date().toISOString();
        msgs.push(msg);
        // Keep only last 100 messages to prevent storage bloat
        if (msgs.length > 100) {
            msgs.shift();
        }
        this.save(this.KEYS.MESSAGES, msgs);
        return msg;
    }

    deleteMessage(id) {
        let msgs = this.getMessages();
        msgs = msgs.filter(m => m.id !== id);
        this.save(this.KEYS.MESSAGES, msgs);
    }

    purgeMessages() {
        this.save(this.KEYS.MESSAGES, []);
    }

    // --- Banned IPs ---
    // In a static site, we can't really get true IP without an external service.
    // We will simulate this by 'banning' specific users or using a generated 'session-ip' stored in cookie.
    getBanned() {
        return this.load(this.KEYS.BANNED_IPS);
    }
}

export const db = new LocalDatabase();
