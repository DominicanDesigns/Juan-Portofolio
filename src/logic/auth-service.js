import { db } from './db.js';

class AuthService {
    constructor() {
        this.SESSION_KEY = 'current_user_session';
        this.ADMIN_USER = 'Administrator';
        // Hashes corresponding to 'Juan5872890@@@@' (simulated simple check)
        this.ADMIN_PASS = 'Juan5872890@@@@';
    }

    // Simple hash for demo (NOT SECURE for real production, but fine for static portfolio demo)
    // In a real app you'd use bcrypt, but on client-side JS, secrecy is impossible anyway.
    // This is strictly to port the logic flow.

    register(username, password) {
        if (!username || !password) throw new Error('Fields required');

        // Block registering as Admin
        if (username === this.ADMIN_USER) throw new Error('Cannot register as Administrator');

        const newUser = {
            username,
            password, // Storing plain/simple hash. 
            role: 'user'
        };

        return db.addUser(newUser);
    }

    login(username, password, securityKey = '') {
        // 1. Admin Logic
        if (username === this.ADMIN_USER) {
            if (securityKey !== 'rasta') throw new Error('Invalid Security Key');
            if (password !== this.ADMIN_PASS) throw new Error('Invalid Admin Password');

            // Success
            const admin = {
                id: 'admin_001',
                username: this.ADMIN_USER,
                isAdmin: true,
                is_banned: false
            };
            this.setSession(admin);
            return admin;
        }

        // 2. Normal User Logic
        const user = db.findUser(username);
        if (!user) throw new Error('User not found');
        if (user.password !== password) throw new Error('Invalid password');
        if (user.is_banned) throw new Error('This account has been banned');

        this.setSession(user);
        return user;
    }

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
        // Force reload or redirect
        window.location.href = 'index.html';
    }

    setSession(user) {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    }

    getUser() {
        try {
            return JSON.parse(localStorage.getItem(this.SESSION_KEY));
        } catch (e) {
            return null;
        }
    }

    isAuthenticated() {
        return !!this.getUser();
    }

    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
}

export const auth = new AuthService();
