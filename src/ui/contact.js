// src/ui/contact.js
import { _t } from '../services/i18n.js';

export function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const status = document.getElementById('form-status');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fname = (form.firstname && form.firstname.value || '').trim();
        const lname = (form.lastname && form.lastname.value || '').trim();
        const email = (form.email && form.email.value || '').trim();
        const message = (form.subject && form.subject.value || '').trim();

        // simple validation
        if (!fname || !email || !message) {
            if (status) {
                status.classList.remove('hidden');
                status.style.color = '#ef4444';
                status.textContent = _t('status.fill_required') || 'Please fill the required fields.';
            }
            return;
        }

        const to = 'Juan_Ant772@hotmail.com';
        const subject = encodeURIComponent('Contact from website — ' + (fname + (lname ? ' ' + lname : '')));
        const body = encodeURIComponent(`Name: ${fname} ${lname}\nEmail: ${email}\n\nMessage:\n${message}`);

        if (status) {
            status.classList.remove('hidden');
            status.style.color = '#10b981';
            status.textContent = _t('status.opening_mail') || 'Opening your mail client...';
        }

        // Use mailto to open user's mail app with prefilled content (works as fallback without server)
        setTimeout(() => {
            window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
            if (status) {
                status.textContent = (_t('status.mail_fail') || 'If your mail client didn\'t open, please send an email to') + ' ' + to;
            }
        }, 250);

        form.reset();
    });
}
