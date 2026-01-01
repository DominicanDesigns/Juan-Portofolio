// src/visuals/rain.js

function createRain() {
    const container = document.querySelector('.rain-container');
    if (!container) return;
    container.textContent = '';

    const symbols = '01$€£₿¥₮';
    // Reduced density for professional look
    const density = Math.max(10, Math.round(window.innerWidth / 40));
    const count = Math.min(60, density);

    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.className = 'rain-letter';
        el.textContent = symbols.charAt(Math.floor(Math.random() * symbols.length));

        const left = Math.random() * 100;
        const size = Math.floor(Math.random() * 14) + 10;
        const duration = (Math.random() * 5 + 3).toFixed(2); // Slower
        const delay = (Math.random() * 5).toFixed(2);
        const opacity = (Math.random() * 0.3 + 0.05).toFixed(2); // Fainter

        el.style.left = `${left}%`;
        el.style.fontSize = `${size}px`;
        el.style.animationDuration = `${duration}s`;
        el.style.animationDelay = `${delay}s`;
        el.style.opacity = opacity;
        el.style.color = Math.random() > 0.9 ? 'var(--accent-gold)' : 'var(--accent-primary)';

        frag.appendChild(el);
    }
    container.appendChild(frag);
}

let _resizeTimer = null;
export function initRain() {
    createRain();
    window.addEventListener('resize', () => {
        clearTimeout(_resizeTimer);
        _resizeTimer = setTimeout(createRain, 240);
    });
}
