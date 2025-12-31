// src/core/main.js
import { initI18n } from '../services/i18n.js';
import { mockDataService } from '../services/mock-data.js';
import { initAnalytics } from '../services/analytics.js';
import { initChatUI } from '../ui/chat.js';
import { initContactForm } from '../ui/contact.js';
import { initTypingEffect } from '../ui/typing.js';
import { initRain } from '../visuals/rain.js';
import { initNeuralCore } from '../visuals/neural-core.js';
import { initAdvancedAnimations } from '../visuals/animations.js';

// Initialize everything on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    // Services
    initI18n();
    initAnalytics();

    // Mock Data Stream
    mockDataService.subscribe((data) => {
        const yieldEl = document.getElementById('stats-yield');
        const nodesEl = document.getElementById('stats-active');
        if (yieldEl) yieldEl.innerText = data.yield;
        if (nodesEl) nodesEl.innerText = data.activeNodes;
    });

    // UI
    initContactForm();
    initChatUI();
    initTypingEffect();

    // Visuals
    initRain();
    // Phase 2 Upgrade: Using Neural Core and GSAP
    // initNeuralCore removed
    initAdvancedAnimations();

    // Register Service Worker if supported
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('SW registered: ', registration);
            }).catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
        });
    }
});
