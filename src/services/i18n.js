// src/services/i18n.js
// Maps language codes for simplified handling
const supportedLangs = ['en', 'es', 'fr'];
const _cache = {};
let _currentLang = 'en';

export async function loadTranslations(lang) {
    if (!supportedLangs.includes(lang)) lang = 'en';
    if (_cache[lang]) {
        _currentLang = lang;
        applyCachedTranslations(lang);
        return;
    }

    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) throw new Error('Failed to load translations');
        const data = await response.json();
        _cache[lang] = data;
        _currentLang = lang;
        applyCachedTranslations(lang);
        localStorage.setItem('site_lang', lang);
    } catch (err) {
        console.error('Translation load error:', err);
        // Fallback to EN if not already EN
        if (lang !== 'en') loadTranslations('en');
    }
}

export function _t(key) {
    const dict = _cache[_currentLang] || _cache['en'];
    return (dict && dict[key]) || key;
}

function applyCachedTranslations(lang) {
    const nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach(n => {
        const key = n.getAttribute('data-i18n');
        const txt = _t(key);

        // Safety check for empty text to avoid wiping content if key missing
        if (!txt || txt === key) return;

        if ((n.tagName === 'INPUT' || n.tagName === 'TEXTAREA') && n.getAttribute('placeholder')) {
            n.placeholder = txt;
        } else {
            n.textContent = txt;
        }
    });

    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(n => {
        const key = n.getAttribute('data-i18n-placeholder');
        const txt = _t(key);
        if (txt) n.placeholder = txt;
    });

    // Updates dropdowns
    const selects = document.querySelectorAll('[data-lang-select]');
    selects.forEach(s => s.value = lang);
}

export function initI18n() {
    const saved = localStorage.getItem('site_lang') || (navigator.language || 'en').split('-')[0];
    loadTranslations(saved);

    const selects = document.querySelectorAll('[data-lang-select]');
    selects.forEach(s => {
        s.addEventListener('change', (e) => {
            loadTranslations(e.target.value);
        });
    });
}
