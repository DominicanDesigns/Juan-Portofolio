// src/services/analytics.js

export function trackEvent(category, action, label = null) {
    // Stub for future defined analytics backend or Google Analytics
    if (process.env.NODE_ENV === 'development') {
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
