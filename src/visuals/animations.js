// src/visuals/animations.js

export function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

export function initAdvancedScroll() {
    // Native IntersectionObserver for .reveal-on-scroll elements
    // This matches the CSS classes added in style.css
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animating once is cleaner for this aesthetic
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));

    // Fallback: If no elements found (legacy pages), default to showing cards if they exist
    if (elements.length === 0) {
        document.querySelectorAll('.card').forEach(el => {
            el.classList.add('reveal-on-scroll');
            observer.observe(el);
        });
    }
}

export function initTextScramble() {
    // CSS-based fade in is sufficient for now, ensuring visibility
    const title = document.querySelector('.hero-text h1 .text-gradient');
    if (title) {
        title.style.opacity = '1';
    }
}

export function initAdvancedAnimations() {
    initMagneticButtons();
    initAdvancedScroll();
    initTextScramble();

    // Also handle sticky nav state here
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}
