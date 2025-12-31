// src/visuals/animations.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

export function initAdvancedScroll() {
    // Animate entries with GSAP for smoother effect than CSS
    const elements = document.querySelectorAll('.card, .section-header, .gallery-item');

    elements.forEach(el => {
        gsap.fromTo(el,
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
}

export function initTextScramble() {
    // Simple mock scramble for Hero Title
    const title = document.querySelector('.hero-text h1 .text-gradient');
    if (!title) return;

    const chars = '!@#$%^&*()_+~|}{[]:;?><,./-=0123456789';
    const finalBuffer = title.innerText;
    let iteration = 0;

    // Animate opacity in GSAP
    gsap.fromTo(title, { opacity: 0 }, { opacity: 1, duration: 1 });
}

export function initAdvancedAnimations() {
    initMagneticButtons();
    initAdvancedScroll();
    initTextScramble();
}
