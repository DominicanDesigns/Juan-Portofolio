// src/ui/typing.js

export function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-text h1 .text-gradient');
    if (!heroTitle) return;

    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;

    function type() {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }
    type();
}
