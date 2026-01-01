// src/services/analytics.js

export function trackEvent(category, action, label = null) {
    // Stub for future defined analytics backend or Google Analytics
    // Safe check for development environment (localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[Analytics] ${category} -> ${action} ${label ? '(' + label + ')' : ''}`);
    }
}

export function initAnalytics() {
    document.addEventListener('click', (e) => {
        if (e.target.matches('button') || e.target.matches('a')) {
            const text = e.target.textContent.trim().substring(0, 20);
            trackEvent('Interaction', 'Click', text);
        }
    });
}
